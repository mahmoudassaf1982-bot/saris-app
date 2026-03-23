import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockRecommendations } from "@/data/mock-data";
import { Play } from "lucide-react";

const RecommendedTraining = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-tajawal font-bold text-base text-saris-text">التدريب الموصى به</h2>
        <button
          onClick={() => navigate("/app/performance")}
          className="font-tajawal text-xs text-saris-navy font-medium"
        >
          عرض الكل ←
        </button>
      </div>
      <div className="space-y-3">
        {mockRecommendations.slice(0, 3).map((rec) => (
          <div
            key={rec.id}
            className="flex items-center gap-3 bg-saris-bg-soft rounded-saris-md p-3"
          >
            <div className="flex-1">
              <p className="font-tajawal text-sm font-bold text-saris-text">{rec.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-inter text-xs text-saris-danger">{rec.currentScore}%</span>
                <span className="font-tajawal text-xs text-saris-text-3">→</span>
                <span className="font-inter text-xs text-saris-success">{rec.targetScore}%</span>
              </div>
            </div>
            <button className="w-9 h-9 rounded-saris-full gradient-primary flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 text-white mr-[-1px]" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendedTraining;
