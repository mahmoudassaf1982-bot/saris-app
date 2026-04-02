import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  country_id: string | null;
  country_name: string | null;
  is_diamond: boolean;
  is_admin: boolean;
  referral_code: string | null;
  welcome_seen: boolean;
  has_completed_first_session: boolean;
  created_at: string | null;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function fetchUserData(userId: string): Promise<Profile | null> {
  const [profileRes, walletRes, roleRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("wallets").select("balance").eq("user_id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);

  if (profileRes.error) {
    console.error("Error fetching profile:", profileRes.error.message);
    return null;
  }

  if (!profileRes.data) return null;

  const p = profileRes.data;
  const balance = walletRes.data?.balance ?? 0;
  const roles: string[] = (roleRes.data ?? []).map((r: { role: string }) => r.role);
  const isAdmin = roles.includes("admin");

  return {
    id: p.id,
    first_name: p.first_name ?? null,
    last_name: p.last_name ?? null,
    email: p.email ?? null,
    country_id: p.country_id ?? null,
    country_name: p.country_name ?? null,
    is_diamond: p.is_diamond ?? false,
    is_admin: isAdmin,
    referral_code: p.referral_code ?? null,
    welcome_seen: p.welcome_seen ?? false,
    has_completed_first_session: p.has_completed_first_session ?? false,
    created_at: p.created_at ?? null,
    balance,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const data = await fetchUserData(userId);
    setProfile(data);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          setTimeout(async () => {
            await loadProfile(newSession.user.id);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        loadProfile(existingSession.user.id).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
