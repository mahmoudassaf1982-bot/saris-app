import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockSkills } from "@/data/mock-data";

const getSkillColor = (score: number) => {
  if (score >= 80) return "bg-saris-amber";
  if (score >= 60) return "bg-saris-success";
  if (score >= 40) return "bg-saris-warning";
  return "bg-saris-danger";
};

const getSkillTextColor = (score: number) => {
  if (score >= 80) return "text-saris-amber";
  if (score >= 60) return "text-saris-success";
  if (score >= 40) return "text-saris-warning";
  return "text-saris-danger";
};

const getSkillLabel = (score: number) => {
  if (score >= 80) return "ممتاز 🏆";
  if (score >= 60) return "جيد ✅";
  if (score >= 40) return "متوسط ⚠️";
  return "يحتاج تحسين ❌";
};

const SkillMapTab = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Skill bars */}
      <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
        <h3 className="font-tajawal font-bold text-sm text-saris-text mb-4">🗺️ مستوى المهارات</h3>
        <div className="space-y-4">
          {mockSkills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-tajawal text-sm text-saris-text">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-tajawal text-[10px] ${getSkillTextColor(skill.score)}`}>{getSkillLabel(skill.score)}</span>
                  <span className={`font-inter text-sm font-bold ${getSkillTextColor(skill.score)}`}>{skill.score}%</span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-saris-border rounded-full">
                <motion.div
                  className={`h-full rounded-full ${getSkillColor(skill.score)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.score}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strong skills */}
      {mockSkills.filter(s => s.score >= 60).length > 0 && (
        <div>
          <h3 className="font-tajawal font-bold text-sm text-saris-text mb-2">✅ أقوى مهاراتك</h3>
          {mockSkills.filter(s => s.score >= 60).map((skill, i) => (
            <div key={i} className="bg-saris-success/5 rounded-saris-md p-3 border border-saris-success/20 mb-2">
              <span className="font-tajawal text-sm text-saris-text">{skill.name} — {skill.score}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Weak skills */}
      {mockSkills.filter(s => s.score < 40).length > 0 && (
        <div>
          <h3 className="font-tajawal font-bold text-sm text-saris-text mb-2">⚠️ مهارات تحتاج تحسين</h3>
          {mockSkills.filter(s => s.score < 40).map((skill, i) => (
            <div key={i} className="bg-saris-danger/5 rounded-saris-md p-3 border border-saris-danger/20 mb-2 flex items-center justify-between">
              <span className="font-tajawal text-sm text-saris-text">{skill.name} — {skill.score}%</span>
              <button
                onClick={() => navigate(`/app/adaptive-training/mock-rec-${i}`)}
                className="bg-saris-danger text-white font-tajawal text-xs font-bold rounded-saris-sm px-3 py-1"
              >
                ابدأ تدريب مركّز
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SkillMapTab;
