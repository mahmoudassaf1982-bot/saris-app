import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-[430px] w-full text-center"
      >
        <div className="w-20 h-20 rounded-saris-full gradient-gold flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-10 h-10 text-saris-navy" />
        </div>
        <h1 className="font-tajawal font-extrabold text-2xl text-saris-navy mb-2">!مرحبًا بك في سارس</h1>
        <p className="font-tajawal text-base text-saris-text-2 mb-2">حسابك جاهز 🎉</p>
        <p className="font-tajawal text-sm text-saris-text-3 mb-8">
          حصلت على <span className="font-inter font-bold text-saris-orange">20</span> نقطة مجانية كمكافأة تسجيل
        </p>
        <button
          onClick={() => navigate("/app")}
          className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-saris-lg py-3.5 shadow-card"
        >
          ابدأ رحلتك
        </button>
      </motion.div>
    </div>
  );
};

export default Welcome;
