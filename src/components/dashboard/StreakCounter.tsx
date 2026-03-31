import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { mockGamification } from "@/data/mock-data";

const StreakCounter = () => {
  const { streak } = mockGamification;
  const flameSize = streak >= 30 ? "w-7 h-7" : streak >= 7 ? "w-6 h-6" : "w-5 h-5";
  const flameBg = streak >= 30 ? "bg-saris-danger/15" : streak >= 7 ? "bg-saris-orange/15" : "bg-saris-warning/15";
  const flameColor = streak >= 30 ? "text-saris-danger" : streak >= 7 ? "text-saris-orange" : "text-saris-warning";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-saris-bg-card rounded-saris-lg p-3 border border-saris-border shadow-card flex items-center gap-3"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`w-10 h-10 rounded-lg ${flameBg} flex items-center justify-center`}
      >
        <Flame className={`${flameSize} ${flameColor}`} />
      </motion.div>
      <div>
        <p className="font-tajawal font-bold text-sm text-saris-text">
          🔥 {streak} أيام متتالية
        </p>
        <p className="font-tajawal text-[11px] text-saris-text-3">واصل التدريب للحفاظ على سلسلتك</p>
      </div>
    </motion.div>
  );
};

export default StreakCounter;
