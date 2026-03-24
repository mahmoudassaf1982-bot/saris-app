import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, TrendingUp, TrendingDown, CheckCircle, Zap, Shield, BarChart3, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface SessionResults {
  abilityScore: number;
  previousAbility: number;
  abilityDelta: number;
  accuracyRate: number;
  speedRating: string;
  totalQuestions: number;
  correctCount: number;
  confidencePhase: string;
  weakSections: string[];
  strongSections: string[];
  weakTopics: string[];
  strongTopics: string[];
  difficultyProgression: string[];
}

interface SmartSessionSummaryProps {
  results: SessionResults;
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-saris-success',
  medium: 'bg-saris-warning',
  hard: 'bg-saris-danger',
};

export default function SmartSessionSummary({ results }: SmartSessionSummaryProps) {
  const navigate = useNavigate();
  const isGood = results.abilityScore >= 60;
  const scoreColor = results.abilityScore >= 70 ? 'text-saris-success' : results.abilityScore >= 45 ? 'text-saris-warning' : 'text-saris-danger';
  const deltaPositive = results.abilityDelta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background px-4 py-6 pb-10"
    >
      <div className="max-w-[430px] mx-auto space-y-4">
        {/* Hero Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-card text-center"
        >
          {isGood ? (
            <Trophy className="w-12 h-12 text-saris-success mx-auto mb-3" />
          ) : (
            <Target className="w-12 h-12 text-saris-danger mx-auto mb-3" />
          )}
          <p className="font-tajawal text-sm text-muted-foreground mb-2">تقدير القدرة التراكمي</p>
          <p className={`font-inter font-black text-4xl ${scoreColor}`}>
            {results.abilityScore}<span className="text-lg text-muted-foreground">/100</span>
          </p>
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-bold ${deltaPositive ? 'bg-saris-success/10 text-saris-success' : 'bg-saris-danger/10 text-saris-danger'}`}>
            {deltaPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {deltaPositive ? '+' : ''}{results.abilityDelta}
          </div>
          <p className="font-tajawal text-xs text-muted-foreground mt-1">القدرة السابقة: {results.previousAbility}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'الدقة', value: `${results.accuracyRate}%`, icon: BarChart3, color: 'text-saris-info' },
            { label: 'السرعة', value: results.speedRating, icon: Zap, color: 'text-saris-warning' },
            { label: 'أسئلة صحيحة', value: `${results.correctCount}/${results.totalQuestions}`, icon: CheckCircle, color: 'text-saris-success' },
            { label: 'مرحلة الثقة', value: results.confidencePhase === 'HIGH' ? 'عالية' : results.confidencePhase === 'MEDIUM' ? 'متوسطة' : 'منخفضة', icon: Shield, color: 'text-saris-purple' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-card rounded-xl border border-border p-3 shadow-card"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-1.5`} />
              <p className="font-tajawal text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-inter font-bold text-lg text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Difficulty Progression */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card"
        >
          <h3 className="font-tajawal font-bold text-sm text-foreground mb-3">مسار الصعوبة</h3>
          <div className="flex items-end gap-1 h-16">
            {results.difficultyProgression.map((d, i) => {
              const h = d === 'easy' ? 33 : d === 'medium' ? 66 : 100;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                  className={`flex-1 rounded-t ${difficultyColor[d]}`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            {[{ label: 'سهل', color: 'bg-saris-success' }, { label: 'متوسط', color: 'bg-saris-warning' }, { label: 'صعب', color: 'bg-saris-danger' }].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${l.color}`} />
                <span className="font-tajawal text-[10px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card space-y-3"
        >
          {results.strongSections.length > 0 && (
            <div>
              <h4 className="font-tajawal font-bold text-sm text-foreground mb-2">نقاط القوة ✅</h4>
              <div className="flex flex-wrap gap-1.5">
                {[...results.strongSections, ...results.strongTopics].map(s => (
                  <span key={s} className="font-tajawal text-xs px-2 py-1 rounded-full bg-saris-success/10 text-saris-success">{s}</span>
                ))}
              </div>
            </div>
          )}
          {results.weakSections.length > 0 && (
            <div>
              <h4 className="font-tajawal font-bold text-sm text-foreground mb-2">نقاط الضعف ⚠️</h4>
              <div className="flex flex-wrap gap-1.5">
                {[...results.weakSections, ...results.weakTopics].map(s => (
                  <span key={s} className="font-tajawal text-xs px-2 py-1 rounded-full bg-saris-danger/10 text-saris-danger">{s}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-2 pt-2"
        >
          <button
            onClick={() => navigate('/app/exams')}
            className="w-full gradient-primary text-primary-foreground font-tajawal font-bold text-base rounded-xl h-12"
          >
            ابدأ تدريب جديد
          </button>
          <button
            onClick={() => navigate('/app/performance')}
            className="w-full border border-border bg-card text-foreground font-tajawal font-bold text-sm rounded-xl h-10"
          >
            عرض ملف الأداء
          </button>
          <button
            onClick={() => navigate('/app')}
            className="w-full text-muted-foreground font-tajawal text-sm rounded-xl h-10 flex items-center justify-center gap-1"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
