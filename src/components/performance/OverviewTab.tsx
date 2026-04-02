import { motion } from "framer-motion";
import { BookOpen, Target, Trophy, TrendingUp } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const OverviewTab = () => {
  const { stats, recentSessions, loading } = useUserStats();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-saris-lg" />)}
        </div>
        <Skeleton className="h-48 rounded-saris-lg" />
      </div>
    );
  }

  if (!stats || stats.completedSessions === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <BookOpen className="w-12 h-12 text-saris-text-3 mx-auto mb-3" />
        <p className="font-tajawal text-sm text-saris-text-2">لا توجد بيانات أداء بعد</p>
      </motion.div>
    );
  }

  const chartData = recentSessions.slice().reverse().map((s, i) => ({ name: `${i + 1}`, score: s.score }));
  const passRate = stats.totalGraded > 0 ? stats.passRate : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: BookOpen, label: "إجمالي الجلسات", value: stats.completedSessions, color: "text-saris-navy" },
          { icon: Target, label: "متوسط الأداء", value: `${stats.averageScore}%`, color: "text-saris-orange" },
          { icon: Trophy, label: "أفضل نتيجة", value: `${stats.bestScore}%`, color: "text-saris-success" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-saris-bg-card rounded-saris-lg p-3 border border-saris-border text-center"
          >
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className="font-inter font-bold text-lg text-saris-text">{stat.value}</p>
            <p className="font-tajawal text-[10px] text-saris-text-3">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Additional stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-saris-bg-card rounded-saris-lg p-3 border border-saris-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-saris-full bg-saris-success/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-saris-success" />
          </div>
          <div>
            <p className="font-inter font-bold text-lg text-saris-text">{passRate}%</p>
            <p className="font-tajawal text-[10px] text-saris-text-3">نسبة النجاح</p>
          </div>
        </div>
        <div className="bg-saris-bg-card rounded-saris-lg p-3 border border-saris-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-saris-full bg-saris-info/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-saris-info" />
          </div>
          <div>
            <p className="font-inter font-bold text-lg text-saris-text">{stats.completedSessions}/{stats.totalSessions}</p>
            <p className="font-tajawal text-[10px] text-saris-text-3">الجلسات المكتملة</p>
          </div>
        </div>
      </div>

      {/* Performance Trend Chart */}
      {chartData.length > 1 && (
        <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
          <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">📈 اتجاه الأداء</h3>
          <div className="h-[160px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--saris-navy))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--saris-orange))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentSessions.length > 0 && (
        <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
          <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">🕐 آخر النشاطات</h3>
          <div className="space-y-2">
            {recentSessions.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-saris-bg rounded-saris-sm px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.passed ? "bg-saris-success" : "bg-saris-danger"}`} />
                  <span className="font-tajawal text-xs text-saris-text truncate max-w-[180px]">{s.examName}</span>
                </div>
                <span className={`font-inter text-xs font-bold ${s.passed ? "text-saris-success" : "text-saris-danger"}`}>{s.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OverviewTab;
