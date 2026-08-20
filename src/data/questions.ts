import type { Question, SkillLevel } from '../types';

/** Real IELTS-style banks: max 3 examples per part per level (testing). */
const BEGINNER: Question[] = [
  // Part 1
  {
    id: 'b-p1-1',
    part: 1,
    level: 'beginner',
    topic: 'Hometown',
    prompt: 'Where is your hometown? Is it a big city or a small town?',
    tip: 'Give a short place name, then add one simple detail (size, location, or feeling).',
  },
  {
    id: 'b-p1-2',
    part: 1,
    level: 'beginner',
    topic: 'Daily routine',
    prompt: 'What do you usually do in the morning?',
    tip: 'Use time markers: first, then, after that. Keep answers 2–3 sentences.',
  },
  {
    id: 'b-p1-3',
    part: 1,
    level: 'beginner',
    topic: 'Free time',
    prompt: 'What do you like doing in your free time? Why?',
    tip: 'Name the activity and give one reason with because.',
  },
  // Part 2
  {
    id: 'b-p2-1',
    part: 2,
    level: 'beginner',
    topic: 'A favourite place',
    prompt: 'Describe your favourite place to spend free time.',
    bullets: [
      'Where it is',
      'How often you go there',
      'What you do there',
      'And explain why you like it',
    ],
    tip: 'Speak for about 1–2 minutes. Cover each bullet briefly.',
  },
  {
    id: 'b-p2-2',
    part: 2,
    level: 'beginner',
    topic: 'A person you know',
    prompt: 'Describe a person you enjoy spending time with.',
    bullets: [
      'Who this person is',
      'How you know them',
      'What you do together',
      'And explain why you enjoy their company',
    ],
    tip: 'Use simple adjectives: kind, funny, helpful — then give an example.',
  },
  {
    id: 'b-p2-3',
    part: 2,
    level: 'beginner',
    topic: 'A meal you like',
    prompt: 'Describe a meal you really enjoy.',
    bullets: [
      'What the meal is',
      'Where / when you usually eat it',
      'Who you eat it with',
      'And explain why you enjoy it',
    ],
    tip: 'Describe taste, smell, or how it makes you feel.',
  },
  // Part 3
  {
    id: 'b-p3-1',
    part: 3,
    level: 'beginner',
    topic: 'Leisure',
    prompt: 'Do young people and older people enjoy the same free-time activities? Why / why not?',
    tip: 'Compare two groups with but / however and give one reason for each.',
  },
  {
    id: 'b-p3-2',
    part: 3,
    level: 'beginner',
    topic: 'Places in the city',
    prompt: 'What kinds of public places are important in a city?',
    tip: 'List 2–3 places (parks, libraries, cafés) and say why they matter.',
  },
  {
    id: 'b-p3-3',
    part: 3,
    level: 'beginner',
    topic: 'Food & lifestyle',
    prompt: 'Is it important for families to eat together? Why?',
    tip: 'State your opinion clearly, then support it with one everyday example.',
  },
];

const INTERMEDIATE: Question[] = [
  {
    id: 'i-p1-1',
    part: 1,
    level: 'intermediate',
    topic: 'Work / Study',
    prompt: 'Do you work or are you a student? What do you like most about it?',
    tip: 'Answer the yes/no part first, then expand with one concrete example.',
  },
  {
    id: 'i-p1-2',
    part: 1,
    level: 'intermediate',
    topic: 'Accommodation',
    prompt: 'What kind of housing do you live in? What would you change about it if you could?',
    tip: 'Describe + evaluate. Use would to talk about a possible change.',
  },
  {
    id: 'i-p1-3',
    part: 1,
    level: 'intermediate',
    topic: 'Technology',
    prompt: 'How has technology changed the way you study or work?',
    tip: 'Use present perfect (has changed) and contrast before / now.',
  },
  {
    id: 'i-p2-1',
    part: 2,
    level: 'intermediate',
    topic: 'A memorable journey',
    prompt: 'Describe a memorable journey you have taken.',
    bullets: [
      'Where you went',
      'How you travelled',
      'What you did during the journey',
      'And explain why it was memorable',
    ],
    tip: 'Structure: set the scene → key events → why it mattered.',
  },
  {
    id: 'i-p2-2',
    part: 2,
    level: 'intermediate',
    topic: 'A skill you learned',
    prompt: 'Describe a skill you learned that was useful.',
    bullets: [
      'What the skill was',
      'How you learned it',
      'How difficult it was',
      'And explain how it has helped you',
    ],
    tip: 'Include a challenge you faced and how you overcame it.',
  },
  {
    id: 'i-p2-3',
    part: 2,
    level: 'intermediate',
    topic: 'An important decision',
    prompt: 'Describe an important decision you made.',
    bullets: [
      'What the decision was',
      'When you made it',
      'What choices you had',
      'And explain why it was important',
    ],
    tip: 'Show cause and effect: because of that decision…',
  },
  {
    id: 'i-p3-1',
    part: 3,
    level: 'intermediate',
    topic: 'Travel & tourism',
    prompt: 'What are the advantages and disadvantages of travelling to other countries?',
    tip: 'Balance both sides, then give a short personal conclusion.',
  },
  {
    id: 'i-p3-2',
    part: 3,
    level: 'intermediate',
    topic: 'Education & skills',
    prompt: 'Should schools teach more practical life skills? Why or why not?',
    tip: 'Take a clear position and support it with two reasons.',
  },
  {
    id: 'i-p3-3',
    part: 3,
    level: 'intermediate',
    topic: 'Decision-making',
    prompt: 'Do you think young people today make decisions differently from previous generations?',
    tip: 'Compare generations and mention technology or social pressure.',
  },
];

const ADVANCED: Question[] = [
  {
    id: 'a-p1-1',
    part: 1,
    level: 'advanced',
    topic: 'Language learning',
    prompt: 'Apart from English, what other languages would you like to learn, and why?',
    tip: 'Show range: motivation, usefulness, and cultural interest.',
  },
  {
    id: 'a-p1-2',
    part: 1,
    level: 'advanced',
    topic: 'News & media',
    prompt: 'How do you usually get the news, and how reliable do you think those sources are?',
    tip: 'Evaluate reliability — avoid one-word answers; hedge with tend to / generally.',
  },
  {
    id: 'a-p1-3',
    part: 1,
    level: 'advanced',
    topic: 'Ambition',
    prompt: 'What ambitions did you have when you were younger? Have they changed?',
    tip: 'Use past vs present contrast and reflect briefly on why they changed.',
  },
  {
    id: 'a-p2-1',
    part: 2,
    level: 'advanced',
    topic: 'A time you helped someone',
    prompt: 'Describe a time when you helped someone solve a problem.',
    bullets: [
      'Who you helped',
      'What the problem was',
      'What you did to help',
      'And explain how you felt afterwards',
    ],
    tip: 'Use narrative tenses carefully (past simple + past continuous / past perfect).',
  },
  {
    id: 'a-p2-2',
    part: 2,
    level: 'advanced',
    topic: 'An environmental issue',
    prompt: 'Describe an environmental problem in your area that concerns you.',
    bullets: [
      'What the problem is',
      'What causes it',
      'How it affects people',
      'And explain what could be done about it',
    ],
    tip: 'Include cause, effect, and a realistic solution.',
  },
  {
    id: 'a-p2-3',
    part: 2,
    level: 'advanced',
    topic: 'A cultural tradition',
    prompt: 'Describe a cultural tradition that is important in your country.',
    bullets: [
      'What the tradition is',
      'When it takes place',
      'What people do',
      'And explain why it remains important',
    ],
    tip: 'Link personal experience to wider cultural meaning.',
  },
  {
    id: 'a-p3-1',
    part: 3,
    level: 'advanced',
    topic: 'Society & volunteering',
    prompt: 'To what extent should governments encourage citizens to volunteer in their communities?',
    tip: 'Discuss government role vs individual responsibility; use to some extent / on the other hand.',
  },
  {
    id: 'a-p3-2',
    part: 3,
    level: 'advanced',
    topic: 'Environment & policy',
    prompt: 'Some people believe economic growth is more important than protecting the environment. Discuss both views and give your own opinion.',
    tip: 'Classic discussion: view A, view B, then a nuanced personal stance.',
  },
  {
    id: 'a-p3-3',
    part: 3,
    level: 'advanced',
    topic: 'Culture & globalisation',
    prompt: 'How might globalisation affect traditional cultures in the next few decades?',
    tip: 'Speculate with may / might / is likely to and give one positive and one negative outcome.',
  },
];

const BY_LEVEL: Record<SkillLevel, Question[]> = {
  beginner: BEGINNER,
  intermediate: INTERMEDIATE,
  advanced: ADVANCED,
};

const MAX_PER_CATEGORY = 3;

export function getQuestionsFor(
  level: SkillLevel,
  part: 1 | 2 | 3,
  count = MAX_PER_CATEGORY,
): Question[] {
  const pool = BY_LEVEL[level].filter((q) => q.part === part);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, MAX_PER_CATEGORY, shuffled.length));
}

/** @deprecated use getQuestionsFor — kept for any leftover imports */
export function pickQuestions(part: 1 | 2 | 3, count: number): Question[] {
  return getQuestionsFor('intermediate', part, count);
}
