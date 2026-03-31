import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, TrendingDown, CheckCircle, XCircle, Zap, BarChart3, Home, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface SimAnswer {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  responseTimeMs: number;
  difficulty: string;
  sectionId: string;
  sectionName: string;
  topic: string;
  usedHint: boolean;
}

interface SimulationSummaryProps {
  answers: SimAnswer[];
  totalQuestions: number;
  totalTimeSeconds: number;
}

const difficultyColor: Record<string, string> = {
  easy: 'bg-saris-success',
  medium: 'bg-saris-warning',
  hard: 'bg-saris-danger',
};

export default function SimulationSummary({ answers, totalQuestions, totalTimeSeconds }: SimulationSummaryProps) {
  const navigate = useNavigate();

  const correctCount = answers.filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / Math.max(totalQuestions, 1)) * 100);
  const isGood = scorePercent >= 60;
  const scoreColor = scorePercent >= 70 ? 'text-saris-success' : scorePercent >= 45 ? 'text-saris-warning' : 'text-saris-danger';

  // Speed rating
  const avgTimeMs = answers.length > 0 ? answers.reduce((s, a) => s + a.responseTimeMs, 0) / answers.length : 0;
  const avgTimeSec = Math.round(avgTimeMs / 1000);
  const speedRating = avgTimeSec < 25 ? 'سريع' : avgTimeSec < 45 ? 'متوسط' : 'بطيء';

  // Accuracy rating
  const accuracyRating = scorePercent >= 80 ? 'ممتاز' : scorePercent >= 60 ? 'جيد' : scorePercent >= 40 ? 'متوسط' : 'يحتاج تحسين';

  // Section performance
  const sectionMap: Record<string, { correct: number; total: number; name: string }> = {};
  for (const a of answers) {
    if (!sectionMap[a.sectionId]) sectionMap[a.sectionId] = { correct: 0, total: 0, name: a.sectionName };
    sectionMap[a.sectionId].total++;
    if (a.isCorrect) sectionMap[a.sectionId].correct++;
  }
  const sections = Object.values(sectionMap);

  // Difficulty breakdown
  const diffMap: Record<string, { correct: number; total: number }> = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
  for (const a of answers) {
    diffMap[a.difficulty].total++;
    if (a.isCorrect) diffMap[a.difficulty].correct++;
  }

  // Weak/strong topics
  const topicMap: Record<string, { correct: number; total: number }> = {};
  for (const a of answers) {
    if (!topicMap[a.topic]) topicMap[a.topic] = { correct: 0, total: 0 };
    topicMap[a.topic].total++;
    if (a.isCorrect) topicMap[a.topic].correct++;
  }
  const weakTopics = Object.entries(topicMap).filter(([, p]) => p.total >= 2 && p.correct / p.total < 0.5).map(([t]) => t);
  const strongTopics = Object.entries(topicMap).filter(([, p]) => p.total >= 2 && p.correct / p.total >= 0.7).map(([t]) => t);

  const hintsUsed = answers.filter(a => a.usedHint).length;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background px-4 py-6 pb-10">
      <div className="max-w-[430px] mx-auto space-y-4">
        {/* Hero Score */}
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
          <p className="font-tajawal text-sm text-muted-foreground mb-2">نتيجة المحاكاة الرسمية</p>
          <p className={`font-inter font-black text-4xl ${scoreColor}`}>
            {scorePercent}<span className="text-lg text-muted-foreground">%</span>
          </p>
          <p className="font-tajawal text-xs text-muted-foreground mt-1">{correctCount} من {totalQuestions} إجابة صحيحة</p>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-saris-purple/10 text-saris-purple">
            ×3 وزن التأثير على درجتك المتوقعة
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'الدقة', value: `${scorePercent}%`, sub: accuracyRating, icon: BarChart3, color: 'text-saris-info' },
            { label: 'السرعة', value: `${avgTimeSec}ث`, sub: speedRating, icon: Zap, color: 'text-saris-warning' },
            { label: 'الوقت الكلي', value: formatTime(totalTimeSeconds), sub: '', icon: Clock, color: 'text-saris-navy' },
            { label: 'تلميحات مستخدمة', value: `${hintsUsed}`, sub: '', icon: CheckCircle, color: 'text-saris-purple' },
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
              {stat.sub && <p className="font-tajawal text-[10px] text-muted-foreground">{stat.sub}</p>}
            </motion.div>
          ))}
        </div>

        {/* Section Performance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card"
        >
          <h3 className="font-tajawal font-bold text-sm text-foreground mb-3">أداء الأقسام</h3>
          <div className="space-y-3">
            {sections.map((sec) => {
              const rate = Math.round((sec.correct / sec.total) * 100);
              const barColor = rate >= 70 ? 'bg-saris-success' : rate >= 45 ? 'bg-saris-warning' : 'bg-saris-danger';
              return (
                <div key={sec.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-tajawal text-xs text-foreground">{sec.name}</span>
                    <span className="font-inter text-xs font-bold text-foreground">{sec.correct}/{sec.total} ({rate}%)</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rate}%` }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className={`h-full rounded-full ${barColor}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Difficulty Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card"
        >
          <h3 className="font-tajawal font-bold text-sm text-foreground mb-3">توزيع الصعوبة</h3>
          <div className="flex items-end gap-3 justify-center h-20">
            {[
              { label: 'سهل', key: 'easy', color: 'bg-saris-success' },
              { label: 'متوسط', key: 'medium', color: 'bg-saris-warning' },
              { label: 'صعب', key: 'hard', color: 'bg-saris-danger' },
            ].map(d => {
              const data = diffMap[d.key];
              const rate = data.total > 0 ? (data.correct / data.total) * 100 : 0;
              return (
                <div key={d.key} className="flex flex-col items-center gap-1 flex-1">
                  <span className="font-inter text-[10px] font-bold text-foreground">{data.correct}/{data.total}</span>
                  <div className="w-full h-16 bg-secondary rounded relative overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${rate}%` }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className={`absolute bottom-0 w-full rounded ${d.color}`}
                    />
                  </div>
                  <span className="font-tajawal text-[10px] text-muted-foreground">{d.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        {(strongTopics.length > 0 || weakTopics.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-card rounded-xl border border-border p-4 shadow-card space-y-3"
          >
            {strongTopics.length > 0 && (
              <div>
                <h4 className="font-tajawal font-bold text-sm text-foreground mb-2">نقاط القوة ✅</h4>
                <div className="flex flex-wrap gap-1.5">
                  {strongTopics.map(t => (
                    <span key={t} className="font-tajawal text-xs px-2 py-1 rounded-full bg-saris-success/10 text-saris-success">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {weakTopics.length > 0 && (
              <div>
                <h4 className="font-tajawal font-bold text-sm text-foreground mb-2">نقاط الضعف ⚠️</h4>
                <div className="flex flex-wrap gap-1.5">
                  {weakTopics.map(t => (
                    <span key={t} className="font-tajawal text-xs px-2 py-1 rounded-full bg-saris-danger/10 text-saris-danger">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="space-y-2 pt-2"
        >
          <button onClick={() => navigate('/app/exams')} className="w-full gradient-primary text-primary-foreground font-tajawal font-bold text-base rounded-xl h-12">
            العودة للاختبارات
          </button>
          <button onClick={() => navigate('/app/performance')} className="w-full border border-border bg-card text-foreground font-tajawal font-bold text-sm rounded-xl h-10">
            عرض ملف الأداء
          </button>
          <button onClick={() => navigate('/app')} className="w-full text-muted-foreground font-tajawal text-sm rounded-xl h-10 flex items-center justify-center gap-1">
            <Home className="w-4 h-4" /> العودة للرئيسية
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
