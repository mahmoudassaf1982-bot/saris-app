import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, RefreshCw, LogOut, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      setResent(true);
      toast({ title: "تم الإرسال", description: "تحقق من بريدك الإلكتروني" });
      setTimeout(() => setResent(false), 30000);
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.email_confirmed_at) {
      window.location.reload();
    } else {
      // Try refreshing the session
      await supabase.auth.refreshSession();
      const { data: refreshed } = await supabase.auth.getSession();
      if (refreshed.session?.user?.email_confirmed_at) {
        window.location.reload();
      } else {
        toast({ title: "لم يتم التحقق بعد", description: "يرجى فتح رابط التأكيد في بريدك الإلكتروني أولاً", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-saris-bg-card rounded-2xl p-8 shadow-card text-center"
      >
        <div className="w-20 h-20 rounded-full bg-saris-navy/10 flex items-center justify-center mx-auto mb-5">
          <Mail className="w-10 h-10 text-saris-navy" />
        </div>

        <h1 className="font-tajawal font-bold text-xl text-saris-text mb-2">
          تحقق من بريدك الإلكتروني
        </h1>

        <p className="font-tajawal text-sm text-saris-text-2 mb-2 leading-relaxed">
          لقد أرسلنا رسالة تأكيد إلى:
        </p>

        <p className="font-inter text-sm font-semibold text-saris-navy mb-4" dir="ltr">
          {user?.email}
        </p>

        <p className="font-tajawal text-sm text-saris-text-3 mb-6 leading-relaxed">
          افتح بريدك الإلكتروني واضغط على رابط التأكيد للمتابعة.
          <br />
          تحقق أيضاً من مجلد البريد المزعج (Spam).
        </p>

        <div className="space-y-3">
          <button
            onClick={handleCheckStatus}
            className="w-full gradient-primary text-white font-tajawal font-bold text-sm rounded-xl py-3 flex items-center justify-center gap-2 shadow-card"
          >
            <CheckCircle className="w-4 h-4" />
            لقد أكدت بريدي — تحقق الآن
          </button>

          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="w-full bg-saris-bg text-saris-text font-tajawal font-bold text-sm rounded-xl py-3 border border-saris-border flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {resending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {resent ? "تم الإرسال — انتظر 30 ثانية" : "إعادة إرسال رسالة التأكيد"}
          </button>

          <button
            onClick={signOut}
            className="w-full text-saris-text-3 font-tajawal text-sm py-2 flex items-center justify-center gap-2 hover:text-saris-danger transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </motion.div>
    </div>
  );
}
