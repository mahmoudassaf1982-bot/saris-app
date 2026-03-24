import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const SmartCoachFloating = () => {
  return (
    <motion.button
      drag
      dragConstraints={{ top: -500, bottom: 100, left: -300, right: 300 }}
      dragElastic={0.1}
      onClick={() => toast({ title: "سارِس", description: "المدرب الذكي سيكون متاحاً قريباً للمحادثة المباشرة" })}
      className="fixed bottom-20 left-4 z-40 w-16 h-16 flex items-center justify-center cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 0.9 }}
      aria-label="المدرب الذكي سارِس"
    >
      <img
        src="/coach/saris-coach-idle.png"
        alt="سارِس"
        className="w-16 h-16 object-contain drop-shadow-lg pointer-events-none"
      />
    </motion.button>
  );
};

export default SmartCoachFloating;
