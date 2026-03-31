import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Brain, Home, Target, Shield, BarChart3, Clock,
  TrendingUp, ChevronLeft, CheckCircle2, XCircle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import TrainingCoach from '@/components/training/TrainingCoach';
import SmartSessionSummary from '@/components/training/SmartSessionSummary';
import FirstSessionCelebration from '@/components/training/FirstSessionCelebration';
import type { MockQuestion } from '@/data/mock-questions';
import type { STESessionState } from '@/services/smartTrainingEngine';
import {
  fetchSession,
  submitAnswer,
  getNextQuestion,
  finishSession,
  getAdaptiveResults,
  type AdaptiveResults,
} from '@/services/examService';

type Phase = 'loading' | 'error' | 'active' | 'submitting' | 'results' | 'first_celebration';

const arabicLetters = ['أ', 'ب', 'ج', 'د'];
const diffColors: Record<string, string> = {
  easy: 'bg-saris-success text-saris-success',
  medium: 'bg-saris-warning text-saris-warning',
  hard: 'bg-saris-danger text-saris-danger',
};
const diffLabels: Record<string, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

export default function AdaptiveTraining() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('loading');
  const [steState, setSteState] = useState<STESessionState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<MockQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [results, setResults] = useState<AdaptiveResults | null>(null);
  const [isFirstSession] = useState(() => !localStorage.getItem('saris_first_session_done'));

  // ── Fetch session from service layer ──
  useEffect(() => {
    if (!sessionId) { setPhase('error'); return; }

    fetchSession(sessionId, 'adaptive_training')
      .then(data => {
        const state = (data as any)._steState as STESessionState;
        setSteState(state);
        setCurrentQuestion(data.questions[0]);
        setPhase('active');
      })
      .catch(() => setPhase('error'));
  }, [sessionId]);

  // Timers
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      setElapsedSeconds(s => s + 1);
      setQuestionSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Submit answer via service layer ──
  const handleConfirm = useCallback(async () => {
    if (!selectedOption || !steState || !currentQuestion || !sessionId) return;
    setConfirmed(true);

    const response = await submitAnswer({
      sessionId,
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      steState,
    });

    setFeedbackCorrect(response.isCorrect);
    setCorrectOptionId(response.correctOptionId);
    setLastAnswerCorrect(response.isCorrect);

    const newState = response.adaptiveState!;

    setTimeout(async () => {
      if (newState.isComplete) {
        setSteState(newState);
        setPhase('submitting');
        await finishSession(sessionId);
        const res = await getAdaptiveResults(newState);
        setResults(res);
        if (isFirstSession) {
          localStorage.setItem('saris_first_session_done', 'true');
          setPhase('first_celebration');
        } else {
          setPhase('results');
        }
        return;
      }

      // ── Get next question via service layer ──
      const { question: nextQ, updatedState } = await getNextQuestion(newState);
      if (!nextQ) {
        setSteState(newState);
        setPhase('submitting');
        await finishSession(sessionId);
        const res = await getAdaptiveResults(newState);
        setResults(res);
        setPhase('results');
        return;
      }

      setSteState(updatedState);
      setCurrentQuestion(nextQ);
      setSelectedOption(null);
      setConfirmed(false);
      setFeedbackCorrect(null);
      setCorrectOptionId(null);
      setQuestionSeconds(0);
    }, 1200);
  }, [selectedOption, steState, currentQuestion, isFirstSession, sessionId]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const questionNum = steState ? steState.answers.length + (phase === 'active' ? 1 : 0) : 0;
  const maxQ = steState?.maxQuestions || 15;

  // LOADING
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // ERROR
  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <Brain className="h-12 w-12 text-destructive" />
        <h2 className="font-tajawal font-bold text-xl text-foreground">الجلسة غير موجودة</h2>
        <p className="font-tajawal text-sm text-muted-foreground text-center">بيانات الجلسة غير متوفرة. يرجى بدء جلسة جديدة.</p>
        <button onClick={() => navigate('/app/exams')} className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 font-tajawal text-sm text-foreground">
          <Home className="w-4 h-4" /> العودة للاختبارات
        </button>
      </div>
    );
  }

  // SUBMITTING
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-tajawal text-sm text-muted-foreground">جارٍ حفظ النتائج وتحديث التحليلات...</p>
      </div>
    );
  }

  // FIRST CELEBRATION
  if (phase === 'first_celebration' && results) {
    return <FirstSessionCelebration abilityScore={results.abilityScore} previousAbility={results.previousAbility} abilityDelta={results.abilityDelta} />;
  }

  // RESULTS
  if (phase === 'results' && results) {
    return <SmartSessionSummary results={results} />;
  }

  if (!steState || !currentQuestion) return null;

  const abilityDelta = steState.currentAbility - steState.previousAbility;

  // ACTIVE TRAINING
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <div>
            <span className="font-tajawal font-bold text-sm text-foreground">جلسة التدريب الذكي</span>
            <span className="font-tajawal text-xs text-muted-foreground mr-2">اختبار القدرات الأكاديمية</span>
          </div>
        </div>
        <button onClick={() => navigate('/app/exams')} className="font-tajawal text-xs text-muted-foreground hover:text-foreground transition-colors">
          خروج
        </button>
      </div>

      <div className="flex-1 px-4 py-3 max-w-[430px] mx-auto w-full space-y-3">
        {/* Adaptive Header */}
        <div className="rounded-xl border border-border bg-card p-3 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                <Brain className="w-3 h-3" /> تدريب ذكي
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${diffColors[steState.currentDifficulty].split(' ')[1]} bg-opacity-10`}
                style={{ backgroundColor: `hsl(var(--saris-${steState.currentDifficulty === 'easy' ? 'success' : steState.currentDifficulty === 'medium' ? 'warning' : 'danger'}) / 0.1)` }}
              >
                <Target className="w-3 h-3" /> {diffLabels[steState.currentDifficulty]}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-saris-purple/10 text-saris-purple">
                {steState.confidencePhase === 'LOW' ? <><Target className="w-3 h-3" /> تقييم أولي</> :
                 steState.confidencePhase === 'MEDIUM' ? <><Brain className="w-3 h-3" /> تعلّم تكيّفي</> :
                 <><Shield className="w-3 h-3" /> تثبيت المستوى</>}
              </span>
            </div>
            <div className="text-left">
              <span className="font-inter text-xs font-bold text-foreground">{questionNum}/{maxQ}</span>
              <span className="font-tajawal text-[10px] text-muted-foreground mr-1">سؤال</span>
              <div className="flex items-center gap-1 justify-end">
                <span className="font-inter text-xs font-bold text-foreground">{steState.currentAbility}%</span>
                {steState.answers.length > 0 && (
                  <span className={`text-[10px] font-bold ${abilityDelta >= 0 ? 'text-saris-success' : 'text-saris-danger'}`}>
                    {abilityDelta >= 0 ? '+' : ''}{abilityDelta}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Difficulty Progression Bar */}
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: maxQ }).map((_, i) => {
              const d = steState.difficultyProgression[i];
              const isCurrent = i === steState.answers.length;
              if (d) {
                return <div key={i} className={`h-1.5 flex-1 rounded-full ${diffColors[d].split(' ')[0]} ${isCurrent ? 'opacity-100' : 'opacity-40'}`} />;
              }
              if (isCurrent) {
                return <div key={i} className={`h-1.5 flex-1 rounded-full ${diffColors[currentQuestion.difficulty].split(' ')[0]}`} />;
              }
              return <div key={i} className="h-1.5 flex-1 rounded-full bg-muted/30" />;
            })}
          </div>
          <Progress value={(steState.answers.length / maxQ) * 100} className="h-1" />
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground font-tajawal">
            <Clock className="w-3 h-3" /> السؤال: {formatTime(questionSeconds)}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground font-tajawal">
            <Clock className="w-3 h-3" /> الإجمالي: {formatTime(elapsedSeconds)}
          </span>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-inter font-bold text-sm text-primary">{questionNum}</span>
              </div>
              <div className="flex-1">
                <p className="font-tajawal text-lg font-semibold text-foreground leading-relaxed">{currentQuestion.text_ar}</p>
                <p className="font-tajawal text-xs text-muted-foreground mt-1">{currentQuestion.sectionName} • {currentQuestion.topic}</p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 mt-4">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOpt = confirmed && opt.id === correctOptionId;
                const isWrongSelection = confirmed && isSelected && opt.id !== correctOptionId;

                let optClass = 'border-border bg-card hover:border-primary/30';
                let letterClass = 'bg-secondary text-foreground';

                if (confirmed) {
                  if (isCorrectOpt) {
                    optClass = 'border-saris-success bg-saris-success/10 ring-2 ring-saris-success/20';
                    letterClass = 'bg-saris-success text-primary-foreground';
                  } else if (isWrongSelection) {
                    optClass = 'border-saris-danger bg-saris-danger/10 ring-2 ring-saris-danger/20';
                    letterClass = 'bg-saris-danger text-primary-foreground';
                  }
                } else if (isSelected) {
                  optClass = 'border-primary bg-primary/5 ring-2 ring-primary/20';
                  letterClass = 'bg-primary text-primary-foreground';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => !confirmed && setSelectedOption(opt.id)}
                    disabled={confirmed}
                    className={`w-full flex items-center gap-3 border rounded-xl px-3 py-3 transition-all min-h-[44px] ${optClass}`}
                    aria-selected={isSelected}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${letterClass}`}>
                      {arabicLetters[i]}
                    </div>
                    <span className="font-tajawal font-medium text-sm text-foreground flex-1 text-right">{opt.textAr}</span>
                    {isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-saris-success flex-shrink-0" />}
                    {isWrongSelection && <XCircle className="w-5 h-5 text-saris-danger flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {confirmed && feedbackCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-xl px-4 py-3 border ${feedbackCorrect ? 'bg-saris-success/10 text-saris-success border-saris-success/20' : 'bg-saris-danger/10 text-saris-danger border-saris-danger/20'}`}
              aria-live="polite"
            >
              <p className="font-tajawal font-bold text-sm">{feedbackCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة'}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Button */}
        <AnimatePresence>
          {selectedOption && !confirmed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button
                onClick={handleConfirm}
                className="w-full gradient-primary text-primary-foreground font-tajawal font-bold text-base rounded-xl h-12 flex items-center justify-center gap-2"
              >
                تأكيد الإجابة
                <ChevronLeft className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Stats Footer */}
        {steState.answers.length > 0 && (
          <div className="bg-muted/20 rounded-lg px-3 py-2 flex items-center justify-around text-xs">
            <span className="flex items-center gap-1 text-muted-foreground font-tajawal">
              <BarChart3 className="w-3 h-3" /> الدقة: {steState.accuracyRate}%
            </span>
            <span className="flex items-center gap-1 text-muted-foreground font-tajawal">
              <Clock className="w-3 h-3" /> متوسط: {Math.round(steState.avgResponseTimeMs / 1000)}ث
            </span>
            <span className="flex items-center gap-1 text-muted-foreground font-tajawal">
              <TrendingUp className="w-3 h-3" /> القدرة: {steState.currentAbility}
            </span>
          </div>
        )}
      </div>

      {/* Training Coach */}
      <TrainingCoach
        consecutiveWrong={steState.consecutiveWrong}
        consecutiveCorrect={steState.consecutiveCorrect}
        lastAnswerCorrect={lastAnswerCorrect}
        questionNumber={steState.answers.length}
        isSessionComplete={steState.isComplete}
        currentQuestion={currentQuestion ? { sectionName: currentQuestion.sectionName, topic: currentQuestion.topic } : undefined}
      />
    </div>
  );
}
