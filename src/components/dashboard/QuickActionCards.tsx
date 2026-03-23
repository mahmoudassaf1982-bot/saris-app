import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, UserPlus, Coins } from "lucide-react";

const quickCards = [
  {
    label: "ابدأ اختبار",
    icon: BookOpen,
    path: "/app/exams",
    className: "gradient-primary",
    iconColor: "text-white",
    textColor: "text-white",
  },
  {
    label: "ادعُ أصدقاءك",
    icon: UserPlus,
    path: "/app/referral",
    className: "bg-saris-success",
    iconColor: "text-white",
    textColor: "text-white",
  },
  {
    label: "شراء نقاط",
    icon: Coins,
    path: "/app/topup",
    className: "gradient-gold",
    iconColor: "text-saris-navy",
    textColor: "text-saris-navy",
  },
];

const QuickActionCards = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="mt-4 grid grid-cols-3 gap-3"
    >
      {quickCards.map((card, i) => (
        <button
          key={i}
          onClick={() => navigate(card.path)}
          className={`${card.className} rounded-saris-lg p-3 flex flex-col items-center gap-2 shadow-card hover:shadow-card-hover transition-shadow`}
        >
          <card.icon className={`w-6 h-6 ${card.iconColor}`} />
          <span className={`font-tajawal text-xs font-bold ${card.textColor}`}>{card.label}</span>
        </button>
      ))}
    </motion.div>
  );
};

export default QuickActionCards;
