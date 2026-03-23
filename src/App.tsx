import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ChooseCountry from "./pages/ChooseCountry";
import CompleteProfile from "./pages/CompleteProfile";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import {
  ExamsPage,
  PerformancePage,
  WalletPage,
  TopupPage,
  HistoryPage,
  ReferralPage,
  AdminPage,
  AdaptiveTrainingPage,
  ExamSessionPage,
} from "./pages/StubPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/choose-country" element={<ChooseCountry />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Protected app routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="performance" element={<PerformancePage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="topup" element={<TopupPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="referral" element={<ReferralPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="adaptive-training/:sessionId" element={<AdaptiveTrainingPage />} />
            <Route path="exam-session/:sessionId" element={<ExamSessionPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
