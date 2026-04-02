import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Skill {
  name: string;
  score: number;
}

export function useSkillMap() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["skillMap", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_memory_profile")
        .select("strength_map, weakness_map")
        .eq("student_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return [];

      const strengthMap = (data.strength_map ?? {}) as Record<string, number>;
      const skills: Skill[] = Object.entries(strengthMap).map(([name, score]) => ({
        name,
        score: typeof score === "number" ? score : 0,
      }));

      return skills.sort((a, b) => b.score - a.score);
    },
  });

  return {
    skills: data ?? [],
    loading: isLoading,
  };
}
