import { motion } from "framer-motion";
import { Coins, BookOpen, Trophy, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";
import { Skeleton } from "@/components/ui/skeleton";

const StatsGrid = () => {
  const { profile } = useAuth();
  const { stats, loading } = useUserStats();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-saris-bg-card rounded-saris-lg p-3 border border-saris-border shadow-card">
            <Skeleton className="w-8 h-8 rounded-saris-md mb-2" />
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "رصيد النقاط",
      value: profile?.balance ?? 0,
      sub: "نقطة متاحة",
      icon: Coins,
      iconColor: "text-saris-orange",
      iconBg: "bg-saris-orange/10",
    },
    {
      label: "الاختبارات المكتملة",
      value: stats?.completedSessions ?? 0,
      sub: `من أصل ${stats?.totalSessions ?? 0} جلسة`,
      icon: BookOpen,
      iconColor: "text-saris-info",
      iconBg: "bg-saris-info/10",
    },
    {
      label: "معدل النجاح",
      value: stats && stats.totalGraded > 0 ? `${stats.passRate}%` : "—",
      sub: stats && stats.totalGraded > 0 ? `${stats.passCount} ناجح من ${stats.totalGraded}` : "لا توجد بيانات",
      icon: Trophy,
      iconColor: "text-saris-success",
      iconBg: "bg-saris-success/10",
    },
    {
      label: "متوسط الأداء",
      value: stats && stats.averageScore > 0 ? `${stats.averageScore}%` : "—",
      sub: "معدل الدرجات",
      icon: Target,
      iconColor: "text-saris-purple",
      iconBg: "bg-saris-purple/10",
    },
  ];

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
