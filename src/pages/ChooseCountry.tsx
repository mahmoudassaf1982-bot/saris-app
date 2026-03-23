import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const countries = ["الكويت", "السعودية", "الإمارات", "البحرين", "قطر", "عُمان"];

const ChooseCountry = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[430px] w-full bg-saris-bg-card rounded-saris-lg p-6 shadow-card border border-saris-border"
      >
        <div className="text-center mb-6">
          <MapPin className="w-10 h-10 text-saris-navy mx-auto mb-3" />
          <h1 className="font-tajawal font-bold text-xl text-saris-text">اختر دولتك</h1>
          <p className="font-tajawal text-sm text-saris-text-2 mt-1">لعرض الاختبارات المتاحة في بلدك</p>
        </div>
        <div className="space-y-2">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => navigate("/complete-profile")}
              className="w-full text-right bg-saris-bg rounded-saris-md px-4 py-3 font-tajawal text-sm text-saris-text border border-saris-border hover:border-saris-navy transition-colors"
            >
              {country}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ChooseCountry;
