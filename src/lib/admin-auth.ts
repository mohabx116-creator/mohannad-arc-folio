import { supabase } from "@/integrations/supabase/client";

export const ALLOWED_ADMIN_EMAILS = ["mohabx116@gmail.com", "mohandelnady33@gmail.com"] as const;

export type AdminAuthStatus =
  | "loading"
  | "login_required"
  | "access_denied"
  | "missing_role"
  | "allowed";

export type AdminAuthState = {
  status: AdminAuthStatus;
  userId?: string;
  email?: string;
  setupError?: string;
};

const db = supabase as any;

export function isAllowedAdminEmail(email?: string | null) {
  return !!email && ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase() as (typeof ALLOWED_ADMIN_EMAILS)[number]);
}

export async function signInWithGoogleAdmin() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/admin`,
    },
  });
}

export async function signInWithEmailAdmin(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function resolveAdminAuth(): Promise<AdminAuthState> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { status: "login_required" };

  const userId = data.user.id;
  const email = data.user.email?.toLowerCase();
  if (!isAllowedAdminEmail(email)) return { status: "access_denied", userId, email };

  const existing = await supabase
    .from("user_roles")
    .select("role")
    .or(`user_id.eq.${userId},email.eq.${email}`)
    .eq("role", "admin")
    .maybeSingle();

  if (existing.data?.role === "admin") return { status: "allowed", userId, email };

  const claimed = await db.rpc("claim_allowed_admin_role");
  if (!claimed.error && claimed.data === true) {
    const verified = await supabase
      .from("user_roles")
      .select("role")
      .or(`user_id.eq.${userId},email.eq.${email}`)
      .eq("role", "admin")
      .maybeSingle();
    if (verified.data?.role === "admin") return { status: "allowed", userId, email };
  }

  return {
    status: "missing_role",
    userId,
    email,
    setupError: claimed.error?.message ?? existing.error?.message,
  };
}

export async function requireAdminAction() {
  const state = await resolveAdminAuth();
  if (state.status !== "allowed") {
    throw new Error("Admin authorization is required for this CMS action.");
  }
}
