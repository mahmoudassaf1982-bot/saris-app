import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate("/app", { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-saris-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-saris-navy animate-spin mx-auto mb-4" />
        <p className="font-tajawal text-saris-text-2 text-sm">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
}
