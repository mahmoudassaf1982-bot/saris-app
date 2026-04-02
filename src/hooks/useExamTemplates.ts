import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useExamTemplates(countryId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ["examTemplates", countryId],
    enabled: !!countryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exam_templates")
        .select("*, exam_sections(*)")
        .eq("country_id", countryId!);

      if (error) throw error;
      return data ?? [];
    },
  });

  return {
    templates: data ?? [],
    loading: isLoading,
  };
}
