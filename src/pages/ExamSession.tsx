import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, ClipboardCheck, Home, Clock, ChevronLeft, ChevronRight,
  Lightbulb, AlertTriangle, Flag, Layers, Grid3X3,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import SimulationSummary from '@/components/simulation/SimulationSummary';
import type { MockQuestion } from '@/data/mock-questions';
import {
  fetchSession,
  requestHint,
  finishSession,
  getSimulationResults,
  type ExamSession as ExamSessionData,
  type SimulationResults,
} from '@/services/examService';

type Phase = 'loading' | 'error' | 'active' | 'confirm_finish' | 'submitting' | 'results' | 'time_up';

const arabicLetters = ['أ', 'ب', 'ج', 'د'];

interface SimAnswer {
  questionId: string;
  selectedOptionId: string | null;
  sectionId: string;
  sectionName: string;
  topic: string;
  difficulty: string;
  flagged: boolean;
  hintText: string | null;
}

interface SectionInfo {
  id: string;
  name: string;
  questionIndices: number[];
}

export default function ExamSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('loading');
  const [session, setSession] = useState<ExamSessionData | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, SimAnswer>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<Record<string, string>>({});
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  // ── Fetch session from service layer ──
  useEffect(() => {
    if (!sessionId) { setPhase('error'); return; }

    fetchSession(sessionId, 'simulation')
      .then(data => {
        setSession(data);
        setQuestions(data.questions);
        setRemainingSeconds(data.totalTimeSeconds);
        if (data.questions.length > 0) setActiveSectionId(data.questions[0].sectionId);
        setPhase('active');
      })
      .catch(() => setPhase('error'));
  }, [sessionId]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'active' && phase !== 'confirm_finish') return;
    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase('time_up');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Auto-submit on time up
  useEffect(() => {
    if (phase === 'time_up') {
      setTimeout(() => setPhase('submitting'), 2000);
      setTimeout(() => handleComputeResults(), 3500);
    }
  }, [phase]);

  // Derive sections
  const sections: SectionInfo[] = useMemo(() => {
    const map = new Map<string, SectionInfo>();
    questions.forEach((q, i) => {
      if (!map.has(q.sectionId)) {
        map.set(q.sectionId, { id: q.sectionId, name: q.sectionName, questionIndices: [] });
      }
      map.get(q.sectionId)!.questionIndices.push(i);
    });
    return Array.from(map.values());
  }, [questions]);

  const totalTimeSeconds = session?.totalTimeSeconds ?? 15 * 60;
  const maxHints = useMemo(() => questions.filter(q => q.difficulty === 'hard').length, [questions]);
  const usedHintCount = Object.keys(hintsUsed).length;

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const selectedOption = currentAnswer?.selectedOptionId ?? null;
  const isFlagged = currentAnswer?.flagged ?? false;
  const isHard = currentQuestion?.difficulty === 'hard';
  const questionHint = currentQuestion ? hintsUsed[currentQuestion.id] : null;
  const canUseHint = isHard && !questionHint && usedHintCount < maxHints;

  const selectOption = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        sectionId: currentQuestion.sectionId,
        sectionName: currentQuestion.sectionName,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        flagged: prev[currentIndex]?.flagged ?? false,
        hintText: prev[currentIndex]?.hintText ?? null,
      },
    }));
  }, [currentIndex, currentQuestion]);

  const toggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex] ?? {
          questionId: currentQuestion.id,
          selectedOptionId: null,
          sectionId: currentQuestion.sectionId,
          sectionName: currentQuestion.sectionName,
          topic: currentQuestion.topic,
          difficulty: currentQuestion.difficulty,
          hintText: null,
        },
        flagged: !(prev[currentIndex]?.flagged ?? false),
      },
    }));
  }, [currentIndex, currentQuestion]);

  // ── Request hint via service layer ──
  const useHint = useCallback(async () => {
    if (!currentQuestion || !canUseHint || !session) return;
    const response = await requestHint(session.id, currentQuestion.id, currentQuestion.difficulty);
    if (response.eligible && response.hintText) {
      setHintsUsed(prev => ({ ...prev, [currentQuestion.id]: response.hintText! }));
    }
  }, [currentQuestion, canUseHint, session]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
    setShowQuestionGrid(false);
    const q = questions[index];
    if (q) setActiveSectionId(q.sectionId);
  }, [questions]);

  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setActiveSectionId(questions[next].sectionId);
    }
  }, [currentIndex, questions]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setActiveSectionId(questions[prev].sectionId);
    }
  }, [currentIndex, questions]);

  const handleFinish = useCallback(() => {
    setPhase('confirm_finish');
  }, []);

  // ── Finish + compute results via service layer ──
  const handleComputeResults = useCallback(async () => {
    if (!session) return;
    await finishSession(session.id);
    const elapsed = totalTimeSeconds - remainingSeconds;
    const results = await getSimulationResults(questions, answers, elapsed, hintsUsed);
    setSimulationResults(results);
    setPhase('results');
  }, [session, questions, answers, remainingSeconds, hintsUsed, totalTimeSeconds]);

  const confirmFinish = useCallback(() => {
    setPhase('submitting');
    handleComputeResults();
  }, [handleComputeResults]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerColor = remainingSeconds < 300 ? 'text-destructive' : 'text-muted-foreground';

  const answeredCount = Object.values(answers).filter(a => a.selectedOptionId).length;
  const flaggedCount = Object.values(answers).filter(a => a.flagged).length;

  // ── LOADING ──
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // ── ERROR ──
  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <ClipboardCheck className="h-12 w-12 text-destructive" />
        <h2 className="font-tajawal font-bold text-xl text-foreground">الجلسة غير موجودة</h2>
        <p className="font-tajawal text-sm text-muted-foreground text-center">بيانات جلسة المحاكاة غير متوفرة. يرجى بدء جلسة جديدة.</p>
        <button onClick={() => navigate('/app/exams')} className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 font-tajawal text-sm text-foreground">
          <Home className="w-4 h-4" /> العودة للاختبارات
        </button>
      </div>
    );
  }

  // ── TIME UP ──
  if (phase === 'time_up') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <AlertTriangle className="h-12 w-12 text-saris-warning mx-auto" />
        </motion.div>
        <h2 className="font-tajawal font-bold text-xl text-foreground">⏰ انتهى الوقت!</h2>
        <p className="font-tajawal text-sm text-muted-foreground">تم إنهاء الجلسة تلقائياً. جارٍ حفظ النتائج...</p>
      </div>
    );
  }

  // ── SUBMITTING ──
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-tajawal text-sm text-muted-foreground">جارٍ حفظ النتائج وتحديث التحليلات...</p>
      </div>
    );
  }

  // ── CONFIRM FINISH ──
  if (phase === 'confirm_finish') {
    const unanswered = questions.length - answeredCount;
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <AlertTriangle className="h-12 w-12 text-saris-warning" />
        <h2 className="font-tajawal font-bold text-xl text-foreground">هل تريد إنهاء المحاكاة؟</h2>
        <div className="text-center space-y-1">
          <p className="font-tajawal text-sm text-muted-foreground">
            أجبت على <span className="font-bold text-foreground">{answeredCount}</span> من <span className="font-bold text-foreground">{questions.length}</span> سؤال
          </p>
          {unanswered > 0 && (
            <p className="font-tajawal text-sm text-destructive">
              ⚠️ {unanswered} سؤال بدون إجابة
            </p>
          )}
          {flaggedCount > 0 && (
            <p className="font-tajawal text-sm text-saris-warning">
              🚩 {flaggedCount} سؤال مُعلَّم للمراجعة
            </p>
          )}
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => setPhase('active')} className="flex-1 border border-border bg-card text-foreground font-tajawal font-bold text-sm rounded-xl h-11">
            العودة
          </button>
          <button onClick={confirmFinish} className="flex-1 gradient-primary text-primary-foreground font-tajawal font-bold text-sm rounded-xl h-11">
            إنهاء وعرض النتائج
          </button>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className={`w-4 h-4 ${timerColor}`} />
          <span className={`font-inter font-bold text-sm ${timerColor}`}>{formatTime(remainingSeconds)}</span>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if (phase === 'results' && simulationResults) {
    return (
      <SimulationSummary
        answers={simulationResults.answers}
        questions={questions}
        totalQuestions={simulationResults.totalQuestions}
        totalTimeSeconds={simulationResults.totalTimeSeconds}
        hintsUsed={simulationResults.hintsUsed}
      />
    );
  }

  if (!currentQuestion) return null;

  const questionNum = currentIndex + 1;
  const maxQ = questions.length;

  // ── ACTIVE SIMULATION ──
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            <div>
              <span className="font-tajawal font-bold text-sm text-foreground">محاكاة رسمية</span>
              <span className="font-tajawal text-xs text-muted-foreground mr-2">اختبار القدرات</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className={`w-4 h-4 ${timerColor}`} />
              <span className={`font-inter font-bold text-sm ${timerColor}`}>{formatTime(remainingSeconds)}</span>
              {remainingSeconds < 60 && (
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-xs">⚠️</motion.span>
              )}
            </div>
            <button onClick={handleFinish} className="font-tajawal text-xs text-destructive font-bold hover:text-destructive/80 transition-colors">
              إنهاء
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        {sections.length > 1 && (
          <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSectionId(sec.id);
                  setCurrentIndex(sec.questionIndices[0]);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-tajawal font-bold whitespace-nowrap transition-colors ${
                  activeSectionId === sec.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                <Layers className="w-3 h-3" />
                {sec.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-3 max-w-[430px] mx-auto w-full space-y-3">
        {/* Progress & Question Counter */}
        <div className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-tajawal text-xs text-muted-foreground">
                📚 {currentQuestion.sectionName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowQuestionGrid(!showQuestionGrid)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-tajawal text-muted-foreground hover:bg-secondary transition-colors"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                {questionNum}/{maxQ}
              </button>
              <button
                onClick={toggleFlag}
                className={`p-1.5 rounded-lg transition-colors ${isFlagged ? 'bg-saris-warning/10 text-saris-warning' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                <Flag className="w-4 h-4" fill={isFlagged ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <Progress value={(answeredCount / maxQ) * 100} className="h-1.5" />
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-tajawal text-[10px] text-muted-foreground">{answeredCount} من {maxQ} تم الإجابة</span>
            {flaggedCount > 0 && (
              <span className="font-tajawal text-[10px] text-saris-warning">🚩 {flaggedCount} مُعلَّم</span>
            )}
          </div>
        </div>

        {/* Question Navigation Grid */}
        <AnimatePresence>
          {showQuestionGrid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, i) => {
                    const ans = answers[i];
                    const isAnswered = !!ans?.selectedOptionId;
                    const isFl = ans?.flagged;
                    const isCurrent = i === currentIndex;
                    let bg = 'bg-secondary text-muted-foreground';
                    if (isCurrent) bg = 'bg-primary text-primary-foreground';
                    else if (isFl) bg = 'bg-saris-warning/20 text-saris-warning border border-saris-warning/30';
                    else if (isAnswered) bg = 'bg-primary/10 text-primary';
                    return (
                      <button
                        key={i}
                        onClick={() => goToQuestion(i)}
                        className={`w-full aspect-square rounded-lg font-inter font-bold text-xs flex items-center justify-center transition-colors ${bg}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-tajawal text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-primary/10 inline-block" /> تمت الإجابة</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-saris-warning/20 border border-saris-warning/30 inline-block" /> مُعلَّم</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-secondary inline-block" /> لم يُجَب</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-inter font-bold text-sm text-primary">{questionNum}</span>
              </div>
              <p className="font-tajawal text-[17px] font-semibold text-foreground leading-relaxed flex-1">
                {currentQuestion.text_ar}
              </p>
            </div>

            <div className="space-y-2">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = selectedOption === opt.id;
                let optClass = 'border-border bg-card hover:border-primary/30';
                let letterClass = 'bg-secondary text-foreground';

                if (isSelected) {
                  optClass = 'border-primary bg-primary/5 ring-2 ring-primary/20';
                  letterClass = 'bg-primary text-primary-foreground';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => selectOption(opt.id)}
                    className={`w-full flex items-center gap-3 border rounded-xl px-3 py-3 transition-all min-h-[44px] ${optClass}`}
                    aria-selected={isSelected}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${letterClass}`}>
                      {arabicLetters[i]}
                    </div>
                    <span className="font-tajawal font-medium text-sm text-foreground flex-1 text-right">{opt.textAr}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Smart Hint — eligibility from service layer */}
        {isHard && (
          <div>
            {!questionHint && canUseHint && (
              <button
                onClick={useHint}
                className="flex items-center gap-2 font-tajawal text-xs text-saris-warning border border-saris-warning/30 rounded-xl px-3 py-2.5 hover:bg-saris-warning/5 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>💡 تلميح</span>
                <span className="mr-auto font-inter text-[10px] text-muted-foreground">
                  {usedHintCount}/{maxHints}
                </span>
              </button>
            )}
            {!questionHint && !canUseHint && usedHintCount >= maxHints && (
              <p className="font-tajawal text-[11px] text-muted-foreground text-center py-1">
                لقد استخدمت جميع التلميحات المتاحة في هذه الجلسة
              </p>
            )}
            {questionHint && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-saris-warning/10 border border-saris-warning/20 rounded-xl px-3 py-2.5"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-saris-warning flex-shrink-0 mt-0.5" />
                  <p className="font-tajawal text-xs text-foreground leading-relaxed">{questionHint}</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex-1 flex items-center justify-center gap-1 border border-border bg-card text-foreground font-tajawal font-bold text-sm rounded-xl h-11 disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-secondary"
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>
          {currentIndex < maxQ - 1 ? (
            <button
              onClick={goNext}
              className="flex-1 flex items-center justify-center gap-1 gradient-primary text-primary-foreground font-tajawal font-bold text-sm rounded-xl h-11"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-1 gradient-primary text-primary-foreground font-tajawal font-bold text-sm rounded-xl h-11"
            >
              إنهاء المحاكاة
            </button>
          )}
        </div>

        {/* Exam conditions notice */}
        {answeredCount === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-saris-warning/5 border border-saris-warning/20 rounded-xl px-3 py-2.5"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-saris-warning flex-shrink-0 mt-0.5" />
              <p className="font-tajawal text-[11px] text-muted-foreground leading-relaxed">
                المحاكاة تحاكي ظروف الاختبار الحقيقي: مؤقت تنازلي، بدون مدرب ذكي، يمكنك التنقل بين الأسئلة ومراجعتها قبل الإنهاء
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
