import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-saris-bg">
      <div className="max-w-[430px] mx-auto relative">
        <TopBar />
        <main className="px-4 pb-24 pt-4">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
