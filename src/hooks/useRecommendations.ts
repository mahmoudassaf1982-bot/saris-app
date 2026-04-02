import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export interface Recommendation {
  id: string;
  weakness_key: string;
  recommendation_json: {
    title?: string;
    sectionName?: string;
    currentScore?: number;
    targetScore?: number;
    reason?: string;
    duration?: string;
    difficulty?: string;
  };
  recommendation_type: string;
  target_section: string | null;
  difficulty: string | null;
  reason_text: string | null;
}

export function useRecommendations() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["recommendations", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_training_recommendations")
        .select("*")
        .eq("student_id", user!.id)
        .eq("is_completed", false)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return (data ?? []) as Recommendation[];
    },
  });

  return { recommendations: data ?? [], loading: isLoading };
}
