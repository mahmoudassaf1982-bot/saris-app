import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { mockPredictedScore } from "@/data/mock-data";

const PredictedScoreTab = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Circular score display */}
      <div className="bg-saris-bg-card rounded-saris-lg p-6 border border-saris-border text-center">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-4">🎯 الدرجة المتوقعة في الاختبار الحقيقي</h3>
        <div className="relative w-36 h-36 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--saris-border))" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--saris-warning))" strokeWidth="8" strokeDasharray={`${mockPredictedScore.confidence * 2.64} 264`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-inter font-extrabold text-2xl text-saris-text">{mockPredictedScore.low} — {mockPredictedScore.high}</span>
            <span className="font-tajawal text-xs text-saris-text-3">الدرجة المتوقعة</span>
          </div>
        </div>
        <span className="inline-block bg-saris-warning/10 text-saris-warning rounded-saris-full px-3 py-1 font-tajawal text-xs font-bold">
          مستوى الجاهزية: {mockPredictedScore.readinessAr}
        </span>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-tajawal text-xs text-saris-text-2">الثقة</span>
            <span className="font-inter text-xs font-bold text-saris-text">{mockPredictedScore.confidence}%</span>
          </div>
          <div className="w-full h-1.5 bg-saris-border rounded-full">
            <div className="h-full bg-saris-navy rounded-full" style={{ width: `${mockPredictedScore.confidence}%` }} />
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">📊 عوامل التنبؤ</h3>
        <div className="space-y-3">
          {[
            { label: "الدقة", value: mockPredictedScore.factors.accuracy },
            { label: "التعامل مع الصعوبة", value: mockPredictedScore.factors.difficultyHandling },
            { label: "كفاءة الوقت", value: mockPredictedScore.factors.timeEfficiency },
            { label: "اتجاه الأداء", value: mockPredictedScore.factors.consistencyTrend },
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
        <div className="bg-saris-danger/5 rounded-saris-md p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-saris-danger flex-shrink-0" />
          <span className="font-tajawal text-xs text-saris-text">أقسام تحتاج تحسين: {mockPredictedScore.weakSections.join("، ")}</span>
        </div>
        <div className="bg-saris-success/5 rounded-saris-md p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-saris-success flex-shrink-0" />
          <span className="font-tajawal text-xs text-saris-text">أقسام قوية: {mockPredictedScore.strongSections.join("، ")}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictedScoreTab;
