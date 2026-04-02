import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Transaction {
  id: string;
  type: string;
  reason: string;
  date: string;
  amount: number;
}

export function useTransactions() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(15);

      if (error) throw error;

      return (data ?? []).map((t) => ({
        id: t.id,
        type: t.type ?? "debit",
        reason: t.reason ?? "",
        date: t.created_at ?? "",
        amount: t.amount ?? 0,
      })) as Transaction[];
    },
  });

  return {
    transactions: data ?? [],
    loading: isLoading,
  };
}
