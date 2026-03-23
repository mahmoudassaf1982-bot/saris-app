import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { mockCountries } from "@/data/mock-data";
import { useToast } from "@/hooks/use-toast";

const ChooseCountry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selected, setSelected] = useState("");

  const handleConfirm = () => {
    if (!selected) {
      toast({ title: "خطأ", description: "يرجى اختيار الدولة", variant: "destructive" });
      return;
    }
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-saris-bg-card rounded-2xl p-6 shadow-card"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
            <span className="font-tajawal font-black text-xl text-saris-navy">S</span>
          </div>
        </div>

        <div className="w-14 h-14 rounded-full bg-saris-navy/10 flex items-center justify-center mx-auto mb-4">
          <Globe className="w-7 h-7 text-saris-navy" />
        </div>

        <h1 className="font-tajawal font-bold text-xl text-saris-text text-center mb-1">اختر دولتك</h1>
        <p className="font-tajawal text-sm text-saris-text-2 text-center mb-6">سيتم عرض الاختبارات المتوفرة حسب دولتك</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {mockCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelected(country.id)}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border transition-all ${
                selected === country.id
                  ? "border-saris-navy bg-saris-navy/5 shadow-sm"
                  : "border-saris-border hover:border-saris-navy/30"
              }`}
              aria-label={`اختر ${country.name}`}
            >
              <span className="text-3xl">{country.flag}</span>
              <span className="font-tajawal text-sm font-semibold text-saris-text">{country.name}</span>
            </button>
          ))}
        </div>

        <p className="font-tajawal text-xs text-saris-warning text-center mb-4">⚠️ لا يمكن تغيير الدولة لاحقًا</p>

        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-xl py-3.5 disabled:opacity-50 shadow-card"
        >
          تأكيد الاختيار
        </button>
      </motion.div>
    </div>
  );
};

export default ChooseCountry;
