import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-saris-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-saris-navy animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Google OAuth users have email_confirmed_at set automatically.
  // Email/password users must verify their email first.
  const isOAuth = user.app_metadata?.provider !== "email";
  const isEmailVerified = !!user.email_confirmed_at;

  if (!isOAuth && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}
