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
  // Internal: accumulated difficulty shift (fractional)
  _difficultyShift: number;
}

const difficultyLevels: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
const difficultyIndex: Record<string, number> = { easy: 0, medium: 1, hard: 2 };

function getStartingDifficulty(previousAbility: number): 'easy' | 'medium' | 'hard' {
  if (previousAbility >= 70) return 'hard';
  if (previousAbility >= 40) return 'medium';
  return 'easy';
}

export function createInitialState(previousAbility: number = 50, maxQuestions: number = 15): STESessionState {
  return {
    currentDifficulty: getStartingDifficulty(previousAbility),
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
    _difficultyShift: 0,
  };
}

// ── Multi-factor question selection ──

interface QuestionScore {
  question: MockQuestion;
  score: number;
}

function abilityMatchScore(question: MockQuestion, ability: number): number {
  // Map difficulty to an ability range center
  const centers: Record<string, number> = { easy: 30, medium: 55, hard: 80 };
  const center = centers[question.difficulty];
  const distance = Math.abs(ability - center);
  // Closer = higher score (max 1, min ~0)
  return Math.max(0, 1 - distance / 50);
}

function weakSkillScore(question: MockQuestion, sectionPerf: Record<string, { correct: number; total: number }>): number {
  const perf = sectionPerf[question.sectionId];
  if (!perf || perf.total === 0) return 0.7; // Unknown sections get moderate priority
  const rate = perf.correct / perf.total;
  if (rate < 0.6) return 1.0; // Weak section — high priority
  if (rate < 0.8) return 0.4;
  return 0.1; // Strong section — low priority
}

function topicVarietyScore(question: MockQuestion, topicPerf: Record<string, { correct: number; total: number }>): number {
  const perf = topicPerf[question.topic];
  if (!perf) return 1.0; // Never attempted — highest variety
  return Math.max(0, 1 - perf.total * 0.25);
}

function examDNAScore(question: MockQuestion): number {
  // Mock: assume exam DNA wants roughly 30% easy, 45% medium, 25% hard
  const idealDist: Record<string, number> = { easy: 0.3, medium: 0.45, hard: 0.25 };
  return idealDist[question.difficulty] || 0.3;
}

export function selectNextQuestion(state: STESessionState): MockQuestion | null {
  const servedIds = new Set(state.questionsServed.map(q => q.id));
  const available = mockQuestionPool.filter(q => !servedIds.has(q.id));
  if (available.length === 0) return null;

  // Standard weights (no psychometric context in mock)
  const W = { ability: 0.35, weak: 0.35, dna: 0.15, variety: 0.15 };

  const scored: QuestionScore[] = available.map(q => {
    const score =
      W.ability * abilityMatchScore(q, state.currentAbility) +
      W.weak * weakSkillScore(q, state.sectionPerformance) +
      W.dna * examDNAScore(q) +
      W.variety * topicVarietyScore(q, state.topicPerformance);
    return { question: q, score };
  });

  // Sort descending and pick from top 3 randomly for variety
  scored.sort((a, b) => b.score - a.score);
  const topN = scored.slice(0, Math.min(3, scored.length));
  return topN[Math.floor(Math.random() * topN.length)].question;
}

// ── Difficulty adaptation ──

function getConfidenceDamping(phase: 'LOW' | 'MEDIUM' | 'HIGH'): number {
  if (phase === 'LOW') return 0.4;
  if (phase === 'MEDIUM') return 0.7;
  return 1.0;
}

function applyDifficultyShift(currentDiff: 'easy' | 'medium' | 'hard', accumulatedShift: number): { difficulty: 'easy' | 'medium' | 'hard'; newShift: number } {
  const idx = difficultyIndex[currentDiff];
  if (accumulatedShift >= 1 && idx < 2) {
    return { difficulty: difficultyLevels[idx + 1], newShift: accumulatedShift - 1 };
  }
  if (accumulatedShift <= -1 && idx > 0) {
    return { difficulty: difficultyLevels[idx - 1], newShift: accumulatedShift + 1 };
  }
  return { difficulty: currentDiff, newShift: accumulatedShift };
}

// ── Cumulative ability score ──

function calculateAbility(answers: STEAnswer[], previousAbility: number): number {
  if (answers.length === 0) return previousAbility;

  const diffWeights: Record<string, number> = { easy: 30, medium: 50, hard: 80 };

  // Weighted accuracy
  let weightedCorrect = 0;
  let weightedTotal = 0;
  for (const a of answers) {
    const w = diffWeights[a.difficulty];
    weightedTotal += w;
    if (a.isCorrect) weightedCorrect += w;
  }
  const accuracy = weightedTotal > 0 ? (weightedCorrect / weightedTotal) * 100 : 0;

  // Speed bonus: proportion of fast correct answers × 15, capped at 10
  const fastCorrect = answers.filter(a => a.isCorrect && a.responseTimeMs < 30000).length;
  const totalCorrect = answers.filter(a => a.isCorrect).length;
  const speedBonus = totalCorrect > 0 ? Math.min(10, (fastCorrect / totalCorrect) * 15) : 0;

  // Hard question bonus: +3 per correct hard, capped at 8
  const hardCorrect = answers.filter(a => a.isCorrect && a.difficulty === 'hard').length;
  const hardBonus = Math.min(8, hardCorrect * 3);

  const sessionAbility = Math.min(100, Math.max(0, accuracy + speedBonus + hardBonus));

  // Blend with previous ability
  const sessionWeight = Math.min(0.7, 0.2 + (answers.length / 15) * 0.5);
  const blended = Math.round(previousAbility * (1 - sessionWeight) + sessionAbility * sessionWeight);

  return Math.min(100, Math.max(0, blended));
}

// ── Process answer ──

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

  // Section performance
  const sectionPerformance = { ...state.sectionPerformance };
  const sp = sectionPerformance[question.sectionId] || { correct: 0, total: 0 };
  sectionPerformance[question.sectionId] = { correct: sp.correct + (isCorrect ? 1 : 0), total: sp.total + 1 };

  // Topic performance
  const topicPerformance = { ...state.topicPerformance };
  const tp = topicPerformance[question.topic] || { correct: 0, total: 0 };
  topicPerformance[question.topic] = { correct: tp.correct + (isCorrect ? 1 : 0), total: tp.total + 1 };

  // Consecutive tracking
  const consecutiveCorrect = isCorrect ? state.consecutiveCorrect + 1 : 0;
  const consecutiveWrong = isCorrect ? 0 : state.consecutiveWrong + 1;

  // Confidence phase
  const qNum = newAnswers.length;
  const confidencePhase: STESessionState['confidencePhase'] = qNum <= 4 ? 'LOW' : qNum <= 10 ? 'MEDIUM' : 'HIGH';

  // Difficulty shift calculation
  let baseShift = 0;
  if (!isCorrect) {
    baseShift = -1;
  } else if (responseTimeMs < 30000) {
    baseShift = 1; // Fast correct
  } else if (responseTimeMs > 60000) {
    baseShift = 0; // Slow correct — stay
  } else {
    baseShift = 0.5; // Normal speed correct
  }

  const damping = getConfidenceDamping(confidencePhase);
  const dampedShift = baseShift * damping;
  let accumulatedShift = state._difficultyShift + dampedShift;

  // Ignore shifts smaller than 0.3 to prevent oscillation
  if (Math.abs(accumulatedShift) < 0.3) {
    accumulatedShift = 0;
  }

  const { difficulty: newDifficulty, newShift } = applyDifficultyShift(state.currentDifficulty, accumulatedShift);

  // Ability calculation
  const currentAbility = calculateAbility(newAnswers, state.previousAbility);

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
    _difficultyShift: newShift,
  };
}

export function getSpeedRating(avgMs: number): string {
  if (avgMs < 25000) return 'سريع';
  if (avgMs < 45000) return 'متوسط';
  return 'بطيء';
}

export function getAccuracyRating(rate: number): string {
  if (rate >= 80) return 'ممتاز';
  if (rate >= 60) return 'جيد';
  if (rate >= 40) return 'متوسط';
  return 'يحتاج تحسين';
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
    if (perf.total >= 2 && rate >= 0.7) strongSections.push(name);
    else if (perf.total >= 2 && rate < 0.5) weakSections.push(name);
  }

  for (const [topic, perf] of Object.entries(state.topicPerformance)) {
    const rate = perf.total > 0 ? perf.correct / perf.total : 0;
    if (perf.total >= 2 && rate >= 0.7) strongTopics.push(topic);
    else if (perf.total >= 2 && rate < 0.5) weakTopics.push(topic);
  }

  return {
    abilityScore: state.currentAbility,
    previousAbility: state.previousAbility,
    abilityDelta: state.currentAbility - state.previousAbility,
    accuracyRate: state.accuracyRate,
    accuracyRating: getAccuracyRating(state.accuracyRate),
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
