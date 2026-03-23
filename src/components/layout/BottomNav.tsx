import { Home, BookOpen, BarChart3, Coins } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "الرئيسية", icon: Home, path: "/app" },
  { label: "اختبارات", icon: BookOpen, path: "/app/exams" },
  { label: "أدائي", icon: BarChart3, path: "/app/performance" },
  { label: "المحفظة", icon: Coins, path: "/app/wallet" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-saris-bg-card border-t border-saris-border">
      <div className="max-w-[430px] mx-auto flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-saris-navy" : "text-saris-text-3"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? "text-saris-orange" : ""}`} />
              <span className={`text-[11px] font-tajawal ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
