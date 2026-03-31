import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Target, TrendingUp, Zap, BarChart3, Home, Clock,
  CheckCircle2, XCircle, Layers, ChevronDown, ChevronUp, Lightbulb, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import type { MockQuestion } from '@/data/mock-questions';
import ExamReview from './ExamReview';

interface SimAnswer {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  difficulty: string;
  sectionId: string;
  sectionName: string;
  topic: string;
  usedHint: boolean;
  flagged: boolean;
}

interface SimulationSummaryProps {
  answers: SimAnswer[];
  questions: MockQuestion[];
  totalQuestions: number;
  totalTimeSeconds: number;
  hintsUsed: Record<string, string>;
}

export default function SimulationSummary({ answers, questions, totalQuestions, totalTimeSeconds, hintsUsed }: SimulationSummaryProps) {
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);

  const correctCount = answers.filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / Math.max(totalQuestions, 1)) * 100);
  const isGood = scorePercent >= 60;
  const scoreColor = scorePercent >= 70 ? 'text-saris-success' : scorePercent >= 45 ? 'text-saris-warning' : 'text-saris-danger';

  const avgTimeSec = totalQuestions > 0 ? Math.round(totalTimeSeconds / totalQuestions) : 0;
  const speedRating = avgTimeSec < 25 ? 'سريع' : avgTimeSec < 45 ? 'متوسط' : 'بطيء';
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

  // Topics
  const topicMap: Record<string, { correct: number; total: number }> = {};
  for (const a of answers) {
    if (!topicMap[a.topic]) topicMap[a.topic] = { correct: 0, total: 0 };
    topicMap[a.topic].total++;
    if (a.isCorrect) topicMap[a.topic].correct++;
  }
  const weakTopics = Object.entries(topicMap).filter(([, p]) => p.total >= 2 && p.correct / p.total < 0.5).map(([t]) => t);
  const strongTopics = Object.entries(topicMap).filter(([, p]) => p.total >= 2 && p.correct / p.total >= 0.7).map(([t]) => t);

  const hintCount = Object.keys(hintsUsed).length;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (showReview) {
    return <ExamReview answers={answers} questions={questions} hintsUsed={hintsUsed} onBack={() => setShowReview(false)} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background px-4 py-6 pb-10">
      <div className="max-w-[430px] mx-auto space-y-4">
        {/* Hero Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-card)] text-center"
        >
          {isGood ? (
            <>
              <Trophy className="w-12 h-12 text-saris-success mx-auto mb-3" />
              <p className="font-tajawal font-bold text-lg text-foreground mb-1">مبروك! اجتزت الاختبار 🎉</p>
            </>
          ) : (
            <>
              <Target className="w-12 h-12 text-destructive mx-auto mb-3" />
              <p className="font-tajawal font-bold text-lg text-foreground mb-1">لم تجتز الاختبار</p>
            </>
          )}
          <p className={`font-inter font-black text-5xl ${scoreColor}`}>
            {scorePercent}<span className="text-xl text-muted-foreground">%</span>
          </p>
          <p className="font-tajawal text-sm text-muted-foreground mt-1">{correctCount} من {totalQuestions} إجابة صحيحة</p>
          <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-saris-purple/10 text-saris-purple">
            ×3 وزن التأثير على درجتك المتوقعة
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'الدقة', value: `${scorePercent}%`, sub: accuracyRating, icon: BarChart3, color: 'text-saris-info' },
            { label: 'السرعة', value: `${avgTimeSec}ث`, sub: speedRating, icon: Zap, color: 'text-saris-warning' },
            { label: 'الوقت الكلي', value: formatTime(totalTimeSeconds), sub: '', icon: Clock, color: 'text-primary' },
            { label: 'تلميحات', value: `${hintCount}`, sub: '', icon: Lightbulb, color: 'text-saris-purple' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-card rounded-xl border border-border p-3 shadow-[var(--shadow-card)]"
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
          className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-tajawal font-bold text-sm text-foreground">نتائج الأقسام</h3>
          </div>
          <div className="space-y-3">
            {sections.map(sec => {
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
          className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)]"
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
            className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)] space-y-3"
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
          <button onClick={() => setShowReview(true)} className="w-full flex items-center justify-center gap-2 border border-border bg-card text-foreground font-tajawal font-bold text-sm rounded-xl h-10">
            <Eye className="w-4 h-4" />
            مراجعة الإجابات
          </button>
          <button onClick={() => navigate('/app')} className="w-full text-muted-foreground font-tajawal text-sm rounded-xl h-10 flex items-center justify-center gap-1">
            <Home className="w-4 h-4" /> العودة للرئيسية
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
