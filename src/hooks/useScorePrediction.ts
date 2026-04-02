import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export interface ScorePrediction {
  predicted_min: number;
  predicted_max: number;
  readiness_level: string;
  confidence: number;
  factors: {
    accuracy: number;
    difficultyHandling: number;
    timeEfficiency: number;
    consistencyTrend: number;
  };
  weak_sections: string[];
  strong_sections: string[];
}

export function useScorePrediction() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["scorePrediction", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_score_predictions")
        .select("*")
        .eq("student_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as ScorePrediction | null;
    },
  });

  return { prediction: data ?? null, loading: isLoading };
}
