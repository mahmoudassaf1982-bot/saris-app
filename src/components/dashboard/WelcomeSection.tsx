import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const WelcomeSection = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="mt-4 space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-3 w-40" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mt-4"
    >
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text">
        مرحبًا {profile?.first_name ?? "مستخدم"} 👋
      </h1>
      <p className="font-tajawal text-[13px] text-saris-text-2 mt-1">
        إليك ملخص حسابك على منصة ساريس
      </p>
      <p className="font-inter text-[11px] text-saris-text-3 mt-0.5 ltr">
        {profile?.email ?? ""}
      </p>
    </motion.div>
  );
};

export default WelcomeSection;
