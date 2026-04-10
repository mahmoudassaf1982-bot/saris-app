import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, ClipboardCheck, Clock, CheckCircle, XCircle, ArrowUpDown } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";
import { Skeleton } from "@/components/ui/skeleton";

type SortKey = "newest" | "oldest" | "highest" | "lowest";

const History = () => {
  const navigate = useNavigate();
  const { stats, recentSessions, loading } = useUserStats();
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-saris-lg" />)}
      </motion.div>
    );
  }

  let sessions = [...recentSessions].filter((s) => {
    if (typeFilter === "all") return true;
    return s.type === typeFilter;
  });

  sessions.sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
    if (sortBy === "oldest") return new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime();
    if (sortBy === "highest") return b.score - a.score;
    return a.score - b.score;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text mb-1">سجل الاختبارات</h1>
      <p className="font-tajawal text-[13px] text-saris-text-2 mb-4">جميع جلساتك السابقة</p>

      {/* Stats summary */}
      <div className="flex gap-2 mb-4">
        <div className="bg-saris-bg-card rounded-saris-full px-3 py-1.5 border border-saris-border">
          <span className="font-tajawal text-xs text-saris-text">{stats?.completedSessions ?? 0} جلسة</span>
        </div>
        <div className="bg-saris-bg-card rounded-saris-full px-3 py-1.5 border border-saris-border">
          <span className="font-tajawal text-xs text-saris-text">{stats?.averageScore ?? 0}% متوسط</span>
        </div>
        <div className="bg-saris-bg-card rounded-saris-full px-3 py-1.5 border border-saris-border">
          <span className="font-tajawal text-xs text-saris-text">{stats?.passCount ?? 0} ناجحة</span>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 mb-3">
        {[
          { key: "all", label: "الكل" },
          { key: "smart_training", label: "تدريب ذكي" },
          { key: "simulation", label: "محاكاة" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setTypeFilter(f.key)}
            className={`px-3 py-1.5 rounded-saris-full font-tajawal text-xs transition-all ${
              typeFilter === f.key ? "bg-saris-navy text-white font-bold" : "bg-saris-bg-card text-saris-text-2 border border-saris-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {([
          { key: "newest", label: "الأحدث" },
          { key: "oldest", label: "الأقدم" },
          { key: "highest", label: "الأعلى درجة" },
          { key: "lowest", label: "الأقل درجة" },
        ] as { key: SortKey; label: string }[]).map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-saris-sm font-tajawal text-[11px] transition-all flex items-center gap-1 ${
              sortBy === s.key ? "bg-saris-orange/10 text-saris-orange font-bold" : "text-saris-text-3"
            }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-saris-text-3 mx-auto mb-3" />
          <p className="font-tajawal text-sm text-saris-text-2 mb-3">لم تبدأ أي جلسة بعد</p>
          <button onClick={() => navigate("/app/exams")} className="gradient-primary text-white font-tajawal font-bold text-sm rounded-saris-md px-6 py-2.5">
            ابدأ أول تدريب
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-saris-bg-card rounded-saris-lg border border-saris-border p-4"
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
                      {session.type === "simulation" ? "اختبار حقيقي" : "تدريب ذكي"}
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
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default History;
