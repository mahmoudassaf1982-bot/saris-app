import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SarisCoachAvatar from '../SmartCoach/SarisCoachAvatar';
import type { CoachAnimState } from '../SmartCoach/SarisCoachAvatar';
import { X, MessageCircle } from 'lucide-react';

interface CoachBubble {
  id: number;
  message: string;
}

interface TrainingCoachProps {
  consecutiveWrong: number;
  consecutiveCorrect: number;
  lastAnswerCorrect: boolean | null;
  questionNumber: number;
  isSessionComplete: boolean;
  currentQuestion?: { sectionName: string; topic: string };
}

const correctMessages = ['أحسنت! 🎯', 'ممتاز! كمّل 🚀', 'صح! 👏'];
const wrongMessages = ['لا بأس، حاول بالسؤال الجاي', 'خطأ بسيط، ركّز أكثر'];

const coachingResponses = {
  guide: [
    'حاول تقرأ السؤال مرة ثانية وركّز على المعطيات الأساسية 🤔',
    'فكّر بالخطوات: ما المطلوب؟ ما المعطيات؟ ما العلاقة بينها؟',
    'جرّب تستبعد الخيارات اللي متأكد إنها غلط أول شي ✂️',
  ],
  explain: [
    'هذا المفهوم يعتمد على فهم العلاقة بين المتغيرات. راجع القاعدة الأساسية 📖',
    'المفتاح هنا هو تطبيق القانون بشكل صحيح. تأكد من الوحدات والإشارات',
    'ارجع للأساسيات: هذا النوع من المسائل يُحل بخطوات محددة',
  ],
  whyWrong: [
    'غالباً الخطأ بسبب خطوة حسابية. راجع عملياتك خطوة بخطوة 🔍',
    'تأكد إنك ما خلطت بين المفاهيم المتشابهة',
    'أحياناً القراءة السريعة تسبب أخطاء. تأنَّ في قراءة السؤال',
  ],
};

export default function TrainingCoach({
  consecutiveWrong,
  consecutiveCorrect,
  lastAnswerCorrect,
  questionNumber,
  isSessionComplete,
  currentQuestion,
}: TrainingCoachProps) {
  const [coachState, setCoachState] = useState<CoachAnimState>('idle');
  const [bubble, setBubble] = useState<CoachBubble | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const bubbleIdRef = useRef(0);
  const prevQuestionRef = useRef(questionNumber);

  const showBubble = (message: string, duration = 5000) => {
    const id = ++bubbleIdRef.current;
    setBubble({ id, message });
    setTimeout(() => {
      setBubble(prev => (prev?.id === id ? null : prev));
    }, duration);
  };

  // Session start
  useEffect(() => {
    if (questionNumber === 0) {
      setCoachState('waving');
      showBubble('يلّا نبدأ! 💪');
      setTimeout(() => setCoachState('idle'), 3000);
    }
  }, []);

  // React to answers
  useEffect(() => {
    if (prevQuestionRef.current === questionNumber) return;
    prevQuestionRef.current = questionNumber;

    if (isSessionComplete) {
      setCoachState('celebrating');
      showBubble('أحسنت! خلّنا نشوف النتائج 📊');
      return;
    }

    if (lastAnswerCorrect === null) return;

    if (lastAnswerCorrect) {
      setCoachState('celebrating');
      showBubble(correctMessages[Math.floor(Math.random() * correctMessages.length)]);
      setTimeout(() => setCoachState('idle'), 2000);

      if (consecutiveCorrect >= 5) {
        setTimeout(() => showBubble('أداء رائع! 🔥 خلّني أزيد الصعوبة شوي'), 2500);
      }
    } else {
      setCoachState('thinking');
      showBubble(wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
      setTimeout(() => setCoachState('idle'), 2000);
    }

    // Auto-intervention after 3 wrong
    if (consecutiveWrong >= 3) {
      setTimeout(() => {
        setCoachState('pointing');
        showBubble('لاحظت إنك تواجه صعوبة. خلّني أساعدك — جرّب تقرأ السؤال مرة ثانية بتأنٍ 🤔', 7000);
        setTimeout(() => setCoachState('idle'), 5000);
      }, 1500);
    }
  }, [questionNumber, lastAnswerCorrect, consecutiveWrong, consecutiveCorrect, isSessionComplete]);

  const handleCoachAction = (type: 'guide' | 'explain' | 'whyWrong') => {
    setCoachState('speaking');
    const responses = coachingResponses[type];
    showBubble(responses[Math.floor(Math.random() * responses.length)], 7000);
    setTimeout(() => setCoachState('idle'), 4000);
    setChatOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-4 z-50 flex flex-col items-start gap-2">
      {/* Bubble */}
      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-card border border-border rounded-xl px-3 py-2 shadow-card max-w-[220px] mb-1"
          >
            <p className="font-tajawal text-xs text-foreground leading-relaxed">{bubble.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coach action panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-card border border-border rounded-xl p-3 shadow-card-hover w-[220px] mb-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-tajawal text-xs font-bold text-foreground">سارِس — المدرب</span>
              <button onClick={() => setChatOpen(false)} className="w-5 h-5 flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'وجّهني للحل', type: 'guide' as const },
                { label: 'اشرح المفهوم', type: 'explain' as const },
                { label: 'لماذا إجابتي خاطئة؟', type: 'whyWrong' as const },
              ].map(action => (
                <button
                  key={action.type}
                  onClick={() => handleCoachAction(action.type)}
                  className="w-full text-right font-tajawal text-xs px-2.5 py-2 rounded-lg bg-secondary hover:bg-primary/10 text-foreground transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coach avatar */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        className="relative cursor-pointer"
        whileTap={{ scale: 0.9 }}
        aria-label="المدرب الذكي سارِس"
      >
        <SarisCoachAvatar state={coachState} size={64} />
        {!chatOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
