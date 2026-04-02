import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { useLearningDNA } from "@/hooks/useLearningDNA";
import { useUserStats } from "@/hooks/useUserStats";
import { Skeleton } from "@/components/ui/skeleton";

type InsightTone = "success" | "warning" | "info";

interface InsightResult {
  message: string;
  tone: InsightTone;
}

const toneStyles: Record<InsightTone, { bg: string; border: string; iconBg: string; iconColor: string }> = {
  success: {
    bg: "from-saris-success/[0.08] to-saris-success/[0.03]",
    border: "border-saris-success/20",
    iconBg: "bg-saris-success/15",
    iconColor: "text-saris-success",
  },
  warning: {
    bg: "from-saris-orange/10 to-saris-orange/[0.03]",
    border: "border-saris-orange/20",
    iconBg: "bg-saris-orange/15",
    iconColor: "text-saris-orange",
  },
  info: {
    bg: "from-primary/[0.08] to-primary/[0.03]",
    border: "border-primary/15",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
};

const toneIcons = {
  success: TrendingUp,
  warning: AlertTriangle,
  info: Sparkles,
};

function getInsight(
  hasSessions: boolean,
  dnaType: string,
  trend: string,
  avgScore: number
): InsightResult {
  if (!hasSessions) {
    return { message: "🚀 أكمل أول اختبار لتحصل على تحليل ذكي لأسلوب تعلمك!", tone: "info" };
  }

  if (trend === "declining" && dnaType === "fast_executor") {
    return { message: "⚠️ أداؤك يتراجع بسبب التسرع. جرّب تدريباً مركّزاً على الدقة.", tone: "warning" };
  }
  if (trend === "declining") {
    return { message: "⚠️ الأداء يحتاج دعم. جرّب تدريباً قصيراً مركّزاً لاستعادة الزخم.", tone: "warning" };
  }

  if (trend === "improving" && dnaType === "fast_executor") {
    return { message: "🧠 أداؤك يتحسن في السرعة لكن تحتاج تثبيت الدقة. استمر!", tone: "success" };
  }
  if (trend === "improving" && (dnaType === "cautious" || dnaType === "accuracy_focused")) {
    return { message: "📈 تحسن واضح! دقتك ممتازة وسرعتك تتطور.", tone: "success" };
  }
  if (trend === "improving" && dnaType === "adaptive") {
    return { message: "🧬 رائع! أنت تتكيّف بسرعة مع كل تدريب. أداء متميز.", tone: "success" };
  }
  if (trend === "improving") {
    return { message: "📈 تحسن واضح بعد آخر جلسات التدريب. استمر بنفس الوتيرة!", tone: "success" };
  }

  if (trend === "stable" && avgScore >= 70) {
    return { message: "✨ أداؤك مستقر وممتاز. حان وقت التحدي الأعلى!", tone: "info" };
  }
  if (trend === "stable" && avgScore >= 50) {
    return { message: "⚡ الأداء مستقر. جرّب تدريباً قصيراً مركّزاً على نقاط الضعف.", tone: "info" };
  }

  return { message: "💡 استمر بالتدريب المنتظم لتحسين مستواك. كل جلسة تقربك من هدفك.", tone: "info" };
}

const SmartInsightHeader = () => {
  const { dna, loading: dnaLoading } = useLearningDNA();
  const { stats, recentSessions, loading: statsLoading } = useUserStats();

  if (dnaLoading || statsLoading) {
    return <Skeleton className="h-20 w-full rounded-saris-lg" />;
  }

  const insight = getInsight(
    recentSessions.length > 0,
    dna?.type ?? "unknown",
    dna?.trend ?? "stable",
    stats?.averageScore ?? 0
  );

  const style = toneStyles[insight.tone];
  const Icon = toneIcons[insight.tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-r ${style.bg} rounded-saris-lg p-4 border ${style.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-saris-md ${style.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        <div>
          <p className="font-tajawal font-bold text-sm text-saris-navy mb-1">تحليل الذكاء الاصطناعي</p>
          <p className="font-tajawal text-sm text-saris-text-2 leading-relaxed">
            {insight.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartInsightHeader;
