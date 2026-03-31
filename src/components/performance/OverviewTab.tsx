import { motion } from "framer-motion";
import { BookOpen, Target, Trophy, TrendingUp } from "lucide-react";
import { mockStats, mockRecentSessions } from "@/data/mock-data";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const chartData = mockRecentSessions.slice().reverse().map((s, i) => ({ name: `${i + 1}`, score: s.score }));

const OverviewTab = () => {
  const passRate = Math.round((mockStats.passCount / mockStats.totalGraded) * 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: BookOpen, label: "إجمالي الجلسات", value: mockStats.completedSessions, color: "text-saris-navy" },
          { icon: Target, label: "متوسط الأداء", value: `${mockStats.averageScore}%`, color: "text-saris-orange" },
          { icon: Trophy, label: "أفضل نتيجة", value: `${mockStats.bestScore}%`, color: "text-saris-success" },
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
            <p className="font-inter font-bold text-lg text-saris-text">{mockStats.completedSessions}/{mockStats.totalSessions}</p>
            <p className="font-tajawal text-[10px] text-saris-text-3">الجلسات المكتملة</p>
          </div>
        </div>
      </div>

      {/* Performance Trend Chart */}
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
        <p className="font-tajawal text-xs text-saris-success mt-2">أداؤك يتحسن بشكل ملحوظ في الجلسات الأخيرة 📈</p>
      </div>

      {/* Recent Activity */}
      <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">🕐 آخر النشاطات</h3>
        <div className="space-y-2">
          {mockRecentSessions.slice(0, 3).map((s) => (
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
    </motion.div>
  );
};

export default OverviewTab;
