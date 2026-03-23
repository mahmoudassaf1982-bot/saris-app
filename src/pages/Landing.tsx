import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-saris-bg flex flex-col">
      <div className="max-w-[430px] mx-auto flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-saris-full gradient-primary flex items-center justify-center mb-6"
        >
          <span className="text-saris-orange font-tajawal font-bold text-3xl">S</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-tajawal font-extrabold text-3xl text-saris-navy mb-2"
        >
          سارس للاختبارات
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="font-tajawal text-base text-saris-text-2 mb-8 leading-relaxed"
        >
          منصة تدريب ذكي ومحاكاة احترافية مدعومة بالذكاء الاصطناعي
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full space-y-3"
        >
          <button
            onClick={() => navigate("/auth")}
            className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-saris-lg py-3.5 flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover transition-shadow"
          >
            ابدأ الآن
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/app")}
            className="w-full bg-saris-bg-card text-saris-navy font-tajawal font-medium text-sm rounded-saris-lg py-3 border border-saris-border"
          >
            تصفح كضيف (عرض تجريبي)
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center gap-6"
        >
          {[
            { label: "اختبار", count: "500+" },
            { label: "طالب", count: "10K+" },
            { label: "سؤال", count: "50K+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-inter font-bold text-lg text-saris-navy">{stat.count}</p>
              <p className="font-tajawal text-xs text-saris-text-3">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
