import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiamondBanner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="gradient-diamond rounded-saris-lg p-4 mt-4 cursor-pointer relative overflow-hidden"
      onClick={() => navigate("/app/topup")}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-saris-full bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-tajawal font-bold text-lg text-white">اشترك في Diamond</p>
          <p className="font-tajawal text-xs text-white/80 mt-0.5 leading-relaxed">
            وصول غير محدود لجميع الاختبارات والتدريب والتحليل بدون نقاط
          </p>
        </div>
        <ArrowLeft className="w-5 h-5 text-white/70 shrink-0" />
      </div>
    </motion.div>
  );
};

export default DiamondBanner;
