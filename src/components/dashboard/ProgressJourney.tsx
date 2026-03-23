import { motion } from "framer-motion";
import { mockRecentSessions } from "@/data/mock-data";

const ProgressJourney = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-4"
    >
      <h2 className="font-tajawal font-bold text-base text-saris-text mb-3">رحلة التقدم</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {mockRecentSessions.map((session) => (
          <div
            key={session.id}
            className="flex-shrink-0 bg-saris-bg-card rounded-saris-md p-3 border border-saris-border shadow-card min-w-[120px]"
          >
            <div
              className={`w-8 h-8 rounded-saris-full flex items-center justify-center text-white font-inter font-bold text-xs mb-2 ${
                session.passed ? "bg-saris-success" : "bg-saris-danger"
              }`}
            >
              {session.score}%
            </div>
            <p className="font-tajawal text-[11px] text-saris-text-2 line-clamp-2 leading-tight">
              {session.examName.split("—")[1]?.trim() || session.examName}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProgressJourney;
