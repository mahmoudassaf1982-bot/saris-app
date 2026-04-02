import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface LearningDNA {
  type: string;
  stage: string;
  confidence: number;
  trend: string;
  history: unknown;
}

export function useLearningDNA() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["learningDNA", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_learning_dna")
        .select("*")
        .eq("student_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        type: data.dna_type ?? "unknown",
        stage: data.evolution_stage ?? "beginner",
        confidence: data.confidence_score ?? 0,
        trend: data.trend_direction ?? "stable",
        history: data.history_json ?? null,
      } as LearningDNA;
    },
  });

  return {
    dna: data ?? null,
    loading: isLoading,
  };
}
