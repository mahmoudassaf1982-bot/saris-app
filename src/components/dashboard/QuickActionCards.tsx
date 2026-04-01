import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, UserPlus, Coins } from "lucide-react";

const quickCards = [
  {
    label: "ابدأ اختبار",
    subtitle: "محاكاة أو تدريب ذكي",
    icon: BookOpen,
    path: "/app/exams",
    iconClass: "gradient-primary",
    iconColor: "text-white",
  },
  {
    label: "ادعُ أصدقاءك",
    subtitle: "واحصل على نقاط مجانية",
    icon: UserPlus,
    path: "/app/referral",
    iconClass: "bg-saris-success",
    iconColor: "text-white",
  },
  {
    label: "شراء نقاط",
    subtitle: "أو اشتراك Diamond",
    icon: Coins,
    path: "/app/topup",
    iconClass: "gradient-gold",
    iconColor: "text-saris-navy",
  },
];

const QuickActionCards = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="mt-4 grid sm:grid-cols-3 gap-3"
    >
      {quickCards.map((card, i) => (
        <button
          key={i}
          onClick={() => navigate(card.path)}
          className="bg-saris-bg-card rounded-2xl p-3 border border-saris-border shadow-card flex items-center gap-3 hover:shadow-card-hover hover:scale-[1.01] transition-all text-right"
        >
          <div className={`w-12 h-12 rounded-full ${card.iconClass} flex items-center justify-center shrink-0`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <div>
            <span className="font-tajawal text-sm font-bold text-saris-text block">{card.label}</span>
            <span className="font-tajawal text-[11px] text-saris-text-3">{card.subtitle}</span>
          </div>
        </button>
      ))}
    </motion.div>
  );
};

export default QuickActionCards;
