import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { mockCountries } from "@/data/mock-data";

const ChooseCountry = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("kw");

  return (
    <div className="min-h-screen bg-saris-bg flex flex-col items-center px-4 pt-12">
      <div className="max-w-[430px] w-full">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-saris-orange" : "bg-saris-border"}`} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-tajawal font-bold text-2xl text-saris-text text-center mb-2">اختر دولتك</h1>
          <p className="font-tajawal text-sm text-saris-text-2 text-center mb-8">حدد الدولة لعرض الاختبارات المتاحة لك</p>

          <div className="space-y-3">
            {mockCountries.map((country, idx) => {
              const isSelected = selected === country.id;
              return (
                <motion.button
                  key={country.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelected(country.id)}
                  className={`w-full flex items-center justify-between bg-saris-bg-card rounded-saris-lg px-4 h-[60px] border transition-all ${
                    isSelected ? "border-saris-orange bg-saris-orange/5" : "border-saris-border"
                  }`}
                  aria-label={`اختر ${country.name}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-tajawal font-medium text-sm text-saris-text">{country.name}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? "border-saris-orange bg-saris-orange" : "border-saris-border"
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/complete-profile")}
            disabled={!selected}
            className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-saris-lg h-12 mt-8 disabled:opacity-50 shadow-card"
          >
            التالي
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseCountry;
