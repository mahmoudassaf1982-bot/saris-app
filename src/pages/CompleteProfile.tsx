import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const CompleteProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[430px] w-full bg-saris-bg-card rounded-saris-lg p-6 shadow-card border border-saris-border"
      >
        <div className="text-center mb-6">
          <User className="w-10 h-10 text-saris-navy mx-auto mb-3" />
          <h1 className="font-tajawal font-bold text-xl text-saris-text">أكمل ملفك الشخصي</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/welcome");
          }}
          className="space-y-4"
        >
          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1">الاسم الأول</label>
            <input className="w-full bg-saris-bg rounded-saris-md px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none" defaultValue="أحمد" />
          </div>
          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1">الاسم الأخير</label>
            <input className="w-full bg-saris-bg rounded-saris-md px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none" defaultValue="محمد" />
          </div>
          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1">الاختبار المستهدف</label>
            <select className="w-full bg-saris-bg rounded-saris-md px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none">
              <option>اختبار القدرات العامة</option>
              <option>اختبار التحصيلي</option>
              <option>SAT</option>
            </select>
          </div>
          <button type="submit" className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-saris-md py-3">
            متابعة
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
