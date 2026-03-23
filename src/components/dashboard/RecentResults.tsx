import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { mockRecentSessions } from "@/data/mock-data";

const RecentResults = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-tajawal font-bold text-base text-saris-text">آخر النتائج</h2>
        <button
          onClick={() => navigate("/app/history")}
          className="font-tajawal text-xs text-saris-navy font-medium"
        >
          عرض الكل ←
        </button>
      </div>
      <div className="space-y-2">
        {mockRecentSessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-3 py-2 border-b border-saris-border last:border-0"
          >
            {session.passed ? (
              <CheckCircle className="w-5 h-5 text-saris-success shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-saris-danger shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-tajawal text-sm text-saris-text truncate">{session.examName}</p>
              <p className="font-inter text-[11px] text-saris-text-3">{session.date}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-16 bg-saris-bg rounded-saris-full h-1.5">
                <div
                  className={`h-1.5 rounded-saris-full ${session.passed ? "bg-saris-success" : "bg-saris-danger"}`}
                  style={{ width: `${session.score}%` }}
                />
              </div>
              <span className="font-inter text-xs font-bold text-saris-text w-8 text-left">{session.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentResults;
