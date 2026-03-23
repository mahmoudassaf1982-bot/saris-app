import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Fingerprint, TrendingUp, ArrowLeft } from "lucide-react";
import { mockDNA } from "@/data/mock-data";

const LearningDNAPreview = () => {
  const navigate = useNavigate();

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
        <div className="w-12 h-12 rounded-saris-full gradient-primary flex items-center justify-center">
          <Fingerprint className="w-6 h-6 text-saris-orange" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-tajawal font-bold text-base text-saris-text">{mockDNA.typeAr}</span>
            <div className="flex items-center gap-1 bg-saris-success/10 rounded-saris-full px-2 py-0.5">
              <TrendingUp className="w-3 h-3 text-saris-success" />
              <span className="font-tajawal text-[11px] text-saris-success font-medium">{mockDNA.trendAr}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-tajawal text-xs text-saris-text-3">المرحلة {mockDNA.stage}</span>
            <span className="font-tajawal text-xs text-saris-text-3">الثقة {mockDNA.confidence}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningDNAPreview;
