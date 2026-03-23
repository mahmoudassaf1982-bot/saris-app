import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const SmartInsightHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="gradient-insight rounded-saris-lg p-4 border border-saris-border"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-saris-md gradient-primary flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-saris-orange" />
        </div>
        <div>
          <p className="font-tajawal font-bold text-sm text-saris-navy mb-1">تحليل الذكاء الاصطناعي</p>
          <p className="font-tajawal text-sm text-saris-text-2 leading-relaxed">
            أداؤك يتحسن! ركّز على الإحصاء لرفع معدلك 📈
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartInsightHeader;
