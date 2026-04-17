"use client";

import type { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/supabase/types";

type AuthStatus = "loading" | "ready";

type SignInOptions = {
  next?: string;
};

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  profile: ProfileRow | null;
  session: Session | null;
  isConfigured: boolean;
  signInWithMagicLink: (email: string, options?: SignInOptions) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseRef = useRef(createBrowserSupabaseClient());
  const supabase = supabaseRef.current;
  const isConfigured = supabase !== null;

  const [status, setStatus] = useState<AuthStatus>(isConfigured ? "loading" : "ready");
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const loadProfile = useCallback(
    async (userId: string | undefined) => {
      if (!supabase || !userId) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      setProfile((data as ProfileRow | null) ?? null);
    },
    [supabase]
  );

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setStatus("ready");
      void loadProfile(data.session?.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      void loadProfile(nextSession?.user.id);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signInWithMagicLink = useCallback<AuthContextValue["signInWithMagicLink"]>(
    async (email, opts) => {
      if (!supabase) {
        return { error: "Supabase is not configured." };
      }
      const params = new URLSearchParams();
      if (opts?.next) params.set("next", opts.next);
      const suffix = params.toString() ? `?${params.toString()}` : "";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback${suffix}` }
      });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    await loadProfile(session?.user.id);
  }, [loadProfile, session?.user.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      profile,
      session,
      isConfigured,
      signInWithMagicLink,
      signOut,
      refreshProfile
    }),
    [status, session, profile, isConfigured, signInWithMagicLink, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
