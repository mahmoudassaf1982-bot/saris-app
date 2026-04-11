import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle hash fragments from email verification links
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user?.email_confirmed_at) {
          // Email is verified, proceed to app
          navigate("/app", { replace: true });
        } else if (type === "signup" || type === "email") {
          // Just verified, refresh session to get updated user
          supabase.auth.refreshSession().then(({ data }) => {
            if (data.session?.user?.email_confirmed_at) {
              navigate("/app", { replace: true });
            } else {
              navigate("/verify-email", { replace: true });
            }
          });
        } else {
          navigate("/app", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
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
