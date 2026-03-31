import { CheckSquare, Check, X, Edit } from "lucide-react";
import { mockAdminQuestions } from "@/data/admin-mock-data";
import { useToast } from "@/hooks/use-toast";

const pending = mockAdminQuestions.filter((q) => q.status === "pending");

const AdminReviewQueue = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-tajawal font-black text-2xl text-saris-text">مراجعة الأسئلة المولّدة</h1>
        <p className="font-tajawal text-sm text-saris-text-2">{pending.length} سؤال بانتظار المراجعة</p>
      </div>

      <div className="space-y-3">
        {pending.map((q) => (
          <div key={q.id} className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-tajawal text-sm text-saris-text font-bold">{q.preview}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-tajawal text-[10px] text-saris-text-3">{q.section}</span>
                  <span className="font-tajawal text-[10px] text-saris-text-3">•</span>
                  <span className="font-tajawal text-[10px] text-saris-text-3">{q.exam}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => toast({ title: "تم الاعتماد ✅" })} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-saris-success/10 text-saris-success font-tajawal text-xs font-bold hover:bg-saris-success/20 transition-colors">
                <Check className="w-3.5 h-3.5" /> اعتماد
              </button>
              <button onClick={() => toast({ title: "تم الرفض ❌" })} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-saris-danger/10 text-saris-danger font-tajawal text-xs font-bold hover:bg-saris-danger/20 transition-colors">
                <X className="w-3.5 h-3.5" /> رفض
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-saris-bg text-saris-text-2 font-tajawal text-xs font-bold hover:bg-saris-border transition-colors">
                <Edit className="w-3.5 h-3.5" /> تعديل
              </button>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <div className="bg-saris-bg-card rounded-xl p-8 border border-saris-border text-center">
            <CheckSquare className="w-10 h-10 text-saris-success mx-auto mb-2" />
            <p className="font-tajawal font-bold text-saris-text">لا توجد أسئلة بانتظار المراجعة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewQueue;
