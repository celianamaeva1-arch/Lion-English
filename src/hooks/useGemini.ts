import { useCallback, useRef, useState } from 'react';
import {
  evaluateAnswers,
  generateFollowUp,
  generateSceneImage,
  synthesizeSpeech,
} from '../services/gemini';
import type { AnswerRecord, BandEvaluation } from '../types';

export function useGemini(apiKey: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setBusy(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const evaluate = useCallback(
    (answers: AnswerRecord[]) => wrap(() => evaluateAnswers(apiKey, answers)),
    [apiKey, wrap],
  );

  const followUp = useCallback(
    (question: string, answer: string) =>
      wrap(() => generateFollowUp(apiKey, question, answer)),
    [apiKey, wrap],
  );

  const sceneImage = useCallback(
    (cue: string) => wrap(() => generateSceneImage(apiKey, cue)),
    [apiKey, wrap],
  );

  const tts = useCallback(
    (text: string) => wrap(() => synthesizeSpeech(apiKey, text)),
    [apiKey, wrap],
  );

  return { busy, error, setError, evaluate, followUp, sceneImage, tts };
}

export type GeminiHook = ReturnType<typeof useGemini>;

export function useGeminiRef() {
  return useRef<BandEvaluation | null>(null);
}
