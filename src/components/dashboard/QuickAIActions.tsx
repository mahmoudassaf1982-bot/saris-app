import { motion } from "framer-motion";
import { Zap, Brain, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const QuickAIActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "تدريب سريع",
      icon: Zap,
      color: "text-saris-orange",
      bg: "bg-saris-orange/10",
      onClick: () => navigate("/app/exams"),
    },
    {
      label: "تحليل أدائي",
      icon: BarChart3,
      color: "text-saris-info",
      bg: "bg-saris-info/10",
      onClick: () => navigate("/app/performance"),
    },
    {
      label: "مساعد ذكي",
      icon: Brain,
      color: "text-saris-purple",
      bg: "bg-saris-purple/10",
      onClick: () => toast({ title: "المدرب الذكي سيكون متاحاً قريباً", description: "نعمل على تجهيز المدرب الذكي لمساعدتك" }),
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
      <div className="flex gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className="flex-1 bg-saris-bg-card rounded-saris-md p-3 border border-saris-border shadow-card flex flex-col items-center gap-2 hover:shadow-card-hover transition-shadow"
            aria-label={action.label}
          >
            <div className={`w-9 h-9 rounded-saris-full ${action.bg} flex items-center justify-center`}>
              <action.icon className={`w-4 h-4 ${action.color}`} />
            </div>
            <span className="font-tajawal text-xs font-medium text-saris-text-2">{action.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickAIActions;
