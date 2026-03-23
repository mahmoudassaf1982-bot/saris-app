import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockSkills } from "@/data/mock-data";
import SarisCoachAvatar from "@/components/SmartCoach/SarisCoachAvatar";

const SkillMapPreview = () => {
  const navigate = useNavigate();

  const getBarColor = (score: number) => {
    if (score >= 70) return "bg-saris-success";
    if (score >= 40) return "bg-saris-warning";
    return "bg-saris-danger";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-4 bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-tajawal font-bold text-base text-saris-text">خريطة المهارات</h2>
        <button
          onClick={() => navigate("/app/performance")}
          className="font-tajawal text-xs text-saris-navy font-medium"
        >
          عرض الكل ←
        </button>
      </div>
      <div className="flex gap-3">
        <SarisCoachAvatar state="pointing" size={80} className="flex-shrink-0" />
        <div className="flex-1 space-y-3">
          {mockSkills.map((skill, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-tajawal text-xs text-saris-text-2">{skill.name}</span>
                <span className="font-inter text-xs font-bold text-saris-text">{skill.score}%</span>
              </div>
              <div className="w-full bg-saris-bg rounded-saris-full h-2">
                <div
                  className={`h-2 rounded-saris-full transition-all duration-500 ${getBarColor(skill.score)}`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillMapPreview;
