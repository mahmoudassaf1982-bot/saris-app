export interface MockQuestion {
  id: string;
  text_ar: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sectionId: string;
  sectionName: string;
  topic: string;
  options: { id: string; textAr: string }[];
}

export const mockAnswerKeys: Record<string, string> = {
  q1: 'o2', q2: 'o3', q3: 'o1', q4: 'o4', q5: 'o2',
  q6: 'o3', q7: 'o1', q8: 'o2', q9: 'o4', q10: 'o1',
  q11: 'o3', q12: 'o2', q13: 'o1', q14: 'o4', q15: 'o3',
  q16: 'o2', q17: 'o1', q18: 'o3', q19: 'o4', q20: 'o2',
  q21: 'o1', q22: 'o3', q23: 'o2', q24: 'o4', q25: 'o1',
  q26: 'o3', q27: 'o2', q28: 'o1', q29: 'o4', q30: 'o3',
};

export const mockQuestionPool: MockQuestion[] = [
  // EASY — 10 questions
  { id: 'q1', text_ar: 'ما ناتج: 3x + 5 = 20، ما قيمة x؟', difficulty: 'easy', sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المعادلات الخطية', options: [{ id: 'o1', textAr: '3' }, { id: 'o2', textAr: '5' }, { id: 'o3', textAr: '7' }, { id: 'o4', textAr: '15' }] },
  { id: 'q2', text_ar: 'إذا كان متوسط 4 أعداد هو 10، فما مجموعها؟', difficulty: 'easy', sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'المتوسط الحسابي', options: [{ id: 'o1', textAr: '20' }, { id: 'o2', textAr: '30' }, { id: 'o3', textAr: '40' }, { id: 'o4', textAr: '50' }] },
  { id: 'q3', text_ar: 'ما قيمة f(2) إذا كانت f(x) = 2x + 1؟', difficulty: 'easy', sectionId: 'sec_func', sectionName: 'الدوال واللوغاريتمات', topic: 'تقييم الدوال', options: [{ id: 'o1', textAr: '5' }, { id: 'o2', textAr: '3' }, { id: 'o3', textAr: '4' }, { id: 'o4', textAr: '6' }] },
  { id: 'q4', text_ar: 'ما محيط مربع طول ضلعه 6 سم؟', difficulty: 'easy', sectionId: 'sec_geo', sectionName: 'الهندسة وحساب المثلثات', topic: 'محيط الأشكال', options: [{ id: 'o1', textAr: '12' }, { id: 'o2', textAr: '18' }, { id: 'o3', textAr: '36' }, { id: 'o4', textAr: '24' }] },
  { id: 'q5', text_ar: 'حل المعادلة: 2x = 14', difficulty: 'easy', sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المعادلات الخطية', options: [{ id: 'o1', textAr: '5' }, { id: 'o2', textAr: '7' }, { id: 'o3', textAr: '8' }, { id: 'o4', textAr: '6' }] },
  { id: 'q6', text_ar: 'إذا رُمي حجر نرد، ما احتمال ظهور عدد زوجي؟', difficulty: 'easy', sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'الاحتمالات البسيطة', options: [{ id: 'o1', textAr: '1/3' }, { id: 'o2', textAr: '1/6' }, { id: 'o3', textAr: '1/2' }, { id: 'o4', textAr: '2/3' }] },
  { id: 'q7', text_ar: 'ما قيمة f(0) إذا كانت f(x) = x² + 3؟', difficulty: 'easy', sectionId: 'sec_func', sectionName: 'الدوال واللوغاريتمات', topic: 'تقييم الدوال', options: [{ id: 'o1', textAr: '3' }, { id: 'o2', textAr: '0' }, { id: 'o3', textAr: '9' }, { id: 'o4', textAr: '1' }] },
  { id: 'q8', text_ar: 'ما مساحة مستطيل أبعاده 5 و 8؟', difficulty: 'easy', sectionId: 'sec_geo', sectionName: 'الهندسة وحساب المثلثات', topic: 'مساحة الأشكال', options: [{ id: 'o1', textAr: '13' }, { id: 'o2', textAr: '40' }, { id: 'o3', textAr: '26' }, { id: 'o4', textAr: '80' }] },
  { id: 'q9', text_ar: 'ما ناتج: 5 + 3 × 2؟', difficulty: 'easy', sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'ترتيب العمليات', options: [{ id: 'o1', textAr: '16' }, { id: 'o2', textAr: '10' }, { id: 'o3', textAr: '13' }, { id: 'o4', textAr: '11' }] },
  { id: 'q10', text_ar: 'ما الوسيط للأعداد: 3, 7, 1, 9, 5؟', difficulty: 'easy', sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'مقاييس النزعة المركزية', options: [{ id: 'o1', textAr: '5' }, { id: 'o2', textAr: '7' }, { id: 'o3', textAr: '3' }, { id: 'o4', textAr: '9' }] },

  // MEDIUM — 12 questions
  { id: 'q11', text_ar: 'إذا كان 2x² - 8 = 0، فما قيم x؟', difficulty: 'medium', sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المعادلات التربيعية', options: [{ id: 'o1', textAr: '±1' }, { id: 'o2', textAr: '±4' }, { id: 'o3', textAr: '±2' }, { id: 'o4', textAr: '±3' }] },
  { id: 'q12', text_ar: 'الانحراف المعياري لمجموعة بيانات متساوية القيم يساوي:', difficulty: 'medium', sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'الانحراف المعياري', options: [{ id: 'o1', textAr: '1' }, { id: 'o2', textAr: '0' }, { id: 'o3', textAr: 'المتوسط' }, { id: 'o4', textAr: 'غير محدد' }] },
  { id: 'q13', text_ar: 'ما مجال الدالة f(x) = √(x - 3)؟', difficulty: 'medium', sectionId: 'sec_func', sectionName: 'الدوال واللوغاريتمات', topic: 'مجال الدوال', options: [{ id: 'o1', textAr: 'x ≥ 3' }, { id: 'o2', textAr: 'x > 3' }, { id: 'o3', textAr: 'x ≥ 0' }, { id: 'o4', textAr: 'جميع الأعداد الحقيقية' }] },
  { id: 'q14', text_ar: 'في مثلث قائم الزاوية، إذا كان الوتر = 10 وأحد الأضلاع = 6، فما طول الضلع الآخر؟', difficulty: 'medium', sectionId: 'sec_geo', sectionName: 'الهندسة وحساب المثلثات', topic: 'نظرية فيثاغورس', options: [{ id: 'o1', textAr: '4' }, { id: 'o2', textAr: '7' }, { id: 'o3', textAr: '12' }, { id: 'o4', textAr: '8' }] },
  { id: 'q15', text_ar: 'إذا كان a + b = 7 و a × b = 12، فما قيمة a² + b²؟', difficulty: 'medium', sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المتطابقات الجبرية', options: [{ id: 'o1', textAr: '49' }, { id: 'o2', textAr: '24' }, { id: 'o3', textAr: '25' }, { id: 'o4', textAr: '37' }] },
  { id: 'q16', text_ar: 'في تجربة سحب كرة من كيس يحوي 3 حمراء و 5 زرقاء، ما احتمال سحب كرة حمراء؟', difficulty: 'medium', sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'الاحتمالات', options: [{ id: 'o1', textAr: '5/8' }, { id: 'o2', textAr: '3/8' }, { id: 'o3', textAr: '1/3' }, { id: 'o4', textAr: '3/5' }] },
  { id: 'q17', text_ar: 'إذا كانت f(x) = x² - 4x + 3، فما قيمة f(1)؟', difficulty: 'medium', sectionId: 'sec_func', sectionName: 'الدوال واللوغاريتمات', topic: 'الدوال التربيعية', options: [{ id: 'o1', textAr: '0' }, { id: 'o2', textAr: '2' }, { id: 'o3', textAr: '-1' }, { id: 'o4', textAr: '3' }] },
  { id: 'q18', text_ar: 'ما مساحة دائرة نصف قطرها 7 سم؟ (π ≈ 22/7)', difficulty: 'medium', sectionId: 'sec_geo', sectionName: 'الهندسة وحساب المثلثات', topic: 'مساحة الدائرة', options: [{ id: 'o1', textAr: '44 سم²' }, { id: 'o2', textAr: '22 سم²' }, { id: 'o3', textAr: '154 سم²' }, { id: 'o4', textAr: '308 سم²' }] },
  { id: 'q19', text_ar: 'ما المميز (Δ) للمعادلة x² - 5x + 6 = 0؟', difficulty: 'medium', sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المعادلات التربيعية', options: [{ id: 'o1', textAr: '-1' }, { id: 'o2', textAr: '0' }, { id: 'o3', textAr: '5' }, { id: 'o4', textAr: '1' }] },
  { id: 'q20', text_ar: 'ما قيمة log₁₀(100)؟', difficulty: 'medium', sectionId: 'sec_func', sectionName: 'الدوال واللوغاريتمات', topic: 'اللوغاريتمات', options: [{ id: 'o1', textAr: '10' }, { id: 'o2', textAr: '2' }, { id: 'o3', textAr: '1' }, { id: 'o4', textAr: '100' }] },
  { id: 'q21', text_ar: 'زاوية المثلث المتساوي الأضلاع تساوي:', difficulty: 'medium', sectionId: 'sec_geo', sectionName: 'الهندسة وحساب المثلثات', topic: 'خصائص المثلثات', options: [{ id: 'o1', textAr: '60°' }, { id: 'o2', textAr: '90°' }, { id: 'o3', textAr: '45°' }, { id: 'o4', textAr: '120°' }] },
  { id: 'q22', text_ar: 'إذا كان المتوسط الحسابي لـ 5 قيم هو 20، وأضيفت قيمة سادسة = 32، فما المتوسط الجديد؟', difficulty: 'medium', sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'المتوسط الحسابي', options: [{ id: 'o1', textAr: '20' }, { id: 'o2', textAr: '24' }, { id: 'o3', textAr: '22' }, { id: 'o4', textAr: '26' }] },

  // HARD — 8 questions
  { id: 'q23', text_ar: 'إذا كان |2x - 3| < 5، فما مجموعة الحل؟', difficulty: 'hard', sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المتباينات', options: [{ id: 'o1', textAr: 'x > 4' }, { id: 'o2', textAr: '-1 < x < 4' }, { id: 'o3', textAr: 'x < -1' }, { id: 'o4', textAr: '-4 < x < 1' }] },
  { id: 'q24', text_ar: 'في تجربة رمي عملة 3 مرات، ما احتمال ظهور صورة مرتين على الأقل؟', difficulty: 'hard', sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'الاحتمالات الشرطية', options: [{ id: 'o1', textAr: '3/8' }, { id: 'o2', textAr: '1/2' }, { id: 'o3', textAr: '1/4' }, { id: 'o4', textAr: '4/8' }] },
  { id: 'q25', text_ar: 'ما المشتقة الأولى لـ f(x) = 3x³ - 2x + 1؟', difficulty: 'hard', sectionId: 'sec_func', sectionName: 'الدوال واللوغاريتمات', topic: 'التفاضل', options: [{ id: 'o1', textAr: '9x² - 2' }, { id: 'o2', textAr: '3x² - 2' }, { id: 'o3', textAr: '9x³ - 2' }, { id: 'o4', textAr: '6x - 2' }] },
  { id: 'q26', text_ar: 'ما قيمة sin(30°) × cos(60°) + cos(30°) × sin(60°)؟', difficulty: 'hard', sectionId: 'sec_geo', sectionName: 'الهندسة وحساب المثلثات', topic: 'حساب المثلثات', options: [{ id: 'o1', textAr: '0' }, { id: 'o2', textAr: '1/2' }, { id: 'o3', textAr: '1' }, { id: 'o4', textAr: '√3/2' }] },
  { id: 'q27', text_ar: 'إذا كانت المصفوفة A = [[1,2],[3,4]]، فما محدد A؟', difficulty: 'hard', sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المصفوفات', options: [{ id: 'o1', textAr: '10' }, { id: 'o2', textAr: '-2' }, { id: 'o3', textAr: '2' }, { id: 'o4', textAr: '-10' }] },
  { id: 'q28', text_ar: 'ما تكامل ∫(2x + 1)dx من 0 إلى 3؟', difficulty: 'hard', sectionId: 'sec_func', sectionName: 'الدوال واللوغاريتمات', topic: 'التكامل', options: [{ id: 'o1', textAr: '12' }, { id: 'o2', textAr: '9' }, { id: 'o3', textAr: '15' }, { id: 'o4', textAr: '6' }] },
  { id: 'q29', text_ar: 'كم عدد طرق ترتيب 4 أشخاص في صف من 6 مقاعد؟', difficulty: 'hard', sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'التباديل والتوافيق', options: [{ id: 'o1', textAr: '24' }, { id: 'o2', textAr: '120' }, { id: 'o3', textAr: '720' }, { id: 'o4', textAr: '360' }] },
  { id: 'q30', text_ar: 'ما حجم كرة نصف قطرها 3 سم؟ (π ≈ 3.14)', difficulty: 'hard', sectionId: 'sec_geo', sectionName: 'الهندسة وحساب المثلثات', topic: 'الأحجام', options: [{ id: 'o1', textAr: '28.26 سم³' }, { id: 'o2', textAr: '84.78 سم³' }, { id: 'o3', textAr: '113.04 سم³' }, { id: 'o4', textAr: '36 سم³' }] },
];
