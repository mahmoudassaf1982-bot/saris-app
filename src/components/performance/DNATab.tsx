import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useLearningDNA } from "@/hooks/useLearningDNA";
import { Skeleton } from "@/components/ui/skeleton";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const dnaTypeLabels: Record<string, string> = {
  fast_executor: "المنفذ السريع",
  cautious: "الحذر",
  accuracy_focused: "المركز على الدقة",
  adaptive: "المتكيّف",
  balanced: "المتوازن",
  unknown: "غير محدد",
};

const dnaDescriptions: Record<string, string> = {
  fast_executor: "تميل للسرعة في الإجابة مع التركيز على إنجاز أكبر عدد من الأسئلة",
  cautious: "تأخذ وقتك في التفكير وتتجنب الأخطاء قدر الإمكان",
  accuracy_focused: "تركز على الدقة العالية في كل إجابة",
  adaptive: "تتكيّف بسرعة مع أنماط الأسئلة المختلفة",
  balanced: "أسلوب متوازن بين السرعة والدقة",
};

const trendLabels: Record<string, string> = {
  improving: "📈 تحسّن",
  declining: "📉 تراجع",
  stable: "➡️ مستقر",
};

const dnaStageLabels = ["مبتدئ", "متعلم", "متقدم", "خبير", "متميز"];

const dnaMetrics = [
  { subject: "الدقة", value: 72 },
  { subject: "السرعة", value: 65 },
  { subject: "الثبات", value: 58 },
  { subject: "التحسن", value: 78 },
  { subject: "التعامل مع الصعوبة", value: 48 },
];

const DNATab = () => {
  const { dna, loading } = useLearningDNA();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-saris-lg" />
        <Skeleton className="h-60 rounded-saris-lg" />
      </div>
    );
  }

  if (!dna) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <Brain className="w-12 h-12 text-saris-text-3 mx-auto mb-3" />
        <p className="font-tajawal text-sm text-saris-text-2">لا توجد بصمة تعلم بعد</p>
        <p className="font-tajawal text-xs text-saris-text-3 mt-1">أكمل بعض الجلسات لتحصل على تحليل بصمتك</p>
      </motion.div>
    );
  }

  const stageIndex = typeof dna.stage === "number" ? dna.stage : parseInt(dna.stage) || 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* DNA Type Card */}
      <div className="bg-saris-bg-card rounded-saris-lg p-6 border border-saris-border text-center">
        <div className="w-16 h-16 rounded-saris-full gradient-primary flex items-center justify-center mx-auto mb-3">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-tajawal font-bold text-[28px] text-saris-text">{dnaTypeLabels[dna.type] ?? dna.type}</h2>
        <p className="font-inter text-xs text-saris-text-3 mb-2">{dna.type}</p>
        <p className="font-tajawal text-sm text-saris-text-2 mb-3">{dnaDescriptions[dna.type] ?? ""}</p>
        <span className="inline-block bg-saris-success/10 text-saris-success rounded-saris-full px-3 py-1 font-tajawal text-xs font-bold">
          {trendLabels[dna.trend] ?? dna.trend}
        </span>
      </div>

      {/* Radar Chart */}
      <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-2">🧬 ملف البصمة التعليمية</h3>
        <div className="h-[220px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={dnaMetrics} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--saris-border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--saris-text-2))" }} />
              <Radar name="الأداء" dataKey="value" stroke="hsl(var(--saris-navy))" fill="hsl(var(--saris-navy))" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evolution stage */}
      <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">🚀 مرحلة التطور</h3>
        <div className="flex items-center gap-1 mb-2">
          {dnaStageLabels.map((_, i) => (
            <div key={i} className={`flex-1 h-2.5 rounded-full transition-all ${i < stageIndex ? "bg-saris-navy" : "bg-saris-border"}`} />
          ))}
        </div>
        <div className="flex justify-between">
          {dnaStageLabels.map((label, i) => (
            <span key={i} className={`font-tajawal text-[9px] ${i < stageIndex ? "text-saris-navy font-bold" : "text-saris-text-3"}`}>{label}</span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-tajawal text-xs text-saris-text-2">الثقة</span>
          <span className="font-inter text-xs font-bold text-saris-text">{Math.round(dna.confidence)}%</span>
        </div>
        <div className="w-full h-1.5 bg-saris-border rounded-full mt-1">
          <div className="h-full bg-saris-orange rounded-full" style={{ width: `${dna.confidence}%` }} />
        </div>
      </div>
    </motion.div>
  );
};

export default DNATab;
