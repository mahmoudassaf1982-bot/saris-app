import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, CheckCircle, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const ALLOWED_DOMAINS = [
  "gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com",
  "proton.me", "protonmail.com", "live.com", "msn.com", "aol.com",
  "zoho.com", "yandex.com", "mail.com",
];

const DISPOSABLE_DOMAINS = [
  "mailinator.com", "guerrillamail.com", "temp-mail.org", "yopmail.com",
  "throwaway.email", "tempmail.com", "fakeinbox.com", "sharklasers.com",
  "guerrillamailblock.com", "grr.la", "dispostable.com", "trashmail.com",
  "10minutemail.com", "tempail.com", "burnermail.io",
];

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const isRegisterRoute = location.pathname.includes("register");

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/app", { replace: true });
    }
  }, [user, authLoading, navigate]);
  const [isLogin, setIsLogin] = useState(!isRegisterRoute);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, [location.search]);

  const validateEmail = (em: string): boolean => {
    setEmailError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(em)) {
      setEmailError("صيغة البريد الإلكتروني غير صحيحة");
      return false;
    }
    const domain = em.split("@")[1]?.toLowerCase();
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      setEmailError("لا يُسمح باستخدام إيميلات مؤقتة أو وهمية");
      return false;
    }
    const isAllowed = ALLOWED_DOMAINS.includes(domain) || domain.endsWith(".edu") || domain.endsWith(".ac");
    if (!isAllowed) {
      setEmailError("يرجى استخدام بريد إلكتروني من مزود معروف (Gmail, Outlook, Yahoo...)");
      return false;
    }
    return true;
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({ title: "خطأ في تسجيل الدخول", description: error.message, variant: "destructive" });
          setSubmitting(false);
          return;
        }
        navigate("/app");
      } else {
        if (!fullName.trim()) {
          toast({ title: "خطأ", description: "يرجى إدخال الاسم الكامل", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          toast({ title: "خطأ", description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          toast({ title: "خطأ", description: "كلمتا المرور غير متطابقتين", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, referral_code: referralCode || undefined },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          toast({ title: "خطأ في التسجيل", description: error.message, variant: "destructive" });
          setSubmitting(false);
          return;
        }
        setShowSuccess(true);
      }
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message ?? "حدث خطأ غير متوقع", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-saris-bg-card rounded-2xl p-8 shadow-card text-center"
        >
          <div className="w-16 h-16 rounded-full bg-saris-navy/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-saris-navy" />
          </div>
          <h2 className="font-tajawal font-bold text-xl text-saris-text mb-2">تحقق من بريدك الإلكتروني ✉️</h2>
          <p className="font-tajawal text-sm text-saris-text-2 mb-2">
            لقد أرسلنا رسالة تأكيد إلى:
          </p>
          <p className="font-inter text-sm font-semibold text-saris-navy mb-4" dir="ltr">{email}</p>
          <p className="font-tajawal text-sm text-saris-text-3 leading-relaxed mb-6">
            افتح بريدك الإلكتروني واضغط على رابط التأكيد لتفعيل حسابك.
            <br />
            تحقق أيضاً من مجلد البريد المزعج (Spam).
          </p>
          <button
            onClick={() => { setShowSuccess(false); setIsLogin(true); }}
            className="w-full gradient-primary text-white font-tajawal font-bold text-sm rounded-xl py-3 shadow-card"
          >
            العودة لتسجيل الدخول
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-saris-bg-card rounded-2xl p-6 shadow-card"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-3">
            <span className="font-tajawal font-black text-2xl text-saris-navy">S</span>
          </div>
          <h1 className="font-tajawal font-black text-xl text-saris-text">سارس للاختبارات</h1>
          <p className="font-tajawal text-xs text-saris-text-3 mt-0.5">مدربك الذكي للاختبارات</p>
        </div>

        {/* Google Sign-In (PRIMARY) */}
        <button
          onClick={handleGoogleAuth}
          className="w-full bg-white rounded-xl py-3.5 font-tajawal font-bold text-sm text-saris-text border border-saris-border flex items-center justify-center gap-3 hover:shadow-card transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          تسجيل الدخول بـ Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-saris-border" />
          <span className="font-tajawal text-xs text-saris-text-3">أو</span>
          <div className="flex-1 h-px bg-saris-border" />
        </div>

        {/* Toggle */}
        <div className="flex bg-saris-bg rounded-xl p-1 mb-5">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-lg font-tajawal font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${
              isLogin ? "bg-saris-bg-card text-saris-text shadow-sm" : "text-saris-text-3"
            }`}
          >
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-lg font-tajawal font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${
              !isLogin ? "bg-saris-bg-card text-saris-text shadow-sm" : "text-saris-text-3"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            إنشاء حساب
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Full Name (register) */}
            {!isLogin && (
              <div>
                <label className="font-tajawal text-sm text-saris-text-2 block mb-1 text-right">الاسم الكامل</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-saris-bg rounded-lg px-4 py-3 pr-10 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none text-right"
                    placeholder="مثال: أحمد محمد العلي"
                    required
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saris-text-3" />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="font-tajawal text-sm text-saris-text-2 block mb-1 text-right">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  className={`w-full bg-saris-bg rounded-lg px-4 py-3 pl-10 font-inter text-sm border focus:outline-none ${
                    emailError ? "border-saris-danger" : "border-saris-border focus:border-saris-navy"
                  }`}
                  placeholder="you@gmail.com"
                  dir="ltr"
                  style={{ textAlign: "left" }}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saris-text-3" />
              </div>
              {emailError && (
                <p className="font-tajawal text-xs text-saris-danger mt-1 text-right">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="font-tajawal text-sm text-saris-text-2 block mb-1 text-right">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-saris-bg rounded-lg px-4 py-3 pl-10 font-inter text-sm border border-saris-border focus:border-saris-navy focus:outline-none"
                  placeholder="••••••••"
                  dir="ltr"
                  style={{ textAlign: "left" }}
                  minLength={isLogin ? undefined : 6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-saris-text-3" /> : <Eye className="w-4 h-4 text-saris-text-3" />}
                </button>
              </div>
              {isLogin && (
                <button type="button" className="font-tajawal text-xs text-saris-navy mt-1.5 block text-right">
                  نسيت كلمة المرور؟
                </button>
              )}
            </div>

            {/* Confirm Password (register) */}
            {!isLogin && (
              <div>
                <label className="font-tajawal text-sm text-saris-text-2 block mb-1 text-right">تأكيد كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-saris-bg rounded-lg px-4 py-3 pl-10 font-inter text-sm border border-saris-border focus:border-saris-navy focus:outline-none"
                    placeholder="••••••••"
                    dir="ltr"
                    style={{ textAlign: "left" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-saris-text-3" /> : <Eye className="w-4 h-4 text-saris-text-3" />}
                  </button>
                </div>
              </div>
            )}

            {/* Referral (register) */}
            {!isLogin && (
              <div>
                <label className="font-tajawal text-sm text-saris-text-2 block mb-1 text-right">
                  كود الدعوة <span className="text-saris-text-3 text-xs">(اختياري)</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-saris-bg rounded-lg px-4 py-3 font-mono text-sm border border-saris-border focus:border-saris-navy focus:outline-none uppercase"
                  placeholder="مثال: AHMED24"
                  dir="ltr"
                  style={{ textAlign: "left" }}
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-xl py-3.5 shadow-card hover:shadow-card-hover transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </button>
          </motion.form>
        </AnimatePresence>

        {/* Registration bonus */}
        {!isLogin && (
          <p className="font-tajawal text-xs text-saris-text-3 text-center mt-4">
            عند التسجيل ستحصل على 20 نقطة هدية لتجربة المنصة مجانًا 🎁
          </p>
        )}

        {/* Toggle link */}
        <p className="text-center mt-5 font-tajawal text-sm text-saris-text-2">
          {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-saris-navy font-bold">
            {isLogin ? "سجّل الآن" : "سجّل دخول"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
