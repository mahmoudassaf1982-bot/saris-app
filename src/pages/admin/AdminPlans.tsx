import { mockSubscriptionPlans } from "@/data/admin-mock-data";
import { CreditCard, Users, Check } from "lucide-react";

const AdminPlans = () => (
  <div className="space-y-4">
    <h1 className="font-tajawal font-black text-2xl text-saris-text">خطط الاشتراك</h1>

    {mockSubscriptionPlans.map((plan) => (
      <div key={plan.id} className="bg-saris-bg-card rounded-xl p-5 border border-saris-border shadow-card max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-saris-purple" />
            <h3 className="font-tajawal font-bold text-lg text-saris-text">{plan.name} 💎</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-saris-success/10 text-saris-success px-2.5 py-1 rounded-full">
            <span className="font-tajawal text-xs font-bold">مفعّلة</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-saris-bg rounded-lg p-3">
            <p className="font-tajawal text-xs text-saris-text-3">شهري</p>
            <p className="font-inter font-bold text-lg text-saris-text">${plan.priceMonthly}</p>
          </div>
          <div className="bg-saris-bg rounded-lg p-3">
            <p className="font-tajawal text-xs text-saris-text-3">سنوي</p>
            <p className="font-inter font-bold text-lg text-saris-text">${plan.priceYearly}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-saris-success" />
              <span className="font-tajawal text-sm text-saris-text">{f}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-saris-bg rounded-lg p-3">
          <Users className="w-4 h-4 text-saris-purple" />
          <span className="font-tajawal text-sm text-saris-text">{plan.subscribers} مشترك حالي</span>
        </div>
      </div>
    ))}
  </div>
);

export default AdminPlans;
