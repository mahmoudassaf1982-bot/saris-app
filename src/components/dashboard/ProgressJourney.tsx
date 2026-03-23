import { motion } from "framer-motion";
import { mockRecentSessions } from "@/data/mock-data";

const getTrend = (index: number): string => {
  if (index === 0) return "➡️";
  const prev = mockRecentSessions[index - 1]?.score ?? 0;
  const curr = mockRecentSessions[index].score;
  if (curr > prev) return "📈";
  if (curr < prev) return "📉";
  return "➡️";
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

const ProgressJourney = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-4"
    >
      <h2 className="font-tajawal font-bold text-base text-saris-text mb-3">مسار التقدم</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {mockRecentSessions.slice(0, 5).map((session, i) => (
          <div
            key={session.id}
            className="flex-shrink-0 bg-saris-bg-card rounded-saris-md p-3 border border-saris-border shadow-card min-w-[100px] text-center"
          >
            <div
              className={`font-inter font-bold text-lg mb-1 ${
                session.passed ? "text-saris-success" : "text-saris-danger"
              }`}
            >
              {session.score}%
            </div>
            <p className="font-tajawal text-[11px] text-saris-text-2 leading-tight mb-1">
              {formatDate(session.date)}
            </p>
            <span className="text-sm">{getTrend(i)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProgressJourney;
