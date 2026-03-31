import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ClipboardCheck, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { mockRecentSessions } from "@/data/mock-data";

const HistoryTab = () => {
  const [sessionFilter, setSessionFilter] = useState<string>("all");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const filteredSessions = mockRecentSessions.filter((s) => {
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

      <div className="space-y-3">
        {filteredSessions.map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-saris-bg-card rounded-saris-lg border border-saris-border overflow-hidden"
          >
            <button
              onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
              className="w-full p-4 text-right"
              aria-label={`تفاصيل ${session.examName}`}
            >
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
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-inter text-[10px] text-saris-text-3">{session.date}</span>
                      <span className="font-tajawal text-[10px] text-saris-text-3 flex items-center gap-0.5"><Clock className="w-3 h-3" /> {session.duration} د</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-left">
                    <span className={`font-inter font-bold text-lg ${session.passed ? "text-saris-success" : "text-saris-danger"}`}>{session.score}%</span>
                    <span className={`block text-[10px] font-tajawal ${session.passed ? "text-saris-success" : "text-saris-danger"}`}>
                      {session.passed ? "ناجح" : "راسب"}
                    </span>
                  </div>
                  {expandedSession === session.id ? <ChevronUp className="w-4 h-4 text-saris-text-3" /> : <ChevronDown className="w-4 h-4 text-saris-text-3" />}
                </div>
              </div>
            </button>

            {expandedSession === session.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4 border-t border-saris-border pt-3 space-y-3">
                <div className="flex gap-3 text-xs font-tajawal text-saris-text-2">
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-saris-success" /> صحيحة: {session.correct}</span>
                  <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-saris-danger" /> خاطئة: {session.wrong}</span>
                  <span>من: {session.total}</span>
                </div>

                {session.sections.map((sec, si) => (
                  <div key={si}>
                    <div className="flex justify-between mb-0.5">
                      <span className="font-tajawal text-xs text-saris-text">{sec.name}</span>
                      <span className="font-inter text-xs font-bold">{sec.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-saris-border rounded-full">
                      <div className={`h-full rounded-full ${sec.score >= 70 ? "bg-saris-success" : sec.score >= 40 ? "bg-saris-warning" : "bg-saris-danger"}`} style={{ width: `${sec.score}%` }} />
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 text-xs font-tajawal text-saris-text-2">
                  <span>سهل: {session.difficulty.easy.correct}/{session.difficulty.easy.total}</span>
                  <span>متوسط: {session.difficulty.medium.correct}/{session.difficulty.medium.total}</span>
                  <span>صعب: {session.difficulty.hard.correct}/{session.difficulty.hard.total}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-tajawal text-xs text-saris-text-2">القدرة: <b className="text-saris-text">{session.abilityEstimate}</b></span>
                  <span className="font-tajawal text-xs text-saris-text-2 flex items-center gap-1"><Zap className="w-3 h-3" /> {session.speedRating}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HistoryTab;
