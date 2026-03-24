import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import SmartCoachFloating from "@/components/SmartCoach/SmartCoachFloating";

const AppLayout = () => {
  const { pathname } = useLocation();
  const isSession = pathname.includes("/adaptive-training/") || pathname.includes("/exam-session/");
  const isTopUp = pathname.includes("/topup");

  if (isSession) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-saris-bg">
      <div className="max-w-[430px] mx-auto relative">
        <TopBar />
        <main className="px-4 pb-24 pt-4">
          <Outlet />
        </main>
        <BottomNav />
        {!isTopUp && <SmartCoachFloating />}
      </div>
    </div>
  );
};

export default AppLayout;
