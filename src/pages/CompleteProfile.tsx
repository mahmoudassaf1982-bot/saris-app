import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const exams = [
  { id: "exam_1", name: "اختبار القدرات الأكاديمية", desc: "اختبار شامل للقدرات الرياضية والتحليلية", questions: 45, duration: "57 دقيقة" },
  { id: "exam_2", name: "اختبار القدرات العامة", desc: "اختبار القدرات العامة المعتمد", questions: 45, duration: "60 دقيقة" },
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState("exam_1");

  return (
    <div className="min-h-screen bg-saris-bg flex flex-col items-center px-4 pt-12">
      <div className="max-w-[430px] w-full">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= 1 ? "bg-saris-orange" : "bg-saris-border"}`} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-tajawal font-bold text-2xl text-saris-text text-center mb-2">أكمل ملفك الشخصي</h1>
          <p className="font-tajawal text-sm text-saris-text-2 text-center mb-8">معلوماتك تساعدنا نخصص تجربتك</p>

          <form
            onSubmit={(e) => { e.preventDefault(); navigate("/welcome"); }}
            className="space-y-4"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="font-tajawal text-sm text-saris-text-2 block mb-1">الاسم الأول</label>
                <input className="w-full bg-saris-bg-card rounded-saris-md px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none" defaultValue="أحمد" />
              </div>
              <div className="flex-1">
                <label className="font-tajawal text-sm text-saris-text-2 block mb-1">اسم العائلة</label>
                <input className="w-full bg-saris-bg-card rounded-saris-md px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none" defaultValue="محمد" />
              </div>
            </div>

            <div>
              <label className="font-tajawal text-sm text-saris-text-2 block mb-1">رقم الهاتف</label>
              <div className="flex gap-2">
                <div className="bg-saris-bg-card rounded-saris-md px-3 py-3 font-inter text-sm border border-saris-border text-saris-text-2 min-w-[70px] text-center">+965</div>
                <input className="flex-1 bg-saris-bg-card rounded-saris-md px-4 py-3 font-inter text-sm border border-saris-border focus:border-saris-navy focus:outline-none ltr" dir="ltr" placeholder="5XXXXXXX" />
              </div>
            </div>

            <div>
              <label className="font-tajawal text-sm text-saris-text-2 block mb-2">الاختبار المستهدف</label>
              <div className="space-y-2.5">
                {exams.map((exam) => {
                  const isActive = selectedExam === exam.id;
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => setSelectedExam(exam.id)}
                      className={`w-full text-right bg-saris-bg-card rounded-saris-lg p-4 border transition-all ${
                        isActive ? "border-saris-orange bg-saris-orange/5" : "border-saris-border"
                      }`}
                    >
                      <p className="font-tajawal font-bold text-sm text-saris-text">{exam.name}</p>
                      <p className="font-tajawal text-xs text-saris-text-2 mt-1">{exam.desc}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="font-tajawal text-xs text-saris-text-3">📝 {exam.questions} سؤال</span>
                        <span className="font-tajawal text-xs text-saris-text-3">⏱ {exam.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-saris-lg h-12 shadow-card">
              التالي
            </button>
            <button type="button" onClick={() => navigate("/choose-country")} className="w-full font-tajawal text-sm text-saris-text-2 py-2">
              الرجوع
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfile;
