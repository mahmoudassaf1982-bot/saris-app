import { mockUser } from "@/data/mock-data";
import SmartInsightHeader from "@/components/dashboard/SmartInsightHeader";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import DiamondBanner from "@/components/dashboard/DiamondBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";
import StreakCounter from "@/components/dashboard/StreakCounter";
import DailyGoals from "@/components/dashboard/DailyGoals";
import AchievementBadges from "@/components/dashboard/AchievementBadges";
import ProgressJourney from "@/components/dashboard/ProgressJourney";
import QuickAIActions from "@/components/dashboard/QuickAIActions";
import SkillMapPreview from "@/components/dashboard/SkillMapPreview";
import LearningDNAPreview from "@/components/dashboard/LearningDNAPreview";
import RecommendedTraining from "@/components/dashboard/RecommendedTraining";
import RecentResults from "@/components/dashboard/RecentResults";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import QuickActionCards from "@/components/dashboard/QuickActionCards";
import { ExternalLink } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-0">
      <SmartInsightHeader />
      <WelcomeSection />
      <StreakCounter />
      {!mockUser.isDiamond && <DiamondBanner />}
      <StatsGrid />
      <DailyGoals />
      <AchievementBadges />
      <ProgressJourney />
      <QuickAIActions />
      <SkillMapPreview />
      <LearningDNAPreview />
      <RecommendedTraining />
      <RecentResults />
      <RecentTransactions />
      {mockUser.isAdmin && (
        <div className="mt-4 px-1">
          <a
            href="https://platform.sarisexams.com/app/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-tajawal text-xs text-saris-text-3 hover:text-saris-navy transition-colors"
          >
            لوحة التحكم
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
      <QuickActionCards />
    </div>
  );
};

export default Dashboard;
