import { useState } from "react";
import { Search } from "lucide-react";
import { mockAdminQuestions } from "@/data/admin-mock-data";

const diffLabels: Record<string, { label: string; cls: string }> = {
  easy: { label: "سهل", cls: "bg-saris-success/10 text-saris-success" },
  medium: { label: "متوسط", cls: "bg-saris-warning/10 text-saris-warning" },
  hard: { label: "صعب", cls: "bg-saris-danger/10 text-saris-danger" },
};
const statusLabels: Record<string, { label: string; cls: string }> = {
  approved: { label: "معتمد", cls: "bg-saris-success/10 text-saris-success" },
  pending: { label: "بانتظار", cls: "bg-saris-warning/10 text-saris-warning" },
  rejected: { label: "مرفوض", cls: "bg-saris-danger/10 text-saris-danger" },
};

const AdminQuestions = () => {
  const [diffFilter, setDiffFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockAdminQuestions.filter((q) => {
    if (diffFilter !== "all" && q.difficulty !== diffFilter) return false;
    if (statusFilter !== "all" && q.status !== statusFilter) return false;
    if (search && !q.preview.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <h1 className="font-tajawal font-black text-2xl text-saris-text">بنك الأسئلة</h1>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saris-text-3" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-saris-bg-card rounded-lg pl-3 pr-10 py-2 font-tajawal text-sm border border-saris-border focus:outline-none" placeholder="بحث..." />
        </div>
        <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)} className="bg-saris-bg-card rounded-lg px-3 py-2 font-tajawal text-sm border border-saris-border">
          <option value="all">كل الصعوبات</option>
          <option value="easy">سهل</option>
          <option value="medium">متوسط</option>
          <option value="hard">صعب</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-saris-bg-card rounded-lg px-3 py-2 font-tajawal text-sm border border-saris-border">
          <option value="all">كل الحالات</option>
          <option value="approved">معتمد</option>
          <option value="pending">بانتظار</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      <div className="bg-saris-bg-card rounded-xl border border-saris-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-saris-border bg-saris-bg">
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">السؤال</th>
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">القسم</th>
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">الصعوبة</th>
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">الحالة</th>
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">المصدر</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr key={q.id} className={`border-b border-saris-border ${i % 2 ? "bg-saris-bg/30" : ""}`}>
                  <td className="px-4 py-3 font-tajawal text-sm text-saris-text max-w-[200px] truncate">{q.preview}</td>
                  <td className="px-4 py-3 font-tajawal text-xs text-saris-text-2">{q.section}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-tajawal font-bold px-2 py-0.5 rounded-full ${diffLabels[q.difficulty].cls}`}>{diffLabels[q.difficulty].label}</span></td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-tajawal font-bold px-2 py-0.5 rounded-full ${statusLabels[q.status].cls}`}>{statusLabels[q.status].label}</span></td>
                  <td className="px-4 py-3 font-tajawal text-xs text-saris-text-2">{q.source === "ai" ? "🤖 AI" : "✍️ يدوي"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-saris-border">
          <p className="font-tajawal text-xs text-saris-text-3">{filtered.length} سؤال</p>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestions;
