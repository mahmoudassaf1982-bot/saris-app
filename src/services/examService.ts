/**
 * examService.ts — Thin-client service layer for exam logic.
 *
 * Every function here is async and returns data shaped exactly as the
 * platform/backend would.  The current implementation falls back to
 * local mocks so the app works offline, but each function is a single
 * swap-point: replace the body with a `fetch()` / Supabase call and
 * the rest of the app stays unchanged.
 */

import {
  mockQuestionPool,
  mockAnswerKeys,
  type MockQuestion,
} from '@/data/mock-questions';
import {
  createInitialState,
  selectNextQuestion,
  processAnswer,
  getSessionResults,
  type STESessionState,
} from '@/services/smartTrainingEngine';

// ─── Shared Types (mirroring platform response shapes) ───────────────

export type SessionType = 'simulation' | 'adaptive_training';

export interface ExamSession {
  id: string;
  type: SessionType;
  questions: MockQuestion[];
  totalTimeSeconds: number; // countdown budget (simulation only)
  previousAbility: number; // for adaptive training
  maxQuestions: number;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  selectedOptionId: string;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctOptionId: string;
  /** Updated adaptive state — only present for adaptive_training sessions */
  adaptiveState?: STESessionState;
}

export interface HintResponse {
  eligible: boolean;
  hintText: string | null;
}

export interface FinishSessionResponse {
  saved: boolean;
}

export interface SimulationResults {
  answers: SimulationAnswerResult[];
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  totalTimeSeconds: number;
  hintsUsed: Record<string, string>;
}

export interface SimulationAnswerResult {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  difficulty: string;
  sectionId: string;
  sectionName: string;
  topic: string;
  usedHint: boolean;
  flagged: boolean;
}

export interface AdaptiveResults {
  abilityScore: number;
  previousAbility: number;
  abilityDelta: number;
  accuracyRate: number;
  accuracyRating: string;
  speedRating: string;
  totalQuestions: number;
  correctCount: number;
  confidencePhase: string;
  weakSections: string[];
  strongSections: string[];
  weakTopics: string[];
  strongTopics: string[];
  difficultyProgression: string[];
}

// ─── Mock hint bank (moves here from ExamSession.tsx) ────────────────

const mockHints: Record<string, string> = {
  q23: 'تذكّر أن |a| < b يعني -b < a < b. طبّق هذه القاعدة على 2x - 3',
  q24: 'استخدم التوزيع الاحتمالي ذي الحدين. عدد المحاولات = 3، احتمال النجاح = 0.5',
  q25: 'المسافة = السرعة × الزمن. اقسم المسافة على السرعة',
  q26: 'ضع عمر سعد = x، عمر أحمد = x + 5. بعد 3 سنوات: (x+5+3) = 2(x+3)',
  q27: 'محدد المصفوفة 2×2: ad - bc. طبّق على [[1,2],[3,4]]',
  q28: 'رتّب المتسابقين حسب المعطيات: خالد قبل سعد، فهد قبل سعد وقبل ناصر',
  q29: 'عدد طرق ترتيب r من n = P(n,r) = n!/(n-r)!',
  q30: '20% من العدد = 45، إذاً العدد = 45 / 0.20',
};

// ─── Internal helpers (mock implementations) ─────────────────────────

function buildSimulationPool(): MockQuestion[] {
  const pool = [...mockQuestionPool];
  const easy = pool.filter(q => q.difficulty === 'easy').sort(() => Math.random() - 0.5).slice(0, 4);
  const medium = pool.filter(q => q.difficulty === 'medium').sort(() => Math.random() - 0.5).slice(0, 7);
  const hard = pool.filter(q => q.difficulty === 'hard').sort(() => Math.random() - 0.5).slice(0, 4);
  const all = [...easy, ...medium, ...hard];
  const sectionOrder = ['sec_alg', 'sec_stats', 'sec_calc', 'sec_logic'];
  const sorted: MockQuestion[] = [];
  for (const sec of sectionOrder) {
    sorted.push(...all.filter(q => q.sectionId === sec));
  }
  return sorted;
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Fetch / create an exam session from the backend.
 * Returns the full question set and session metadata.
 *
 * TODO: replace with  POST /api/sessions  or  supabase.rpc('create_session')
 */
export async function fetchSession(
  sessionId: string,
  type: SessionType,
): Promise<ExamSession> {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 400));

  if (type === 'simulation') {
    const questions = buildSimulationPool();
    return {
      id: sessionId,
      type,
      questions,
      totalTimeSeconds: 15 * 60,
      previousAbility: 55,
      maxQuestions: questions.length,
    };
  }

  // adaptive_training
  const state = createInitialState(55, 15);
  const firstQ = selectNextQuestion(state);
  if (!firstQ) throw new Error('NO_QUESTIONS');
  state.questionsServed = [firstQ];
  state.questionStartTime = Date.now();

  return {
    id: sessionId,
    type,
    questions: [firstQ],
    totalTimeSeconds: 0, // not used for adaptive
    previousAbility: state.previousAbility,
    maxQuestions: state.maxQuestions,
    // Attach internal STE state for client-side progression (mock only)
    ...(({ _steState: state }) as any),
  };
}

/**
 * Get the next question for an adaptive session.
 *
 * TODO: replace with  POST /api/sessions/:id/next-question
 */
export async function getNextQuestion(
  steState: STESessionState,
): Promise<{ question: MockQuestion | null; updatedState: STESessionState }> {
  const question = selectNextQuestion(steState);
  if (!question) return { question: null, updatedState: steState };

  const updatedState: STESessionState = {
    ...steState,
    questionsServed: [...steState.questionsServed, question],
    questionStartTime: Date.now(),
  };
  return { question, updatedState };
}

/**
 * Submit an answer and get correctness + updated state.
 *
 * TODO: replace with  POST /api/sessions/:id/answer
 */
export async function submitAnswer(
  req: SubmitAnswerRequest & { steState?: STESessionState },
): Promise<SubmitAnswerResponse> {
  const { questionId, selectedOptionId, steState } = req;

  // Adaptive training path
  if (steState) {
    const newState = processAnswer(steState, questionId, selectedOptionId);
    const lastAnswer = newState.answers[newState.answers.length - 1];
    return {
      isCorrect: lastAnswer.isCorrect,
      correctOptionId: lastAnswer.correctOptionId,
      adaptiveState: newState,
    };
  }

  // Simulation path — just check correctness
  const correctOptionId = mockAnswerKeys[questionId];
  return {
    isCorrect: selectedOptionId === correctOptionId,
    correctOptionId,
  };
}

/**
 * Request a hint for a question.
 *
 * TODO: replace with  POST /api/sessions/:id/hint
 */
export async function requestHint(
  _sessionId: string,
  questionId: string,
  difficulty: string,
): Promise<HintResponse> {
  // Platform rule: hints only for hard questions
  if (difficulty !== 'hard') {
    return { eligible: false, hintText: null };
  }

  const hintText =
    mockHints[questionId] ||
    'حاول التفكير في المسألة بطريقة مختلفة وراجع القوانين الأساسية المتعلقة بالموضوع.';

  return { eligible: true, hintText };
}

/**
 * Notify the backend that the session is finished. The backend
 * persists results, updates DNA, predicted scores, etc.
 *
 * TODO: replace with  POST /api/sessions/:id/finish
 */
export async function finishSession(
  _sessionId: string,
): Promise<FinishSessionResponse> {
  await new Promise(r => setTimeout(r, 300));
  return { saved: true };
}

/**
 * Compute / fetch results for a simulation session.
 * In production the backend returns this; here we compute locally.
 *
 * TODO: replace with  GET /api/sessions/:id/results
 */
export async function getSimulationResults(
  questions: MockQuestion[],
  answers: Record<number, { questionId: string; selectedOptionId: string | null; flagged: boolean }>,
  totalTimeSeconds: number,
  hintsUsed: Record<string, string>,
): Promise<SimulationResults> {
  const simAnswers: SimulationAnswerResult[] = questions.map((q, i) => ({
    questionId: q.id,
    selectedOptionId: answers[i]?.selectedOptionId ?? null,
    correctOptionId: mockAnswerKeys[q.id],
    isCorrect: answers[i]?.selectedOptionId === mockAnswerKeys[q.id],
    difficulty: q.difficulty,
    sectionId: q.sectionId,
    sectionName: q.sectionName,
    topic: q.topic,
    usedHint: !!hintsUsed[q.id],
    flagged: answers[i]?.flagged ?? false,
  }));

  const correctCount = simAnswers.filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / Math.max(questions.length, 1)) * 100);

  return {
    answers: simAnswers,
    scorePercent,
    correctCount,
    totalQuestions: questions.length,
    totalTimeSeconds,
    hintsUsed,
  };
}

/**
 * Compute / fetch results for an adaptive training session.
 *
 * TODO: replace with  GET /api/sessions/:id/results
 */
export async function getAdaptiveResults(
  steState: STESessionState,
): Promise<AdaptiveResults> {
  return getSessionResults(steState);
}
