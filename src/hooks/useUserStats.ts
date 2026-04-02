import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface ScoreJson {
  percentage?: number;
  [key: string]: unknown;
}

interface ExamSnapshot {
  template?: { name_ar?: string };
  [key: string]: unknown;
}

interface RecentSession {
  id: string;
  examName: string;
  date: string | null;
  score: number;
  passed: boolean;
  type: string | null;
}

interface UserStats {
  completedSessions: number;
  totalSessions: number;
  passCount: number;
  totalGraded: number;
  passRate: number;
  averageScore: number;
  bestScore: number;
}

export function useUserStats() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["userStats", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exam_sessions")
        .select("id, status, score_json, exam_snapshot, completed_at, session_type, started_at")
        .eq("user_id", user!.id)
        .order("started_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const sessions = data ?? [];
      const completed = sessions.filter((s) => s.status === "completed");
      const scores = completed
        .map((s) => (s.score_json as ScoreJson)?.percentage ?? 0)
        .filter((p) => p > 0);

      const passCount = scores.filter((p) => p >= 60).length;
      const totalGraded = completed.length;
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

      const stats: UserStats = {
        completedSessions: completed.length,
        totalSessions: sessions.length,
        passCount,
        totalGraded,
        passRate: totalGraded > 0 ? Math.round((passCount / totalGraded) * 100) : 0,
        averageScore,
        bestScore,
      };

      const recentSessions: RecentSession[] = completed.slice(0, 12).map((s) => {
        const snapshot = s.exam_snapshot as ExamSnapshot;
        const scoreJson = s.score_json as ScoreJson;
        const percentage = scoreJson?.percentage ?? 0;
        return {
          id: s.id,
          examName: snapshot?.template?.name_ar ?? "اختبار",
          date: s.completed_at,
          score: percentage,
          passed: percentage >= 60,
          type: s.session_type,
        };
      });

      return { stats, recentSessions };
    },
  });

  return {
    stats: data?.stats ?? null,
    recentSessions: data?.recentSessions ?? [],
    loading: isLoading,
  };
}
