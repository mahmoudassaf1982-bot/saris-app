import { motion } from "framer-motion";
import { Coins, Sparkles, CheckCircle } from "lucide-react";
import { usePointsPacks } from "@/hooks/usePointsPacks";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const TopUp = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { packs, loading } = usePointsPacks(profile?.country_id ?? null);

  const handleBuyPack = (pack: { points: number }) => {
    toast({ title: "تم الشراء بنجاح!", description: `+${pack.points} نقطة تمت إضافتها لحسابك` });
  };

  const handleDiamond = () => {
    toast({ title: "إتمام الدفع", description: "سيتم تحويلك لإتمام الدفع عبر PayPal" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text mb-1">شراء النقاط</h1>
      <p className="font-tajawal text-[13px] text-saris-text-2 mb-4">اختر الباقة المناسبة لك</p>

      {/* Current balance */}
      <div className="gradient-primary rounded-saris-lg p-4 mb-6 flex items-center gap-3">
        <Coins className="w-6 h-6 text-saris-orange" />
        <span className="font-tajawal text-sm text-white">رصيدك الحالي: <b className="font-inter">{profile?.balance ?? 0}</b> نقطة</span>
      </div>

      {/* Points packs */}
      <h2 className="font-tajawal font-bold text-base text-saris-text mb-3">باقات النقاط</h2>
      {loading ? (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-saris-lg" />
          ))}
        </div>
      ) : packs.length === 0 ? (
        <p className="font-tajawal text-sm text-saris-text-3 text-center py-6 mb-8">لا توجد باقات متاحة حالياً</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-saris-bg-card rounded-saris-lg p-4 border relative ${
                pack.popular ? "border-saris-orange shadow-card-hover" : "border-saris-border"
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-2.5 right-3 bg-saris-orange text-white font-tajawal text-[10px] font-bold px-2 py-0.5 rounded-saris-full">
                  الأكثر مبيعًا
                </span>
              )}
              <p className="font-tajawal font-bold text-sm text-saris-text mb-1">{pack.label}</p>
              <p className="font-inter font-extrabold text-2xl text-saris-navy">{pack.points}</p>
              <p className="font-tajawal text-xs text-saris-text-3 mb-1">نقطة</p>
              <p className="font-inter font-bold text-sm text-saris-orange mb-3">${pack.price_usd}</p>
              <button
                onClick={() => handleBuyPack(pack)}
                className="w-full border border-saris-orange text-saris-orange font-tajawal font-bold text-xs rounded-saris-md py-2 hover:bg-saris-orange/5 transition-colors"
              >
                اشتري الآن
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Diamond section */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-saris-purple" />
        <h2 className="font-tajawal font-bold text-base text-saris-text">اشتراك Diamond ✨</h2>
      </div>
      <p className="font-tajawal text-sm text-saris-text-2 mb-4">وصول غير محدود بدون نقاط</p>

      <div className="space-y-3 mb-6">
        {[
          { name: "شهري", price: "$9.99 / شهر", badge: null },
          { name: "سنوي", price: "$79.99 / سنة", badge: "وفّر 33%" },
        ].map((plan, i) => (
          <div key={i} className={`rounded-saris-lg p-4 border ${i === 1 ? "border-saris-purple gradient-diamond" : "bg-saris-bg-card border-saris-border"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className={`font-tajawal font-bold text-base ${i === 1 ? "text-white" : "text-saris-text"}`}>{plan.name}</h3>
                <p className={`font-inter font-bold text-lg ${i === 1 ? "text-white" : "text-saris-purple"}`}>{plan.price}</p>
              </div>
              {plan.badge && (
                <span className="bg-white/20 text-white font-tajawal text-[10px] font-bold px-2 py-0.5 rounded-saris-full">{plan.badge}</span>
              )}
            </div>
            <div className="space-y-1.5 mb-4">
              {["جلسات تدريب غير محدودة", "جلسات محاكاة غير محدودة", "تحليلات غير محدودة", "المدرب الذكي بلا حدود"].map((feature, fi) => (
                <div key={fi} className="flex items-center gap-1.5">
                  <CheckCircle className={`w-3.5 h-3.5 ${i === 1 ? "text-white/80" : "text-saris-success"}`} />
                  <span className={`font-tajawal text-xs ${i === 1 ? "text-white/90" : "text-saris-text-2"}`}>♾️ {feature}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleDiamond}
              className={`w-full font-tajawal font-bold text-sm rounded-saris-md py-2.5 ${
                i === 1 ? "bg-white text-saris-purple" : "gradient-diamond text-white"
              }`}
            >
              اشترك الآن
            </button>
          </div>
        ))}
      </div>

      {/* Payment note */}
      <div className="text-center">
        <p className="font-tajawal text-xs text-saris-text-3">جميع المدفوعات تتم عبر PayPal بشكل آمن 🔒</p>
      </div>
    </motion.div>
  );
};

export default TopUp;
