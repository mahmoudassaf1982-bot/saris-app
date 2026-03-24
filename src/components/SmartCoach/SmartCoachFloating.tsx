import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const SmartCoachFloating = () => {
  return (
    <motion.button
      onClick={() => toast({ title: "سارِس", description: "المدرب الذكي سيكون متاحاً قريباً للمحادثة المباشرة" })}
      className="fixed bottom-20 left-4 z-40 w-16 h-16 flex items-center justify-center"
      whileTap={{ scale: 0.9 }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      aria-label="المدرب الذكي سارِس"
    >
      <img
        src="/coach/saris-coach-idle.png"
        alt="سارِس"
        className="w-16 h-16 object-contain drop-shadow-lg"
      />
    </motion.button>
  );
};

export default SmartCoachFloating;
