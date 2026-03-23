import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/choose-country");
  };

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[430px] w-full bg-saris-bg-card rounded-saris-lg p-6 shadow-card border border-saris-border"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-saris-full gradient-primary flex items-center justify-center mx-auto mb-3">
            <span className="text-saris-orange font-tajawal font-bold text-xl">S</span>
          </div>
          <h1 className="font-tajawal font-bold text-xl text-saris-text">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="font-tajawal text-sm text-saris-text-2 block mb-1">الاسم الكامل</label>
              <input
                type="text"
                className="w-full bg-saris-bg rounded-saris-md px-4 py-3 font-tajawal text-sm border border-saris-border focus:border-saris-navy focus:outline-none"
                placeholder="أحمد محمد"
              />
            </div>
          )}
          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                className="w-full bg-saris-bg rounded-saris-md px-4 py-3 pr-10 font-inter text-sm border border-saris-border focus:border-saris-navy focus:outline-none ltr"
                placeholder="ahmed@example.com"
                dir="ltr"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saris-text-3" />
            </div>
          </div>
          <div>
            <label className="font-tajawal text-sm text-saris-text-2 block mb-1">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-saris-bg rounded-saris-md px-4 py-3 pr-10 font-inter text-sm border border-saris-border focus:border-saris-navy focus:outline-none ltr"
                placeholder="••••••••"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-saris-text-3" />
                ) : (
                  <Eye className="w-4 h-4 text-saris-text-3" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full gradient-primary text-white font-tajawal font-bold text-base rounded-saris-md py-3"
          >
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-saris-border" />
          <span className="font-tajawal text-xs text-saris-text-3">أو</span>
          <div className="flex-1 h-px bg-saris-border" />
        </div>

        <div className="mt-4 space-y-2">
          <button className="w-full bg-saris-bg rounded-saris-md py-3 font-tajawal text-sm text-saris-text border border-saris-border">
            المتابعة مع Google
          </button>
          <button className="w-full bg-saris-bg rounded-saris-md py-3 font-tajawal text-sm text-saris-text border border-saris-border">
            المتابعة مع Apple
          </button>
        </div>

        <p className="text-center mt-4 font-tajawal text-sm text-saris-text-2">
          {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-saris-navy font-bold">
            {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
