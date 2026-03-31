import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Lock, ChevronLeft } from "lucide-react";
import { mockGamification } from "@/data/mock-data";

const tierColors: Record<string, string> = {
  bronze: "from-amber-600 to-amber-800",
  silver: "from-gray-300 to-gray-500",
  gold: "from-yellow-400 to-amber-500",
};

const tierBorders: Record<string, string> = {
  bronze: "border-amber-600/30",
  silver: "border-gray-400/30",
  gold: "border-yellow-500/30",
};

const AchievementBadges = () => {
  const { badges } = mockGamification;
  const [showAll, setShowAll] = useState(false);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const displayed = showAll ? badges : badges.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card mt-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4.5 h-4.5 text-saris-navy" />
          <h3 className="font-tajawal font-bold text-sm text-saris-text">الإنجازات</h3>
        </div>
        <span className="font-inter text-xs font-bold text-saris-text-2">{unlockedCount}/{badges.length}</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <AnimatePresence>
          {displayed.map((badge) => (
            <motion.div
              key={badge.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative flex flex-col items-center p-3 rounded-xl border transition-all ${
                badge.unlocked
                  ? `${tierBorders[badge.tier]} bg-gradient-to-b from-white to-saris-bg`
                  : "border-saris-border bg-saris-bg opacity-60"
              }`}
            >
              {badge.unlocked ? (
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tierColors[badge.tier]} flex items-center justify-center mb-1.5`}>
                  <span className="text-lg">{badge.icon}</span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-saris-border flex items-center justify-center mb-1.5">
                  <Lock className="w-4 h-4 text-saris-text-3" />
                </div>
              )}
              <p className="font-tajawal font-bold text-[11px] text-saris-text text-center leading-tight">
                {badge.name}
              </p>
              <p className="font-tajawal text-[9px] text-saris-text-3 text-center mt-0.5 leading-tight">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {badges.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 w-full flex items-center justify-center gap-1 font-tajawal text-xs text-saris-navy"
        >
          {showAll ? "عرض أقل" : "عرض الكل"}
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${showAll ? "rotate-90" : "-rotate-90"}`} />
        </button>
      )}
    </motion.div>
  );
};

export default AchievementBadges;
