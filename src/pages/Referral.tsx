import { motion } from "framer-motion";
import { Copy, Share2, Gift, UserPlus, Users } from "lucide-react";
import { mockUser, mockReferralStats } from "@/data/mock-data";
import { useToast } from "@/hooks/use-toast";

const Referral = () => {
  const { toast } = useToast();

  const shareMessage = `جرّب منصة سارس للاختبارات! استخدم كود الدعوة ${mockUser.referralCode} واحصل على نقاط مجانية 🎁\nhttps://sarisexams.com/ref/${mockUser.referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(mockUser.referralCode);
    toast({ title: "تم النسخ!", description: "تم نسخ كود الدعوة" });
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent("https://sarisexams.com/ref/" + mockUser.referralCode)}&text=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://sarisexams.com/ref/${mockUser.referralCode}`);
    toast({ title: "تم النسخ!", description: "تم نسخ رابط الدعوة" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text mb-1">ادعُ أصدقاءك</h1>
      <p className="font-tajawal text-[13px] text-saris-text-2 mb-5">شارك سارس واحصل على نقاط مجانية</p>

      {/* Referral code card */}
      <div className="gradient-primary rounded-saris-lg p-5 mb-5">
        <p className="font-tajawal text-sm text-white/80 mb-2">كود الدعوة الخاص بك</p>
        <div className="flex items-center justify-between bg-white/10 rounded-saris-md px-4 py-3 mb-4">
          <span className="font-inter font-extrabold text-2xl text-white tracking-widest">{mockUser.referralCode}</span>
          <button onClick={copyCode} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center" aria-label="نسخ الكود">
            <Copy className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={shareWhatsApp} className="flex-1 bg-[#25D366] text-white font-tajawal font-bold text-xs rounded-saris-md py-2.5 flex items-center justify-center gap-1.5" aria-label="مشاركة عبر واتساب">
            <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            واتساب
          </button>
          <button onClick={shareTelegram} className="flex-1 bg-[#0088CC] text-white font-tajawal font-bold text-xs rounded-saris-md py-2.5 flex items-center justify-center gap-1.5" aria-label="مشاركة عبر تيليجرام">
            <Share2 className="w-4 h-4" />
            تيليجرام
          </button>
          <button onClick={copyLink} className="flex-1 bg-white/10 text-white font-tajawal font-bold text-xs rounded-saris-md py-2.5 flex items-center justify-center gap-1.5" aria-label="نسخ الرابط">
            <Copy className="w-4 h-4" />
            نسخ الرابط
          </button>
        </div>
      </div>

      {/* How it works */}
      <h2 className="font-tajawal font-bold text-base text-saris-text mb-3">كيف تعمل الإحالة؟</h2>
      <div className="flex gap-3 mb-6">
        {[
          { icon: Share2, title: "شارك كودك", desc: "أرسل كود الدعوة لأصدقائك" },
          { icon: UserPlus, title: "صديقك يسجّل", desc: "يستخدم الكود عند التسجيل" },
          { icon: Gift, title: "تحصل على نقاط", desc: "كلاكما يحصل على 25 نقطة" },
        ].map((step, i) => (
          <div key={i} className="flex-1 bg-saris-bg-card rounded-saris-lg p-3 border border-saris-border text-center">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2">
              <step.icon className="w-4 h-4 text-white" />
            </div>
            <p className="font-tajawal font-bold text-[11px] text-saris-text mb-0.5">{step.title}</p>
            <p className="font-tajawal text-[9px] text-saris-text-3 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-saris-navy" />
            <span className="font-tajawal font-bold text-sm text-saris-text">إحصائيات الدعوات</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-saris-bg rounded-saris-md p-3 text-center">
            <p className="font-inter font-bold text-xl text-saris-navy">{mockReferralStats.totalReferrals}</p>
            <p className="font-tajawal text-[10px] text-saris-text-3">دعوة ناجحة</p>
          </div>
          <div className="bg-saris-bg rounded-saris-md p-3 text-center">
            <p className="font-inter font-bold text-xl text-saris-success">{mockReferralStats.pointsEarned}</p>
            <p className="font-tajawal text-[10px] text-saris-text-3">نقطة مكتسبة</p>
          </div>
        </div>
      </div>

      {/* Referral history */}
      <h2 className="font-tajawal font-bold text-base text-saris-text mb-3">سجل الدعوات</h2>
      <div className="space-y-2">
        {mockReferralStats.referrals.map((ref, i) => (
          <motion.div
            key={ref.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-saris-bg-card rounded-saris-md p-3 border border-saris-border flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-saris-info/10 flex items-center justify-center">
                <span className="font-tajawal text-xs font-bold text-saris-info">{ref.maskedName.charAt(0)}</span>
              </div>
              <div>
                <p className="font-tajawal text-sm text-saris-text">{ref.maskedName}</p>
                <p className="font-inter text-[10px] text-saris-text-3">{ref.date}</p>
              </div>
            </div>
            <span className="font-inter font-bold text-sm text-saris-success">+{ref.points} نقطة</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Referral;
