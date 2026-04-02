import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ClipboardCheck, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

const HistoryTab = () => {
  const { recentSessions, loading } = useUserStats();
  const [sessionFilter, setSessionFilter] = useState<string>("all");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-saris-lg" />)}
      </div>
    );
  }

  const filteredSessions = recentSessions.filter((s) => {
    if (sessionFilter === "all") return true;
    if (sessionFilter === "smart_training") return s.type === "smart_training";
    if (sessionFilter === "simulation") return s.type === "simulation";
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "الكل" },
          { key: "smart_training", label: "تدريب ذكي" },
          { key: "simulation", label: "محاكاة" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setSessionFilter(f.key)}
            className={`px-3 py-1.5 rounded-saris-full font-tajawal text-xs transition-all ${
              sessionFilter === f.key ? "bg-saris-navy text-white font-bold" : "bg-saris-bg-card text-saris-text-2 border border-saris-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 text-saris-text-3 mx-auto mb-2" />
          <p className="font-tajawal text-sm text-saris-text-2">لا توجد جلسات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-saris-bg-card rounded-saris-lg border border-saris-border overflow-hidden"
            >
              <div className="w-full p-4 text-right">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {session.type === "simulation" ? (
                      <ClipboardCheck className="w-5 h-5 text-saris-navy flex-shrink-0 mt-0.5" />
                    ) : (
                      <Brain className="w-5 h-5 text-saris-orange flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`inline-block text-[10px] font-tajawal font-bold px-2 py-0.5 rounded-saris-full mb-1 ${
                        session.type === "simulation" ? "bg-saris-navy/10 text-saris-navy" : "bg-saris-orange/10 text-saris-orange"
                      }`}>
                        {session.type === "simulation" ? "محاكاة رسمية" : "تدريب ذكي"}
                      </span>
                      <p className="font-tajawal text-sm text-saris-text">{session.examName}</p>
                      <span className="font-inter text-[10px] text-saris-text-3">
                        {session.date ? new Date(session.date).toLocaleDateString("ar") : ""}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`font-inter font-bold text-lg ${session.passed ? "text-saris-success" : "text-saris-danger"}`}>{session.score}%</span>
                    <span className={`block text-[10px] font-tajawal ${session.passed ? "text-saris-success" : "text-saris-danger"}`}>
                      {session.passed ? "ناجح" : "راسب"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTab;
