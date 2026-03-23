import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Brain, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import SarisCoachAvatar from "@/components/SmartCoach/SarisCoachAvatar";
import { mockExamTemplates } from "@/data/mock-data";

type Phase = 1 | 2 | 3 | 4;

const Welcome = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>(1);
  const template = mockExamTemplates[0];
  const [selectedSection, setSelectedSection] = useState(template.sections[0]);

  useEffect(() => {
    if (phase === 4) {
      const timer = setTimeout(() => navigate("/app/adaptive-training/mock-first-session"), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, navigate]);

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {/* Phase 1 — Welcome Gate */}
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <SarisCoachAvatar state="waving" size={128} className="mb-6" />

              <div className="bg-saris-bg-card rounded-2xl p-6 shadow-card w-full text-center">
                <h1 className="font-tajawal font-black text-2xl text-saris-text mb-1">مرحبًا 👋</h1>
                <p className="font-tajawal font-bold text-lg text-saris-navy mb-4">أنا سارِس — المدرب الذكي</p>

                <div className="bg-saris-navy/5 border border-saris-navy/10 rounded-xl p-4 mb-6 text-right space-y-2">
                  <p className="font-tajawal text-sm text-saris-text">🎯 هدفي: أخليك تنجح في اختبارك</p>
                  <p className="font-tajawal text-sm text-saris-text">خلينا نبدأ مع بعض أول تدريب بسيط 👇</p>
                </div>

                <button
                  onClick={() => setPhase(2)}
                  className="w-full gradient-gold text-saris-navy font-tajawal font-bold text-lg rounded-xl py-3.5 shadow-card-hover flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  ابدأ أول تدريب الآن
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 2 — Subject Confirmation */}
          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <SarisCoachAvatar state="speaking" size={96} className="mb-4" />

              <div className="bg-saris-bg-card rounded-2xl p-6 shadow-card w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-saris-navy" />
                  <h2 className="font-tajawal font-bold text-lg text-saris-text">جلستك الأولى</h2>
                </div>

                <div className="bg-saris-bg rounded-xl p-4 mb-4">
                  <p className="font-tajawal text-sm text-saris-text-2 mb-1">المادة المختارة</p>
                  <p className="font-tajawal font-bold text-base text-saris-text">{selectedSection.name}</p>
                  <p className="font-tajawal text-xs text-saris-text-3 mt-1">{selectedSection.questions} سؤال</p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-5">
                  <span className="font-tajawal text-sm text-emerald-600 font-bold">هذه الجلسة مجانية 🎁</span>
                </div>

                <button
                  onClick={() => setPhase(4)}
                  className="w-full gradient-gold text-saris-navy font-tajawal font-bold text-base rounded-xl py-3.5 shadow-card-hover flex items-center justify-center gap-2 mb-3"
                >
                  <Zap className="w-5 h-5" />
                  ابدأ الآن
                </button>

                {template.sections.length > 1 && (
                  <button
                    onClick={() => setPhase(3)}
                    className="w-full font-tajawal text-sm text-saris-navy py-2"
                  >
                    تغيير المادة
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Phase 3 — Subject Picker */}
          {phase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="bg-saris-bg-card rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setPhase(2)} className="w-8 h-8 rounded-full bg-saris-bg flex items-center justify-center" aria-label="رجوع">
                    <ChevronRight className="w-4 h-4 text-saris-text-2" />
                  </button>
                  <h2 className="font-tajawal font-bold text-lg text-saris-text">اختر المادة</h2>
                </div>

                <div className="space-y-2">
                  {template.sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => { setSelectedSection(sec); setPhase(2); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-right ${
                        selectedSection.id === sec.id
                          ? "border-saris-navy bg-saris-navy/5 ring-1 ring-saris-navy/20"
                          : "border-saris-border hover:border-saris-navy/30"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-saris-navy flex-shrink-0" />
                      <div>
                        <p className="font-tajawal font-bold text-sm text-saris-text">{sec.name}</p>
                        <p className="font-tajawal text-xs text-saris-text-3">{sec.questions} سؤال</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 4 — Starting */}
          {phase === 4 && (
            <motion.div
              key="phase4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <SarisCoachAvatar state="thinking" size={96} className="mb-6" />
              </motion.div>

              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-saris-navy animate-spin" />
                <span className="font-tajawal font-bold text-base text-saris-text">جارٍ تجهيز جلستك...</span>
              </div>
              <p className="font-tajawal text-sm text-saris-text-3 mt-2">ثوانٍ قليلة فقط</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Welcome;
