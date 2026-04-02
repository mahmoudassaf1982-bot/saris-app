import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { useScorePrediction } from "@/hooks/useScorePrediction";
import { Skeleton } from "@/components/ui/skeleton";

const PredictedScoreTab = () => {
  const { prediction, loading } = useScorePrediction();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-saris-lg" />
        <Skeleton className="h-40 w-full rounded-saris-lg" />
      </div>
    );
  }

  if (!prediction) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <Sparkles className="w-12 h-12 text-saris-text-3 mx-auto mb-3" />
        <p className="font-tajawal font-bold text-saris-text mb-1">لا يوجد تنبؤ بعد</p>
        <p className="font-tajawal text-xs text-saris-text-3">أكمل اختبارات أكثر للحصول على تنبؤ دقيق</p>
      </motion.div>
    );
  }

  const factors = prediction.factors ?? { accuracy: 0, difficultyHandling: 0, timeEfficiency: 0, consistencyTrend: 0 };
  const weakSections = prediction.weak_sections ?? [];
  const strongSections = prediction.strong_sections ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Circular score display */}
      <div className="bg-saris-bg-card rounded-saris-lg p-6 border border-saris-border text-center">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-4">🎯 الدرجة المتوقعة في الاختبار الحقيقي</h3>
        <div className="relative w-36 h-36 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--saris-border))" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--saris-warning))" strokeWidth="8" strokeDasharray={`${prediction.confidence * 2.64} 264`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-inter font-extrabold text-2xl text-saris-text">{prediction.predicted_min} — {prediction.predicted_max}</span>
            <span className="font-tajawal text-xs text-saris-text-3">الدرجة المتوقعة</span>
          </div>
        </div>
        <span className="inline-block bg-saris-warning/10 text-saris-warning rounded-saris-full px-3 py-1 font-tajawal text-xs font-bold">
          مستوى الجاهزية: {prediction.readiness_level}
        </span>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-tajawal text-xs text-saris-text-2">الثقة</span>
            <span className="font-inter text-xs font-bold text-saris-text">{prediction.confidence}%</span>
          </div>
          <div className="w-full h-1.5 bg-saris-border rounded-full">
            <div className="h-full bg-saris-navy rounded-full" style={{ width: `${prediction.confidence}%` }} />
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">📊 عوامل التنبؤ</h3>
        <div className="space-y-3">
          {[
            { label: "الدقة", value: factors.accuracy },
            { label: "التعامل مع الصعوبة", value: factors.difficultyHandling },
            { label: "كفاءة الوقت", value: factors.timeEfficiency },
            { label: "اتجاه الأداء", value: factors.consistencyTrend },
          ].map((f, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-tajawal text-sm text-saris-text">{f.label}</span>
                <span className="font-inter text-sm font-bold text-saris-text">{f.value}%</span>
              </div>
              <div className="w-full h-2 bg-saris-border rounded-full">
                <div className={`h-full rounded-full transition-all ${f.value >= 70 ? "bg-saris-success" : f.value >= 50 ? "bg-saris-warning" : "bg-saris-danger"}`} style={{ width: `${f.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections analysis */}
      <div className="space-y-2">
        {weakSections.length > 0 && (
          <div className="bg-saris-danger/5 rounded-saris-md p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-saris-danger flex-shrink-0" />
            <span className="font-tajawal text-xs text-saris-text">أقسام تحتاج تحسين: {weakSections.join("، ")}</span>
          </div>
        )}
        {strongSections.length > 0 && (
          <div className="bg-saris-success/5 rounded-saris-md p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-saris-success flex-shrink-0" />
            <span className="font-tajawal text-xs text-saris-text">أقسام قوية: {strongSections.join("، ")}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PredictedScoreTab;
