import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const countries = [
  { id: "kw", name: "الكويت", flag: "🇰🇼", exams: "اختبار القدرات الأكاديمية" },
  { id: "sa", name: "السعودية", flag: "🇸🇦", exams: "قدرات، تحصيلي" },
  { id: "jo", name: "الأردن", flag: "🇯🇴", exams: "التوجيهي" },
];

const ChooseCountry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selected, setSelected] = useState("");

  const handleConfirm = () => {
    if (!selected) {
      toast({ title: "خطأ", description: "يرجى اختيار الدولة", variant: "destructive" });
      return;
    }
    navigate("/complete-profile", { state: { country: selected } });
  };

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-saris-bg-card rounded-2xl p-6 shadow-card"
      >
        <div className="flex items-center justify-center mb-5">
          <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
            <span className="font-tajawal font-black text-xl text-saris-navy">S</span>
          </div>
        </div>

        <div className="w-14 h-14 rounded-full bg-saris-navy/10 flex items-center justify-center mx-auto mb-4">
          <Globe className="w-7 h-7 text-saris-navy" />
        </div>

        <h1 className="font-tajawal font-bold text-xl text-saris-text text-center mb-1">اختر بلدك</h1>
        <p className="font-tajawal text-sm text-saris-text-2 text-center mb-6">سيتم عرض الاختبارات المتوفرة حسب بلدك</p>

        <div className="space-y-3 mb-6">
          {countries.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelected(country.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-right ${
                selected === country.id
                  ? "border-saris-navy bg-saris-navy/5 shadow-sm ring-1 ring-saris-navy/20"
                  : "border-saris-border hover:border-saris-navy/30"
              }`}
            >
              <span className="text-4xl">{country.flag}</span>
              <div className="flex-1">
                <p className="font-tajawal font-bold text-base text-saris-text">{country.name}</p>
                <p className="font-tajawal text-xs text-saris-text-3 mt-0.5">{country.exams}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="font-tajawal text-xs text-saris-warning text-center mb-4">⚠️ لا يمكن تغيير البلد لاحقًا</p>

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
