import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Play, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const RecommendedTraining = () => {
  const navigate = useNavigate();
  const { recommendations, loading } = useRecommendations();

  if (loading) {
    return (
      <div className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card text-center py-8"
      >
        <Sparkles className="w-10 h-10 text-saris-text-3 mx-auto mb-2" />
        <p className="font-tajawal text-sm text-saris-text-2">لا توجد توصيات — أكمل اختباراً للحصول على توصيات مخصصة</p>
      </motion.div>
    );
  }

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
        {recommendations.slice(0, 3).map((rec) => {
          const json = rec.recommendation_json ?? {};
          return (
            <div
              key={rec.id}
              className="flex items-center gap-3 bg-saris-bg-soft rounded-saris-md p-3"
            >
              <div className="flex-1">
                <p className="font-tajawal text-sm font-bold text-saris-text">
                  {json.sectionName ? `تدريب مركّز: ${json.sectionName}` : json.title ?? rec.weakness_key}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-inter text-xs text-saris-danger">{json.currentScore ?? 0}%</span>
                  <span className="font-tajawal text-xs text-saris-text-3">→</span>
                  <span className="font-inter text-xs text-saris-success">{json.targetScore ?? 0}%</span>
                </div>
              </div>
              <button className="w-9 h-9 rounded-saris-full gradient-primary flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 text-white mr-[-1px]" />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecommendedTraining;
