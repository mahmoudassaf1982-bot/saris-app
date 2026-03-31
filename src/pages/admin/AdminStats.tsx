import { mockAdminDailySessions, mockAdminKPIs } from "@/data/admin-mock-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { TrendingUp, Users, BookOpen, DollarSign } from "lucide-react";

const AdminStats = () => (
  <div className="space-y-6">
    <h1 className="font-tajawal font-black text-2xl text-saris-text">الإحصائيات</h1>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-saris-navy" />
          <h3 className="font-tajawal font-bold text-sm text-saris-text">الجلسات اليومية</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockAdminDailySessions}>
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => v.slice(8)} />
              <YAxis tick={{ fontSize: 10 }} width={25} />
              <Tooltip contentStyle={{ fontFamily: "Tajawal", fontSize: 12 }} />
              <Bar dataKey="sessions" fill="hsl(213,52%,23%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-saris-success" />
          <h3 className="font-tajawal font-bold text-sm text-saris-text">التسجيلات اليومية</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockAdminDailySessions}>
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => v.slice(8)} />
              <YAxis tick={{ fontSize: 10 }} width={25} />
              <Tooltip contentStyle={{ fontFamily: "Tajawal", fontSize: 12 }} />
              <Line type="monotone" dataKey="registrations" stroke="hsl(142,71%,45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

export default AdminStats;
