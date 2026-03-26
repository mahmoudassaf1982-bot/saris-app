import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, ClipboardCheck, BarChart3, ChevronDown, ChevronUp, X, AlertTriangle, Coins, Bot, TrendingDown, Globe } from "lucide-react";
import { mockExamTemplates, mockUser, mockStats } from "@/data/mock-data";
import { SUPPORTED_LANGUAGES, getLanguageLabel, type ExamLanguage } from "@/services/languageGovernance";
import { buildGenerationPayload, type ExamDNAConfig } from "@/services/generationConfig";

type SessionType = "smart_training" | "simulation";

const Exams = () => {
  const navigate = useNavigate();
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [modalExam, setModalExam] = useState<typeof mockExamTemplates[0] | null>(null);
  const [modalType, setModalType] = useState<SessionType>("smart_training");

  // Persistent exam language overrides — survives modal close/reopen AND page reload
  const STORAGE_KEY = "saris_exam_language_overrides";

  const [examLanguageOverrides, setExamLanguageOverrides] = useState<Record<string, ExamLanguage>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const getExamLanguage = (examId: string, defaultLang: string): ExamLanguage => {
    return examLanguageOverrides[examId] ?? (defaultLang as ExamLanguage);
  };

  const setExamLanguage = (examId: string, lang: ExamLanguage) => {
    setExamLanguageOverrides(prev => {
      const next = { ...prev, [examId]: lang };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetExamLanguage = (examId: string) => {
    setExamLanguageOverrides(prev => {
      const next = { ...prev };
      delete next[examId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const hasLanguageOverride = (examId: string) => examId in examLanguageOverrides;

  const openModal = (exam: typeof mockExamTemplates[0], type: SessionType) => {
    setModalExam(exam);
    setModalType(type);
  };

  const cost = modalExam ? (modalType === "smart_training" ? modalExam.trainingCost : modalExam.simulationCost) : 0;
  const canAfford = mockUser.isDiamond || mockStats.balance >= cost;

  const startSession = () => {
    if (!canAfford || !modalExam) return;

    // Build generation payload from DNA config — this is the real integration point
    const dnaConfig: ExamDNAConfig = {
      examId: modalExam.id,
      examName: modalExam.name,
      examLanguage: getExamLanguage(modalExam.id, modalExam.examLanguage),
      dna: modalExam.dna,
      sections: modalExam.sections.map(s => ({ id: s.id, name: s.name, questions: s.questions })),
    };
    const payload = buildGenerationPayload(dnaConfig);
    console.log('[DNA→Generation] Payload built:', {
      examId: payload.examId,
      language: payload.language,
      directive: payload.languageDirective,
    });
    console.log('[DNA→Generation] System prompt:\n', payload.systemPrompt);

    if (modalType === "smart_training") navigate("/app/adaptive-training/mock-session-1");
    else navigate("/app/exam-session/mock-session-2");
    setModalExam(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-tajawal font-bold text-[22px] text-saris-text mb-1">الاختبارات المتاحة</h1>
      <p className="font-tajawal text-[13px] text-saris-text-2 mb-4">اختر اختبارًا لبدء التدريب أو المحاكاة</p>

      {/* Country filter */}
      <div className="inline-flex items-center gap-1.5 bg-saris-bg-card rounded-saris-full px-3 py-1.5 border border-saris-border mb-5">
        <span className="text-base">{mockUser.countryFlag}</span>
        <span className="font-tajawal text-xs text-saris-text">{mockUser.country}</span>
      </div>

      {/* Exam cards */}
      <div className="space-y-4">
        {mockExamTemplates.map((exam, idx) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-saris-bg-card rounded-saris-lg border border-saris-border shadow-card overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-tajawal font-bold text-base text-saris-text">{exam.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-saris-full font-tajawal text-xs ${exam.categoryColor}`}>
                      {exam.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-saris-full font-tajawal text-xs bg-saris-purple/10 text-saris-purple">
                      <Globe className="w-3 h-3" />
                      {getLanguageLabel(getExamLanguage(exam.id, exam.examLanguage))}
                    </span>
                  </div>
                </div>
                <BookOpen className="w-5 h-5 text-saris-navy flex-shrink-0" />
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                <span className="font-tajawal text-xs text-saris-text-2">📝 {exam.totalQuestions} سؤال</span>
                <span className="font-tajawal text-xs text-saris-text-2">⏱ {exam.duration} دقيقة</span>
                <span className="font-tajawal text-xs text-saris-text-2">📊 {exam.sectionCount} أقسام</span>
                <span className="font-tajawal text-xs text-saris-text-2">💰 {exam.trainingCost}/{exam.simulationCost} نقطة</span>
              </div>

              {/* Sections accordion */}
              <button
                onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                className="flex items-center gap-1 text-saris-navy font-tajawal text-xs font-medium mb-3"
                aria-label="عرض الأقسام"
              >
                الأقسام {expandedExam === exam.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <AnimatePresence>
                {expandedExam === exam.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                    <div className="space-y-1.5 bg-saris-bg rounded-saris-md p-3">
                      {exam.sections.map((sec) => (
                        <div key={sec.id} className="flex items-center justify-between">
                          <span className="font-tajawal text-xs text-saris-text">{sec.name}</span>
                          <span className="font-tajawal text-[11px] text-saris-text-3">{sec.questions} سؤال, {sec.time} دقيقة</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(exam, "smart_training")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-saris-orange text-white font-tajawal font-bold text-sm rounded-saris-md h-10"
                  aria-label="بدء تدريب ذكي"
                >
                  <Brain className="w-4 h-4" />
                  تدريب ذكي
                </button>
                <button
                  onClick={() => openModal(exam, "simulation")}
                  className="flex-1 flex items-center justify-center gap-1.5 gradient-primary text-white font-tajawal font-bold text-sm rounded-saris-md h-10"
                  aria-label="بدء محاكاة رسمية"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  محاكاة رسمية
                </button>
              </div>

              {exam.hasAnalysis && (
                <button className="w-full mt-2 flex items-center justify-center gap-1.5 text-saris-navy font-tajawal text-xs font-medium border border-saris-border rounded-saris-md h-8">
                  <BarChart3 className="w-3.5 h-3.5" />
                  تحليل النتيجة
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Session Config Modal */}
      <AnimatePresence>
        {modalExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 flex items-end justify-center"
            onClick={() => setModalExam(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[430px] bg-saris-bg-card rounded-t-[20px] p-5 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-tajawal font-bold text-lg text-saris-text">
                  {modalType === "smart_training" ? "بدء جلسة تدريب ذكي" : "بدء جلسة محاكاة رسمية"}
                </h3>
                <button onClick={() => setModalExam(null)} className="w-8 h-8 rounded-full bg-saris-bg flex items-center justify-center" aria-label="إغلاق">
                  <X className="w-4 h-4 text-saris-text-2" />
                </button>
              </div>

              <p className="font-tajawal text-sm text-saris-text-2 mb-4">{modalExam.name}</p>

              {/* Exam Language — DNA Config */}
              <div className="flex items-center justify-between bg-saris-bg rounded-saris-md p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-saris-purple" />
                  <span className="font-tajawal text-sm text-saris-text">لغة الاختبار</span>
                </div>
                <select
                  value={getExamLanguage(modalExam.id, modalExam.examLanguage)}
                  onChange={(e) => setExamLanguage(modalExam.id, e.target.value as ExamLanguage)}
                  className="bg-saris-bg-card border border-saris-border rounded-saris-md px-3 py-1.5 font-tajawal text-sm text-saris-text focus:outline-none focus:ring-2 focus:ring-saris-purple/30"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {hasLanguageOverride(modalExam.id) && (
                <button
                  onClick={() => resetExamLanguage(modalExam.id)}
                  className="w-full flex items-center justify-center gap-1.5 text-saris-text-3 font-tajawal text-xs border border-dashed border-saris-border rounded-saris-md h-7 mb-4 hover:text-saris-danger hover:border-saris-danger transition-colors"
                >
                  إعادة تعيين إلى اللغة الافتراضية ({getLanguageLabel(modalExam.examLanguage as ExamLanguage)})
                </button>
              )}


              <div className="flex items-center justify-between bg-saris-bg rounded-saris-md p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-saris-orange" />
                  <span className="font-tajawal text-sm text-saris-text">تكلفة الجلسة</span>
                </div>
                {mockUser.isDiamond ? (
                  <span className="font-tajawal text-sm font-bold text-saris-purple">♾️ مجاني</span>
                ) : (
                  <span className="font-inter font-bold text-sm text-saris-text">{cost} نقطة</span>
                )}
              </div>

              {!mockUser.isDiamond && (
                <div className="flex items-center justify-between bg-saris-bg rounded-saris-md p-3 mb-4">
                  <span className="font-tajawal text-sm text-saris-text-2">رصيدك الحالي</span>
                  <span className="font-inter font-bold text-sm text-saris-navy">{mockStats.balance} نقطة</span>
                </div>
              )}

              {/* Info cards */}
              {modalType === "smart_training" ? (
                <div className="space-y-2 mb-5">
                  {[
                    { icon: Brain, text: "المحرك الذكي يختار أسئلة تناسب مستواك" },
                    { icon: TrendingDown, text: "يركز على نقاط ضعفك" },
                    { icon: Bot, text: "المدرب الذكي متاح لمساعدتك" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-saris-info/5 rounded-saris-md px-3 py-2">
                      <item.icon className="w-4 h-4 text-saris-info flex-shrink-0" />
                      <span className="font-tajawal text-xs text-saris-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 mb-5">
                  <div className="flex items-start gap-2 bg-saris-warning/10 rounded-saris-md px-3 py-2.5">
                    <AlertTriangle className="w-4 h-4 text-saris-warning flex-shrink-0 mt-0.5" />
                    <span className="font-tajawal text-xs text-saris-text leading-relaxed">
                      المحاكاة تحاكي ظروف الاختبار الحقيقي: مؤقت تنازلي، لا مدرب ذكي، لا تلميحات (إلا للأسئلة الصعبة)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-saris-info/5 rounded-saris-md px-3 py-2">
                    <BarChart3 className="w-4 h-4 text-saris-info flex-shrink-0" />
                    <span className="font-tajawal text-xs text-saris-text">هذه الجلسة تؤثر على تنبؤ درجتك بوزن ×3</span>
                  </div>
                </div>
              )}

              {/* Insufficient balance */}
              {!canAfford && (
                <div className="bg-saris-danger/10 rounded-saris-md p-3 mb-4">
                  <p className="font-tajawal text-sm text-saris-danger font-bold mb-1">رصيدك غير كافٍ</p>
                  <p className="font-tajawal text-xs text-saris-text-2">رصيدك: {mockStats.balance} | المطلوب: {cost}</p>
                  <button onClick={() => { setModalExam(null); navigate("/app/topup"); }} className="mt-2 bg-saris-danger text-white font-tajawal font-bold text-xs rounded-saris-md px-4 py-2">
                    اشحن رصيدك
                  </button>
                </div>
              )}

              <button
                onClick={startSession}
                disabled={!canAfford}
                className={`w-full font-tajawal font-bold text-base rounded-saris-lg h-12 disabled:opacity-50 ${
                  modalType === "smart_training" ? "bg-saris-orange text-white" : "gradient-primary text-white"
                }`}
              >
                {modalType === "smart_training" ? "ابدأ التدريب" : "ابدأ المحاكاة"}
              </button>

              {canAfford && !mockUser.isDiamond && (
                <p className="font-tajawal text-[11px] text-saris-text-3 text-center mt-2">سيتم خصم النقاط عند بدء الجلسة</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Exams;
