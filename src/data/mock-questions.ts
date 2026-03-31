export interface CognitiveTags {
  cognitive_type: 'analytical' | 'computational' | 'conceptual' | 'logical';
  reasoning_depth: 'shallow' | 'moderate' | 'deep';
  trap_likelihood: 'low' | 'medium' | 'high';
}

export interface MockQuestion {
  id: string;
  text_ar: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sectionId: string;
  sectionName: string;
  topic: string;
  options: { id: string; textAr: string }[];
  cognitive_tags?: CognitiveTags;
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
  // ── EASY (10) ──
  {
    id: 'q1', text_ar: 'ما ناتج: 3x + 5 = 20، ما قيمة x؟', difficulty: 'easy',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المعادلات الخطية',
    options: [{ id: 'o1', textAr: '3' }, { id: 'o2', textAr: '5' }, { id: 'o3', textAr: '7' }, { id: 'o4', textAr: '15' }],
    cognitive_tags: { cognitive_type: 'computational', reasoning_depth: 'shallow', trap_likelihood: 'low' },
  },
  {
    id: 'q2', text_ar: 'إذا كان متوسط 4 أعداد هو 10، فما مجموعها؟', difficulty: 'easy',
    sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'المتوسط الحسابي',
    options: [{ id: 'o1', textAr: '20' }, { id: 'o2', textAr: '30' }, { id: 'o3', textAr: '40' }, { id: 'o4', textAr: '50' }],
    cognitive_tags: { cognitive_type: 'computational', reasoning_depth: 'shallow', trap_likelihood: 'low' },
  },
  {
    id: 'q3', text_ar: 'ما ناتج: 15 + 27 - 12؟', difficulty: 'easy',
    sectionId: 'sec_calc', sectionName: 'الحساب', topic: 'العمليات الحسابية',
    options: [{ id: 'o1', textAr: '30' }, { id: 'o2', textAr: '28' }, { id: 'o3', textAr: '54' }, { id: 'o4', textAr: '24' }],
  },
  {
    id: 'q4', text_ar: 'إذا كانت الساعة 3:00 وأضفنا 90 دقيقة، كم تصبح الساعة؟', difficulty: 'easy',
    sectionId: 'sec_logic', sectionName: 'التفكير المنطقي', topic: 'التفكير العددي',
    options: [{ id: 'o1', textAr: '4:00' }, { id: 'o2', textAr: '3:90' }, { id: 'o3', textAr: '5:00' }, { id: 'o4', textAr: '4:30' }],
    cognitive_tags: { cognitive_type: 'logical', reasoning_depth: 'shallow', trap_likelihood: 'medium' },
  },
  {
    id: 'q5', text_ar: 'حل المعادلة: 2x = 14', difficulty: 'easy',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المعادلات الخطية',
    options: [{ id: 'o1', textAr: '5' }, { id: 'o2', textAr: '7' }, { id: 'o3', textAr: '8' }, { id: 'o4', textAr: '6' }],
  },
  {
    id: 'q6', text_ar: 'إذا رُمي حجر نرد، ما احتمال ظهور عدد زوجي؟', difficulty: 'easy',
    sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'الاحتمالات البسيطة',
    options: [{ id: 'o1', textAr: '1/3' }, { id: 'o2', textAr: '1/6' }, { id: 'o3', textAr: '1/2' }, { id: 'o4', textAr: '2/3' }],
  },
  {
    id: 'q7', text_ar: 'ما ناتج: 8 × 7؟', difficulty: 'easy',
    sectionId: 'sec_calc', sectionName: 'الحساب', topic: 'الضرب',
    options: [{ id: 'o1', textAr: '56' }, { id: 'o2', textAr: '48' }, { id: 'o3', textAr: '63' }, { id: 'o4', textAr: '54' }],
  },
  {
    id: 'q8', text_ar: 'ما مساحة مستطيل أبعاده 5 و 8؟', difficulty: 'easy',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'مساحة الأشكال',
    options: [{ id: 'o1', textAr: '13' }, { id: 'o2', textAr: '40' }, { id: 'o3', textAr: '26' }, { id: 'o4', textAr: '80' }],
  },
  {
    id: 'q9', text_ar: 'ما العدد التالي في المتتابعة: 2, 5, 8, 11, ...؟', difficulty: 'easy',
    sectionId: 'sec_logic', sectionName: 'التفكير المنطقي', topic: 'المتتابعات',
    options: [{ id: 'o1', textAr: '12' }, { id: 'o2', textAr: '13' }, { id: 'o3', textAr: '15' }, { id: 'o4', textAr: '14' }],
    cognitive_tags: { cognitive_type: 'analytical', reasoning_depth: 'shallow', trap_likelihood: 'low' },
  },
  {
    id: 'q10', text_ar: 'ما الوسيط للأعداد: 3, 7, 1, 9, 5؟', difficulty: 'easy',
    sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'مقاييس النزعة المركزية',
    options: [{ id: 'o1', textAr: '5' }, { id: 'o2', textAr: '7' }, { id: 'o3', textAr: '3' }, { id: 'o4', textAr: '9' }],
  },

  // ── MEDIUM (12) ──
  {
    id: 'q11', text_ar: 'إذا كان 2x² - 8 = 0، فما قيم x؟', difficulty: 'medium',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المعادلات التربيعية',
    options: [{ id: 'o1', textAr: '±1' }, { id: 'o2', textAr: '±4' }, { id: 'o3', textAr: '±2' }, { id: 'o4', textAr: '±3' }],
    cognitive_tags: { cognitive_type: 'computational', reasoning_depth: 'moderate', trap_likelihood: 'medium' },
  },
  {
    id: 'q12', text_ar: 'الانحراف المعياري لمجموعة بيانات متساوية القيم يساوي:', difficulty: 'medium',
    sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'الانحراف المعياري',
    options: [{ id: 'o1', textAr: '1' }, { id: 'o2', textAr: '0' }, { id: 'o3', textAr: 'المتوسط' }, { id: 'o4', textAr: 'غير محدد' }],
    cognitive_tags: { cognitive_type: 'conceptual', reasoning_depth: 'moderate', trap_likelihood: 'high' },
  },
  {
    id: 'q13', text_ar: 'إذا كان ثمن 5 كتب 75 ريال، فكم ثمن 8 كتب؟', difficulty: 'medium',
    sectionId: 'sec_calc', sectionName: 'الحساب', topic: 'التناسب',
    options: [{ id: 'o1', textAr: '120 ريال' }, { id: 'o2', textAr: '100 ريال' }, { id: 'o3', textAr: '150 ريال' }, { id: 'o4', textAr: '90 ريال' }],
  },
  {
    id: 'q14', text_ar: 'في مثلث قائم الزاوية، إذا كان الوتر = 10 وأحد الأضلاع = 6، فما طول الضلع الآخر؟', difficulty: 'medium',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'نظرية فيثاغورس',
    options: [{ id: 'o1', textAr: '4' }, { id: 'o2', textAr: '7' }, { id: 'o3', textAr: '12' }, { id: 'o4', textAr: '8' }],
  },
  {
    id: 'q15', text_ar: 'إذا كان a + b = 7 و a × b = 12، فما قيمة a² + b²؟', difficulty: 'medium',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المتطابقات الجبرية',
    options: [{ id: 'o1', textAr: '49' }, { id: 'o2', textAr: '24' }, { id: 'o3', textAr: '25' }, { id: 'o4', textAr: '37' }],
    cognitive_tags: { cognitive_type: 'analytical', reasoning_depth: 'moderate', trap_likelihood: 'high' },
  },
  {
    id: 'q16', text_ar: 'في تجربة سحب كرة من كيس يحوي 3 حمراء و 5 زرقاء، ما احتمال سحب كرة حمراء؟', difficulty: 'medium',
    sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'الاحتمالات',
    options: [{ id: 'o1', textAr: '5/8' }, { id: 'o2', textAr: '3/8' }, { id: 'o3', textAr: '1/3' }, { id: 'o4', textAr: '3/5' }],
  },
  {
    id: 'q17', text_ar: 'عدد يقبل القسمة على 3 و 5 معاً ويقع بين 20 و 40 هو:', difficulty: 'medium',
    sectionId: 'sec_calc', sectionName: 'الحساب', topic: 'القسمة والمضاعفات',
    options: [{ id: 'o1', textAr: '30' }, { id: 'o2', textAr: '25' }, { id: 'o3', textAr: '35' }, { id: 'o4', textAr: '27' }],
  },
  {
    id: 'q18', text_ar: 'إذا كان عمر أحمد ضعف عمر سعد، ومجموع عمريهما 36، فكم عمر سعد؟', difficulty: 'medium',
    sectionId: 'sec_logic', sectionName: 'التفكير المنطقي', topic: 'المسائل اللفظية',
    options: [{ id: 'o1', textAr: '18' }, { id: 'o2', textAr: '24' }, { id: 'o3', textAr: '12' }, { id: 'o4', textAr: '9' }],
    cognitive_tags: { cognitive_type: 'logical', reasoning_depth: 'moderate', trap_likelihood: 'medium' },
  },
  {
    id: 'q19', text_ar: 'ما المميز (Δ) للمعادلة x² - 5x + 6 = 0؟', difficulty: 'medium',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المعادلات التربيعية',
    options: [{ id: 'o1', textAr: '-1' }, { id: 'o2', textAr: '0' }, { id: 'o3', textAr: '5' }, { id: 'o4', textAr: '1' }],
  },
  {
    id: 'q20', text_ar: 'أي الأشكال التالية لا ينتمي للمجموعة: مربع، مستطيل، دائرة، معين؟', difficulty: 'medium',
    sectionId: 'sec_logic', sectionName: 'التفكير المنطقي', topic: 'التصنيف والتحليل',
    options: [{ id: 'o1', textAr: 'المربع' }, { id: 'o2', textAr: 'الدائرة' }, { id: 'o3', textAr: 'المعين' }, { id: 'o4', textAr: 'المستطيل' }],
    cognitive_tags: { cognitive_type: 'analytical', reasoning_depth: 'moderate', trap_likelihood: 'medium' },
  },
  {
    id: 'q21', text_ar: 'إذا كان المتوسط الحسابي لـ 5 قيم هو 20، وأضيفت قيمة سادسة = 32، فما المتوسط الجديد؟', difficulty: 'medium',
    sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'المتوسط الحسابي',
    options: [{ id: 'o1', textAr: '20' }, { id: 'o2', textAr: '24' }, { id: 'o3', textAr: '22' }, { id: 'o4', textAr: '26' }],
  },
  {
    id: 'q22', text_ar: 'ما نسبة الخصم إذا انخفض سعر منتج من 200 إلى 150 ريال؟', difficulty: 'medium',
    sectionId: 'sec_calc', sectionName: 'الحساب', topic: 'النسب المئوية',
    options: [{ id: 'o1', textAr: '20%' }, { id: 'o2', textAr: '30%' }, { id: 'o3', textAr: '25%' }, { id: 'o4', textAr: '35%' }],
  },

  // ── HARD (8) ──
  {
    id: 'q23', text_ar: 'إذا كان |2x - 3| < 5، فما مجموعة الحل؟', difficulty: 'hard',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المتباينات',
    options: [{ id: 'o1', textAr: 'x > 4' }, { id: 'o2', textAr: '-1 < x < 4' }, { id: 'o3', textAr: 'x < -1' }, { id: 'o4', textAr: '-4 < x < 1' }],
    cognitive_tags: { cognitive_type: 'analytical', reasoning_depth: 'deep', trap_likelihood: 'high' },
  },
  {
    id: 'q24', text_ar: 'في تجربة رمي عملة 3 مرات، ما احتمال ظهور صورة مرتين على الأقل؟', difficulty: 'hard',
    sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'الاحتمالات الشرطية',
    options: [{ id: 'o1', textAr: '3/8' }, { id: 'o2', textAr: '1/2' }, { id: 'o3', textAr: '1/4' }, { id: 'o4', textAr: '4/8' }],
    cognitive_tags: { cognitive_type: 'computational', reasoning_depth: 'deep', trap_likelihood: 'high' },
  },
  {
    id: 'q25', text_ar: 'قطار يسير بسرعة 90 كم/ساعة. كم يحتاج لقطع 315 كم؟', difficulty: 'hard',
    sectionId: 'sec_calc', sectionName: 'الحساب', topic: 'المسافة والسرعة',
    options: [{ id: 'o1', textAr: '3.5 ساعات' }, { id: 'o2', textAr: '3 ساعات' }, { id: 'o3', textAr: '4 ساعات' }, { id: 'o4', textAr: '2.5 ساعات' }],
  },
  {
    id: 'q26', text_ar: 'إذا كان أحمد أكبر من سعد بـ 5 سنوات، وبعد 3 سنوات سيكون عمر أحمد ضعف عمر سعد، فكم عمر سعد الآن؟', difficulty: 'hard',
    sectionId: 'sec_logic', sectionName: 'التفكير المنطقي', topic: 'المسائل اللفظية المعقدة',
    options: [{ id: 'o1', textAr: '3' }, { id: 'o2', textAr: '5' }, { id: 'o3', textAr: '2' }, { id: 'o4', textAr: '7' }],
    cognitive_tags: { cognitive_type: 'logical', reasoning_depth: 'deep', trap_likelihood: 'high' },
  },
  {
    id: 'q27', text_ar: 'إذا كانت المصفوفة A = [[1,2],[3,4]]، فما محدد A؟', difficulty: 'hard',
    sectionId: 'sec_alg', sectionName: 'الجبر والهندسة', topic: 'المصفوفات',
    options: [{ id: 'o1', textAr: '10' }, { id: 'o2', textAr: '-2' }, { id: 'o3', textAr: '2' }, { id: 'o4', textAr: '-10' }],
    cognitive_tags: { cognitive_type: 'computational', reasoning_depth: 'deep', trap_likelihood: 'medium' },
  },
  {
    id: 'q28', text_ar: 'في سباق، أنهى خالد قبل سعد، وسعد بعد فهد، وفهد قبل ناصر. من الثاني؟', difficulty: 'hard',
    sectionId: 'sec_logic', sectionName: 'التفكير المنطقي', topic: 'الترتيب المنطقي',
    options: [{ id: 'o1', textAr: 'فهد' }, { id: 'o2', textAr: 'سعد' }, { id: 'o3', textAr: 'خالد' }, { id: 'o4', textAr: 'ناصر' }],
    cognitive_tags: { cognitive_type: 'logical', reasoning_depth: 'deep', trap_likelihood: 'high' },
  },
  {
    id: 'q29', text_ar: 'كم عدد طرق ترتيب 4 أشخاص في صف من 6 مقاعد؟', difficulty: 'hard',
    sectionId: 'sec_stats', sectionName: 'الإحصاء والاحتمالات', topic: 'التباديل والتوافيق',
    options: [{ id: 'o1', textAr: '24' }, { id: 'o2', textAr: '120' }, { id: 'o3', textAr: '720' }, { id: 'o4', textAr: '360' }],
  },
  {
    id: 'q30', text_ar: 'إذا كان 20% من عدد يساوي 45، فما هو العدد؟', difficulty: 'hard',
    sectionId: 'sec_calc', sectionName: 'الحساب', topic: 'النسب المئوية المتقدمة',
    options: [{ id: 'o1', textAr: '180' }, { id: 'o2', textAr: '200' }, { id: 'o3', textAr: '225' }, { id: 'o4', textAr: '250' }],
    cognitive_tags: { cognitive_type: 'computational', reasoning_depth: 'moderate', trap_likelihood: 'medium' },
  },
];
