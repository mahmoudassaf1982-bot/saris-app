import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SarisCoachAvatar from '@/components/SmartCoach/SarisCoachAvatar';

interface FirstSessionCelebrationProps {
  abilityScore: number;
  previousAbility: number;
  abilityDelta: number;
}

export default function FirstSessionCelebration({ abilityScore, previousAbility, abilityDelta }: FirstSessionCelebrationProps) {
  const navigate = useNavigate();
  const scoreColor = abilityScore >= 70 ? 'text-saris-success' : abilityScore >= 45 ? 'text-saris-warning' : 'text-saris-danger';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-5%',
              backgroundColor: ['hsl(var(--saris-orange))', 'hsl(var(--saris-success))', 'hsl(var(--saris-info))', 'hsl(var(--saris-purple))'][i % 4],
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, (Math.random() - 0.5) * 100],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2.5 + Math.random() * 2,
              delay: Math.random() * 1.5,
              repeat: Infinity,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
        className="text-center z-10"
      >
        <SarisCoachAvatar state="celebrating" size={128} />

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-tajawal font-black text-3xl text-foreground mt-4"
        >
          🎉 أحسنت!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-tajawal text-lg text-muted-foreground mt-2"
        >
          أكملت أول تدريب لك!
        </motion.p>

        {/* Score card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-card mt-6 w-full max-w-[280px] mx-auto"
        >
          <p className="font-tajawal text-sm text-muted-foreground mb-1">تقدير قدرتك</p>
          <p className={`font-inter font-black text-5xl ${scoreColor}`}>
            {abilityScore}<span className="text-xl text-muted-foreground">/100</span>
          </p>
        </motion.div>

        {/* Coach bubble */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-card border border-border rounded-xl px-4 py-3 shadow-card mt-4 max-w-[280px] mx-auto"
        >
          <p className="font-tajawal text-sm text-foreground">بداية ممتازة! خلّنا نكمل مع بعض 💪</p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-6 space-y-3 w-full max-w-[280px] mx-auto"
        >
          <button
            onClick={() => navigate('/app/exams')}
            className="w-full gradient-gold text-foreground font-tajawal font-bold text-base rounded-xl h-12"
          >
            تدريب آخر على نفس المادة
          </button>
          <button
            onClick={() => navigate('/app')}
            className="w-full border border-border bg-card text-foreground font-tajawal font-bold text-sm rounded-xl h-10"
          >
            استكشف المنصة
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
