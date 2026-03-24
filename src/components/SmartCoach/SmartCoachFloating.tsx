import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const SmartCoachFloating = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none" />
      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.05}
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
    </>
  );
};

export default SmartCoachFloating;
