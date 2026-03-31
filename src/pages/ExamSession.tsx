import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, ClipboardCheck, Home, Clock, ChevronLeft, CheckCircle2, XCircle,
  Lightbulb, AlertTriangle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import SimulationSummary from '@/components/simulation/SimulationSummary';
import { mockQuestionPool, mockAnswerKeys, type MockQuestion } from '@/data/mock-questions';

type Phase = 'loading' | 'error' | 'active' | 'submitting' | 'results' | 'time_up';

const arabicLetters = ['أ', 'ب', 'ج', 'د'];
const diffLabels: Record<string, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };
const diffBadgeColors: Record<string, string> = {
  easy: 'bg-saris-success/10 text-saris-success',
  medium: 'bg-saris-warning/10 text-saris-warning',
  hard: 'bg-saris-danger/10 text-saris-danger',
};

interface SimAnswer {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  responseTimeMs: number;
  difficulty: string;
  sectionId: string;
  sectionName: string;
  topic: string;
  usedHint: boolean;
}

// Build a fixed simulation pool: 15 questions in exam order (mixed difficulty)
function buildSimulationPool(): MockQuestion[] {
  const pool = [...mockQuestionPool];
  // Shuffle and pick 15, ensuring mix of difficulties
  const easy = pool.filter(q => q.difficulty === 'easy').sort(() => Math.random() - 0.5).slice(0, 5);
  const medium = pool.filter(q => q.difficulty === 'medium').sort(() => Math.random() - 0.5).slice(0, 6);
  const hard = pool.filter(q => q.difficulty === 'hard').sort(() => Math.random() - 0.5).slice(0, 4);
  return [...easy, ...medium, ...hard];
}

// Mock hints for hard questions
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

const TOTAL_TIME_SECONDS = 15 * 60; // 15 minutes for 15 questions

export default function ExamSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<SimAnswer[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_TIME_SECONDS);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [hintUsedForQuestion, setHintUsedForQuestion] = useState(false);

  // Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sessionId) { setPhase('error'); return; }
      const pool = buildSimulationPool();
      if (pool.length === 0) { setPhase('error'); return; }
      setQuestions(pool);
      setQuestionStartTime(Date.now());
      setPhase('active');
    }, 500);
    return () => clearTimeout(timer);
  }, [sessionId]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'active') return;
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
      setTimeout(() => setPhase('results'), 3500);
    }
  }, [phase]);

  const currentQuestion = questions[currentIndex];
  const maxQ = questions.length;
  const isHardQuestion = currentQuestion?.difficulty === 'hard';
  const hintAvailable = isHardQuestion && mockHints[currentQuestion?.id] && !hintUsedForQuestion;

  const handleConfirm = useCallback(() => {
    if (!selectedOption || !currentQuestion) return;
    setConfirmed(true);

    const correctId = mockAnswerKeys[currentQuestion.id];
    const isCorrect = selectedOption === correctId;
    const responseTimeMs = Date.now() - questionStartTime;

    setFeedbackCorrect(isCorrect);
    setCorrectOptionId(correctId);

    const newAnswer: SimAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      correctOptionId: correctId,
      isCorrect,
      responseTimeMs,
      difficulty: currentQuestion.difficulty,
      sectionId: currentQuestion.sectionId,
      sectionName: currentQuestion.sectionName,
      topic: currentQuestion.topic,
      usedHint: hintUsedForQuestion,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex >= maxQ - 1) {
        // Last question
        setPhase('submitting');
        setTimeout(() => setPhase('results'), 1500);
        return;
      }

      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setConfirmed(false);
      setFeedbackCorrect(null);
      setCorrectOptionId(null);
      setShowHint(false);
      setHintUsedForQuestion(false);
      setQuestionStartTime(Date.now());
    }, 1500);
  }, [selectedOption, currentQuestion, questionStartTime, answers, currentIndex, maxQ, hintUsedForQuestion]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerColor = remainingSeconds < 60 ? 'text-saris-danger' : remainingSeconds < 180 ? 'text-saris-warning' : 'text-muted-foreground';

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

  // ── RESULTS ──
  if (phase === 'results') {
    return <SimulationSummary answers={answers} totalQuestions={maxQ} totalTimeSeconds={TOTAL_TIME_SECONDS - remainingSeconds} />;
  }

  if (!currentQuestion) return null;

  const questionNum = currentIndex + 1;

  // ── ACTIVE SIMULATION ──
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-saris-navy" />
          <div>
            <span className="font-tajawal font-bold text-sm text-foreground">محاكاة رسمية</span>
            <span className="font-tajawal text-xs text-muted-foreground mr-2">اختبار القدرات الأكاديمية</span>
          </div>
        </div>
        <button onClick={() => navigate('/app/exams')} className="font-tajawal text-xs text-muted-foreground hover:text-foreground transition-colors">
          خروج
        </button>
      </div>

      <div className="flex-1 px-4 py-3 max-w-[430px] mx-auto w-full space-y-3">
        {/* Timer & Progress Header */}
        <div className="rounded-xl border border-border bg-card p-3 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-saris-navy/10 text-saris-navy">
                <ClipboardCheck className="w-3 h-3" /> محاكاة رسمية
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${diffBadgeColors[currentQuestion.difficulty]}`}>
                {diffLabels[currentQuestion.difficulty]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-inter text-xs font-bold text-foreground">{questionNum}/{maxQ}</span>
              <span className="font-tajawal text-[10px] text-muted-foreground">سؤال</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className={`w-4 h-4 ${timerColor}`} />
            <span className={`font-inter font-bold text-lg ${timerColor}`}>
              {formatTime(remainingSeconds)}
            </span>
            {remainingSeconds < 60 && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-xs font-tajawal text-saris-danger font-bold"
              >
                ⚠️
              </motion.span>
            )}
          </div>

          <Progress value={(questionNum / maxQ) * 100} className="h-1.5" />

          {/* ×3 Weight Indicator */}
          <div className="flex items-center justify-center mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-saris-purple/10 text-saris-purple">
              ×3 وزن التأثير على التنبؤ
            </span>
          </div>
        </div>

        {/* Section Info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-tajawal text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            📚 {currentQuestion.sectionName}
          </span>
          <span className="font-tajawal text-muted-foreground">
            {currentQuestion.topic}
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
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-saris-navy/10 flex items-center justify-center flex-shrink-0">
                <span className="font-inter font-bold text-sm text-saris-navy">{questionNum}</span>
              </div>
              <p className="font-tajawal text-[17px] font-semibold text-foreground leading-relaxed flex-1">{currentQuestion.text_ar}</p>
            </div>

            {/* Options */}
            <div className="space-y-2">
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

        {/* Hint Button (only for hard questions) */}
        {isHardQuestion && !confirmed && (
          <div>
            {!showHint && hintAvailable && (
              <button
                onClick={() => { setShowHint(true); setHintUsedForQuestion(true); }}
                className="flex items-center gap-2 font-tajawal text-xs text-saris-warning border border-saris-warning/30 rounded-xl px-3 py-2 hover:bg-saris-warning/5 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                تلميح (للأسئلة الصعبة فقط)
              </button>
            )}
            {showHint && mockHints[currentQuestion.id] && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-saris-warning/10 border border-saris-warning/20 rounded-xl px-3 py-2.5"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-saris-warning flex-shrink-0 mt-0.5" />
                  <p className="font-tajawal text-xs text-foreground leading-relaxed">{mockHints[currentQuestion.id]}</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

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

        {/* Exam conditions notice (shown at start) */}
        {answers.length === 0 && !confirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-saris-warning/5 border border-saris-warning/20 rounded-xl px-3 py-2.5"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-saris-warning flex-shrink-0 mt-0.5" />
              <p className="font-tajawal text-[11px] text-muted-foreground leading-relaxed">
                المحاكاة تحاكي ظروف الاختبار الحقيقي: مؤقت تنازلي، لا مدرب ذكي، تلميحات محدودة للأسئلة الصعبة فقط
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
