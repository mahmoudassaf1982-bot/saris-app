import { motion } from "framer-motion";
import { Target, CheckCircle, Circle } from "lucide-react";
import { mockGamification } from "@/data/mock-data";

const DailyGoals = () => {
  const { dailyGoals } = mockGamification;
  const completedCount = dailyGoals.filter((g) => g.completed).length;
  const allDone = completedCount === dailyGoals.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card mt-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4.5 h-4.5 text-saris-navy" />
          <h3 className="font-tajawal font-bold text-sm text-saris-text">أهداف اليوم</h3>
        </div>
        <span className="font-inter text-xs font-bold text-saris-text-2">
          {completedCount}/{dailyGoals.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {dailyGoals.map((goal, i) => (
          <div key={i} className="flex items-center gap-3">
            {goal.completed ? (
              <CheckCircle className="w-5 h-5 text-saris-success flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-saris-text-3 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-tajawal text-sm ${goal.completed ? "text-saris-text-3 line-through" : "text-saris-text"}`}>
                {goal.label}
              </p>
              {!goal.completed && (
                <div className="w-full bg-saris-bg rounded-full h-1.5 mt-1">
                  <div
                    className="h-1.5 rounded-full bg-saris-navy/40 transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {allDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 bg-saris-success/10 border border-saris-success/20 rounded-lg px-3 py-2 text-center"
        >
          <span className="font-tajawal text-sm text-saris-success font-bold">🎉 أحسنت! أكملت جميع الأهداف</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DailyGoals;
