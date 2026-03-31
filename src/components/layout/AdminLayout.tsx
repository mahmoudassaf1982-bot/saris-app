import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Users, BarChart3, Globe, BookOpen, FileQuestion, Cpu,
  CheckSquare, ListTodo, Activity, AlertTriangle, FileText,
  HeartPulse, Dna, Package, CreditCard, Settings, Menu, X,
  LogOut, ChevronLeft,
} from "lucide-react";

const navGroups = [
  {
    label: "الأساسي",
    items: [
      { label: "الرئيسية", path: "/app/admin", icon: Home },
      { label: "المستخدمون", path: "/app/admin/users", icon: Users },
      { label: "الإحصائيات", path: "/app/admin/stats", icon: BarChart3 },
    ],
  },
  {
    label: "الاختبارات والمحتوى",
    items: [
      { label: "الدول", path: "/app/admin/countries", icon: Globe },
      { label: "قائمة الاختبارات", path: "/app/admin/exams", icon: BookOpen },
      { label: "بنك الأسئلة", path: "/app/admin/questions", icon: FileQuestion },
      { label: "إدارة المحتوى", path: "/app/admin/content", icon: FileText },
      { label: "ملفات الاختبارات", path: "/app/admin/exam-profiles", icon: Dna },
    ],
  },
  {
    label: "نظام الذكاء الاصطناعي",
    items: [
      { label: "مولّد الأسئلة", path: "/app/admin/ai-generator", icon: Cpu },
      { label: "مراجعة الأسئلة", path: "/app/admin/review-queue", icon: CheckSquare },
      { label: "مهام التوليد", path: "/app/admin/jobs", icon: ListTodo },
      { label: "مراقبة AI", path: "/app/admin/ai-monitoring", icon: Activity },
      { label: "تنبيهات التوليد", path: "/app/admin/generation-alerts", icon: AlertTriangle },
      { label: "تقرير التوليد", path: "/app/admin/generation-report", icon: FileText },
      { label: "صحة البنك", path: "/app/admin/bank-health", icon: HeartPulse },
      { label: "بناء DNA", path: "/app/admin/dna-builder", icon: Dna },
    ],
  },
  {
    label: "التجارة",
    items: [
      { label: "باقات النقاط", path: "/app/admin/points-packs", icon: Package },
      { label: "خطط الاشتراك", path: "/app/admin/plans", icon: CreditCard },
      { label: "الإعدادات", path: "/app/admin/settings", icon: Settings },
    ],
  },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/app/admin") return location.pathname === "/app/admin";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-4 font-tajawal text-[10px] font-bold text-saris-text-3 uppercase tracking-wider mb-1.5">
              {group.label}
            </p>
            {group.items.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-right font-tajawal text-sm transition-colors ${
                  isActive(item.path)
                    ? "bg-saris-navy/10 text-saris-navy font-bold border-r-2 border-saris-navy"
                    : "text-saris-text-2 hover:bg-saris-bg hover:text-saris-text"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-saris-border p-3">
        <button
          onClick={() => navigate("/app")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-tajawal text-xs text-saris-text-3 hover:bg-saris-bg transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          العودة لواجهة الطالب
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-saris-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-saris-bg-card border-l border-saris-border flex-col fixed top-0 right-0 h-screen z-40">
        <div className="px-4 py-3 border-b border-saris-border flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-saris-orange font-tajawal font-bold text-sm">S</span>
          </div>
          <span className="font-tajawal font-bold text-sm text-saris-navy">لوحة الإدارة</span>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute top-0 right-0 w-64 h-full bg-saris-bg-card shadow-modal z-50">
            <div className="px-4 py-3 border-b border-saris-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-saris-orange font-tajawal font-bold text-sm">S</span>
                </div>
                <span className="font-tajawal font-bold text-sm text-saris-navy">لوحة الإدارة</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1">
                <X className="w-5 h-5 text-saris-text-2" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:mr-56">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-saris-bg-card border-b border-saris-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-saris-text" />
            </button>
            <h1 className="font-tajawal font-bold text-base text-saris-text">لوحة الإدارة — سارس</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <span className="font-tajawal font-bold text-xs text-white">أ</span>
            </div>
            <button onClick={() => navigate("/auth")} className="p-1.5 rounded-lg hover:bg-saris-bg transition-colors">
              <LogOut className="w-4 h-4 text-saris-text-3" />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
