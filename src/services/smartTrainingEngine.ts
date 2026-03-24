import { MockQuestion, mockAnswerKeys, mockQuestionPool } from '@/data/mock-questions';

export interface STEAnswer {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  responseTimeMs: number;
  difficulty: 'easy' | 'medium' | 'hard';
  sectionId: string;
  topic: string;
}

export interface STESessionState {
  currentDifficulty: 'easy' | 'medium' | 'hard';
  currentAbility: number;
  previousAbility: number;
  confidencePhase: 'LOW' | 'MEDIUM' | 'HIGH';
  accuracyRate: number;
  avgResponseTimeMs: number;
  answers: STEAnswer[];
  questionsServed: MockQuestion[];
  difficultyProgression: string[];
  sectionPerformance: Record<string, { correct: number; total: number }>;
  topicPerformance: Record<string, { correct: number; total: number }>;
  isComplete: boolean;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  maxQuestions: number;
  questionStartTime: number;
}

export function createInitialState(previousAbility: number = 50, maxQuestions: number = 15): STESessionState {
  return {
    currentDifficulty: 'medium',
    currentAbility: previousAbility,
    previousAbility,
    confidencePhase: 'LOW',
    accuracyRate: 0,
    avgResponseTimeMs: 0,
    answers: [],
    questionsServed: [],
    difficultyProgression: [],
    sectionPerformance: {},
    topicPerformance: {},
    isComplete: false,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    maxQuestions,
    questionStartTime: Date.now(),
  };
}

export function selectNextQuestion(state: STESessionState): MockQuestion | null {
  const servedIds = new Set(state.questionsServed.map(q => q.id));
  const available = mockQuestionPool.filter(q => !servedIds.has(q.id) && q.difficulty === state.currentDifficulty);

  // Prefer weaker sections
  const weakest = getWeakestSection(state);
  if (weakest) {
    const fromWeak = available.filter(q => q.sectionId === weakest);
    if (fromWeak.length > 0) return fromWeak[Math.floor(Math.random() * fromWeak.length)];
  }

  if (available.length > 0) return available[Math.floor(Math.random() * available.length)];

  // Fallback: any unserved question
  const anyAvailable = mockQuestionPool.filter(q => !servedIds.has(q.id));
  if (anyAvailable.length > 0) return anyAvailable[Math.floor(Math.random() * anyAvailable.length)];

  return null;
}

function getWeakestSection(state: STESessionState): string | null {
  const sections = state.sectionPerformance;
  let weakest: string | null = null;
  let lowestRate = 1;

  for (const [sectionId, perf] of Object.entries(sections)) {
    if (perf.total === 0) continue;
    const rate = perf.correct / perf.total;
    if (rate < lowestRate) {
      lowestRate = rate;
      weakest = sectionId;
    }
  }
  return weakest;
}

export function processAnswer(
  state: STESessionState,
  questionId: string,
  selectedOptionId: string
): STESessionState {
  const question = state.questionsServed.find(q => q.id === questionId);
  if (!question) return state;

  const correctOptionId = mockAnswerKeys[questionId];
  const isCorrect = selectedOptionId === correctOptionId;
  const responseTimeMs = Date.now() - state.questionStartTime;

  const answer: STEAnswer = {
    questionId,
    selectedOptionId,
    correctOptionId,
    isCorrect,
    responseTimeMs,
    difficulty: question.difficulty,
    sectionId: question.sectionId,
    topic: question.topic,
  };

  const newAnswers = [...state.answers, answer];
  const correctCount = newAnswers.filter(a => a.isCorrect).length;
  const accuracyRate = Math.round((correctCount / newAnswers.length) * 100);
  const totalTime = newAnswers.reduce((sum, a) => sum + a.responseTimeMs, 0);
  const avgResponseTimeMs = Math.round(totalTime / newAnswers.length);

  // Update section performance
  const sectionPerformance = { ...state.sectionPerformance };
  const sp = sectionPerformance[question.sectionId] || { correct: 0, total: 0 };
  sectionPerformance[question.sectionId] = { correct: sp.correct + (isCorrect ? 1 : 0), total: sp.total + 1 };

  // Update topic performance
  const topicPerformance = { ...state.topicPerformance };
  const tp = topicPerformance[question.topic] || { correct: 0, total: 0 };
  topicPerformance[question.topic] = { correct: tp.correct + (isCorrect ? 1 : 0), total: tp.total + 1 };

  // Consecutive tracking
  let consecutiveCorrect = isCorrect ? state.consecutiveCorrect + 1 : 0;
  let consecutiveWrong = isCorrect ? 0 : state.consecutiveWrong + 1;

  // Difficulty adjustment
  let newDifficulty = state.currentDifficulty;
  if (consecutiveCorrect >= 2) {
    newDifficulty = state.currentDifficulty === 'easy' ? 'medium' : state.currentDifficulty === 'medium' ? 'hard' : 'hard';
    consecutiveCorrect = 0;
  } else if (consecutiveWrong >= 2) {
    newDifficulty = state.currentDifficulty === 'hard' ? 'medium' : state.currentDifficulty === 'medium' ? 'easy' : 'easy';
    consecutiveWrong = 0;
  }

  // Ability score adjustment
  let abilityDelta = 0;
  if (isCorrect) {
    abilityDelta = question.difficulty === 'hard' ? 5 : question.difficulty === 'medium' ? 3 : 1;
    if (responseTimeMs < 15000) abilityDelta += 1;
  } else {
    abilityDelta = question.difficulty === 'easy' ? -4 : question.difficulty === 'medium' ? -2 : -1;
  }
  const currentAbility = Math.max(0, Math.min(100, state.currentAbility + abilityDelta));

  // Confidence phase
  const qNum = newAnswers.length;
  const confidencePhase: STESessionState['confidencePhase'] = qNum <= 4 ? 'LOW' : qNum <= 10 ? 'MEDIUM' : 'HIGH';

  const isComplete = newAnswers.length >= state.maxQuestions;

  return {
    ...state,
    currentDifficulty: newDifficulty,
    currentAbility,
    confidencePhase,
    accuracyRate,
    avgResponseTimeMs,
    answers: newAnswers,
    difficultyProgression: [...state.difficultyProgression, question.difficulty],
    sectionPerformance,
    topicPerformance,
    consecutiveCorrect,
    consecutiveWrong,
    isComplete,
    questionStartTime: Date.now(),
  };
}

export function getSpeedRating(avgMs: number): string {
  if (avgMs < 15000) return 'سريع';
  if (avgMs < 30000) return 'متوسط';
  return 'بطيء';
}

export function getSessionResults(state: STESessionState) {
  const correctCount = state.answers.filter(a => a.isCorrect).length;

  const weakSections: string[] = [];
  const strongSections: string[] = [];
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];

  for (const [sectionId, perf] of Object.entries(state.sectionPerformance)) {
    const rate = perf.total > 0 ? perf.correct / perf.total : 0;
    const name = mockQuestionPool.find(q => q.sectionId === sectionId)?.sectionName || sectionId;
    if (rate >= 0.6) strongSections.push(name);
    else weakSections.push(name);
  }

  for (const [topic, perf] of Object.entries(state.topicPerformance)) {
    const rate = perf.total > 0 ? perf.correct / perf.total : 0;
    if (rate >= 0.6) strongTopics.push(topic);
    else weakTopics.push(topic);
  }

  return {
    abilityScore: state.currentAbility,
    previousAbility: state.previousAbility,
    abilityDelta: state.currentAbility - state.previousAbility,
    accuracyRate: state.accuracyRate,
    speedRating: getSpeedRating(state.avgResponseTimeMs),
    totalQuestions: state.maxQuestions,
    correctCount,
    confidencePhase: state.confidencePhase,
    weakSections,
    strongSections,
    weakTopics,
    strongTopics,
    difficultyProgression: state.difficultyProgression,
  };
}
