import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SarisCoachAvatar from "@/components/SmartCoach/SarisCoachAvatar";
import { toast } from "@/hooks/use-toast";

const SmartCoachFloating = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 left-4 z-40" style={{ maxWidth: 430 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-3 bg-saris-bg-card rounded-2xl shadow-modal border border-saris-border p-4 w-72"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-tajawal font-bold text-sm text-saris-text">المدرب الذكي سارِس</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-saris-bg flex items-center justify-center"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4 text-saris-text-3" />
              </button>
            </div>

            <div className="flex justify-center mb-3">
              <SarisCoachAvatar state="speaking" size={80} />
            </div>

            <div className="bg-saris-navy/5 rounded-xl p-3 mb-3">
              <p className="font-tajawal text-sm text-saris-text leading-relaxed">
                أهلاً! أنا سارِس 👋 كيف أقدر أساعدك اليوم؟
              </p>
            </div>

            <div className="space-y-2">
              {[
                { label: "وش أضعف مهاراتي؟", action: "سأحلل أداءك وأخبرك بنقاط ضعفك" },
                { label: "ابدأ تدريب سريع", action: "سأجهز لك جلسة تدريب مخصصة" },
                { label: "كيف أحسّن درجتي؟", action: "سأعطيك توصيات مخصصة لتحسين أدائك" },
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    toast({ title: "سارِس", description: q.action });
                    setOpen(false);
                  }}
                  className="w-full text-right bg-saris-bg hover:bg-saris-bg-soft rounded-xl px-3 py-2.5 font-tajawal text-xs text-saris-navy font-medium transition-colors border border-saris-border"
                >
                  {q.label}
                </button>
              ))}
            </div>

            <p className="font-tajawal text-[10px] text-saris-text-3 text-center mt-3">
              المحادثة الكاملة ستكون متاحة قريباً
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full gradient-primary shadow-card-hover flex items-center justify-center overflow-hidden border-2 border-saris-orange/30"
        whileTap={{ scale: 0.9 }}
        animate={open ? {} : { y: [0, -4, 0] }}
        transition={open ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="المدرب الذكي سارِس"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <img
            src="/coach/saris-coach-idle.png"
            alt="سارِس"
            className="w-11 h-11 object-contain"
          />
        )}
      </motion.button>
    </div>
  );
};

export default SmartCoachFloating;
