import { motion } from "framer-motion";
import { Users, UserCheck, DollarSign, PlayCircle, TrendingUp, AlertCircle } from "lucide-react";
import { mockAdminKPIs, mockAdminDailySessions, mockAdminActivity } from "@/data/admin-mock-data";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const kpis = [
  { label: "إجمالي الطلاب", value: mockAdminKPIs.totalStudents.toLocaleString(), icon: Users, color: "text-saris-info", bg: "bg-saris-info/10" },
  { label: "نشطون (7 أيام)", value: mockAdminKPIs.activeStudents7d.toLocaleString(), icon: UserCheck, color: "text-saris-success", bg: "bg-saris-success/10" },
  { label: "الإيرادات ($)", value: `$${mockAdminKPIs.revenue.toLocaleString()}`, icon: DollarSign, color: "text-saris-orange", bg: "bg-saris-orange/10" },
  { label: "جلسات اليوم", value: mockAdminKPIs.todaySessions.toString(), icon: PlayCircle, color: "text-saris-purple", bg: "bg-saris-purple/10" },
];

const activityIcons: Record<string, string> = { registration: "👤", purchase: "💰", session: "📝" };

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-tajawal font-black text-2xl text-saris-text">الرئيسية</h1>
      <p className="font-tajawal text-sm text-saris-text-2">نظرة عامة على المنصة</p>
    </div>

    {/* KPIs */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card"
        >
          <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center mb-2`}>
            <kpi.icon className={`w-4.5 h-4.5 ${kpi.color}`} />
          </div>
          <p className="font-tajawal text-xs text-saris-text-2">{kpi.label}</p>
          <p className="font-inter font-bold text-xl text-saris-text mt-0.5">{kpi.value}</p>
        </motion.div>
      ))}
    </div>

    {/* Chart + Activity */}
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-saris-navy" />
          <h3 className="font-tajawal font-bold text-sm text-saris-text">الجلسات اليومية (30 يومًا)</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockAdminDailySessions}>
              <defs>
                <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(213,52%,23%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(213,52%,23%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} width={30} />
              <Tooltip contentStyle={{ fontFamily: "Tajawal", fontSize: 12 }} />
              <Area type="monotone" dataKey="sessions" stroke="hsl(213,52%,23%)" fill="url(#sessionsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">آخر النشاطات</h3>
        <div className="space-y-3 max-h-52 overflow-y-auto no-scrollbar">
          {mockAdminActivity.map((a) => (
            <div key={a.id} className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{activityIcons[a.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-tajawal text-xs text-saris-text truncate">{a.text}</p>
                <p className="font-tajawal text-[10px] text-saris-text-3">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* System Health */}
    <div className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-saris-navy" />
        <h3 className="font-tajawal font-bold text-sm text-saris-text">صحة النظام</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "إجمالي الأسئلة", value: mockAdminKPIs.totalQuestions, status: "good" },
          { label: "أسئلة معتمدة", value: mockAdminKPIs.approvedQuestions, status: "good" },
          { label: "بانتظار المراجعة", value: mockAdminKPIs.pendingQuestions, status: "warning" },
          { label: "أسئلة مرفوضة", value: mockAdminKPIs.rejectedQuestions, status: "danger" },
        ].map((item, i) => (
          <div key={i} className="bg-saris-bg rounded-lg p-3">
            <p className="font-tajawal text-xs text-saris-text-2">{item.label}</p>
            <p className={`font-inter font-bold text-lg ${item.status === "good" ? "text-saris-success" : item.status === "warning" ? "text-saris-warning" : "text-saris-danger"}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
