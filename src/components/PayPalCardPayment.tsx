import { useState, useEffect, useCallback } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, CreditCard } from 'lucide-react';

const countryIdToISO: Record<string, string> = {
  kw: 'KW', sa: 'SA', jo: 'JO', qa: 'QA', ae: 'AE', bh: 'BH', om: 'OM', tr: 'TR',
};

export interface OrderParams {
  orderType: 'points_pack' | 'diamond_plan';
  packId?: string;
  planId?: string;
  pointsAmount?: number;
  priceUSD: number;
  description?: string;
}

interface PreloadedPayPalCardButtonProps {
  visible: boolean;
  orderParamsRef: React.RefObject<OrderParams | null>;
  onSuccess?: (result: { points_credited?: number; diamond_activated?: boolean }) => void;
  onCancel?: () => void;
  onButtonClick?: () => void;
  onPopupOpened?: () => void;
}

export function PreloadedPayPalCardButton({ visible, orderParamsRef, onSuccess, onCancel, onButtonClick, onPopupOpened }: PreloadedPayPalCardButtonProps) {
  const { profile, refreshProfile } = useAuth();

  const createOrder = useCallback(async (): Promise<string> => {
    const params = orderParamsRef.current;
    if (!params) throw new Error('لم يتم تحديد حزمة');
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke('paypal-create-order', {
      body: {
        order_type: params.orderType,
        pack_id: params.packId,
        plan_id: params.planId,
        points_amount: params.pointsAmount,
        price_usd: params.priceUSD,
        description: params.description,
        user_id: session?.user?.id || null,
        payer: {
          email: profile?.email || '',
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          country_code: countryIdToISO[profile?.country_id || ''] || '',
        },
      },
    });
    if (error || data?.error) throw new Error(data?.error || error?.message || 'فشل إنشاء الطلب');
    onPopupOpened?.();
    return data.id;
  }, [orderParamsRef, profile, onPopupOpened]);

  const onApprove = useCallback(async (data: { orderID: string }) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('paypal-capture-order', {
        body: { paypal_order_id: data.orderID },
      });
      if (error || result?.error) {
        if (result?.already_completed) {
          toast.info('تم معالجة هذا الطلب مسبقاً');
          return;
        }
        throw new Error(result?.error || error?.message);
      }
      // Refresh profile to update balance
      await refreshProfile();
      toast.success(result?.message || 'تمت عملية الدفع بنجاح 🎉');
      onSuccess?.(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'فشل تأكيد الدفع');
    }
  }, [refreshProfile, onSuccess]);

  return (
    <div className="w-full" dir="ltr" style={visible ? {} : { visibility: 'hidden', position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
      {visible && (
        <div className="flex items-center gap-2 mb-3 justify-center" dir="rtl">
          <CreditCard className="h-4 w-4 text-saris-text-3" />
          <span className="text-sm font-medium text-saris-text-3 font-tajawal">ادفع ببطاقتك مباشرة — بدون حساب PayPal</span>
        </div>
      )}
      <PayPalButtons
        style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 45 }}
        fundingSource="card"
        onClick={(_data, actions) => { onButtonClick?.(); return actions.resolve(); }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={() => { onPopupOpened?.(); toast.info('تم إلغاء عملية الدفع'); onCancel?.(); }}
        onError={(err) => { onPopupOpened?.(); console.error('PayPal error:', err); toast.error('حدث خطأ في بوابة الدفع'); }}
      />
    </div>
  );
}

export function PayPalPaymentWrapper({ children, clientId }: { children: React.ReactNode; clientId: string }) {
  return (
    <PayPalScriptProvider options={{ clientId, currency: 'USD', intent: 'capture', components: 'buttons' }} deferLoading={false}>
      {children}
    </PayPalScriptProvider>
  );
}
