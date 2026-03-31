import { mockAdminExams } from "@/data/admin-mock-data";
import { BookOpen, CheckCircle, AlertCircle } from "lucide-react";

const AdminExams = () => (
  <div className="space-y-4">
    <h1 className="font-tajawal font-black text-2xl text-saris-text">قائمة الاختبارات</h1>

    <div className="grid md:grid-cols-2 gap-4">
      {mockAdminExams.map((exam) => (
        <div key={exam.id} className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-saris-navy" />
              <div>
                <h3 className="font-tajawal font-bold text-sm text-saris-text">{exam.name}</h3>
                <p className="font-inter text-[10px] text-saris-text-3">{exam.code}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-tajawal font-bold px-2 py-1 rounded-full ${exam.ready ? "bg-saris-success/10 text-saris-success" : "bg-saris-warning/10 text-saris-warning"}`}>
              {exam.ready ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {exam.ready ? "جاهز" : "غير مكتمل"}
            </div>
          </div>
          <p className="font-tajawal text-xs text-saris-text-2 mb-3">{exam.country} — {exam.totalQuestions} سؤال</p>
          <div className="space-y-2">
            {exam.sections.map((sec) => {
              const pct = Math.min(100, Math.round((sec.questions / sec.target) * 100));
              return (
                <div key={sec.name}>
                  <div className="flex justify-between mb-0.5">
                    <span className="font-tajawal text-xs text-saris-text">{sec.name}</span>
                    <span className="font-inter text-[10px] text-saris-text-3">{sec.questions}/{sec.target}</span>
                  </div>
                  <div className="w-full bg-saris-bg rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${pct >= 80 ? "bg-saris-success" : pct >= 50 ? "bg-saris-warning" : "bg-saris-danger"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminExams;
