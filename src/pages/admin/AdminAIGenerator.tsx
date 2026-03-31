import { useState } from "react";
import { Cpu, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminAIGenerator = () => {
  const { toast } = useToast();
  const [exam, setExam] = useState("القدرات الأكاديمية");
  const [section, setSection] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(10);

  const sections: Record<string, string[]> = {
    "القدرات الأكاديمية": ["الجبر والهندسة", "الإحصاء والاحتمالات", "الدوال واللوغاريتمات", "الهندسة وحساب المثلثات"],
    "القدرات العامة (قدرات)": ["الكمي", "اللفظي"],
  };

  const handleSubmit = () => {
    if (!section) {
      toast({ title: "خطأ", description: "يرجى اختيار القسم", variant: "destructive" });
      return;
    }
    toast({ title: "تم الإرسال", description: `تم إنشاء مهمة توليد ${count} سؤال في ${section}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-tajawal font-black text-2xl text-saris-text">مولّد الأسئلة بالذكاء الاصطناعي</h1>
        <p className="font-tajawal text-sm text-saris-text-2">أنشئ أسئلة جديدة باستخدام AI</p>
      </div>

      <div className="bg-saris-bg-card rounded-xl p-5 border border-saris-border shadow-card max-w-lg space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-saris-navy" />
          <h3 className="font-tajawal font-bold text-base text-saris-text">مهمة توليد جديدة</h3>
        </div>

        <div>
          <label className="font-tajawal text-sm text-saris-text-2 block mb-1">الاختبار</label>
          <select value={exam} onChange={(e) => { setExam(e.target.value); setSection(""); }} className="w-full bg-saris-bg rounded-lg px-4 py-3 font-tajawal text-sm border border-saris-border focus:outline-none">
            {Object.keys(sections).map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div>
          <label className="font-tajawal text-sm text-saris-text-2 block mb-1">القسم</label>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full bg-saris-bg rounded-lg px-4 py-3 font-tajawal text-sm border border-saris-border focus:outline-none">
            <option value="">اختر القسم</option>
            {(sections[exam] || []).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="font-tajawal text-sm text-saris-text-2 block mb-1">مستوى الصعوبة</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-saris-bg rounded-lg px-4 py-3 font-tajawal text-sm border border-saris-border focus:outline-none">
            <option value="easy">سهل</option>
            <option value="medium">متوسط</option>
            <option value="hard">صعب</option>
          </select>
        </div>

        <div>
          <label className="font-tajawal text-sm text-saris-text-2 block mb-1">عدد الأسئلة</label>
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full bg-saris-bg rounded-lg px-4 py-3 font-inter text-sm border border-saris-border focus:outline-none" />
        </div>

        <button onClick={handleSubmit} className="w-full gradient-primary text-white font-tajawal font-bold text-sm rounded-xl py-3 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          بدء التوليد
        </button>
      </div>
    </div>
  );
};

export default AdminAIGenerator;
