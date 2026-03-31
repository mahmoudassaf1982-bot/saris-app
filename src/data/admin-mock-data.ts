// Admin Mock Data
const arabicFirstNames = ["أحمد", "محمد", "عبدالله", "سارة", "فاطمة", "نورة", "خالد", "عمر", "ليلى", "مريم", "يوسف", "حسن", "علي", "رنا", "دانة", "سلمان", "فيصل", "هند", "لمى", "جاسم", "بدر", "منيرة", "عائشة", "سعود", "ناصر", "ريم", "لطيفة", "طارق", "زينب", "حمد", "عبدالرحمن", "نوف", "مها", "تركي", "بندر", "غادة", "هيا", "ماجد", "وليد", "أمل", "سلطان", "مشاري", "شيخة", "دلال", "صالح", "راشد", "موضي", "حصة", "جواهر", "ثامر"];
const arabicLastNames = ["العلي", "المحمد", "الأحمد", "السالم", "العبدالله", "الخالد", "الفهد", "الراشد", "الناصر", "الحمد", "العمر", "الصالح", "الماجد", "البدر", "السعود", "التركي", "الجاسم", "الحسن", "اليوسف", "الفيصل"];
const countries = ["الكويت", "السعودية", "الأردن"];
const countryFlags = ["🇰🇼", "🇸🇦", "🇯🇴"];
const exams = ["اختبار القدرات الأكاديمية", "اختبار القدرات العامة (قدرات)", "اختبار الثانوية العامة (التوجيهي)"];
const statuses = ["active", "inactive", "suspended"] as const;

export const mockAdminStudents = Array.from({ length: 50 }, (_, i) => {
  const ci = i % 3;
  return {
    id: `stu_${String(i + 1).padStart(3, "0")}`,
    firstName: arabicFirstNames[i],
    lastName: arabicLastNames[i % 20],
    email: `student${i + 1}@gmail.com`,
    country: countries[ci],
    countryFlag: countryFlags[ci],
    exam: exams[ci],
    balance: Math.floor(Math.random() * 200),
    lastActive: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString().split("T")[0],
    status: statuses[i < 40 ? 0 : i < 46 ? 1 : 2],
    sessionsCount: Math.floor(Math.random() * 50),
    avgScore: Math.floor(Math.random() * 60) + 30,
    createdAt: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString().split("T")[0],
    isDiamond: i < 5,
  };
});

export const mockAdminKPIs = {
  totalStudents: 1247,
  activeStudents7d: 342,
  revenue: 8450,
  todaySessions: 89,
  totalQuestions: 2340,
  approvedQuestions: 1980,
  pendingQuestions: 210,
  rejectedQuestions: 150,
};

export const mockAdminDailySessions = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
  sessions: Math.floor(Math.random() * 80) + 20,
  registrations: Math.floor(Math.random() * 15) + 2,
}));

export const mockAdminActivity = [
  { id: "a1", type: "registration" as const, text: "تسجيل جديد: سارة العبدالله", time: "منذ 5 دقائق" },
  { id: "a2", type: "purchase" as const, text: "شراء باقة 150 نقطة — أحمد المحمد", time: "منذ 12 دقيقة" },
  { id: "a3", type: "session" as const, text: "جلسة محاكاة مكتملة — خالد الفهد (78%)", time: "منذ 20 دقيقة" },
  { id: "a4", type: "registration" as const, text: "تسجيل جديد: منيرة الراشد", time: "منذ 35 دقيقة" },
  { id: "a5", type: "session" as const, text: "جلسة تدريب ذكي مكتملة — عمر الناصر (62%)", time: "منذ 45 دقيقة" },
  { id: "a6", type: "purchase" as const, text: "اشتراك Diamond — فاطمة السالم", time: "منذ ساعة" },
  { id: "a7", type: "session" as const, text: "جلسة تدريب ذكي مكتملة — يوسف الحمد (55%)", time: "منذ ساعتين" },
  { id: "a8", type: "registration" as const, text: "تسجيل جديد: ليلى العمر", time: "منذ 3 ساعات" },
];

export const mockAdminExams = [
  {
    id: "adm_exam_1",
    code: "KW-QAA",
    name: "اختبار القدرات الأكاديمية",
    country: "🇰🇼 الكويت",
    totalQuestions: 850,
    sections: [
      { name: "الجبر والهندسة", questions: 280, target: 300 },
      { name: "الإحصاء والاحتمالات", questions: 190, target: 250 },
      { name: "الدوال واللوغاريتمات", questions: 210, target: 250 },
      { name: "الهندسة وحساب المثلثات", questions: 170, target: 200 },
    ],
    ready: true,
  },
  {
    id: "adm_exam_2",
    code: "SA-QUD",
    name: "اختبار القدرات العامة (قدرات)",
    country: "🇸🇦 السعودية",
    totalQuestions: 420,
    sections: [
      { name: "الكمي", questions: 220, target: 300 },
      { name: "اللفظي", questions: 200, target: 300 },
    ],
    ready: false,
  },
];

export const mockAdminQuestions = Array.from({ length: 30 }, (_, i) => ({
  id: `q_adm_${i + 1}`,
  preview: `سؤال رقم ${i + 1} — ${["ما هو ناتج", "أوجد قيمة", "إذا كان", "احسب", "حدد"][i % 5]} ...`,
  exam: i < 20 ? "القدرات الأكاديمية" : "القدرات العامة",
  section: ["الجبر", "الإحصاء", "الدوال", "الهندسة"][i % 4],
  difficulty: (["easy", "medium", "hard"] as const)[i % 3],
  status: (["approved", "pending", "rejected"] as const)[i < 20 ? 0 : i < 26 ? 1 : 2],
  createdAt: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString().split("T")[0],
  source: i < 15 ? "manual" : "ai" as const,
}));

export const mockAIJobs = [
  { id: "job_1", exam: "القدرات الأكاديمية", section: "الجبر والهندسة", difficulty: "medium", count: 20, status: "completed" as const, created: "2025-03-28", completed: "2025-03-28", approved: 18, rejected: 2 },
  { id: "job_2", exam: "القدرات الأكاديمية", section: "الإحصاء", difficulty: "hard", count: 15, status: "completed" as const, created: "2025-03-27", completed: "2025-03-27", approved: 12, rejected: 3 },
  { id: "job_3", exam: "القدرات العامة", section: "الكمي", difficulty: "easy", count: 25, status: "running" as const, created: "2025-03-29", completed: null, approved: 0, rejected: 0 },
  { id: "job_4", exam: "القدرات الأكاديمية", section: "الدوال", difficulty: "medium", count: 20, status: "pending" as const, created: "2025-03-29", completed: null, approved: 0, rejected: 0 },
  { id: "job_5", exam: "القدرات الأكاديمية", section: "الهندسة", difficulty: "hard", count: 10, status: "failed" as const, created: "2025-03-26", completed: "2025-03-26", approved: 0, rejected: 0 },
  { id: "job_6", exam: "القدرات العامة", section: "اللفظي", difficulty: "medium", count: 30, status: "completed" as const, created: "2025-03-25", completed: "2025-03-25", approved: 27, rejected: 3 },
  { id: "job_7", exam: "القدرات الأكاديمية", section: "الجبر", difficulty: "easy", count: 20, status: "completed" as const, created: "2025-03-24", completed: "2025-03-24", approved: 20, rejected: 0 },
  { id: "job_8", exam: "القدرات العامة", section: "الكمي", difficulty: "hard", count: 15, status: "running" as const, created: "2025-03-29", completed: null, approved: 0, rejected: 0 },
  { id: "job_9", exam: "القدرات الأكاديمية", section: "الإحصاء", difficulty: "easy", count: 25, status: "pending" as const, created: "2025-03-29", completed: null, approved: 0, rejected: 0 },
  { id: "job_10", exam: "القدرات الأكاديمية", section: "الدوال", difficulty: "hard", count: 10, status: "completed" as const, created: "2025-03-23", completed: "2025-03-23", approved: 8, rejected: 2 },
];

export const mockBankHealth = [
  {
    exam: "القدرات الأكاديمية",
    sections: [
      { name: "الجبر والهندسة", easy: { count: 100, target: 100 }, medium: { count: 120, target: 150 }, hard: { count: 60, target: 80 } },
      { name: "الإحصاء والاحتمالات", easy: { count: 70, target: 100 }, medium: { count: 80, target: 120 }, hard: { count: 40, target: 60 } },
      { name: "الدوال واللوغاريتمات", easy: { count: 80, target: 100 }, medium: { count: 90, target: 120 }, hard: { count: 40, target: 60 } },
      { name: "الهندسة وحساب المثلثات", easy: { count: 60, target: 80 }, medium: { count: 70, target: 100 }, hard: { count: 40, target: 50 } },
    ],
  },
  {
    exam: "القدرات العامة (قدرات)",
    sections: [
      { name: "الكمي", easy: { count: 80, target: 120 }, medium: { count: 90, target: 150 }, hard: { count: 50, target: 80 } },
      { name: "اللفظي", easy: { count: 70, target: 100 }, medium: { count: 80, target: 120 }, hard: { count: 50, target: 70 } },
    ],
  },
];

export const mockAIMonitoring = {
  provider: "Claude 3.5 Sonnet",
  status: "operational" as const,
  totalCalls: 1247,
  errorRate: 2.1,
  avgLatency: 3.2,
  totalTokens: 2450000,
  costUSD: 48.5,
  dailyCalls: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split("T")[0],
    calls: Math.floor(Math.random() * 200) + 50,
    errors: Math.floor(Math.random() * 10),
    tokens: Math.floor(Math.random() * 500000) + 100000,
  })),
};

export const mockAdminSettings = {
  maintenanceMode: false,
  registrationOpen: true,
  defaultPoints: 20,
  trainingCost: 5,
  simulationCost: 10,
  bankThreshold: 100,
};

export const mockPointsPacks = [
  { id: "pp1", name: "الأساسية", points: 50, price: 2.99, active: true },
  { id: "pp2", name: "المتقدمة", points: 150, price: 6.99, active: true, popular: true },
  { id: "pp3", name: "الاحترافية", points: 400, price: 14.99, active: true },
  { id: "pp4", name: "المطلقة", points: 1000, price: 29.99, active: true },
];

export const mockSubscriptionPlans = [
  { id: "plan_1", name: "Diamond", priceMonthly: 9.99, priceYearly: 89.99, features: ["جلسات غير محدودة", "تلميحات ذكية مجانية", "تحليل متقدم", "أولوية الدعم"], active: true, subscribers: 48 },
];
