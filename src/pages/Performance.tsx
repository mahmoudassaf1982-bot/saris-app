import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, Trophy, TrendingUp, Brain, ClipboardCheck, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, AlertTriangle, Zap, BarChart3 } from "lucide-react";
import { mockStats, mockDNA, mockSkills, mockRecommendations, mockRecentSessions, dnaStageLabels, mockDNAHistory, mockPredictedScore } from "@/data/mock-data";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const tabs = ["نظرة عامة", "الدرجة المتوقعة", "بصمة التعلم", "خريطة المهارات", "التوصيات", "سجل التدريبات"];

const chartData = mockRecentSessions.slice().reverse().map((s, i) => ({ name: `${i + 1}`, score: s.score }));

const Performance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [sessionFilter, setSessionFilter] = useState<string>("all");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const filteredSessions = mockRecentSessions.filter((s) => {
    if (sessionFilter === "all") return true;
    if (sessionFilter === "smart_training") return s.type === "smart_training";
    if (sessionFilter === "simulation") return s.type === "simulation";
    return true;
  });

  const getSkillColor = (score: number) => score >= 70 ? "bg-saris-success" : score >= 40 ? "bg-saris-warning" : "bg-saris-danger";
  const getSkillTextColor = (score: number) => score >= 70 ? "text-saris-success" : score >= 40 ? "text-saris-warning" : "text-saris-danger";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-tajawal font-bold text-[22px] text-saris-text">ملف الأداء</h1>
        <span className="flex items-center gap-1 text-xs font-tajawal text-saris-success">🟢 يتحدث تلقائياً</span>
      </div>
      <p className="font-tajawal text-[13px] text-saris-text-2 mb-4">تحليل شامل لأدائك وتوصيات التحسين</p>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-saris-full font-tajawal text-xs transition-all ${
              activeTab === i ? "bg-saris-navy text-white font-bold" : "bg-saris-bg-card text-saris-text-2 border border-saris-border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0 - Overview */}
      {activeTab === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: BookOpen, label: "إجمالي الجلسات", value: mockStats.completedSessions, color: "text-saris-navy" },
              { icon: Target, label: "متوسط الأداء", value: `${mockStats.averageScore}%`, color: "text-saris-orange" },
              { icon: Trophy, label: "أفضل نتيجة", value: `${mockStats.bestScore}%`, color: "text-saris-success" },
            ].map((stat, i) => (
              <div key={i} className="bg-saris-bg-card rounded-saris-lg p-3 border border-saris-border text-center">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <p className="font-inter font-bold text-lg text-saris-text">{stat.value}</p>
                <p className="font-tajawal text-[10px] text-saris-text-3">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
            <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">اتجاه الأداء</h3>
            <div className="h-[160px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--saris-navy))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--saris-orange))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="font-tajawal text-xs text-saris-success mt-2">أداؤك يتحسن بشكل ملحوظ في الجلسات الأخيرة 📈</p>
          </div>
        </motion.div>
      )}

      {/* Tab 1 - Predicted Score */}
      {activeTab === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Circular score display */}
          <div className="bg-saris-bg-card rounded-saris-lg p-6 border border-saris-border text-center">
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--saris-border))" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--saris-warning))" strokeWidth="8" strokeDasharray={`${mockPredictedScore.confidence * 2.64} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-inter font-extrabold text-2xl text-saris-text">{mockPredictedScore.low} — {mockPredictedScore.high}</span>
                <span className="font-tajawal text-xs text-saris-text-3">الدرجة المتوقعة</span>
              </div>
            </div>
            <span className="inline-block bg-saris-warning/10 text-saris-warning rounded-saris-full px-3 py-1 font-tajawal text-xs font-bold">
              مستوى الجاهزية: {mockPredictedScore.readinessAr}
            </span>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-tajawal text-xs text-saris-text-2">الثقة</span>
                <span className="font-inter text-xs font-bold text-saris-text">{mockPredictedScore.confidence}%</span>
              </div>
              <div className="w-full h-1.5 bg-saris-border rounded-full">
                <div className="h-full bg-saris-navy rounded-full" style={{ width: `${mockPredictedScore.confidence}%` }} />
              </div>
            </div>
          </div>

          {/* Factor breakdown */}
          <div className="space-y-3">
            {[
              { label: "الدقة", value: mockPredictedScore.factors.accuracy },
              { label: "التعامل مع الصعوبة", value: mockPredictedScore.factors.difficultyHandling },
              { label: "كفاءة الوقت", value: mockPredictedScore.factors.timeEfficiency },
              { label: "اتجاه الأداء", value: mockPredictedScore.factors.consistencyTrend },
            ].map((f, i) => (
              <div key={i} className="bg-saris-bg-card rounded-saris-md p-3 border border-saris-border">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-tajawal text-sm text-saris-text">{f.label}</span>
                  <span className="font-inter text-sm font-bold text-saris-text">{f.value}%</span>
                </div>
                <div className="w-full h-2 bg-saris-border rounded-full">
                  <div className={`h-full rounded-full ${f.value >= 70 ? "bg-saris-success" : f.value >= 50 ? "bg-saris-warning" : "bg-saris-danger"}`} style={{ width: `${f.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="bg-saris-danger/5 rounded-saris-md p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-saris-danger flex-shrink-0" />
              <span className="font-tajawal text-xs text-saris-text">أقسام تحتاج تحسين: {mockPredictedScore.weakSections.join("، ")}</span>
            </div>
            <div className="bg-saris-success/5 rounded-saris-md p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-saris-success flex-shrink-0" />
              <span className="font-tajawal text-xs text-saris-text">أقسام قوية: {mockPredictedScore.strongSections.join("، ")}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2 - DNA */}
      {activeTab === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-saris-bg-card rounded-saris-lg p-6 border border-saris-border text-center">
            <div className="w-16 h-16 rounded-saris-full gradient-primary flex items-center justify-center mx-auto mb-3">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-tajawal font-bold text-[28px] text-saris-text">{mockDNA.typeAr}</h2>
            <p className="font-inter text-xs text-saris-text-3 mb-2">{mockDNA.type}</p>
            <p className="font-tajawal text-sm text-saris-text-2 mb-3">{mockDNA.description}</p>
            <span className="inline-block bg-saris-success/10 text-saris-success rounded-saris-full px-3 py-1 font-tajawal text-xs font-bold">
              📈 {mockDNA.trendAr}
            </span>
          </div>

          {/* Evolution stage */}
          <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
            <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">مرحلة التطور</h3>
            <div className="flex items-center gap-1 mb-2">
              {dnaStageLabels.map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i < mockDNA.stage ? "bg-saris-navy" : "bg-saris-border"}`} />
              ))}
            </div>
            <div className="flex justify-between">
              {dnaStageLabels.map((label, i) => (
                <span key={i} className={`font-tajawal text-[9px] ${i < mockDNA.stage ? "text-saris-navy font-bold" : "text-saris-text-3"}`}>{label}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-tajawal text-xs text-saris-text-2">الثقة</span>
              <span className="font-inter text-xs font-bold text-saris-text">{mockDNA.confidence}%</span>
            </div>
            <div className="w-full h-1.5 bg-saris-border rounded-full mt-1">
              <div className="h-full bg-saris-orange rounded-full" style={{ width: `${mockDNA.confidence}%` }} />
            </div>
          </div>

          {/* DNA History */}
          <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
            <h3 className="font-tajawal font-bold text-sm text-saris-text mb-3">تاريخ البصمة</h3>
            <div className="space-y-2">
              {mockDNAHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-saris-bg rounded-saris-sm px-3 py-2">
                  <span className="font-tajawal text-xs text-saris-text">الجلسة {h.session}: {h.typeAr} ← {h.direction}</span>
                  <span className="font-inter text-[10px] text-saris-text-3">{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3 - Skill Map */}
      {activeTab === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
            <h3 className="font-tajawal font-bold text-sm text-saris-text mb-4">مستوى المهارات</h3>
            <div className="space-y-4">
              {mockSkills.map((skill, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-tajawal text-sm text-saris-text">{skill.name}</span>
                    <span className={`font-inter text-sm font-bold ${getSkillTextColor(skill.score)}`}>{skill.score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-saris-border rounded-full">
                    <div className={`h-full rounded-full ${getSkillColor(skill.score)}`} style={{ width: `${skill.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strong skills */}
          <div>
            <h3 className="font-tajawal font-bold text-sm text-saris-text mb-2">✅ أقوى مهاراتك</h3>
            {mockSkills.filter(s => s.score >= 70).map((skill, i) => (
              <div key={i} className="bg-saris-success/5 rounded-saris-md p-3 border border-saris-success/20 mb-2">
                <span className="font-tajawal text-sm text-saris-text">{skill.name} — {skill.score}%</span>
              </div>
            ))}
          </div>

          {/* Weak skills */}
          <div>
            <h3 className="font-tajawal font-bold text-sm text-saris-text mb-2">⚠️ مهارات تحتاج تحسين</h3>
            {mockSkills.filter(s => s.score < 40).map((skill, i) => (
              <div key={i} className="bg-saris-danger/5 rounded-saris-md p-3 border border-saris-danger/20 mb-2 flex items-center justify-between">
                <span className="font-tajawal text-sm text-saris-text">{skill.name} — {skill.score}%</span>
                <button onClick={() => navigate("/app/adaptive-training/mock-rec-" + i)} className="bg-saris-danger text-white font-tajawal text-xs font-bold rounded-saris-sm px-3 py-1">
                  ابدأ تدريب مركّز
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab 4 - Recommendations */}
      {activeTab === 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {mockRecommendations.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-saris-bg-card rounded-saris-lg p-4 border border-saris-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-saris-orange/10 text-saris-orange px-2 py-0.5 rounded-saris-full font-tajawal text-[11px] font-bold">تدريب مركّز</span>
                <span className="bg-saris-bg text-saris-text-3 px-2 py-0.5 rounded-saris-full font-tajawal text-[11px]">{rec.difficulty}</span>
              </div>
              <h4 className="font-tajawal font-bold text-sm text-saris-text mb-1">{rec.title}</h4>
              <p className="font-tajawal text-xs text-saris-text-2 mb-3">{rec.reason}</p>

              {/* Progress */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-inter text-xs font-bold text-saris-danger">{rec.currentScore}%</span>
                <div className="flex-1 h-2 bg-saris-border rounded-full relative">
                  <div className="h-full bg-saris-danger rounded-full" style={{ width: `${rec.currentScore}%` }} />
                  <div className="absolute top-0 h-full border-r-2 border-dashed border-saris-success" style={{ left: `${rec.targetScore}%` }} />
                </div>
                <span className="font-inter text-xs font-bold text-saris-success">هدف {rec.targetScore}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-tajawal text-xs text-saris-text-3 flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.duration}</span>
                <button onClick={() => navigate(`/app/adaptive-training/mock-rec-${i + 1}`)} className="bg-saris-orange text-white font-tajawal font-bold text-xs rounded-saris-md px-4 py-2">
                  ابدأ التدريب
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tab 5 - Session History */}
      {activeTab === 5 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Filter */}
          <div className="flex gap-2 mb-4">
            {[
              { key: "all", label: "الكل" },
              { key: "smart_training", label: "تدريب ذكي" },
              { key: "simulation", label: "محاكاة" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSessionFilter(f.key)}
                className={`px-3 py-1.5 rounded-saris-full font-tajawal text-xs transition-all ${
                  sessionFilter === f.key ? "bg-saris-navy text-white font-bold" : "bg-saris-bg-card text-saris-text-2 border border-saris-border"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <div key={session.id} className="bg-saris-bg-card rounded-saris-lg border border-saris-border overflow-hidden">
                <button
                  onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                  className="w-full p-4 text-right"
                  aria-label={`تفاصيل ${session.examName}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {session.type === "simulation" ? (
                        <ClipboardCheck className="w-5 h-5 text-saris-navy flex-shrink-0 mt-0.5" />
                      ) : (
                        <Brain className="w-5 h-5 text-saris-orange flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`inline-block text-[10px] font-tajawal font-bold px-2 py-0.5 rounded-saris-full mb-1 ${
                          session.type === "simulation" ? "bg-saris-navy/10 text-saris-navy" : "bg-saris-orange/10 text-saris-orange"
                        }`}>
                          {session.type === "simulation" ? "محاكاة رسمية" : "تدريب ذكي"}
                        </span>
                        <p className="font-tajawal text-sm text-saris-text">{session.examName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="font-inter text-[10px] text-saris-text-3">{session.date}</span>
                          <span className="font-tajawal text-[10px] text-saris-text-3 flex items-center gap-0.5"><Clock className="w-3 h-3" /> {session.duration} د</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-left">
                        <span className={`font-inter font-bold text-lg ${session.passed ? "text-saris-success" : "text-saris-danger"}`}>{session.score}%</span>
                        <span className={`block text-[10px] font-tajawal ${session.passed ? "text-saris-success" : "text-saris-danger"}`}>
                          {session.passed ? "ناجح" : "راسب"}
                        </span>
                      </div>
                      {expandedSession === session.id ? <ChevronUp className="w-4 h-4 text-saris-text-3" /> : <ChevronDown className="w-4 h-4 text-saris-text-3" />}
                    </div>
                  </div>
                </button>

                {expandedSession === session.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4 border-t border-saris-border pt-3 space-y-3">
                    <div className="flex gap-3 text-xs font-tajawal text-saris-text-2">
                      <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-saris-success" /> صحيحة: {session.correct}</span>
                      <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-saris-danger" /> خاطئة: {session.wrong}</span>
                      <span>من: {session.total}</span>
                    </div>

                    {session.sections.map((sec, si) => (
                      <div key={si}>
                        <div className="flex justify-between mb-0.5">
                          <span className="font-tajawal text-xs text-saris-text">{sec.name}</span>
                          <span className="font-inter text-xs font-bold">{sec.score}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-saris-border rounded-full">
                          <div className={`h-full rounded-full ${sec.score >= 70 ? "bg-saris-success" : sec.score >= 40 ? "bg-saris-warning" : "bg-saris-danger"}`} style={{ width: `${sec.score}%` }} />
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-3 text-xs font-tajawal text-saris-text-2">
                      <span>سهل: {session.difficulty.easy.correct}/{session.difficulty.easy.total}</span>
                      <span>متوسط: {session.difficulty.medium.correct}/{session.difficulty.medium.total}</span>
                      <span>صعب: {session.difficulty.hard.correct}/{session.difficulty.hard.total}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-tajawal text-xs text-saris-text-2">القدرة: <b className="text-saris-text">{session.abilityEstimate}</b></span>
                      <span className="font-tajawal text-xs text-saris-text-2 flex items-center gap-1"><Zap className="w-3 h-3" /> {session.speedRating}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Performance;
