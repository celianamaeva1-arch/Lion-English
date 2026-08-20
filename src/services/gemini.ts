import type { AnswerRecord, BandEvaluation } from '../types';

const BASE = 'https://generativelanguage.googleapis.com/v1beta';

function requireKey(apiKey: string): string {
  const key = apiKey.trim();
  if (!key) throw new Error('Add a Gemini API key in Settings to use AI features.');
  return key;
}

async function generateText(apiKey: string, prompt: string, model = 'gemini-2.0-flash'): Promise<string> {
  const key = requireKey(apiKey);
  const res = await fetch(
    `${BASE}/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  if (!text) throw new Error('Empty response from Gemini.');
  return text;
}

function extractJson<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? raw).trim();
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Could not parse AI JSON response.');
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}

export async function evaluateAnswers(
  apiKey: string,
  answers: AnswerRecord[],
): Promise<BandEvaluation> {
  const transcript = answers
    .map(
      (a, i) =>
        `Q${i + 1} (Part ${a.part}): ${a.question}\nAnswer: ${a.transcript || '(no answer)'}`,
    )
    .join('\n\n');

  const prompt = `You are an official IELTS Speaking examiner. Score the candidate using the four criteria:
Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation (estimate from transcript quality).

Return ONLY valid JSON with this shape:
{
  "overall": number,
  "criteria": [{"name": string, "band": number, "feedback": string}],
  "strengths": string[],
  "improvements": string[],
  "modelAnswer": string
}

Bands use 0.5 increments from 1.0 to 9.0. Be realistic and specific.

Candidate responses:
${transcript}`;

  const raw = await generateText(apiKey, prompt);
  const parsed = extractJson<BandEvaluation>(raw);
  return {
    overall: Number(parsed.overall) || 0,
    criteria: Array.isArray(parsed.criteria) ? parsed.criteria : [],
    strengths: parsed.strengths ?? [],
    improvements: parsed.improvements ?? [],
    modelAnswer: parsed.modelAnswer,
  };
}

export async function generateFollowUp(
  apiKey: string,
  question: string,
  answer: string,
): Promise<string> {
  const prompt = `You are an IELTS Speaking Part 3 examiner. Based on the candidate's answer, ask ONE short follow-up question that probes deeper. Return only the question text.

Question: ${question}
Answer: ${answer || '(brief / unclear)'}`;
  return (await generateText(apiKey, prompt)).trim().replace(/^["']|["']$/g, '');
}

export async function generateSceneImage(
  apiKey: string,
  cueCard: string,
): Promise<string | null> {
  const key = requireKey(apiKey);
  const prompt = `A clear, photorealistic illustration for an IELTS speaking cue card: ${cueCard}. No text overlays.`;

  // Try Imagen; fall back gracefully if unavailable on the key/plan.
  try {
    const res = await fetch(
      `${BASE}/models/imagen-3.0-generate-002:predict?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1 },
        }),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const b64 =
      data?.predictions?.[0]?.bytesBase64Encoded ??
      data?.generatedImages?.[0]?.image?.imageBytes ??
      null;
    return b64 ? `data:image/png;base64,${b64}` : null;
  } catch {
    return null;
  }
}

/** Prefer Gemini TTS when available; callers should fall back to SpeechSynthesis. */
export async function synthesizeSpeech(
  apiKey: string,
  text: string,
): Promise<{ base64: string; mimeType: string } | null> {
  const key = requireKey(apiKey);
  try {
    const res = await fetch(
      `${BASE}/models/gemini-2.5-flash-preview-tts:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `Say clearly: ${text}` }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
          },
        }),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const part = data?.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data,
    );
    if (!part?.inlineData?.data) return null;
    return {
      base64: part.inlineData.data as string,
      mimeType: (part.inlineData.mimeType as string) || 'audio/wav',
    };
  } catch {
    return null;
  }
}
