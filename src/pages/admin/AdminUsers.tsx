import { useState } from "react";
import { Search, Filter, ChevronLeft } from "lucide-react";
import { mockAdminStudents } from "@/data/admin-mock-data";

const statusLabels: Record<string, { label: string; cls: string }> = {
  active: { label: "نشط", cls: "bg-saris-success/10 text-saris-success" },
  inactive: { label: "غير نشط", cls: "bg-saris-warning/10 text-saris-warning" },
  suspended: { label: "موقوف", cls: "bg-saris-danger/10 text-saris-danger" },
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockAdminStudents[0] | null>(null);

  const filtered = mockAdminStudents.filter((s) => {
    const matchesSearch = !search || `${s.firstName} ${s.lastName} ${s.email}`.includes(search);
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (selectedUser) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedUser(null)} className="flex items-center gap-1.5 font-tajawal text-sm text-saris-navy">
          <ChevronLeft className="w-4 h-4" />
          رجوع للقائمة
        </button>
        <div className="bg-saris-bg-card rounded-xl p-5 border border-saris-border shadow-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
              <span className="font-tajawal font-bold text-xl text-white">{selectedUser.firstName[0]}</span>
            </div>
            <div>
              <h2 className="font-tajawal font-bold text-lg text-saris-text">{selectedUser.firstName} {selectedUser.lastName}</h2>
              <p className="font-inter text-sm text-saris-text-2">{selectedUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-tajawal font-bold px-2 py-0.5 rounded-full ${statusLabels[selectedUser.status].cls}`}>{statusLabels[selectedUser.status].label}</span>
                {selectedUser.isDiamond && <span className="text-[10px] font-tajawal font-bold px-2 py-0.5 rounded-full bg-saris-purple/10 text-saris-purple">Diamond 💎</span>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "البلد", value: `${selectedUser.countryFlag} ${selectedUser.country}` },
              { label: "الرصيد", value: `${selectedUser.balance} نقطة` },
              { label: "الجلسات", value: selectedUser.sessionsCount.toString() },
              { label: "المعدل", value: `${selectedUser.avgScore}%` },
              { label: "الاختبار", value: selectedUser.exam },
              { label: "آخر نشاط", value: selectedUser.lastActive },
              { label: "تاريخ التسجيل", value: selectedUser.createdAt },
            ].map((item, i) => (
              <div key={i} className="bg-saris-bg rounded-lg p-3">
                <p className="font-tajawal text-[10px] text-saris-text-3">{item.label}</p>
                <p className="font-tajawal text-sm font-bold text-saris-text mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-tajawal font-black text-2xl text-saris-text">المستخدمون</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saris-text-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-saris-bg-card rounded-lg pl-4 pr-10 py-2.5 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none"
            placeholder="بحث بالاسم أو الإيميل..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-saris-bg-card rounded-lg px-3 py-2.5 font-tajawal text-sm border border-saris-border focus:outline-none"
        >
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
          <option value="suspended">موقوف</option>
        </select>
      </div>

      <div className="bg-saris-bg-card rounded-xl border border-saris-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-saris-border bg-saris-bg">
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">الاسم</th>
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">البلد</th>
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">الرصيد</th>
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">آخر نشاط</th>
                <th className="font-tajawal text-xs font-bold text-saris-text-2 text-right px-4 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedUser(s)}
                  className={`cursor-pointer border-b border-saris-border hover:bg-saris-bg/50 transition-colors ${i % 2 === 0 ? "" : "bg-saris-bg/30"}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-tajawal text-sm font-bold text-saris-text">{s.firstName} {s.lastName}</p>
                    <p className="font-inter text-[10px] text-saris-text-3">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 font-tajawal text-sm text-saris-text">{s.countryFlag} {s.country}</td>
                  <td className="px-4 py-3 font-inter text-sm font-bold text-saris-text">{s.balance}</td>
                  <td className="px-4 py-3 font-inter text-xs text-saris-text-2">{s.lastActive}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-tajawal font-bold px-2 py-0.5 rounded-full ${statusLabels[s.status].cls}`}>
                      {statusLabels[s.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-saris-border">
          <p className="font-tajawal text-xs text-saris-text-3">{filtered.length} مستخدم</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
