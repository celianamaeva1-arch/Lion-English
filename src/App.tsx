import { useCallback, useEffect, useMemo, useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { BandScoreModal } from './components/BandScoreModal';
import { Header } from './components/Header';
import { KeySettings } from './components/KeySettings';
import { LevelScreen } from './components/LevelScreen';
import { LoginScreen } from './components/LoginScreen';
import { ModeSelector } from './components/ModeSelector';
import { QuestionCard } from './components/QuestionCard';
import { Timer } from './components/Timer';
import { getQuestionsFor } from './data/questions';
import { useGemini } from './hooks/useGemini';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTTS } from './hooks/useTTS';
import type {
  AnswerRecord,
  AppSettings,
  BandEvaluation,
  ExamMode,
  ExamPhase,
  Question,
  SkillLevel,
  UserSession,
} from './types';

const STORAGE_KEY = 'lion-english-settings';
const SESSION_KEY = 'lion-english-session';

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  darkMode:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true,
  autoSpeak: true,
  voiceName: 'Kore',
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserSession;
    if (!parsed?.email) return null;
    return { email: parsed.email, level: parsed.level ?? null };
  } catch {
    return null;
  }
}

function buildQueue(mode: ExamMode, level: SkillLevel): Question[] {
  // Max 3 examples per category (part) for testing
  if (mode === 'part1') return getQuestionsFor(level, 1, 3);
  if (mode === 'part2') return getQuestionsFor(level, 2, 3);
  if (mode === 'part3') return getQuestionsFor(level, 3, 3);
  // Full test: one cue card + up to 3 from Part 1 and Part 3
  return [
    ...getQuestionsFor(level, 1, level === 'beginner' ? 2 : 3),
    ...getQuestionsFor(level, 2, 1),
    ...getQuestionsFor(level, 3, level === 'beginner' ? 1 : 3),
  ];
}

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [session, setSession] = useState<UserSession | null>(() => loadSession());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<ExamPhase>('idle');
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [evaluation, setEvaluation] = useState<BandEvaluation | null>(null);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [sceneUrl, setSceneUrl] = useState<string | null>(null);
  const [sceneLoading, setSceneLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const speech = useSpeechRecognition();
  const gemini = useGemini(settings.apiKey);
  const tts = useTTS(settings.apiKey);

  const current = queue[index] ?? null;
  const loggedIn = Boolean(session?.email);
  const hasLevel = Boolean(session?.level);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const resetSpeech = speech.reset;

  const logout = () => {
    setSession(null);
    setMode(null);
    setQueue([]);
    setIndex(0);
    setPhase('idle');
    setAnswers([]);
    setEvaluation(null);
    setResultsOpen(false);
    setSceneUrl(null);
    resetSpeech();
    tts.stop();
  };

  const changeLevel = () => {
    setSession((s) => (s ? { ...s, level: null } : s));
    setMode(null);
    setQueue([]);
    setIndex(0);
    setPhase('idle');
    setAnswers([]);
    setEvaluation(null);
    setResultsOpen(false);
    setSceneUrl(null);
    resetSpeech();
    tts.stop();
  };

  const startMode = (next: ExamMode) => {
    if (!session?.level) return;
    const q = buildQueue(next, session.level);
    setMode(next);
    setQueue(q);
    setIndex(0);
    setAnswers([]);
    setEvaluation(null);
    setResultsOpen(false);
    setSceneUrl(null);
    resetSpeech();
    setPhase(q[0]?.part === 2 ? 'prep' : 'question');
  };

  const restart = () => {
    setMode(null);
    setQueue([]);
    setIndex(0);
    setPhase('idle');
    setAnswers([]);
    setEvaluation(null);
    setResultsOpen(false);
    setSceneUrl(null);
    resetSpeech();
    tts.stop();
  };

  useEffect(() => {
    if (!current || !settings.autoSpeak) return;
    if (phase !== 'question' && phase !== 'prep' && phase !== 'followup') return;
    void tts.speak(current.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on question/phase change
  }, [current?.id, phase, settings.autoSpeak]);

  useEffect(() => {
    if (!current || current.part !== 2 || !settings.apiKey) {
      setSceneUrl(null);
      return;
    }
    let cancelled = false;
    setSceneLoading(true);
    void gemini.sceneImage(current.prompt).then((url) => {
      if (!cancelled) {
        setSceneUrl(url);
        setSceneLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, settings.apiKey]);

  const persistAnswer = useCallback(() => {
    if (!current) return;
    const transcript = speech.displayText.trim();
    setAnswers((prev) => [
      ...prev.filter((a) => a.questionId !== current.id),
      {
        questionId: current.id,
        question: current.prompt,
        transcript,
        part: current.part,
      },
    ]);
  }, [current, speech.displayText]);

  const finishAndEvaluate = useCallback(async () => {
    persistAnswer();
    speech.stop();
    setPhase('evaluating');
    setStatusMsg('Scoring your answers…');

    const allAnswers: AnswerRecord[] = (() => {
      if (!current) return answers;
      const transcript = speech.displayText.trim();
      return [
        ...answers.filter((a) => a.questionId !== current.id),
        {
          questionId: current.id,
          question: current.prompt,
          transcript,
          part: current.part,
        },
      ];
    })();

    if (!settings.apiKey.trim()) {
      setEvaluation({
        overall: 0,
        criteria: [],
        strengths: ['You completed a practice round without an API key.'],
        improvements: [
          'Add a Gemini API key in Settings to unlock band scores and AI feedback.',
        ],
      });
      setResultsOpen(true);
      setPhase('results');
      setStatusMsg(null);
      return;
    }

    const result = await gemini.evaluate(allAnswers);
    if (result) {
      setEvaluation(result);
      setResultsOpen(true);
      setPhase('results');
    } else {
      setStatusMsg(gemini.error ?? 'Evaluation failed');
      setPhase('question');
    }
  }, [answers, current, gemini, persistAnswer, settings.apiKey, speech]);

  const goNext = useCallback(async () => {
    persistAnswer();
    speech.stop();
    speech.reset();
    tts.stop();

    const isLast = index >= queue.length - 1;

    if (
      current?.part === 3 &&
      phase === 'question' &&
      settings.apiKey.trim() &&
      speech.displayText.trim() &&
      session?.level !== 'beginner'
    ) {
      const follow = await gemini.followUp(current.prompt, speech.displayText);
      if (follow) {
        setQueue((q) => {
          const copy = [...q];
          copy.splice(index + 1, 0, {
            id: `${current.id}-fu-${Date.now()}`,
            part: 3,
            level: current.level,
            topic: `${current.topic} · follow-up`,
            prompt: follow,
            tip: 'Answer directly, then add a reason or short example.',
          });
          return copy;
        });
        setIndex((i) => i + 1);
        setPhase('followup');
        return;
      }
    }

    if (isLast) {
      await finishAndEvaluate();
      return;
    }

    const nextQ = queue[index + 1];
    setIndex((i) => i + 1);
    setPhase(nextQ?.part === 2 ? 'prep' : 'question');
  }, [
    current,
    finishAndEvaluate,
    gemini,
    index,
    persistAnswer,
    phase,
    queue,
    session?.level,
    settings.apiKey,
    speech,
    tts,
  ]);

  const onPrepComplete = useCallback(() => {
    setPhase('speaking');
    speech.reset();
    speech.start();
  }, [speech]);

  const onSpeakingComplete = useCallback(() => {
    speech.stop();
    void goNext();
  }, [goNext, speech]);

  const canSubmit = useMemo(
    () => phase === 'question' || phase === 'followup' || phase === 'speaking',
    [phase],
  );

  const toggleDark = () => setSettings((s) => ({ ...s, darkMode: !s.darkMode }));

  if (!loggedIn) {
    return (
      <LoginScreen
        darkMode={settings.darkMode}
        onToggleDark={toggleDark}
        onLogin={(email) => setSession({ email, level: null })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Header
        darkMode={settings.darkMode}
        email={session?.email}
        level={session?.level}
        onToggleDark={toggleDark}
        onOpenSettings={() => setSettingsOpen(true)}
        onChangeLevel={hasLevel ? changeLevel : undefined}
        onLogout={logout}
      />

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {!hasLevel && (
          <LevelScreen
            email={session!.email}
            onSelect={(level) => setSession((s) => (s ? { ...s, level } : s))}
            onLogout={logout}
          />
        )}

        {hasLevel && phase === 'idle' && (
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Choose a practice mode
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {session!.level} track — speak out loud and optionally get AI band scores.
              </p>
            </div>
            <ModeSelector onSelect={startMode} />
            {!settings.apiKey && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                No API key yet — mic practice still works. Open Settings to add a Gemini key for
                scoring.
              </p>
            )}
          </section>
        )}

        {hasLevel && current && phase !== 'idle' && phase !== 'results' && (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={restart}
                className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Back to modes
              </button>
              {mode && (
                <span className="rounded-full bg-slate-200/70 px-3 py-1 text-xs font-medium capitalize dark:bg-slate-800">
                  {mode.replace('part', 'Part ')}
                </span>
              )}
            </div>

            <QuestionCard
              question={current}
              index={index}
              total={queue.length}
              imageUrl={sceneUrl}
              imageLoading={sceneLoading}
            />

            {(phase === 'prep' || phase === 'speaking') && (
              <div className="flex justify-center rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                {phase === 'prep' ? (
                  <Timer
                    key={`prep-${current.id}`}
                    seconds={session?.level === 'beginner' ? 90 : 60}
                    label="Preparation"
                    running
                    onComplete={onPrepComplete}
                  />
                ) : (
                  <Timer
                    key={`speak-${current.id}`}
                    seconds={session?.level === 'advanced' ? 150 : 120}
                    label="Speaking"
                    running
                    onComplete={onSpeakingComplete}
                  />
                )}
              </div>
            )}

            {(phase === 'question' ||
              phase === 'followup' ||
              phase === 'speaking' ||
              phase === 'prep') && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <AudioRecorder
                  supported={speech.supported}
                  listening={speech.listening}
                  displayText={speech.displayText}
                  onStart={() => {
                    if (phase === 'prep') return;
                    speech.start();
                  }}
                  onStop={speech.stop}
                  onChangeText={speech.setManualTranscript}
                />
              </div>
            )}

            {phase === 'evaluating' && (
              <p className="text-center text-sm text-indigo-600 dark:text-indigo-300">
                {statusMsg ?? 'Evaluating…'}
              </p>
            )}

            {gemini.error && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                {gemini.error}
              </p>
            )}

            {canSubmit && phase !== 'prep' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={gemini.busy}
                  onClick={() => void goNext()}
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {index >= queue.length - 1 ? 'Finish & evaluate' : 'Next question'}
                </button>
                {settings.autoSpeak === false && (
                  <button
                    type="button"
                    onClick={() => void tts.speak(current.prompt)}
                    className="rounded-xl border border-slate-200 px-4 text-sm dark:border-slate-700"
                  >
                    Speak Q
                  </button>
                )}
              </div>
            )}

            {phase === 'prep' && (
              <button
                type="button"
                onClick={onPrepComplete}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-medium dark:border-slate-700"
              >
                Skip prep — start speaking
              </button>
            )}
          </section>
        )}
      </main>

      <KeySettings
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={setSettings}
      />

      <BandScoreModal
        open={resultsOpen}
        evaluation={evaluation}
        onClose={() => setResultsOpen(false)}
        onRestart={restart}
      />
    </div>
  );
}
