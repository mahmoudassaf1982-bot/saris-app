import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }

    supabase.functions.invoke('paypal-capture-order', { body: { paypal_order_id: token } })
      .then(({ data, error }) => {
        if (error || data?.error) {
          if (data?.already_completed) { setStatus('success'); refreshProfile(); return; }
          setStatus('error');
        } else {
          setStatus('success');
          refreshProfile();
        }
      })
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-saris-bg p-4">
      <div className="max-w-md w-full rounded-saris-lg border border-saris-border bg-saris-bg-card p-8 text-center shadow-card">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-saris-navy mx-auto mb-4" />
            <h1 className="text-xl font-bold text-saris-text font-tajawal">جارٍ تأكيد الدفع...</h1>
            <p className="text-sm text-saris-text-2 mt-2 font-tajawal">يرجى الانتظار</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="h-12 w-12 rounded-full bg-saris-danger/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-xl font-bold text-saris-text font-tajawal">فشل تأكيد الدفع</h1>
            <p className="text-sm text-saris-text-2 mt-2 font-tajawal">حدث خطأ أثناء تأكيد الدفع. يرجى المحاولة مرة أخرى.</p>
            <button onClick={() => navigate('/app/topup')} className="mt-6 gradient-primary text-white font-tajawal font-bold rounded-saris-md px-6 py-2.5">
              العودة لصفحة الشراء
            </button>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-saris-success mx-auto mb-4" />
            <h1 className="text-xl font-bold text-saris-text font-tajawal">تمت عملية الدفع بنجاح 🎉</h1>
            <p className="text-sm text-saris-text-2 mt-2 font-tajawal">تمت إضافة النقاط إلى حسابك.</p>
            <button onClick={() => navigate('/app')} className="mt-6 gradient-primary text-white font-tajawal font-bold rounded-saris-md px-6 py-2.5">
              العودة للصفحة الرئيسية
            </button>
          </>
        )}
      </div>
    </div>
  );
}
