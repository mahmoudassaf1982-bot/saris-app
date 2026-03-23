import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const SmartCoachFloating = () => {
  return (
    <motion.button
      onClick={() => toast({ title: "سارِس", description: "المدرب الذكي سيكون متاحاً قريباً للمحادثة المباشرة" })}
      className="fixed bottom-20 left-4 z-40 w-14 h-14 rounded-full gradient-primary shadow-card-hover flex items-center justify-center overflow-hidden border-2 border-saris-orange/30"
      whileTap={{ scale: 0.9 }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      aria-label="المدرب الذكي سارِس"
    >
      <img
        src="/coach/saris-coach-idle.png"
        alt="سارِس"
        className="w-11 h-11 object-contain"
      />
    </motion.button>
  );
};

export default SmartCoachFloating;
