import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Coins, ArrowDownCircle, ArrowUpCircle, Sparkles, Wallet as WalletIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";

const filterOptions = [
  { key: "all", label: "الكل" },
  { key: "credit", label: "إيداع" },
  { key: "debit", label: "سحب" },
];

const Wallet = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { transactions, loading } = useTransactions();
  const [filter, setFilter] = useState("all");

  const filtered = transactions.filter((t) => filter === "all" || t.type === filter);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text mb-4">محفظتي</h1>

      {/* Balance card */}
      <div className="gradient-gold rounded-saris-lg p-5 mb-4 flex items-center justify-between">
        <div>
          <p className="font-inter font-extrabold text-5xl text-saris-navy">{profile?.balance ?? 0}</p>
          <p className="font-tajawal text-sm text-saris-navy-dark/80 mt-1">نقطة متاحة</p>
          <button
            onClick={() => navigate("/app/topup")}
            className="mt-3 bg-saris-bg-card text-saris-orange font-tajawal font-bold text-sm rounded-saris-full px-4 py-2"
          >
            اشحن رصيدك
          </button>
        </div>
        <Coins className="w-14 h-14 text-saris-navy/20" />
      </div>

      {/* Diamond status */}
      {profile?.is_diamond ? (
        <div className="gradient-diamond rounded-saris-lg p-4 mb-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="font-tajawal font-bold text-sm">Diamond مفعّل ✨</span>
          </div>
          <p className="font-tajawal text-xs text-white/80">جميع الجلسات مجانية</p>
        </div>
      ) : (
        <button
          onClick={() => navigate("/app/topup")}
          className="w-full gradient-diamond rounded-saris-lg p-4 mb-4 text-right flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <div>
              <p className="font-tajawal font-bold text-sm text-white">اشترك في Diamond</p>
              <p className="font-tajawal text-xs text-white/70">وصول غير محدود بدون نقاط</p>
            </div>
          </div>
        </button>
      )}

      {/* Transactions */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-tajawal font-bold text-base text-saris-text">سجل المعاملات</h2>
      </div>

      <div className="flex gap-2 mb-4">
        {filterOptions.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-saris-full font-tajawal text-xs transition-all ${
              filter === f.key ? "bg-saris-navy text-white font-bold" : "bg-saris-bg-card text-saris-text-2 border border-saris-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full rounded-saris-md" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8">
          <WalletIcon className="w-10 h-10 text-saris-text-3 mx-auto mb-2" />
          <p className="font-tajawal text-sm text-saris-text-2">لا توجد معاملات بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-saris-bg-card rounded-saris-md p-3 border border-saris-border flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {tx.type === "credit" ? (
                  <div className="w-8 h-8 rounded-full bg-saris-success/10 flex items-center justify-center">
                    <ArrowDownCircle className="w-4 h-4 text-saris-success" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-saris-danger/10 flex items-center justify-center">
                    <ArrowUpCircle className="w-4 h-4 text-saris-danger" />
                  </div>
                )}
                <div>
                  <p className="font-tajawal text-sm text-saris-text">{tx.reason}</p>
                  <p className="font-inter text-[10px] text-saris-text-3">{tx.date ? new Date(tx.date).toLocaleDateString("ar") : ""}</p>
                </div>
              </div>
              <span className={`font-inter font-bold text-sm ${tx.type === "credit" ? "text-saris-success" : "text-saris-danger"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Wallet;
