import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import SmartCoachFloating from "@/components/SmartCoach/SmartCoachFloating";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-saris-bg">
      <div className="max-w-[430px] mx-auto relative">
        <TopBar />
        <main className="px-4 pb-24 pt-4">
          <Outlet />
        </main>
        <BottomNav />
        <SmartCoachFloating />
      </div>
    </div>
  );
};

export default AppLayout;
