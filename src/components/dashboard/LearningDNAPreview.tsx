import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Brain } from "lucide-react";
import { useLearningDNA } from "@/hooks/useLearningDNA";
import SarisCoachAvatar from "@/components/SmartCoach/SarisCoachAvatar";
import { Skeleton } from "@/components/ui/skeleton";

const dnaTypeLabels: Record<string, string> = {
  fast_executor: "المنفذ السريع",
  cautious: "الحذر",
  accuracy_focused: "المركز على الدقة",
  adaptive: "المتكيّف",
  balanced: "المتوازن",
  unknown: "غير محدد",
};

const trendLabels: Record<string, string> = {
  improving: "تحسّن",
  declining: "تراجع",
  stable: "مستقر",
};

const trendIcons: Record<string, typeof TrendingUp> = {
  improving: TrendingUp,
  declining: TrendingDown,
  stable: Minus,
};

const trendColors: Record<string, string> = {
  improving: "text-saris-success bg-saris-success/10",
  declining: "text-saris-danger bg-saris-danger/10",
  stable: "text-saris-text-3 bg-saris-bg",
};

const LearningDNAPreview = () => {
  const navigate = useNavigate();
  const { dna, loading } = useLearningDNA();

  if (loading) {
    return (
      <div className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!dna) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card text-center"
      >
        <Brain className="w-8 h-8 text-saris-text-3 mx-auto mb-2" />
        <p className="font-tajawal text-sm text-saris-text-2">لا توجد بصمة تعلم بعد</p>
      </motion.div>
    );
  }

  const TrendIcon = trendIcons[dna.trend] ?? Minus;
  const trendColor = trendColors[dna.trend] ?? trendColors.stable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-tajawal font-bold text-base text-saris-text">بصمة التعلم (DNA)</h2>
        <button
          onClick={() => navigate("/app/performance")}
          className="font-tajawal text-xs text-saris-navy font-medium"
        >
          عرض الكل ←
        </button>
      </div>
      <div className="flex items-center gap-3">
        <SarisCoachAvatar state="idle" size={64} className="flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-tajawal font-bold text-base text-saris-text">{dnaTypeLabels[dna.type] ?? dna.type}</span>
            <div className={`flex items-center gap-1 rounded-saris-full px-2 py-0.5 ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="font-tajawal text-[11px] font-medium">{trendLabels[dna.trend] ?? dna.trend}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-tajawal text-xs text-saris-text-3">المرحلة {dna.stage}</span>
            <span className="font-tajawal text-xs text-saris-text-3">الثقة {Math.round(dna.confidence)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningDNAPreview;
