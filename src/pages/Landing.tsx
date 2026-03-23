import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Target, BarChart3, Bot, ArrowLeft, Sparkles, UserPlus, Coins, CheckCircle } from "lucide-react";
import { mockSupportedExams } from "@/data/mock-data";

const features = [
  { icon: Brain, title: "محرك تدريب ذكي", desc: "يختار أسئلة تناسب مستواك ويركز على نقاط ضعفك", color: "bg-saris-info/10 text-saris-info" },
  { icon: Target, title: "محاكاة اختبار حقيقي", desc: "جرّب الاختبار بنفس الظروف الحقيقية", color: "bg-saris-success/10 text-saris-success" },
  { icon: BarChart3, title: "تحليل أداء متقدم", desc: "بصمة تعلم + خريطة مهارات + درجة متوقعة", color: "bg-saris-orange/10 text-saris-orange" },
  { icon: Bot, title: "مدرب ذكي بالذكاء الاصطناعي", desc: "يساعدك أثناء التدريب ويشرح لك", color: "bg-saris-purple/10 text-saris-purple" },
];

const steps = [
  { icon: UserPlus, title: "سجّل مجانًا", desc: "أنشئ حسابك واحصل على نقاط مجانية" },
  { icon: Target, title: "اختر اختبارك", desc: "حدد الاختبار المستهدف وابدأ التدريب" },
  { icon: Sparkles, title: "تحسّن بذكاء", desc: "المحرك الذكي يتابع تقدمك ويوصيك" },
];

const Landing = () => {
  const navigate = useNavigate();
  const countryTabs = Object.keys(mockSupportedExams);
  const [activeCountry, setActiveCountry] = useState(countryTabs[0]);

  return (
    <div className="min-h-screen bg-saris-bg flex flex-col">
      {/* Hero */}
      <section className="gradient-primary px-5 pt-14 pb-16">
        <div className="max-w-[430px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-16 h-16 rounded-saris-full bg-white/10 flex items-center justify-center mx-auto mb-5">
            <span className="text-saris-orange font-tajawal font-bold text-2xl">S</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-tajawal font-extrabold text-[28px] text-white mb-3 leading-tight">
            استعد لاختبارك بالذكاء الاصطناعي
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-tajawal text-base text-white/80 mb-8 leading-relaxed">
            منصة سارس تدربك بذكاء على اختبارات القدرات والقياس
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
            <button onClick={() => navigate("/auth")} className="w-full gradient-gold text-saris-navy font-tajawal font-bold text-base rounded-saris-lg h-12 flex items-center justify-center gap-2 shadow-card-hover">
              ابدأ مجانًا
              <ArrowLeft className="w-5 h-5" />
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex items-center justify-center gap-8">
            {[{ label: "اختبار", count: "500+" }, { label: "طالب", count: "10K+" }, { label: "سؤال", count: "50K+" }].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-inter font-bold text-lg text-white">{stat.count}</p>
                <p className="font-tajawal text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-10 bg-saris-bg-card">
        <div className="max-w-[430px] mx-auto">
          <h2 className="font-tajawal font-bold text-2xl text-saris-text text-center mb-8">لماذا سارس؟</h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-saris-bg rounded-saris-lg p-4 border border-saris-border">
                <div className={`w-10 h-10 rounded-saris-md ${f.color} flex items-center justify-center mb-3`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-tajawal font-bold text-sm text-saris-text mb-1">{f.title}</h3>
                <p className="font-tajawal text-xs text-saris-text-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Exams */}
      <section className="px-5 py-10 bg-saris-bg">
        <div className="max-w-[430px] mx-auto">
          <h2 className="font-tajawal font-bold text-2xl text-saris-text text-center mb-6">الاختبارات المدعومة</h2>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
            {countryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCountry(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-saris-full font-tajawal text-sm transition-all ${
                  activeCountry === tab ? "gradient-primary text-white" : "bg-saris-bg-card text-saris-text-2 border border-saris-border"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {mockSupportedExams[activeCountry]?.map((exam, i) => (
              <div key={i} className="bg-saris-bg-card rounded-saris-md px-4 py-3 border border-saris-border flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-saris-success flex-shrink-0" />
                <span className="font-tajawal text-sm text-saris-text">{exam}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-5 py-10 bg-saris-bg-card">
        <div className="max-w-[430px] mx-auto">
          <h2 className="font-tajawal font-bold text-2xl text-saris-text text-center mb-8">كيف تبدأ؟</h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-saris-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-tajawal font-bold text-sm text-saris-text">{step.title}</h3>
                  <p className="font-tajawal text-xs text-saris-text-2 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="px-5 py-10 bg-saris-bg">
        <div className="max-w-[430px] mx-auto">
          <h2 className="font-tajawal font-bold text-2xl text-saris-text text-center mb-6">الأسعار</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border text-center">
              <Coins className="w-8 h-8 text-saris-orange mx-auto mb-2" />
              <h3 className="font-tajawal font-bold text-sm text-saris-text mb-1">نظام النقاط</h3>
              <p className="font-tajawal text-xs text-saris-text-2">ادفع حسب استخدامك</p>
            </div>
            <div className="gradient-diamond rounded-saris-lg p-4 text-center">
              <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="font-tajawal font-bold text-sm text-white mb-1">اشتراك Diamond</h3>
              <p className="font-tajawal text-xs text-white/80">وصول غير محدود</p>
            </div>
          </div>
          <button onClick={() => navigate("/auth")} className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-saris-lg h-12 mt-6 shadow-card">
            ابدأ مجانًا
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 bg-saris-navy-dark">
        <div className="max-w-[430px] mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-saris-full gradient-primary flex items-center justify-center">
              <span className="text-saris-orange font-tajawal font-bold text-sm">S</span>
            </div>
            <span className="font-tajawal font-bold text-white">سارس للاختبارات</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <a href="#" className="font-tajawal text-xs text-white/60 hover:text-white/80">الشروط والأحكام</a>
            <span className="text-white/30">|</span>
            <a href="#" className="font-tajawal text-xs text-white/60 hover:text-white/80">سياسة الخصوصية</a>
            <span className="text-white/30">|</span>
            <a href="#" className="font-tajawal text-xs text-white/60 hover:text-white/80">تواصل معنا</a>
          </div>
          <p className="font-inter text-xs text-white/40">© 2025 SARIS EXAMS — سارس للاختبارات</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
