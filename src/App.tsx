import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmartCoachProvider } from "./components/SmartCoach";

import Auth from "./pages/Auth";
import ChooseCountry from "./pages/ChooseCountry";
import CompleteProfile from "./pages/CompleteProfile";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Exams from "./pages/Exams";
import Performance from "./pages/Performance";
import Wallet from "./pages/Wallet";
import TopUp from "./pages/TopUp";
import History from "./pages/History";
import Referral from "./pages/Referral";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import AdaptiveTraining from "./pages/AdaptiveTraining";
import ExamSession from "./pages/ExamSession";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/login" element={<Auth />} />
          <Route path="/auth/register" element={<Auth />} />
          <Route path="/choose-country" element={<ChooseCountry />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Student app */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="exams" element={<Exams />} />
            <Route path="performance" element={<Performance />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="topup" element={<TopUp />} />
            <Route path="history" element={<History />} />
            <Route path="referral" element={<Referral />} />
            <Route path="adaptive-training/:sessionId" element={<AdaptiveTraining />} />
            <Route path="exam-session/:sessionId" element={<ExamSession />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
