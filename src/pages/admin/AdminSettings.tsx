import { useState } from "react";
import { Settings, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { mockAdminSettings } from "@/data/admin-mock-data";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(mockAdminSettings);

  const toggle = (key: "maintenanceMode" | "registrationOpen") =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="space-y-6">
      <h1 className="font-tajawal font-black text-2xl text-saris-text">الإعدادات</h1>

      <div className="bg-saris-bg-card rounded-xl p-5 border border-saris-border shadow-card max-w-lg space-y-5">
        {/* Toggles */}
        {[
          { key: "maintenanceMode" as const, label: "وضع الصيانة", desc: "تعطيل المنصة مؤقتاً" },
          { key: "registrationOpen" as const, label: "التسجيل مفتوح", desc: "السماح بتسجيل مستخدمين جدد" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-tajawal font-bold text-sm text-saris-text">{label}</p>
              <p className="font-tajawal text-xs text-saris-text-3">{desc}</p>
            </div>
            <button onClick={() => toggle(key)} className="p-1">
              {settings[key] ? (
                <ToggleRight className="w-8 h-8 text-saris-success" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-saris-text-3" />
              )}
            </button>
          </div>
        ))}

        <hr className="border-saris-border" />

        {/* Numeric settings */}
        {[
          { key: "defaultPoints", label: "نقاط التسجيل الافتراضية" },
          { key: "trainingCost", label: "تكلفة جلسة التدريب" },
          { key: "simulationCost", label: "تكلفة جلسة المحاكاة" },
          { key: "bankThreshold", label: "حد الأسئلة الأدنى لكل قسم" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1">{label}</label>
            <input
              type="number"
              value={(settings as any)[key]}
              onChange={(e) => setSettings((s) => ({ ...s, [key]: Number(e.target.value) }))}
              className="w-full bg-saris-bg rounded-lg px-4 py-2.5 font-inter text-sm border border-saris-border focus:outline-none"
            />
          </div>
        ))}

        <button
          onClick={() => toast({ title: "تم الحفظ ✅", description: "تم حفظ الإعدادات بنجاح" })}
          className="w-full gradient-primary text-white font-tajawal font-bold text-sm rounded-xl py-3 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
