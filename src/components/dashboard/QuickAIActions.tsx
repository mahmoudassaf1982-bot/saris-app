import { motion } from "framer-motion";
import { Zap, Target, Rocket, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickAIActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "تدريب سريع",
      subtitle: "5 دقائق",
      icon: Zap,
      gradient: "gradient-gold",
      iconBg: "bg-saris-orange/15",
      iconColor: "text-saris-orange",
      path: "/app/exams",
    },
    {
      label: "تحسين الدقة",
      subtitle: "تركيز مكثف",
      icon: Target,
      gradient: "",
      iconBg: "bg-saris-success/15",
      iconColor: "text-saris-success",
      path: "/app/exams",
    },
    {
      label: "تحسين السرعة",
      subtitle: "تمرين موقوت",
      icon: Rocket,
      gradient: "",
      iconBg: "bg-saris-info/15",
      iconColor: "text-saris-info",
      path: "/app/exams",
    },
    {
      label: "ملف الأداء",
      subtitle: "تحليل شامل",
      icon: BarChart3,
      gradient: "",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      path: "/app/performance",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="mt-4"
    >
      <h2 className="font-tajawal font-bold text-base text-saris-text mb-3">إجراءات سريعة</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className="bg-saris-bg-card rounded-2xl p-3 border border-saris-border shadow-card flex flex-col items-center gap-2 hover:shadow-card-hover hover:scale-[1.02] transition-all"
            aria-label={action.label}
          >
            <div className={`w-11 h-11 rounded-full ${action.iconBg} flex items-center justify-center`}>
              <action.icon className={`w-5 h-5 ${action.iconColor}`} />
            </div>
            <div className="text-center">
              <span className="font-tajawal text-xs font-bold text-saris-text block">{action.label}</span>
              <span className="font-tajawal text-[10px] text-saris-text-3">{action.subtitle}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickAIActions;
