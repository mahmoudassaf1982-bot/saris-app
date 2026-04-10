import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-saris-bg p-4">
      <div className="max-w-md w-full rounded-saris-lg border border-saris-border bg-saris-bg-card p-8 text-center shadow-card">
        <XCircle className="h-12 w-12 text-saris-orange mx-auto mb-4" />
        <h1 className="text-xl font-bold text-saris-text font-tajawal">تم إلغاء عملية الدفع</h1>
        <p className="text-sm text-saris-text-2 mt-2 font-tajawal">لم تتم عملية الدفع. يمكنك المحاولة مرة أخرى.</p>
        <button onClick={() => navigate('/app/topup')} className="mt-6 gradient-primary text-white font-tajawal font-bold rounded-saris-md px-6 py-2.5">
          العودة لصفحة الشراء
        </button>
      </div>
    </div>
  );
}
