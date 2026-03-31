import { mockAIMonitoring } from "@/data/admin-mock-data";
import { Activity, Wifi, AlertTriangle, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const AdminAIMonitoring = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-tajawal font-black text-2xl text-saris-text">مراقبة الذكاء الاصطناعي</h1>
      <p className="font-tajawal text-sm text-saris-text-2">حالة مزود AI والتكاليف</p>
    </div>

    {/* Status */}
    <div className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-saris-navy" />
          <h3 className="font-tajawal font-bold text-sm text-saris-text">حالة المزود</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-saris-success/10 text-saris-success px-2.5 py-1 rounded-full">
          <Wifi className="w-3 h-3" />
          <span className="font-tajawal text-xs font-bold">يعمل</span>
        </div>
      </div>
      <p className="font-inter text-sm text-saris-text-2 mb-3">{mockAIMonitoring.provider}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "إجمالي الطلبات", value: mockAIMonitoring.totalCalls.toLocaleString() },
          { label: "معدل الأخطاء", value: `${mockAIMonitoring.errorRate}%` },
          { label: "متوسط الاستجابة", value: `${mockAIMonitoring.avgLatency}s` },
          { label: "التكلفة الإجمالية", value: `$${mockAIMonitoring.costUSD}` },
        ].map((item, i) => (
          <div key={i} className="bg-saris-bg rounded-lg p-3 text-center">
            <p className="font-tajawal text-[10px] text-saris-text-3">{item.label}</p>
            <p className="font-inter font-bold text-lg text-saris-text">{item.value}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Usage Chart */}
    <div className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
      <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">الطلبات اليومية (7 أيام)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockAIMonitoring.dailyCalls}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 10 }} width={30} />
            <Tooltip contentStyle={{ fontFamily: "Tajawal", fontSize: 12 }} />
            <Bar dataKey="calls" fill="hsl(213,52%,23%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Token Usage */}
    <div className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-saris-orange" />
        <h3 className="font-tajawal font-bold text-sm text-saris-text">استهلاك التوكنات</h3>
      </div>
      <p className="font-inter text-2xl font-bold text-saris-text">{(mockAIMonitoring.totalTokens / 1000000).toFixed(1)}M</p>
      <p className="font-tajawal text-xs text-saris-text-3">إجمالي التوكنات المستهلكة</p>
    </div>
  </div>
);

export default AdminAIMonitoring;
