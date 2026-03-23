import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserCircle, Phone } from "lucide-react";
import { mockCountries } from "@/data/mock-data";

const countryCodes: Record<string, { code: string; flag: string }> = {
  kw: { code: "+965", flag: "🇰🇼" },
  sa: { code: "+966", flag: "🇸🇦" },
  tr: { code: "+90", flag: "🇹🇷" },
  qa: { code: "+974", flag: "🇶🇦" },
};

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("أحمد");
  const [lastName, setLastName] = useState("محمد");
  const [countryId, setCountryId] = useState("kw");
  const [phone, setPhone] = useState("");

  const cc = countryCodes[countryId] || countryCodes.kw;
  const canSubmit = firstName.trim() && lastName.trim() && countryId && phone.trim();

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-saris-bg-card rounded-2xl p-6 shadow-card"
      >
        <div className="w-14 h-14 rounded-full bg-saris-navy/10 flex items-center justify-center mx-auto mb-4">
          <UserCircle className="w-7 h-7 text-saris-navy" />
        </div>

        <h1 className="font-tajawal font-bold text-xl text-saris-text text-center mb-1">أكمل بياناتك</h1>
        <p className="font-tajawal text-sm text-saris-text-2 text-center mb-6">نحتاج بعض المعلومات لإكمال حسابك</p>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate("/welcome"); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-tajawal text-sm text-saris-text-2 block mb-1">الاسم الأول</label>
              <input
                className="w-full bg-saris-bg rounded-lg px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none text-right"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-tajawal text-sm text-saris-text-2 block mb-1">اسم العائلة</label>
              <input
                className="w-full bg-saris-bg rounded-lg px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none text-right"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1">الدولة</label>
            <select
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="w-full bg-saris-bg rounded-lg px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none text-right"
            >
              {mockCountries.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1">رقم الهاتف</label>
            <div className="flex gap-2">
              <div className="bg-saris-bg rounded-lg px-3 py-3 font-inter text-sm border border-saris-border text-saris-text-2 min-w-[80px] text-center flex items-center gap-1 justify-center">
                <span>{cc.flag}</span>
                <span>{cc.code}</span>
              </div>
              <input
                className="flex-1 bg-saris-bg rounded-lg px-4 py-3 font-mono text-sm border border-saris-border focus:border-saris-navy focus:outline-none"
                dir="ltr"
                style={{ textAlign: "left" }}
                inputMode="tel"
                maxLength={10}
                placeholder="5XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <p className="font-tajawal text-[11px] text-saris-text-3 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              سيُستخدم لتأكيد العمليات المالية
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-xl py-3.5 disabled:opacity-50 shadow-card"
          >
            حفظ ومتابعة
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
