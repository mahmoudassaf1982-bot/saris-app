import { motion } from "framer-motion";
import { Coins, BookOpen, Trophy, Target } from "lucide-react";
import { mockStats } from "@/data/mock-data";

const cards = [
  {
    label: "رصيد النقاط",
    value: mockStats.balance,
    sub: "نقطة متاحة",
    icon: Coins,
    iconColor: "text-saris-orange",
    iconBg: "bg-saris-orange/10",
  },
  {
    label: "الاختبارات المكتملة",
    value: mockStats.completedSessions,
    sub: `من أصل ${mockStats.totalSessions} جلسة`,
    icon: BookOpen,
    iconColor: "text-saris-info",
    iconBg: "bg-saris-info/10",
  },
  {
    label: "معدل النجاح",
    value: `${mockStats.passRate}%`,
    sub: `${mockStats.passCount} ناجح من ${mockStats.totalGraded}`,
    icon: Trophy,
    iconColor: "text-saris-success",
    iconBg: "bg-saris-success/10",
  },
  {
    label: "متوسط الأداء",
    value: `${mockStats.averageScore}%`,
    sub: "معدل الدرجات",
    icon: Target,
    iconColor: "text-saris-purple",
    iconBg: "bg-saris-purple/10",
  },
];

const StatsGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="grid grid-cols-2 gap-3 mt-4"
    >
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-saris-bg-card rounded-saris-lg p-3 border border-saris-border shadow-card"
        >
          <div className={`w-8 h-8 rounded-saris-md ${card.iconBg} flex items-center justify-center mb-2`}>
            <card.icon className={`w-4 h-4 ${card.iconColor}`} />
          </div>
          <p className="font-tajawal text-xs text-saris-text-2">{card.label}</p>
          <p className="font-inter font-bold text-xl text-saris-text mt-0.5">{card.value}</p>
          <p className="font-tajawal text-[11px] text-saris-text-3 mt-0.5">{card.sub}</p>
        </div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
