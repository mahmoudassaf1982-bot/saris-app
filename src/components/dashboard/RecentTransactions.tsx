import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { mockTransactions } from "@/data/mock-data";

const RecentTransactions = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-tajawal font-bold text-base text-saris-text">آخر المعاملات</h2>
        <button
          onClick={() => navigate("/app/wallet")}
          className="font-tajawal text-xs text-saris-navy font-medium"
        >
          عرض الكل ←
        </button>
      </div>
      <div className="space-y-2">
        {mockTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 py-2 border-b border-saris-border last:border-0"
          >
            {tx.type === "credit" ? (
              <ArrowUpCircle className="w-5 h-5 text-saris-success shrink-0" />
            ) : (
              <ArrowDownCircle className="w-5 h-5 text-saris-danger shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-tajawal text-sm text-saris-text">{tx.reason}</p>
              <p className="font-inter text-[11px] text-saris-text-3">{tx.date}</p>
            </div>
            <span
              className={`font-inter text-sm font-bold shrink-0 ${
                tx.type === "credit" ? "text-saris-success" : "text-saris-danger"
              }`}
            >
              {tx.amount > 0 ? "+" : ""}{tx.amount}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentTransactions;
