import { mockBankHealth } from "@/data/admin-mock-data";
import { HeartPulse } from "lucide-react";

const diffLabels = { easy: "سهل", medium: "متوسط", hard: "صعب" };

const AdminBankHealth = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-tajawal font-black text-2xl text-saris-text">صحة بنك الأسئلة</h1>
      <p className="font-tajawal text-sm text-saris-text-2">تغطية الأسئلة لكل اختبار وقسم ومستوى صعوبة</p>
    </div>

    {mockBankHealth.map((exam) => (
      <div key={exam.exam} className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulse className="w-5 h-5 text-saris-navy" />
          <h3 className="font-tajawal font-bold text-base text-saris-text">{exam.exam}</h3>
        </div>

        <div className="space-y-4">
          {exam.sections.map((sec) => (
            <div key={sec.name} className="bg-saris-bg rounded-lg p-3">
              <p className="font-tajawal font-bold text-sm text-saris-text mb-2">{sec.name}</p>
              <div className="grid grid-cols-3 gap-2">
                {(["easy", "medium", "hard"] as const).map((d) => {
                  const data = sec[d];
                  const pct = Math.round((data.count / data.target) * 100);
                  const color = pct >= 80 ? "bg-saris-success" : pct >= 50 ? "bg-saris-warning" : "bg-saris-danger";
                  return (
                    <div key={d} className="text-center">
                      <p className="font-tajawal text-[10px] text-saris-text-3 mb-1">{diffLabels[d]}</p>
                      <div className="w-full bg-saris-border rounded-full h-2 mb-1">
                        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <p className="font-inter text-[10px] text-saris-text-2">{data.count}/{data.target}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default AdminBankHealth;
