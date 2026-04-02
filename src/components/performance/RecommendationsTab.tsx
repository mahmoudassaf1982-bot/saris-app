import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, Sparkles } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Skeleton } from "@/components/ui/skeleton";

const RecommendationsTab = () => {
  const navigate = useNavigate();
  const { recommendations, loading } = useRecommendations();

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-40 w-full rounded-saris-lg" />
        <Skeleton className="h-40 w-full rounded-saris-lg" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <Sparkles className="w-12 h-12 text-saris-text-3 mx-auto mb-3" />
        <p className="font-tajawal font-bold text-saris-text mb-1">لا توجد توصيات حالياً</p>
        <p className="font-tajawal text-xs text-saris-text-3">أكمل اختباراً لتحصل على توصيات مخصصة.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      {recommendations.map((rec, i) => {
        const json = rec.recommendation_json ?? {};
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-saris-orange/10 text-saris-orange px-2 py-0.5 rounded-saris-full font-tajawal text-[11px] font-bold">تدريب مركّز</span>
              <span className="bg-saris-bg text-saris-text-3 px-2 py-0.5 rounded-saris-full font-tajawal text-[11px]">{rec.difficulty ?? json.difficulty ?? "—"}</span>
            </div>
            <h4 className="font-tajawal font-bold text-sm text-saris-text mb-1">
              {json.sectionName ? `تدريب مركّز: ${json.sectionName}` : json.title ?? rec.weakness_key}
            </h4>
            <p className="font-tajawal text-xs text-saris-text-2 mb-3">{rec.reason_text ?? json.reason ?? ""}</p>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-inter text-xs font-bold text-saris-danger">{json.currentScore ?? 0}%</span>
              <div className="flex-1 h-2 bg-saris-border rounded-full relative">
                <div className="h-full bg-saris-danger rounded-full" style={{ width: `${json.currentScore ?? 0}%` }} />
                <div className="absolute top-0 h-full border-r-2 border-dashed border-saris-success" style={{ left: `${json.targetScore ?? 0}%` }} />
              </div>
              <span className="font-inter text-xs font-bold text-saris-success">هدف {json.targetScore ?? 0}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-tajawal text-xs text-saris-text-3 flex items-center gap-1"><Clock className="w-3 h-3" /> {json.duration ?? "10 دقائق"}</span>
              <button
                onClick={() => navigate(`/app/adaptive-training/mock-rec-${i + 1}`)}
                className="bg-saris-orange text-white font-tajawal font-bold text-xs rounded-saris-md px-4 py-2"
              >
                ابدأ التدريب
              </button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default RecommendationsTab;
