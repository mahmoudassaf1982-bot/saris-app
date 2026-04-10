import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Sparkles, CheckCircle, CreditCard, Loader2, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PreloadedPayPalCardButton, PayPalPaymentWrapper, type OrderParams } from "@/components/PayPalCardPayment";

interface PointsPack {
  id: string;
  label: string;
  points: number;
  price_usd: number;
  popular: boolean;
}

interface DiamondPlan {
  id: string;
  name_ar: string;
  price_usd: number;
  duration_months: number;
}

const TopUp = () => {
  const { profile } = useAuth();
  const [packs, setPacks] = useState<PointsPack[]>([]);
  const [diamondPlan, setDiamondPlan] = useState<DiamondPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);

  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [showDiamondPayment, setShowDiamondPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentKey, setPaymentKey] = useState(0);

  const orderParamsRef = useRef<OrderParams | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSelection = selectedPackId ? 'pack' : showDiamondPayment ? 'diamond' : null;

  // Update order params when selection changes
  useEffect(() => {
    if (selectedPackId) {
      const pack = packs.find(p => p.id === selectedPackId);
      if (pack) {
        orderParamsRef.current = {
          orderType: 'points_pack',
          packId: pack.id,
          pointsAmount: pack.points,
          priceUSD: pack.price_usd,
          description: `شراء ${pack.points} نقطة - حزمة ${pack.label}`,
        };
      }
    } else if (showDiamondPayment && diamondPlan) {
      orderParamsRef.current = {
        orderType: 'diamond_plan',
        planId: diamondPlan.id,
        priceUSD: diamondPlan.price_usd,
        description: diamondPlan.name_ar,
      };
    } else {
      orderParamsRef.current = null;
    }
  }, [selectedPackId, showDiamondPayment, packs, diamondPlan]);

  // Loading message helpers
  const showLoadingMessage = useCallback(() => {
    setPaymentLoading(true);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => setPaymentLoading(false), 8000);
  }, []);

  const hideLoadingMessage = useCallback(() => {
    setPaymentLoading(false);
    if (loadingTimerRef.current) { clearTimeout(loadingTimerRef.current); loadingTimerRef.current = null; }
  }, []);

  useEffect(() => { return () => { if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current); }; }, []);

  const handlePaymentSuccess = useCallback(() => {
    hideLoadingMessage();
    setSelectedPackId(null);
    setShowDiamondPayment(false);
  }, [hideLoadingMessage]);

  const handlePaymentCancel = useCallback(() => {
    hideLoadingMessage();
    setSelectedPackId(null);
    setShowDiamondPayment(false);
  }, [hideLoadingMessage]);

  const handlePackSelection = useCallback((packId: string) => {
    if (paymentLoading) return;
    if (selectedPackId === packId) { setSelectedPackId(null); return; }
    setShowDiamondPayment(false);
    if (selectedPackId) {
      setSelectedPackId(null);
      setTimeout(() => { setSelectedPackId(packId); setPaymentKey(k => k + 1); }, 50);
    } else {
      setSelectedPackId(packId);
      setPaymentKey(k => k + 1);
    }
  }, [selectedPackId, paymentLoading]);

  const handleDiamondToggle = useCallback(() => {
    if (paymentLoading) return;
    if (showDiamondPayment) { setShowDiamondPayment(false); return; }
    setSelectedPackId(null);
    setShowDiamondPayment(true);
    setPaymentKey(k => k + 1);
  }, [showDiamondPayment, paymentLoading]);

  // Fetch PayPal client ID
  useEffect(() => {
    supabase.functions.invoke('paypal-config').then(({ data }) => {
      if (data?.client_id) setClientId(data.client_id);
      else toast.error('فشل تحميل إعدادات الدفع');
    });
  }, []);

  // Fetch packs and diamond plan
  useEffect(() => {
    const countryId = profile?.country_id;
    if (!countryId) return;

    const fetchData = async () => {
      const [packsRes, plansRes] = await Promise.all([
        supabase.from('points_packs').select('*').eq('country_id', countryId).eq('is_active', true).order('points', { ascending: true }),
        supabase.from('diamond_plans').select('*').eq('country_id', countryId).eq('is_active', true).limit(1),
      ]);
      if (packsRes.data) setPacks(packsRes.data as PointsPack[]);
      if (plansRes.data && plansRes.data.length > 0) setDiamondPlan(plansRes.data[0] as DiamondPlan);
      setLoading(false);
    };
    fetchData();
  }, [profile?.country_id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full rounded-saris-lg" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-44 w-full rounded-saris-lg" />)}
        </div>
      </div>
    );
  }

  const content = (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text mb-1">شراء النقاط</h1>
      <p className="font-tajawal text-[13px] text-saris-text-2 mb-4">اختر الباقة المناسبة أو اشترك في Diamond</p>

      {/* Current balance */}
      <div className="gradient-primary rounded-saris-lg p-4 mb-6 flex items-center gap-3">
        <Coins className="w-6 h-6 text-saris-orange" />
        <span className="font-tajawal text-sm text-white">رصيدك الحالي: <b className="font-inter">{profile?.balance ?? 0}</b> نقطة</span>
      </div>

      {/* Diamond section */}
      {diamondPlan && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="gradient-diamond rounded-saris-lg p-4 mb-6 relative overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-saris-full bg-white/20 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-tajawal font-bold text-lg text-white">{diamondPlan.name_ar}</h2>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="font-tajawal text-xs text-white/80 mt-0.5">وصول غير محدود لجميع الاختبارات والتدريب والتحليل — بدون خصم نقاط</p>
              <div className="mt-2 space-y-1">
                {['جلسات محاكاة غير محدودة', 'تدريب ذكي AI بلا حدود', 'تحليل نتائج مجاني', 'شارة Diamond مميزة'].map((feature) => (
                  <div key={feature} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-white/80" />
                    <span className="font-tajawal text-xs text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="font-inter font-extrabold text-2xl text-white">${diamondPlan.price_usd}</span>
                  <span className="font-tajawal text-xs text-white/70 mr-1">/ {diamondPlan.duration_months} شهر</span>
                </div>
                <button
                  onClick={handleDiamondToggle}
                  disabled={paymentLoading}
                  className="bg-white/20 hover:bg-white/30 text-white font-tajawal font-bold text-xs rounded-saris-md px-4 py-2 transition-colors disabled:opacity-50"
                >
                  <CreditCard className="w-3.5 h-3.5 inline ml-1" />
                  {showDiamondPayment ? 'إخفاء' : 'اشترك الآن'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 border-t border-saris-border" />
        <span className="font-tajawal text-xs text-saris-text-3">أو اشترِ نقاط</span>
        <div className="flex-1 border-t border-saris-border" />
      </div>

      {/* Points packs */}
      {packs.length === 0 ? (
        <div className="rounded-saris-lg border border-saris-border bg-saris-bg-card p-8 text-center mb-6">
          <Coins className="w-10 h-10 text-saris-text-3 mx-auto mb-3" />
          <p className="font-tajawal font-bold text-sm text-saris-text">لا توجد حزم متاحة</p>
          <p className="font-tajawal text-xs text-saris-text-3 mt-1">لا توجد حزم نقاط لدولتك حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => handlePackSelection(pack.id)}
              className={`bg-saris-bg-card rounded-saris-lg p-4 border relative cursor-pointer transition-all ${
                pack.popular ? 'border-saris-orange shadow-card-hover' : 'border-saris-border'
              } ${selectedPackId === pack.id ? 'ring-2 ring-saris-navy' : ''} ${
                paymentLoading && selectedPackId !== pack.id ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-2.5 right-3 bg-saris-orange text-white font-tajawal text-[10px] font-bold px-2 py-0.5 rounded-saris-full">
                  الأكثر شعبية
                </span>
              )}
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-saris-full bg-saris-orange/10">
                  <Coins className="w-5 h-5 text-saris-orange" />
                </div>
                <p className="font-tajawal font-bold text-sm text-saris-text mb-1">{pack.label}</p>
                <p className="font-inter font-extrabold text-2xl text-saris-navy">{pack.points}</p>
                <p className="font-tajawal text-xs text-saris-text-3 mb-1">نقطة</p>
                <p className="font-inter font-bold text-lg text-saris-orange mb-3">${pack.price_usd}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePackSelection(pack.id); }}
                  disabled={paymentLoading && selectedPackId !== pack.id}
                  className={`w-full font-tajawal font-bold text-xs rounded-saris-md py-2 transition-colors ${
                    selectedPackId === pack.id
                      ? 'bg-saris-navy text-white'
                      : 'border border-saris-orange text-saris-orange hover:bg-saris-orange/5'
                  } disabled:opacity-50`}
                >
                  <CreditCard className="w-3.5 h-3.5 inline ml-1" />
                  {selectedPackId === pack.id ? 'إلغاء' : 'شراء الآن'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Payment loading indicator */}
      <AnimatePresence>
        {paymentLoading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-saris-lg border border-saris-border bg-saris-bg-card p-4 mb-4 shadow-card"
          >
            <div className="flex items-center justify-center gap-3 text-saris-text-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium font-tajawal">جاري فتح نموذج الدفع الآمن... يرجى الانتظار</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PayPal payment button */}
      {clientId && (
        <div className={activeSelection ? 'rounded-saris-lg border border-saris-border bg-saris-bg-card p-4 mb-4 shadow-card' : ''}>
          <PreloadedPayPalCardButton
            key={paymentKey}
            visible={!!activeSelection}
            orderParamsRef={orderParamsRef}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
            onButtonClick={showLoadingMessage}
            onPopupOpened={hideLoadingMessage}
          />
        </div>
      )}

      {/* Payment note */}
      <div className="text-center mt-4">
        <p className="font-tajawal text-xs text-saris-text-3">💳 مدفوعات محمية بالكامل بواسطة PayPal. النقاط تُضاف فوراً بعد تأكيد الدفع.</p>
      </div>
    </motion.div>
  );

  if (clientId) {
    return <PayPalPaymentWrapper clientId={clientId}>{content}</PayPalPaymentWrapper>;
  }
  return content;
};

export default TopUp;
