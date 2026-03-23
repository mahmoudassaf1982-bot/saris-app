import { motion } from "framer-motion";
import { mockUser } from "@/data/mock-data";

const WelcomeSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="mt-4"
    >
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text">
        مرحبًا {mockUser.firstName} 👋
      </h1>
      <p className="font-tajawal text-[13px] text-saris-text-2 mt-1">
        إليك ملخص حسابك على منصة ساريس
      </p>
      <p className="font-inter text-[11px] text-saris-text-3 mt-0.5 ltr">
        {mockUser.email}
      </p>
    </motion.div>
  );
};

export default WelcomeSection;
