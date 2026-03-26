/**
 * Generation Configuration Service
 * Reads examLanguage from DNA/exam config and builds the full generation payload.
 * This is the integration-ready bridge between DNA Builder and AI generation.
 * 
 * Flow: DNA Config → examLanguage → buildGenerationPayload() → AI prompt with language directive
 */

import { 
  type ExamLanguage, 
  buildLanguagePromptDirective, 
  validateFullQuestion, 
  type ValidationResult,
  getLanguageLabel
} from './languageGovernance';

// ─── Types ───────────────────────────────────────────────────────

export interface ExamDNAConfig {
  examId: string;
  examName: string;
  examLanguage: ExamLanguage;
  dna: { easy: number; medium: number; hard: number };
  sections: { id: string; name: string; questions: number }[];
}

export interface GenerationPayload {
  examId: string;
  language: ExamLanguage;
  languageDirective: string;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  targetSections: string[];
  /** Full system prompt including language enforcement */
  systemPrompt: string;
}

export interface GenerationResult {
  questionText: string;
  options: string[];
  accepted: boolean;
  validation: ValidationResult;
  attempt: number;
}

// ─── Payload Builder ─────────────────────────────────────────────

/**
 * Builds the complete generation payload from DNA config.
 * This is called BEFORE any AI generation request.
 */
export function buildGenerationPayload(config: ExamDNAConfig): GenerationPayload {
  const languageDirective = buildLanguagePromptDirective(config.examLanguage);

  const systemPrompt = [
    `You are a question generator for the exam: "${config.examName}".`,
    ``,
    languageDirective,
    ``,
    `DIFFICULTY DISTRIBUTION:`,
    `- Easy: ${config.dna.easy}%`,
    `- Medium: ${config.dna.medium}%`,
    `- Hard: ${config.dna.hard}%`,
    ``,
    `SECTIONS: ${config.sections.map(s => s.name).join(', ')}`,
    ``,
    `Generate a multiple-choice question with 4 options. Mark the correct answer.`,
  ].join('\n');

  return {
    examId: config.examId,
    language: config.examLanguage,
    languageDirective,
    difficultyDistribution: config.dna,
    targetSections: config.sections.map(s => s.id),
    systemPrompt,
  };
}

// ─── Post-Generation Validator ───────────────────────────────────

const MAX_GENERATION_RETRIES = 3;

/**
 * Validates a generated question against the exam language.
 * Returns acceptance status. In production, rejection triggers re-generation.
 */
export function validateGeneratedQuestion(
  questionText: string,
  options: string[],
  expectedLanguage: ExamLanguage,
  attempt: number = 1
): GenerationResult {
  const validation = validateFullQuestion(questionText, options, expectedLanguage);

  if (!validation.isValid) {
    console.warn(
      `[GenerationConfig] Question rejected (attempt ${attempt}/${MAX_GENERATION_RETRIES}):`,
      `Expected=${getLanguageLabel(expectedLanguage)}`,
      `Detected=${validation.detectedLanguage}`,
      `Confidence=${(validation.confidence * 100).toFixed(0)}%`,
      `Reason=${validation.reason}`
    );
  }

  return {
    questionText,
    options,
    accepted: validation.isValid,
    validation,
    attempt,
  };
}

/**
 * Simulates the full generation→validate→retry pipeline.
 * In production, each retry calls the AI again with a stricter prompt.
 * 
 * Integration point for Edge Function:
 * ```typescript
 * // In generate-question Edge Function:
 * const dnaConfig = await getExamDNA(examId);
 * const payload = buildGenerationPayload(dnaConfig);
 * 
 * let result: GenerationResult;
 * for (let attempt = 1; attempt <= 3; attempt++) {
 *   const aiResponse = await callClaude(payload.systemPrompt, userPrompt);
 *   result = validateGeneratedQuestion(
 *     aiResponse.question, aiResponse.options, payload.language, attempt
 *   );
 *   if (result.accepted) break;
 *   // Add stricter language reminder on retry
 *   payload.systemPrompt += '\n\nPREVIOUS ATTEMPT FAILED LANGUAGE CHECK. BE STRICT.';
 * }
 * if (!result.accepted) throw new Error('Language validation failed after max retries');
 * return result;
 * ```
 */
export function simulateGenerationPipeline(
  config: ExamDNAConfig,
  mockQuestionText: string,
  mockOptions: string[]
): GenerationResult {
  const payload = buildGenerationPayload(config);

  for (let attempt = 1; attempt <= MAX_GENERATION_RETRIES; attempt++) {
    const result = validateGeneratedQuestion(
      mockQuestionText,
      mockOptions,
      payload.language,
      attempt
    );
    if (result.accepted) return result;
  }

  return {
    questionText: mockQuestionText,
    options: mockOptions,
    accepted: false,
    validation: {
      isValid: false,
      detectedLanguage: 'unknown',
      confidence: 0,
      reason: `فشل التحقق بعد ${MAX_GENERATION_RETRIES} محاولات`,
    },
    attempt: MAX_GENERATION_RETRIES,
  };
}
