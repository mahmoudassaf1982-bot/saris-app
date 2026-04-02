import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface PointsPack {
  id: string;
  label: string;
  points: number;
  price_usd: number;
  popular: boolean;
  country_id: string;
}

export function usePointsPacks(countryId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ["pointsPacks", countryId],
    enabled: !!countryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("points_packs")
        .select("*")
        .eq("country_id", countryId!)
        .eq("is_active", true)
        .order("points", { ascending: true });

      if (error) throw error;
      return (data ?? []) as PointsPack[];
    },
  });

  return { packs: data ?? [], loading: isLoading };
}
