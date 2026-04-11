import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, RefreshCw, LogOut, Loader2, CheckCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);

  // Cooldown timer
  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!user?.email || cooldown > 0) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      toast({ title: "تم الإرسال ✉️", description: "تحقق من بريدك الإلكتروني" });
      startCooldown(60);
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      await supabase.auth.refreshSession();
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email_confirmed_at) {
        setVerified(true);
      } else {
        toast({
          title: "لم يتم تأكيد البريد الإلكتروني بعد",
          description: "يرجى فتح رسالة التأكيد في بريدك الإلكتروني ثم العودة إلى التطبيق.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحقق", variant: "destructive" });
    } finally {
      setChecking(false);
    }
  };

  const handleOpenMail = () => {
    const email = user?.email || "";
    const domain = email.split("@")[1]?.toLowerCase();
    const mailApps: Record<string, string> = {
      "gmail.com": "https://mail.google.com",
      "outlook.com": "https://outlook.live.com",
      "hotmail.com": "https://outlook.live.com",
      "live.com": "https://outlook.live.com",
      "yahoo.com": "https://mail.yahoo.com",
      "icloud.com": "https://www.icloud.com/mail",
      "proton.me": "https://mail.proton.me",
      "protonmail.com": "https://mail.proton.me",
    };
    const url = mailApps[domain] || `mailto:${email}`;
    window.open(url, "_blank", "noopener");
  };

  const handleEnterApp = () => {
    window.location.href = "/app";
  };

  // ── Verified success state ──
  if (verified) {
    return (
      <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[400px] w-full bg-saris-bg-card rounded-2xl p-8 shadow-card text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-saris-success/10 flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle className="w-10 h-10 text-saris-success" />
          </motion.div>
          <h1 className="font-tajawal font-bold text-xl text-saris-text mb-2">
            تم تأكيد بريدك الإلكتروني بنجاح ✅
          </h1>
          <p className="font-tajawal text-sm text-saris-text-2 mb-8 leading-relaxed">
            يمكنك الآن البدء باستخدام المنصة.
          </p>
          <button
            onClick={handleEnterApp}
            className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-xl py-4 shadow-card active:scale-[0.98] transition-transform"
          >
            الدخول إلى المنصة
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main verify email screen ──
  return (
    <div className="min-h-screen bg-saris-bg flex flex-col items-center justify-start px-4 pt-12 pb-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[400px] w-full flex flex-col items-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-[72px] h-[72px] rounded-full gradient-primary flex items-center justify-center mb-5 shadow-lg"
        >
          <Mail className="w-9 h-9 text-white" />
        </motion.div>

        {/* Title */}
        <h1 className="font-tajawal font-bold text-[22px] text-saris-text text-center mb-2 leading-tight">
          بقيت خطوة أخيرة لتفعيل حسابك
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-1">
            <div className="w-6 h-1.5 rounded-full bg-saris-navy" />
            <div className="w-6 h-1.5 rounded-full gradient-primary" />
            <div className="w-6 h-1.5 rounded-full bg-saris-border" />
          </div>
          <span className="font-tajawal text-xs text-saris-text-3">
            الخطوة 2 من 3 — تأكيد البريد الإلكتروني
          </span>
        </div>

        {/* Description */}
        <p className="font-tajawal text-sm text-saris-text-2 text-center leading-relaxed mb-5 px-2">
          لقد أرسلنا رسالة تأكيد إلى بريدك الإلكتروني.
          <br />
          افتح الرسالة واضغط على رابط التأكيد لتفعيل حسابك والبدء باستخدام منصة SARIS.
        </p>

        {/* Email card */}
        <div className="w-full bg-saris-bg rounded-2xl border border-saris-border p-5 mb-6 text-center">
          <p className="font-tajawal text-xs text-saris-text-3 mb-2">
            تم إرسال رسالة التأكيد إلى
          </p>
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-saris-navy flex-shrink-0" />
            <p className="font-inter text-base font-bold text-saris-navy" dir="ltr">
              {user?.email}
            </p>
          </div>
          <p className="font-tajawal text-[11px] text-saris-text-3 leading-relaxed">
            إذا كان البريد غير صحيح، يمكنك تسجيل الخروج وإنشاء حساب بالبريد الصحيح.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleCheckStatus}
          disabled={checking}
          className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-xl py-4 shadow-card flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform disabled:opacity-70 mb-3"
        >
          {checking ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          {checking ? "جاري التحقق..." : "تحقق من حالة التأكيد"}
        </button>

        {/* Open mail CTA */}
        <button
          onClick={handleOpenMail}
          className="w-full bg-saris-bg-card text-saris-navy font-tajawal font-bold text-sm rounded-xl py-3.5 border border-saris-navy/20 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform mb-6"
        >
          <ExternalLink className="w-4 h-4" />
          فتح البريد الإلكتروني
        </button>

        {/* Resend section */}
        <div className="w-full bg-saris-bg-card rounded-2xl border border-saris-border p-4 text-center mb-5">
          <p className="font-tajawal text-sm text-saris-text-2 mb-3">لم تصلك الرسالة؟</p>
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full bg-saris-bg text-saris-text font-tajawal font-bold text-sm rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {resending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {cooldown > 0
              ? `إعادة الإرسال بعد ${cooldown} ثانية`
              : "إعادة إرسال رسالة التأكيد"}
          </button>
        </div>

        {/* Note */}
        <p className="font-tajawal text-[11px] text-saris-text-3 text-center leading-relaxed mb-6 px-4">
          قد تستغرق الرسالة دقيقة أو دقيقتين للوصول. إذا لم تجدها، تحقق من مجلد الرسائل غير المرغوب فيها (Spam).
        </p>

        {/* Logout */}
        <button
          onClick={signOut}
          className="font-tajawal text-sm text-saris-text-3 flex items-center justify-center gap-1.5 hover:text-saris-danger transition-colors py-2 active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </motion.div>
    </div>
  );
}
