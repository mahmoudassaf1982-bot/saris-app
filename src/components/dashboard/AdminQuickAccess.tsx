import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles } from "lucide-react";

const AdminQuickAccess = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="mt-4 gradient-primary rounded-saris-lg p-4 cursor-pointer"
      onClick={() => navigate("/app/admin")}
    >
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-white/80" />
        <div className="flex-1">
          <p className="font-tajawal font-bold text-base text-white">لوحة الإدارة</p>
          <p className="font-tajawal text-xs text-white/70 mt-0.5">
            إدارة الاختبارات، الأسئلة، والمستخدمين
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate("/app/admin");
        }}
        className="mt-3 flex items-center gap-2 bg-white/15 rounded-saris-md px-3 py-2 hover:bg-white/25 transition-colors"
      >
        <Sparkles className="w-4 h-4 text-saris-orange" />
        <span className="font-tajawal text-xs text-white font-medium">توليد الأسئلة</span>
      </button>
    </motion.div>
  );
};

export default AdminQuickAccess;
