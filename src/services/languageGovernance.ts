/**
 * Language Governance Service
 * Controls exam language enforcement across the platform:
 * DNA Builder → AI Generation Prompt → Language Validation → Question Bank
 */

// ─── Types ───────────────────────────────────────────────────────

export type ExamLanguage = 'ar' | 'en' | 'fr';

export interface ExamLanguageOption {
  code: ExamLanguage;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: ExamLanguageOption[] = [
  { code: 'ar', label: 'العربية', nativeName: 'العربية' },
  { code: 'en', label: 'الإنجليزية', nativeName: 'English' },
  { code: 'fr', label: 'الفرنسية', nativeName: 'Français' },
];

export function getLanguageLabel(code: ExamLanguage): string {
  return SUPPORTED_LANGUAGES.find(l => l.code === code)?.label ?? code;
}

// ─── AI Generation Prompt Builder ────────────────────────────────

const LANGUAGE_NAMES: Record<ExamLanguage, string> = {
  ar: 'Arabic',
  en: 'English',
  fr: 'French',
};

const EXCLUDED_LANGUAGES: Record<ExamLanguage, string[]> = {
  ar: ['English', 'French'],
  en: ['Arabic', 'French'],
  fr: ['Arabic', 'English'],
};

/**
 * Builds the language enforcement section of the AI generation prompt.
 * This is injected into the prompt BEFORE generation, not after.
 */
export function buildLanguagePromptDirective(language: ExamLanguage): string {
  const langName = LANGUAGE_NAMES[language];
  const excluded = EXCLUDED_LANGUAGES[language].join(' or ');

  return [
    `LANGUAGE REQUIREMENT (STRICT):`,
    `- Generate the question strictly in ${langName}.`,
    `- All answer choices must be in ${langName}.`,
    `- Do not mix languages under any circumstances.`,
    `- Do not include words from ${excluded} unless they are universally accepted technical terms (e.g., "DNA", "pH").`,
    `- Mathematical notation should use standard symbols, not language-specific words.`,
  ].join('\n');
}

// ─── Language Validation Layer (Post-Generation) ─────────────────

/** Unicode ranges for dominant script detection */
const SCRIPT_RANGES: Record<string, RegExp> = {
  arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g,
  latin: /[A-Za-zÀ-ÿ]/g,
};

interface ValidationResult {
  isValid: boolean;
  detectedLanguage: ExamLanguage | 'unknown';
  confidence: number;
  reason?: string;
}

/**
 * Simple heuristic language validator.
 * Checks if the text's dominant script matches the expected exam language.
 * In production, this would use a proper language detection API.
 */
export function validateQuestionLanguage(
  text: string,
  expectedLanguage: ExamLanguage
): ValidationResult {
  // Strip numbers, symbols, and whitespace for script analysis
  const cleaned = text.replace(/[\d\s\p{P}\p{S}]/gu, '');
  if (cleaned.length < 3) {
    return { isValid: true, detectedLanguage: expectedLanguage, confidence: 0.5, reason: 'Text too short to validate' };
  }

  const arabicMatches = (cleaned.match(SCRIPT_RANGES.arabic) || []).length;
  const latinMatches = (cleaned.match(SCRIPT_RANGES.latin) || []).length;
  const total = arabicMatches + latinMatches;

  if (total === 0) {
    return { isValid: true, detectedLanguage: expectedLanguage, confidence: 0.3, reason: 'No recognizable script detected' };
  }

  const arabicRatio = arabicMatches / total;
  const latinRatio = latinMatches / total;

  let detectedLanguage: ExamLanguage | 'unknown' = 'unknown';
  let confidence = 0;

  if (arabicRatio > 0.7) {
    detectedLanguage = 'ar';
    confidence = arabicRatio;
  } else if (latinRatio > 0.7) {
    // Cannot distinguish en/fr by script alone — assume expected if latin-based
    detectedLanguage = expectedLanguage === 'fr' ? 'fr' : 'en';
    confidence = latinRatio;
  }

  const isValid = detectedLanguage === expectedLanguage;

  return {
    isValid,
    detectedLanguage,
    confidence,
    reason: isValid ? undefined : `Expected ${getLanguageLabel(expectedLanguage)}, detected ${detectedLanguage === 'unknown' ? 'مختلطة' : getLanguageLabel(detectedLanguage)}`,
  };
}

/**
 * Validates an entire question including all options.
 * Returns true only if ALL parts pass validation.
 */
export function validateFullQuestion(
  questionText: string,
  options: string[],
  expectedLanguage: ExamLanguage
): ValidationResult {
  const questionResult = validateQuestionLanguage(questionText, expectedLanguage);
  if (!questionResult.isValid) return questionResult;

  for (const option of options) {
    const optionResult = validateQuestionLanguage(option, expectedLanguage);
    if (!optionResult.isValid) {
      return { ...optionResult, reason: `خيار غير مطابق: ${optionResult.reason}` };
    }
  }

  return questionResult;
}

// ─── Question Bank Pipeline Interface ────────────────────────────

export interface GeneratedQuestion {
  text: string;
  options: { id: string; text: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
  sectionId: string;
  topic: string;
  language: ExamLanguage;
}

export interface PipelineResult {
  accepted: boolean;
  question?: GeneratedQuestion;
  validationResult: ValidationResult;
  retryCount: number;
}

/**
 * Mock pipeline: AI Generation → Language Validation → Accept/Reject
 * In production, rejection triggers automatic re-generation (max 3 retries).
 * 
 * Usage (future Edge Function):
 * ```
 * const prompt = buildLanguagePromptDirective(examLanguage);
 * const generated = await generateQuestion(prompt + questionPrompt);
 * const result = await languagePipeline(generated, examLanguage);
 * if (result.accepted) insertIntoQuestionBank(result.question);
 * ```
 */
export function mockLanguagePipeline(
  question: GeneratedQuestion,
  expectedLanguage: ExamLanguage
): PipelineResult {
  const optionTexts = question.options.map(o => o.text);
  const validation = validateFullQuestion(question.text, optionTexts, expectedLanguage);

  return {
    accepted: validation.isValid,
    question: validation.isValid ? question : undefined,
    validationResult: validation,
    retryCount: 0,
  };
}
