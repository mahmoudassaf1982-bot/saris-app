import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SarisCoachAvatar from "./SarisCoachAvatar";

const quickActions = [
  { label: "أين أجد التدريب الذكي؟", response: "اذهب إلى صفحة الاختبارات واختر 'تدريب ذكي' لبدء جلسة تدريب مخصصة لمستواك." },
  { label: "كيف أحسن درجتي؟", response: "ركّز على الأقسام الضعيفة في خريطة المهارات، واستخدم التدريب المركّز لتحسينها." },
  { label: "اشرح لي الاختبار", response: "الاختبار يتكون من أقسام متعددة. المحاكاة تشبه الاختبار الحقيقي، والتدريب الذكي يتكيّف مع مستواك." },
];

const SmartCoachFloating = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none" />

      {/* Collapsed: draggable coach */}
      {!isOpen && (
        <motion.button
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.05}
          onClick={() => { setIsOpen(true); setShowBubble(false); }}
          className="fixed bottom-20 left-4 z-40 w-16 h-16 flex items-center justify-center cursor-grab active:cursor-grabbing"
          whileTap={{ scale: 0.9 }}
          aria-label="المدرب الذكي سارِس"
        >
          {/* Speech bubble */}
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-saris-bg-card border border-saris-border rounded-xl px-3 py-1.5 shadow-card whitespace-nowrap"
              >
                <span className="font-tajawal text-[11px] text-saris-text">أهلاً! كيف أقدر أساعدك؟</span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-saris-bg-card border-b border-r border-saris-border rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
          <img
            src="/coach/saris-coach-idle.png"
            alt="سارِس"
            className="w-16 h-16 object-contain drop-shadow-lg pointer-events-none"
          />
        </motion.button>
      )}

      {/* Expanded: bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/30"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-saris-bg-card rounded-t-[20px] max-w-[430px] mx-auto overflow-hidden"
              style={{ maxHeight: "70vh" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-saris-border">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-saris-navy" />
                  <h3 className="font-tajawal font-bold text-sm text-saris-text">المدرب الذكي سارِس</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-saris-bg flex items-center justify-center"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4 text-saris-text-2" />
                </button>
              </div>

              {/* Coach avatar */}
              <div className="flex justify-center py-4">
                <SarisCoachAvatar state="celebrating" size={80} />
              </div>

              {/* Quick actions */}
              <div className="px-4 pb-3 flex flex-wrap gap-2 justify-center">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      toast({ title: "سارِس", description: action.response });
                    }}
                    className="bg-saris-bg rounded-full px-3 py-1.5 border border-saris-border font-tajawal text-xs text-saris-text hover:bg-saris-bg-soft transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Chat input (disabled) */}
              <div className="px-4 pb-4">
                <div className="bg-saris-bg rounded-xl border border-saris-border px-4 py-3 opacity-60">
                  <span className="font-tajawal text-xs text-saris-text-3">سيكون متاحاً قريباً...</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartCoachFloating;
