import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Rocket, Coins, Sparkles } from "lucide-react";
import { mockUser } from "@/data/mock-data";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-saris-bg flex flex-col items-center justify-center px-4">
      <div className="max-w-[430px] w-full text-center">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-saris-orange" />
          ))}
        </div>

        {/* Celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-saris-full gradient-gold flex items-center justify-center mx-auto shadow-card-hover">
            <Rocket className="w-12 h-12 text-saris-navy" />
          </div>
          {/* Sparkle decorations */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ delay: 0.3 + i * 0.15, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
              className="absolute"
              style={{
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 50}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 35}%`,
              }}
            >
              <Sparkles className="w-4 h-4 text-saris-orange" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="font-tajawal font-extrabold text-[28px] text-saris-navy mb-2">!أهلاً بك في سارس</h1>
          <p className="font-tajawal text-base text-saris-text-2 mb-6 leading-relaxed">
            حسابك جاهز. لقد حصلت على <span className="font-bold text-saris-orange">{mockUser.signupBonus}</span> نقطة مجانية للبدء!
          </p>
        </motion.div>

        {/* Bonus card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="gradient-gold rounded-saris-lg p-5 mb-8 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-saris-full bg-white/30 flex items-center justify-center">
            <Coins className="w-6 h-6 text-saris-navy" />
          </div>
          <div className="text-right">
            <p className="font-inter font-extrabold text-2xl text-saris-navy">+{mockUser.signupBonus} نقطة</p>
            <p className="font-tajawal text-sm text-saris-navy-dark">مكافأة التسجيل</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
          <button
            onClick={() => navigate("/app/exams")}
            className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-saris-lg h-12 shadow-card flex items-center justify-center gap-2"
          >
            ابدأ أول تدريب 🚀
          </button>
          <button
            onClick={() => navigate("/app")}
            className="w-full bg-saris-bg-card text-saris-navy font-tajawal font-medium text-sm rounded-saris-lg h-12 border border-saris-border"
          >
            استكشف المنصة
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
