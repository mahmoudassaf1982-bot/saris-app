export const mockUser = {
  id: "usr_001",
  firstName: "أحمد",
  lastName: "محمد",
  email: "ahmed@example.com",
  balance: 25,
  isAdmin: true,
  isDiamond: false,
  country: "الكويت",
  countryFlag: "🇰🇼",
  examTemplate: "اختبار القدرات الأكاديمية",
  createdAt: "2024-11-01",
  referralCode: "AHMED2024",
  signupBonus: 50,
};

export const mockStats = {
  balance: 25,
  completedSessions: 12,
  totalSessions: 20,
  passRate: 58,
  passCount: 7,
  totalGraded: 12,
  averageScore: 67,
  bestScore: 81,
};

export const mockDNA = {
  type: "balanced" as const,
  typeAr: "المتوازن",
  trend: "improving" as const,
  trendAr: "تحسّن",
  stage: 2,
  confidence: 65,
  description: "توازن جيد بين السرعة والدقة",
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

export const dnaStageLabels = ["المبتدئ", "المتعلم", "المتقدم", "الخبير", "المتقن"];

export const mockSkills = [
  { name: "الجبر والهندسة", score: 72 },
  { name: "الإحصاء والاحتمالات", score: 12 },
  { name: "الدوال واللوغاريتمات", score: 38 },
  { name: "الهندسة وحساب المثلثات", score: 45 },
];

export const mockRecommendations = [
  {
    id: "rec_1",
    title: "تدريب مركّز: الإحصاء",
    section: "الإحصاء والاحتمالات",
    type: "focused_skill" as const,
    currentScore: 12,
    targetScore: 70,
    sectionId: "sec_stats",
    difficulty: "سهل",
    duration: "10 دقائق",
    reason: "لأن دقتك في الإحصاء والاحتمالات هي 12% فقط.",
  },
  {
    id: "rec_2",
    title: "تدريب مركّز: الدوال واللوغاريتمات",
    section: "الدوال واللوغاريتمات",
    type: "focused_skill" as const,
    currentScore: 38,
    targetScore: 70,
    sectionId: "sec_func",
    difficulty: "متوسط",
    duration: "12 دقيقة",
    reason: "لم تحقق تقدم كافٍ في هذا القسم",
  },
  {
    id: "rec_3",
    title: "تدريب مركّز: الهندسة وحساب المثلثات",
    section: "الهندسة وحساب المثلثات",
    type: "focused_skill" as const,
    currentScore: 45,
    targetScore: 70,
    sectionId: "sec_geo",
    difficulty: "متوسط",
    duration: "10 دقائق",
    reason: "مهارات الهندسة أقل من المستوى المطلوب",
  },
];

export const mockRecentSessions = [
  { id: "s1", examName: "القدرات الأكاديمية — محاكاة #5", date: "2025-03-20", score: 81, passed: true, type: "simulation" as const, correct: 12, wrong: 3, total: 15, duration: 55, sections: [{ name: "الجبر", score: 90 }, { name: "الإحصاء", score: 60 }, { name: "الدوال", score: 80 }, { name: "الهندسة", score: 85 }], difficulty: { easy: { correct: 5, total: 6 }, medium: { correct: 5, total: 6 }, hard: { correct: 2, total: 3 } }, abilityEstimate: 72, speedRating: "متوسط" as const },
  { id: "s2", examName: "تدريب ذكي — الجبر", date: "2025-03-18", score: 55, passed: false, type: "smart_training" as const, correct: 8, wrong: 7, total: 15, duration: 12, sections: [{ name: "الجبر", score: 55 }], difficulty: { easy: { correct: 4, total: 5 }, medium: { correct: 3, total: 6 }, hard: { correct: 1, total: 4 } }, abilityEstimate: 48, speedRating: "سريع" as const },
  { id: "s3", examName: "القدرات الأكاديمية — محاكاة #4", date: "2025-03-15", score: 68, passed: true, type: "simulation" as const, correct: 10, wrong: 5, total: 15, duration: 50, sections: [{ name: "الجبر", score: 75 }, { name: "الإحصاء", score: 50 }, { name: "الدوال", score: 70 }, { name: "الهندسة", score: 65 }], difficulty: { easy: { correct: 6, total: 6 }, medium: { correct: 3, total: 6 }, hard: { correct: 1, total: 3 } }, abilityEstimate: 62, speedRating: "متوسط" as const },
  { id: "s4", examName: "تدريب ذكي — الإحصاء", date: "2025-03-12", score: 45, passed: false, type: "smart_training" as const, correct: 7, wrong: 8, total: 15, duration: 14, sections: [{ name: "الإحصاء", score: 45 }], difficulty: { easy: { correct: 4, total: 5 }, medium: { correct: 2, total: 6 }, hard: { correct: 1, total: 4 } }, abilityEstimate: 40, speedRating: "بطيء" as const },
  { id: "s5", examName: "القدرات الأكاديمية — محاكاة #3", date: "2025-03-10", score: 72, passed: true, type: "simulation" as const, correct: 11, wrong: 4, total: 15, duration: 52, sections: [{ name: "الجبر", score: 80 }, { name: "الإحصاء", score: 55 }, { name: "الدوال", score: 75 }, { name: "الهندسة", score: 70 }], difficulty: { easy: { correct: 6, total: 6 }, medium: { correct: 4, total: 6 }, hard: { correct: 1, total: 3 } }, abilityEstimate: 65, speedRating: "سريع" as const },
  { id: "s6", examName: "تدريب ذكي — الدوال", date: "2025-03-08", score: 60, passed: true, type: "smart_training" as const, correct: 9, wrong: 6, total: 15, duration: 11, sections: [{ name: "الدوال", score: 60 }], difficulty: { easy: { correct: 5, total: 5 }, medium: { correct: 3, total: 6 }, hard: { correct: 1, total: 4 } }, abilityEstimate: 55, speedRating: "متوسط" as const },
  { id: "s7", examName: "تدريب ذكي — الهندسة", date: "2025-03-06", score: 50, passed: false, type: "smart_training" as const, correct: 7, wrong: 8, total: 15, duration: 13, sections: [{ name: "الهندسة", score: 50 }], difficulty: { easy: { correct: 4, total: 5 }, medium: { correct: 2, total: 6 }, hard: { correct: 1, total: 4 } }, abilityEstimate: 45, speedRating: "بطيء" as const },
  { id: "s8", examName: "القدرات الأكاديمية — محاكاة #2", date: "2025-03-04", score: 58, passed: false, type: "simulation" as const, correct: 9, wrong: 6, total: 15, duration: 56, sections: [{ name: "الجبر", score: 65 }, { name: "الإحصاء", score: 40 }, { name: "الدوال", score: 60 }, { name: "الهندسة", score: 55 }], difficulty: { easy: { correct: 5, total: 6 }, medium: { correct: 3, total: 6 }, hard: { correct: 1, total: 3 } }, abilityEstimate: 52, speedRating: "متوسط" as const },
  { id: "s9", examName: "تدريب ذكي — الجبر", date: "2025-03-02", score: 65, passed: true, type: "smart_training" as const, correct: 10, wrong: 5, total: 15, duration: 10, sections: [{ name: "الجبر", score: 65 }], difficulty: { easy: { correct: 5, total: 5 }, medium: { correct: 4, total: 6 }, hard: { correct: 1, total: 4 } }, abilityEstimate: 58, speedRating: "سريع" as const },
  { id: "s10", examName: "تدريب ذكي — الإحصاء", date: "2025-02-28", score: 35, passed: false, type: "smart_training" as const, correct: 5, wrong: 10, total: 15, duration: 15, sections: [{ name: "الإحصاء", score: 35 }], difficulty: { easy: { correct: 3, total: 5 }, medium: { correct: 2, total: 6 }, hard: { correct: 0, total: 4 } }, abilityEstimate: 30, speedRating: "بطيء" as const },
  { id: "s11", examName: "تدريب ذكي — الدوال", date: "2025-02-25", score: 42, passed: false, type: "smart_training" as const, correct: 6, wrong: 9, total: 15, duration: 12, sections: [{ name: "الدوال", score: 42 }], difficulty: { easy: { correct: 4, total: 5 }, medium: { correct: 2, total: 6 }, hard: { correct: 0, total: 4 } }, abilityEstimate: 38, speedRating: "متوسط" as const },
  { id: "s12", examName: "تدريب ذكي — الهندسة", date: "2025-02-22", score: 40, passed: false, type: "smart_training" as const, correct: 6, wrong: 9, total: 15, duration: 14, sections: [{ name: "الهندسة", score: 40 }], difficulty: { easy: { correct: 4, total: 5 }, medium: { correct: 2, total: 6 }, hard: { correct: 0, total: 4 } }, abilityEstimate: 35, speedRating: "بطيء" as const },
];

export const mockTransactions = [
  { id: "t1", type: "credit" as const, reason: "مكافأة التسجيل", reasonKey: "signup_bonus", date: "2025-02-20", amount: 50 },
  { id: "t2", type: "credit" as const, reason: "إحالة صديق", reasonKey: "referral_bonus", date: "2025-02-25", amount: 25 },
  { id: "t3", type: "credit" as const, reason: "شراء نقاط", reasonKey: "purchase_points", date: "2025-03-05", amount: 20 },
  { id: "t4", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-02-22", amount: -5 },
  { id: "t5", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-02-25", amount: -5 },
  { id: "t6", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-02-28", amount: -5 },
  { id: "t7", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-03-02", amount: -5 },
  { id: "t8", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-03-04", amount: -5 },
  { id: "t9", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-03-06", amount: -5 },
  { id: "t10", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-03-08", amount: -5 },
  { id: "t11", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-03-10", amount: -5 },
  { id: "t12", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-03-12", amount: -5 },
  { id: "t13", type: "debit" as const, reason: "جلسة تدريب ذكي", reasonKey: "practice_session", date: "2025-03-15", amount: -5 },
  { id: "t14", type: "debit" as const, reason: "جلسة محاكاة رسمية", reasonKey: "exam_attempt_session", date: "2025-03-18", amount: -10 },
  { id: "t15", type: "debit" as const, reason: "جلسة محاكاة رسمية", reasonKey: "exam_attempt_session", date: "2025-03-20", amount: -10 },
];

export const mockCountries = [
  { id: "kw", name: "الكويت", flag: "🇰🇼" },
  { id: "sa", name: "السعودية", flag: "🇸🇦" },
  { id: "jo", name: "الأردن", flag: "🇯🇴" },
];

export const mockExamTemplates = [
  {
    id: "exam_1",
    name: "اختبار القدرات الأكاديمية",
    category: "قدرات",
    categoryColor: "bg-saris-info/10 text-saris-info",
    totalQuestions: 45,
    duration: 57,
    sectionCount: 4,
    trainingCost: 5,
    simulationCost: 10,
    dna: { easy: 30, medium: 50, hard: 20 },
    sections: [
      { id: "sec_alg", name: "الجبر والهندسة", questions: 15, time: 20 },
      { id: "sec_stats", name: "الإحصاء والاحتمالات", questions: 12, time: 15 },
      { id: "sec_func", name: "الدوال واللوغاريتمات", questions: 10, time: 12 },
      { id: "sec_geo", name: "الهندسة وحساب المثلثات", questions: 8, time: 10 },
    ],
    hasAnalysis: true,
  },
  {
    id: "exam_2",
    name: "اختبار الرياضيات العامة",
    category: "رياضيات",
    categoryColor: "bg-saris-success/10 text-saris-success",
    totalQuestions: 45,
    duration: 60,
    sectionCount: 3,
    trainingCost: 5,
    simulationCost: 8,
    dna: { easy: 25, medium: 55, hard: 20 },
    sections: [
      { id: "sec_basic", name: "الحساب الأساسي", questions: 20, time: 25 },
      { id: "sec_adv", name: "الجبر المتقدم", questions: 15, time: 20 },
      { id: "sec_ana", name: "الهندسة التحليلية", questions: 10, time: 15 },
    ],
    hasAnalysis: false,
  },
];

export const mockDNAHistory = [
  { session: 12, type: "balanced", typeAr: "المتوازن", direction: "متحسن", date: "2025-03-20" },
  { session: 10, type: "fast_executor", typeAr: "المنفذ السريع", direction: "مستقر", date: "2025-03-15" },
  { session: 8, type: "fast_executor", typeAr: "المنفذ السريع", direction: "متحسن", date: "2025-03-10" },
  { session: 5, type: "cautious", typeAr: "الحذر", direction: "متراجع", date: "2025-03-04" },
  { session: 3, type: "cautious", typeAr: "الحذر", direction: "مستقر", date: "2025-02-28" },
];

export const mockPredictedScore = {
  low: 55,
  high: 68,
  readiness: "medium" as const,
  readinessAr: "متوسط",
  confidence: 72,
  factors: {
    accuracy: 65,
    difficultyHandling: 48,
    timeEfficiency: 70,
    consistencyTrend: 72,
  },
  weakSections: ["الإحصاء والاحتمالات"],
  strongSections: ["الجبر والهندسة"],
};

export const mockGamification = {
  streak: 5,
  dailyGoals: [
    { label: "أكمل جلسة تدريب واحدة", completed: true, progress: 100 },
    { label: "أجب على 20 سؤالاً", completed: true, progress: 100 },
    { label: "حقق دقة 70%+ في جلسة", completed: false, progress: 45 },
  ],
  badges: [
    { id: "b1", name: "البداية", description: "أكمل أول جلسة", icon: "🚀", tier: "bronze" as const, unlocked: true, category: "streak" },
    { id: "b2", name: "نجم الدقة", description: "حقق 90%+ في جلسة", icon: "⭐", tier: "gold" as const, unlocked: true, category: "performance" },
    { id: "b3", name: "100 سؤال", description: "أجب على 100 سؤال", icon: "💯", tier: "silver" as const, unlocked: true, category: "milestone" },
    { id: "b4", name: "مثابر", description: "7 أيام متتالية", icon: "🔥", tier: "silver" as const, unlocked: false, category: "streak" },
    { id: "b5", name: "لا يتوقف", description: "30 يومًا متتاليًا", icon: "💪", tier: "gold" as const, unlocked: false, category: "streak" },
    { id: "b6", name: "سريع البديهة", description: "10 إجابات صحيحة متتالية", icon: "⚡", tier: "silver" as const, unlocked: false, category: "performance" },
    { id: "b7", name: "قاهر الصعب", description: "5 أسئلة صعبة صحيحة", icon: "🏆", tier: "gold" as const, unlocked: false, category: "performance" },
    { id: "b8", name: "500 سؤال", description: "أجب على 500 سؤال", icon: "📚", tier: "gold" as const, unlocked: false, category: "milestone" },
    { id: "b9", name: "خبير", description: "80%+ في جميع الأقسام", icon: "👑", tier: "gold" as const, unlocked: false, category: "milestone" },
  ],
};

export const mockReferralStats = {
  totalReferrals: 3,
  pointsEarned: 75,
  referrals: [
    { id: "r1", maskedName: "م****د", date: "2025-03-10", points: 25 },
    { id: "r2", maskedName: "س****ر", date: "2025-03-05", points: 25 },
    { id: "r3", maskedName: "ع****ي", date: "2025-02-28", points: 25 },
  ],
};

export const mockPointsPacks = [
  { id: "p1", name: "الأساسية", points: 50, price: 2.99, description: "الأنسب للمبتدئين", popular: false },
  { id: "p2", name: "المتقدمة", points: 150, price: 6.99, description: "الأكثر شعبية", popular: true },
  { id: "p3", name: "الاحترافية", points: 400, price: 14.99, description: "قيمة ممتازة", popular: false },
  { id: "p4", name: "المطلقة", points: 1000, price: 29.99, description: "أفضل سعر للنقطة", popular: false },
];

export const mockSupportedExams: Record<string, string[]> = {
  "🇰🇼 الكويت": ["اختبار القدرات الأكاديمية", "اختبار الرياضيات العامة"],
  "🇸🇦 السعودية": ["اختبار القدرات العامة (قدرات)", "اختبار التحصيلي"],
  "🇯🇴 الأردن": ["اختبار الثانوية العامة (التوجيهي)"],
};
