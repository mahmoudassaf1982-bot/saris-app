import { Coins } from "lucide-react";
import { mockUser, mockStats } from "@/data/mock-data";

const TopBar = () => {
  return (
    <header className="sticky top-0 z-50 bg-saris-bg-card border-b border-saris-border px-4 py-3 flex items-center justify-between">
      {/* Right: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-saris-full gradient-primary flex items-center justify-center">
          <span className="text-saris-orange font-tajawal font-bold text-lg leading-none">S</span>
        </div>
        <span className="font-tajawal font-bold text-lg text-saris-navy">سارس</span>
      </div>

      {/* Left: Points Badge */}
      <div className="flex items-center gap-1.5 gradient-gold rounded-saris-full px-3 py-1.5">
        <Coins className="w-4 h-4 text-saris-navy" />
        <span className="font-inter font-bold text-sm text-saris-navy">{mockStats.balance}</span>
        <span className="font-tajawal text-xs text-saris-navy-dark">نقطة</span>
      </div>
    </header>
  );
};

export default TopBar;
