import { useState } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, BarChart3 } from "lucide-react";
import OverviewTab from "@/components/performance/OverviewTab";
import PredictedScoreTab from "@/components/performance/PredictedScoreTab";
import DNATab from "@/components/performance/DNATab";
import SkillMapTab from "@/components/performance/SkillMapTab";
import RecommendationsTab from "@/components/performance/RecommendationsTab";
import HistoryTab from "@/components/performance/HistoryTab";

const tabs = [
  { key: "overview", label: "نظرة عامة" },
  { key: "prediction", label: "الدرجة المتوقعة" },
  { key: "dna", label: "بصمة التعلم (DNA)" },
  { key: "skills", label: "خريطة المهارات" },
  { key: "recommendations", label: "التوصيات" },
  { key: "history", label: "سجل التدريبات" },
];

const Performance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const hasData = true; // mock: set to false to test empty state
  const isConnected = true; // mock realtime indicator

  if (!hasData) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
        <BarChart3 className="w-16 h-16 text-saris-text-3 mx-auto mb-4" />
        <h2 className="font-tajawal font-bold text-lg text-saris-text mb-2">لا توجد بيانات بعد</h2>
        <p className="font-tajawal text-sm text-saris-text-3">أكمل اختباراً واحداً على الأقل لرؤية تحليل أدائك</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-tajawal font-black text-2xl text-saris-text">ملف الأداء الشامل</h1>
        <span className={`flex items-center gap-1 text-xs font-tajawal mt-1 ${isConnected ? "text-saris-success" : "text-saris-text-3"}`}>
          {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isConnected ? "يتحدث تلقائياً" : "تحديث تلقائي غير متاح"}
        </span>
      </div>
      <p className="font-tajawal text-[12px] text-saris-text-2 mb-4 leading-relaxed">
        نظرة موحّدة على بصمة التعلم، خريطة المهارات، التوصيات، وتاريخ التدريب
      </p>

      {/* Scrollable Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-saris-full font-tajawal text-xs transition-all ${
              activeTab === tab.key
                ? "bg-saris-navy text-white font-bold"
                : "bg-saris-bg-card text-saris-text-2 border border-saris-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "prediction" && <PredictedScoreTab />}
      {activeTab === "dna" && <DNATab />}
      {activeTab === "skills" && <SkillMapTab />}
      {activeTab === "recommendations" && <RecommendationsTab />}
      {activeTab === "history" && <HistoryTab />}
    </motion.div>
  );
};

export default Performance;
