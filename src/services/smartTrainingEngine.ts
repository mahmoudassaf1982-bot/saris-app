import { MockQuestion, mockAnswerKeys, mockQuestionPool, getQuestionText, getOptionTexts } from '@/data/mock-questions';
import { validateFullQuestion, buildLanguagePromptDirective, type ExamLanguage } from '@/services/languageGovernance';

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
  examLanguage: ExamLanguage;
  languagePromptDirective: string;
  rejectedQuestionIds: string[];
}

export function createInitialState(
  previousAbility: number = 50,
  maxQuestions: number = 15,
  examLanguage: ExamLanguage = 'ar'
): STESessionState {
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
    examLanguage,
    languagePromptDirective: buildLanguagePromptDirective(examLanguage),
    rejectedQuestionIds: [],
  };
}

/**
 * Validates a question against the session's exam language.
 * Returns true if the question passes language validation.
 * On failure, adds the question ID to rejectedQuestionIds.
 */
function validateQuestionForSession(
  question: MockQuestion,
  state: STESessionState
): { valid: boolean; state: STESessionState } {
  const questionText = getQuestionText(question, state.examLanguage);
  const optionTexts = getOptionTexts(question, state.examLanguage);
  const result = validateFullQuestion(questionText, optionTexts, state.examLanguage);

  if (result.isValid) {
    return { valid: true, state };
  }

  console.warn(
    `[STE Language Gate] Question "${question.id}" REJECTED: ${result.reason}. ` +
    `Expected: ${state.examLanguage}, Detected: ${result.detectedLanguage}, Confidence: ${result.confidence.toFixed(2)}`
  );

  return {
    valid: false,
    state: {
      ...state,
      rejectedQuestionIds: [...state.rejectedQuestionIds, question.id],
    },
  };
}

/**
 * Selects the next question with language validation gate.
 * Each candidate is validated before being served.
 * Rejected questions are skipped and logged (simulates re-generation).
 */
export function selectNextQuestion(state: STESessionState): { question: MockQuestion | null; state: STESessionState } {
  const MAX_RETRIES = 3;
  let currentState = state;
  let retryCount = 0;

  const servedIds = new Set(currentState.questionsServed.map(q => q.id));
  const rejectedIds = new Set(currentState.rejectedQuestionIds);
  const excludedIds = new Set([...servedIds, ...rejectedIds]);

  const getCandidates = (difficulty?: string) => {
    return mockQuestionPool.filter(q =>
      !excludedIds.has(q.id) &&
      (!difficulty || q.difficulty === difficulty)
    );
  };

  while (retryCount < MAX_RETRIES) {
    let candidates = getCandidates(currentState.currentDifficulty);

    // Prefer weaker sections
    const weakest = getWeakestSection(currentState);
    if (weakest) {
      const fromWeak = candidates.filter(q => q.sectionId === weakest);
      if (fromWeak.length > 0) candidates = fromWeak;
    }

    if (candidates.length === 0) {
      // Fallback: any unserved, non-rejected question
      candidates = getCandidates();
    }

    if (candidates.length === 0) {
      return { question: null, state: currentState };
    }

    const candidate = candidates[Math.floor(Math.random() * candidates.length)];
    const validation = validateQuestionForSession(candidate, currentState);
    currentState = validation.state;

    if (validation.valid) {
      console.log(
        `[STE Language Gate] Question "${candidate.id}" ACCEPTED for language "${currentState.examLanguage}". ` +
        `Prompt directive active: ${currentState.languagePromptDirective.substring(0, 50)}...`
      );
      return { question: candidate, state: currentState };
    }

    // Rejected — mark and retry
    excludedIds.add(candidate.id);
    retryCount++;
    console.warn(`[STE Language Gate] Retry ${retryCount}/${MAX_RETRIES} — selecting another question`);
  }

  // All retries exhausted — do NOT serve unvalidated questions
  console.error(
    `[STE Language Gate] Max retries (${MAX_RETRIES}) exhausted. ` +
    `No question passed language validation for "${currentState.examLanguage}". ` +
    `Rejected IDs: [${[...currentState.rejectedQuestionIds].join(', ')}]. Returning null.`
  );
  return { question: null, state: currentState };
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
