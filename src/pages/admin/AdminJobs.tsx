import { mockAIJobs } from "@/data/admin-mock-data";
import { ListTodo } from "lucide-react";

const statusStyles: Record<string, { label: string; cls: string }> = {
  pending: { label: "قيد الانتظار", cls: "bg-saris-warning/10 text-saris-warning" },
  running: { label: "قيد التنفيذ", cls: "bg-saris-info/10 text-saris-info" },
  completed: { label: "مكتمل", cls: "bg-saris-success/10 text-saris-success" },
  failed: { label: "فشل", cls: "bg-saris-danger/10 text-saris-danger" },
};

const AdminJobs = () => (
  <div className="space-y-4">
    <div>
      <h1 className="font-tajawal font-black text-2xl text-saris-text">مهام التوليد</h1>
      <p className="font-tajawal text-sm text-saris-text-2">{mockAIJobs.length} مهمة</p>
    </div>

    <div className="bg-saris-bg-card rounded-xl border border-saris-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-saris-border bg-saris-bg">
              <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">الاختبار</th>
              <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">القسم</th>
              <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">الصعوبة</th>
              <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">العدد</th>
              <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">الحالة</th>
              <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">النتيجة</th>
              <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {mockAIJobs.map((job, i) => (
              <tr key={job.id} className={`border-b border-saris-border ${i % 2 ? "bg-saris-bg/30" : ""}`}>
                <td className="px-4 py-3 font-tajawal text-sm text-saris-text">{job.exam}</td>
                <td className="px-4 py-3 font-tajawal text-xs text-saris-text-2">{job.section}</td>
                <td className="px-4 py-3 font-tajawal text-xs text-saris-text-2">{job.difficulty}</td>
                <td className="px-4 py-3 font-inter text-sm text-saris-text">{job.count}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-tajawal font-bold px-2 py-0.5 rounded-full ${statusStyles[job.status].cls}`}>
                    {statusStyles[job.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 font-inter text-xs text-saris-text-2">
                  {job.status === "completed" ? `✅ ${job.approved} / ❌ ${job.rejected}` : "—"}
                </td>
                <td className="px-4 py-3 font-inter text-xs text-saris-text-3">{job.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminJobs;
