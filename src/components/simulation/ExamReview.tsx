import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, XCircle, Lightbulb, Layers, MinusCircle } from 'lucide-react';
import type { MockQuestion } from '@/data/mock-questions';

const arabicLetters = ['أ', 'ب', 'ج', 'د'];

interface ReviewAnswer {
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

interface ExamReviewProps {
  answers: ReviewAnswer[];
  questions: MockQuestion[];
  hintsUsed: Record<string, string>;
  onBack: () => void;
}

export default function ExamReview({ answers, questions, hintsUsed, onBack }: ExamReviewProps) {
  // Group by section
  const sectionMap = new Map<string, { name: string; items: { q: MockQuestion; a: ReviewAnswer; index: number }[] }>();
  questions.forEach((q, i) => {
    if (!sectionMap.has(q.sectionId)) {
      sectionMap.set(q.sectionId, { name: q.sectionName, items: [] });
    }
    sectionMap.get(q.sectionId)!.items.push({ q, a: answers[i], index: i });
  });
  const sections = Array.from(sectionMap.values());

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-tajawal font-bold text-base text-foreground">مراجعة الإجابات</h1>
      </div>

      <div className="px-4 py-4 max-w-[430px] mx-auto space-y-6">
        {sections.map(sec => (
          <div key={sec.name}>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-primary" />
              <h2 className="font-tajawal font-bold text-sm text-foreground">{sec.name}</h2>
            </div>
            <div className="space-y-3">
              {sec.items.map(({ q, a, index }) => {
                const hint = hintsUsed[q.id];
                return (
                  <div key={q.id} className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
                    {/* Question */}
                    <div className="flex items-start gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        a.isCorrect ? 'bg-saris-success/10 text-saris-success' : a.selectedOptionId ? 'bg-saris-danger/10 text-saris-danger' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <p className="font-tajawal text-sm font-semibold text-foreground leading-relaxed flex-1">{q.text_ar}</p>
                      {a.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-saris-success flex-shrink-0" />
                      ) : a.selectedOptionId ? (
                        <XCircle className="w-5 h-5 text-saris-danger flex-shrink-0" />
                      ) : (
                        <MinusCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const isSelected = a.selectedOptionId === opt.id;
                        const isCorrect = a.correctOptionId === opt.id;
                        let cls = 'border-transparent bg-secondary/50';
                        if (isCorrect) cls = 'border-saris-success/30 bg-saris-success/10';
                        if (isSelected && !isCorrect) cls = 'border-saris-danger/30 bg-saris-danger/10';

                        return (
                          <div key={opt.id} className={`flex items-center gap-2 border rounded-lg px-2.5 py-2 ${cls}`}>
                            <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                              isCorrect ? 'bg-saris-success text-primary-foreground' : isSelected ? 'bg-saris-danger text-primary-foreground' : 'bg-secondary text-muted-foreground'
                            }`}>
                              {arabicLetters[oi]}
                            </span>
                            <span className="font-tajawal text-xs text-foreground flex-1">{opt.textAr}</span>
                            {isCorrect && <CheckCircle2 className="w-4 h-4 text-saris-success" />}
                            {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-saris-danger" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Hint if used */}
                    {hint && (
                      <div className="mt-2 bg-saris-warning/10 border border-saris-warning/20 rounded-lg px-2.5 py-2 flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-saris-warning flex-shrink-0 mt-0.5" />
                        <p className="font-tajawal text-[11px] text-foreground leading-relaxed">{hint}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button onClick={onBack} className="w-full border border-border bg-card text-foreground font-tajawal font-bold text-sm rounded-xl h-10 mt-4">
          العودة للنتائج
        </button>
      </div>
    </motion.div>
  );
}
