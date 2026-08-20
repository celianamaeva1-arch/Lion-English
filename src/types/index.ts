export type ExamMode = 'part1' | 'part2' | 'part3' | 'full';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type AppScreen = 'login' | 'level' | 'home';

export type ExamPhase =
  | 'idle'
  | 'intro'
  | 'question'
  | 'prep'
  | 'speaking'
  | 'followup'
  | 'evaluating'
  | 'results';

export interface Question {
  id: string;
  part: 1 | 2 | 3;
  level: SkillLevel;
  topic: string;
  prompt: string;
  bullets?: string[];
  /** Short examiner tip shown as learning support */
  tip?: string;
}

export interface AnswerRecord {
  questionId: string;
  question: string;
  transcript: string;
  part: 1 | 2 | 3;
}

export interface CriterionScore {
  name: string;
  band: number;
  feedback: string;
}

export interface BandEvaluation {
  overall: number;
  criteria: CriterionScore[];
  strengths: string[];
  improvements: string[];
  modelAnswer?: string;
}

export interface AppSettings {
  apiKey: string;
  darkMode: boolean;
  autoSpeak: boolean;
  voiceName: string;
}

export interface UserSession {
  email: string;
  level: SkillLevel | null;
}
