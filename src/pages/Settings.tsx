import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Mail, Phone, MapPin, Crown, Coins, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const infoRows = [
    { icon: User, label: "الاسم", value: `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "—" },
    { icon: Mail, label: "البريد الإلكتروني", value: profile?.email ?? "—" },
    { icon: Phone, label: "رقم الهاتف", value: profile?.phone ?? "—" },
    { icon: MapPin, label: "الدولة", value: profile?.country_name ?? "—" },
    { icon: Coins, label: "الرصيد", value: `${profile?.balance ?? 0} نقطة` },
    { icon: Crown, label: "الاشتراك", value: profile?.is_diamond ? "Diamond 💎" : "مجاني" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-4">
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text mb-1">الإعدادات</h1>
      <p className="font-tajawal text-[13px] text-saris-text-2 mb-6">معلومات حسابك وإعدادات التطبيق</p>

      {/* Avatar & Name */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-saris-full gradient-primary flex items-center justify-center mb-3">
          <span className="text-white font-tajawal font-bold text-3xl">
            {(profile?.first_name?.[0] ?? "S").toUpperCase()}
          </span>
        </div>
        <h2 className="font-tajawal font-bold text-lg text-saris-text">
          {`${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "مستخدم"}
        </h2>
        {profile?.referral_code && (
          <span className="font-inter text-xs text-saris-text-3 mt-0.5">
            كود الإحالة: {profile.referral_code}
          </span>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-saris-bg-card rounded-saris-lg border border-saris-border overflow-hidden mb-6">
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center gap-3 px-4 py-3 ${i < infoRows.length - 1 ? "border-b border-saris-border" : ""}`}
          >
            <div className="w-8 h-8 rounded-saris-full bg-saris-orange/10 flex items-center justify-center shrink-0">
              <row.icon className="w-4 h-4 text-saris-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-tajawal text-xs text-saris-text-3">{row.label}</p>
              <p className="font-tajawal text-sm text-saris-text truncate" dir="auto">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-tajawal font-bold text-sm rounded-saris-lg py-3 transition-colors border border-red-200"
      >
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </button>
    </motion.div>
  );
};

export default Settings;
