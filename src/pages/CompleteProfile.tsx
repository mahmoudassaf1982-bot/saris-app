import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { UserCircle, GraduationCap, Target, BookOpen } from "lucide-react";

const examsByCountry: Record<string, string[]> = {
  kw: ["اختبار القدرات الأكاديمية"],
  sa: ["اختبار القدرات العامة (قدرات)", "اختبار التحصيلي"],
  jo: ["اختبار الثانوية العامة (التوجيهي)"],
};

const grades = [
  "الصف العاشر",
  "الصف الحادي عشر",
  "الصف الثاني عشر",
  "خريج ثانوية",
  "طالب جامعي",
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const countryId = (location.state as any)?.country || "kw";

  const [firstName, setFirstName] = useState("أحمد");
  const [lastName, setLastName] = useState("محمد");
  const [grade, setGrade] = useState("");
  const [targetExam, setTargetExam] = useState("");
  const [targetScore, setTargetScore] = useState("");

  const exams = examsByCountry[countryId] || examsByCountry.kw;
  const canSubmit = firstName.trim() && lastName.trim() && grade && targetExam;

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-saris-bg-card rounded-2xl p-6 shadow-card"
      >
        <div className="w-14 h-14 rounded-full bg-saris-navy/10 flex items-center justify-center mx-auto mb-4">
          <UserCircle className="w-7 h-7 text-saris-navy" />
        </div>

        <h1 className="font-tajawal font-bold text-xl text-saris-text text-center mb-1">أكمل ملفك الشخصي</h1>
        <p className="font-tajawal text-sm text-saris-text-2 text-center mb-6">نحتاج بعض المعلومات لتخصيص تجربتك</p>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate("/welcome"); }}
          className="space-y-4"
        >
          {/* Name */}
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

          {/* Grade */}
          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              المرحلة الدراسية
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-saris-bg rounded-lg px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none text-right appearance-none"
              required
            >
              <option value="" disabled>اختر المرحلة</option>
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Target Exam */}
          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              الاختبار المستهدف
            </label>
            <select
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full bg-saris-bg rounded-lg px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none text-right appearance-none"
              required
            >
              <option value="" disabled>اختر الاختبار</option>
              {exams.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>

          {/* Target Score */}
          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              الدرجة المستهدفة <span className="text-saris-text-3 text-xs">(اختياري)</span>
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              className="w-full bg-saris-bg rounded-lg px-4 py-3 font-inter text-sm border border-saris-border focus:border-saris-navy focus:outline-none"
              placeholder="مثال: 85"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-xl py-3.5 disabled:opacity-50 shadow-card mt-2"
          >
            متابعة
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
