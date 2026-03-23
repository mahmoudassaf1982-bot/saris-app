import { mockUser } from "@/data/mock-data";
import SmartInsightHeader from "@/components/dashboard/SmartInsightHeader";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import DiamondBanner from "@/components/dashboard/DiamondBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ProgressJourney from "@/components/dashboard/ProgressJourney";
import QuickAIActions from "@/components/dashboard/QuickAIActions";
import SkillMapPreview from "@/components/dashboard/SkillMapPreview";
import LearningDNAPreview from "@/components/dashboard/LearningDNAPreview";
import RecommendedTraining from "@/components/dashboard/RecommendedTraining";
import RecentResults from "@/components/dashboard/RecentResults";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import AdminQuickAccess from "@/components/dashboard/AdminQuickAccess";
import QuickActionCards from "@/components/dashboard/QuickActionCards";

const Dashboard = () => {
  return (
    <div className="space-y-0">
      <SmartInsightHeader />
      <WelcomeSection />
      {!mockUser.isDiamond && <DiamondBanner />}
      <StatsGrid />
      <ProgressJourney />
      <QuickAIActions />
      <SkillMapPreview />
      <LearningDNAPreview />
      <RecommendedTraining />
      <RecentResults />
      <RecentTransactions />
      {mockUser.isAdmin && <AdminQuickAccess />}
      <QuickActionCards />
    </div>
  );
};

export default Dashboard;
