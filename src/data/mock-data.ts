export const mockUser = {
  id: "usr_001",
  firstName: "أحمد",
  lastName: "محمد",
  email: "ahmed@example.com",
  balance: 25,
  isAdmin: true,
  isDiamond: false,
  country: "الكويت",
  examTemplate: "اختبار القدرات العامة",
  createdAt: "2024-11-01",
};

export const mockStats = {
  balance: 25,
  completedSessions: 12,
  totalSessions: 20,
  passRate: 58,
  passCount: 7,
  totalGraded: 12,
  averageScore: 67,
};

export const mockDNA = {
  type: "balanced" as const,
  typeAr: "المتوازن",
  trend: "improving" as const,
  trendAr: "تحسّن",
  stage: 2,
  confidence: 65,
};

export const dnaTypeLabels: Record<string, string> = {
  analytical: "المحلل",
  fast_executor: "المنفذ السريع",
  cautious: "الحذر",
  accuracy_focused: "المركز على الدقة",
  speed_focused: "المركز على السرعة",
  balanced: "المتوازن",
  adaptive: "المتكيف",
};

export const mockSkills = [
  { name: "الجبر والهندسة", score: 72 },
  { name: "الإحصاء والاحتمالات", score: 12 },
  { name: "الدوال واللوغاريتمات", score: 38 },
  { name: "الهندسة وحساب المثلثات", score: 45 },
];

export const mockRecommendations = [
  {
    id: "rec_1",
    title: "تدريب مكثف: الإحصاء",
    section: "الإحصاء والاحتمالات",
    type: "focused_skill",
    currentScore: 0,
    targetScore: 70,
    sectionId: "sec_stats",
  },
  {
    id: "rec_2",
    title: "رفع مستوى الدوال",
    section: "الدوال واللوغاريتمات",
    type: "progressive_path",
    currentScore: 38,
    targetScore: 70,
    sectionId: "sec_func",
  },
  {
    id: "rec_3",
    title: "تحسين الهندسة",
    section: "الهندسة وحساب المثلثات",
    type: "accuracy_drill",
    currentScore: 45,
    targetScore: 70,
    sectionId: "sec_geo",
  },
];

export const mockRecentSessions = [
  { id: "s1", examName: "القدرات العامة — محاكاة #5", date: "2025-03-20", score: 81, passed: true, type: "simulation" as const },
  { id: "s2", examName: "تدريب ذكي — الجبر", date: "2025-03-18", score: 55, passed: false, type: "smart_training" as const },
  { id: "s3", examName: "القدرات العامة — محاكاة #4", date: "2025-03-15", score: 68, passed: true, type: "simulation" as const },
  { id: "s4", examName: "تدريب ذكي — الإحصاء", date: "2025-03-12", score: 45, passed: false, type: "smart_training" as const },
  { id: "s5", examName: "القدرات العامة — محاكاة #3", date: "2025-03-10", score: 72, passed: true, type: "simulation" as const },
];

export const mockTransactions = [
  { id: "t1", type: "credit" as const, reason: "شراء نقاط", date: "2025-03-19", amount: 50 },
  { id: "t2", type: "debit" as const, reason: "جلسة تدريب", date: "2025-03-18", amount: -5 },
  { id: "t3", type: "debit" as const, reason: "جلسة محاكاة", date: "2025-03-15", amount: -10 },
  { id: "t4", type: "credit" as const, reason: "مكافأة تسجيل", date: "2025-03-01", amount: 20 },
  { id: "t5", type: "debit" as const, reason: "تلميح ذكي", date: "2025-03-14", amount: -2 },
];
