import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, BarChart3, Target, Sparkles } from "lucide-react";
import SarisCoachAvatar from "@/components/SmartCoach/SarisCoachAvatar";
import { mockUser } from "@/data/mock-data";

const features = [
  { icon: Brain, text: "تدريب ذكي يتكيف مع مستواك", emoji: "🧠" },
  { icon: BarChart3, text: "تحليل مفصّل لأدائك", emoji: "📊" },
  { icon: Target, text: "توصيات مخصصة لك", emoji: "🎯" },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          {/* Coach Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <SarisCoachAvatar state="waving" size={128} className="mb-6" />
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
          >
            <h1 className="font-tajawal font-black text-2xl text-saris-text mb-1">
              مرحبًا {mockUser.firstName}! 🎉
            </h1>
            <p className="font-tajawal font-bold text-lg text-saris-navy">
              أنا مدربك الذكي سارس
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="w-full space-y-3 mb-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-saris-navy/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{feature.emoji}</span>
                </div>
                <p className="font-tajawal font-bold text-sm text-saris-text">{feature.text}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            onClick={() => navigate("/app")}
            className="w-full gradient-gold text-saris-navy font-tajawal font-black text-lg rounded-xl py-4 shadow-card-hover flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            هيا نبدأ!
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
