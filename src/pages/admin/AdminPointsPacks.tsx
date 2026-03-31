import { mockPointsPacks as packs, mockSubscriptionPlans as plans } from "@/data/admin-mock-data";
import { Package, Edit, ToggleRight } from "lucide-react";

const AdminPointsPacks = () => (
  <div className="space-y-4">
    <h1 className="font-tajawal font-black text-2xl text-saris-text">باقات النقاط</h1>

    <div className="grid md:grid-cols-2 gap-3">
      {packs.map((p) => (
        <div key={p.id} className="bg-saris-bg-card rounded-xl p-4 border border-saris-border shadow-card flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-saris-orange" />
              <h3 className="font-tajawal font-bold text-sm text-saris-text">{p.name}</h3>
              {p.popular && <span className="text-[9px] font-tajawal font-bold px-1.5 py-0.5 rounded-full bg-saris-orange/10 text-saris-orange">الأكثر شعبية</span>}
            </div>
            <p className="font-inter text-lg font-bold text-saris-text mt-1">{p.points} نقطة</p>
            <p className="font-inter text-sm text-saris-text-2">${p.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <ToggleRight className="w-6 h-6 text-saris-success" />
            <button className="p-2 rounded-lg hover:bg-saris-bg transition-colors">
              <Edit className="w-4 h-4 text-saris-text-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminPointsPacks;
