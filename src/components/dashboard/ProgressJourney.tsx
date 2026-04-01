import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { mockRecentSessions } from "@/data/mock-data";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

type TrendType = "up" | "down" | "stable";

const getTrend = (curr: number, prev: number): TrendType => {
  const delta = curr - prev;
  if (delta > 3) return "up";
  if (delta < -3) return "down";
  return "stable";
};

const trendConfig: Record<TrendType, { icon: typeof TrendingUp; color: string; dotColor: string }> = {
  up: { icon: TrendingUp, color: "text-saris-success", dotColor: "bg-saris-success" },
  down: { icon: TrendingDown, color: "text-destructive", dotColor: "bg-destructive" },
  stable: { icon: Minus, color: "text-muted-foreground", dotColor: "bg-muted-foreground" },
};

const ProgressJourney = () => {
  const sessions = mockRecentSessions.slice(0, 5).reverse(); // oldest → newest, left to right

  if (sessions.length < 2) return null;

  const trends: TrendType[] = sessions.map((s, i) =>
    i === 0 ? "stable" : getTrend(s.score, sessions[i - 1].score)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-saris-navy" />
          <h2 className="font-tajawal font-bold text-base text-saris-text">مسار التقدم</h2>
        </div>
        <span className="font-tajawal text-[11px] text-saris-text-3">آخر {sessions.length} جلسات</span>
      </div>

      <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card">
        <div className="flex items-start justify-between">
          {sessions.map((session, i) => {
            const trend = trends[i];
            const cfg = trendConfig[trend];
            const TrendIcon = cfg.icon;
            const scoreColor = session.score >= 60 ? "text-saris-success" : "text-destructive";
            // Next trend for connecting line color
            const nextTrend = i < sessions.length - 1 ? trends[i + 1] : null;
            const nextCfg = nextTrend ? trendConfig[nextTrend] : null;

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="flex flex-col items-center flex-1 relative"
              >
                {/* Score */}
                <span className={`font-inter font-bold text-sm ${scoreColor}`}>
                  {session.score}%
                </span>

                {/* Dot + connecting line */}
                <div className="relative flex items-center justify-center w-full my-2">
                  {/* Line to next */}
                  {i < sessions.length - 1 && nextCfg && (
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-0.5 ${nextCfg.dotColor}`}
                      style={{ left: '50%', right: '-50%' }}
                    />
                  )}
                  <div className={`w-3 h-3 rounded-full ${cfg.dotColor} relative z-10 ring-2 ring-saris-bg-card`} />
                </div>

                {/* Trend icon */}
                <TrendIcon className={`w-3.5 h-3.5 ${cfg.color} mb-1`} />

                {/* Date */}
                <span className="font-tajawal text-[10px] text-saris-text-3 leading-tight text-center">
                  {formatDate(session.date)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressJourney;
