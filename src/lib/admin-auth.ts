import { supabase } from "@/integrations/supabase/client";

export const ALLOWED_ADMIN_EMAILS = ["mohabx116@gmail.com", "mohandelnady33@gmail.com"] as const;

export type AdminAuthStatus =
  | "loading"
  | "login_required"
  | "access_denied"
  | "missing_role"
  | "auth_error"
  | "allowed";

export type AdminAuthState = {
  status: AdminAuthStatus;
  userId?: string;
  email?: string;
  setupError?: string;
  failedStep?: string;
  suggestedFix?: string;
};

const db = supabase as any;
const AUTH_TIMEOUT_MS = 10000;
type RoleCheckResult = {
  data: { role: string } | null;
  error: { message: string } | null;
};

function withTimeout<T>(promise: PromiseLike<T>, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(message)), AUTH_TIMEOUT_MS);
    Promise.resolve(promise)
      .then(resolve, reject)
      .finally(() => clearTimeout(timeout));
  });
}

function authError(
  failedStep: string,
  setupError: string,
  suggestedFix: string,
  userId?: string,
  email?: string,
): AdminAuthState {
  if (import.meta.env.DEV) {
    console.error("[Admin Auth]", { failedStep, setupError, userId, email });
  }

  return {
    status: "auth_error",
    userId,
    email,
    failedStep,
    setupError,
    suggestedFix,
  };
}

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
  let authResult: Awaited<ReturnType<typeof supabase.auth.getUser>>;

  try {
    authResult = await withTimeout(
      supabase.auth.getUser(),
      "Supabase auth check timed out. Check the public Supabase URL and publishable key.",
    );
  } catch (error) {
    return authError(
      "Supabase session/user check",
      error instanceof Error ? error.message : "Unable to read the authenticated Supabase user.",
      "Verify VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy.",
    );
  }

  const { data, error } = authResult;
  if (error) {
    return authError(
      "Supabase session/user check",
      error.message,
      "Sign out and sign in again. If this persists, verify the Supabase Auth configuration.",
    );
  }

  if (!data.user) return { status: "login_required" };

  const userId = data.user.id;
  const email = data.user.email?.toLowerCase();

  if (!email) {
    return authError(
      "Authenticated user email check",
      "The authenticated Supabase user has no email address.",
      "Use an email/password Supabase Auth user or a provider that returns an email address.",
      userId,
    );
  }

  if (!isAllowedAdminEmail(email)) return { status: "access_denied", userId, email };

  let existing: RoleCheckResult;

  try {
    existing = await withTimeout(
      supabase
        .from("user_roles")
        .select("role")
        .or(`user_id.eq.${userId},email.eq.${email}`)
        .eq("role", "admin")
        .maybeSingle(),
      "Admin role check timed out. Check Supabase RLS and network access.",
    );
  } catch (error) {
    return authError(
      "user_roles admin role query",
      error instanceof Error ? error.message : "Unable to query user_roles.",
      "Confirm the user_roles table exists, RLS is enabled, and the user can select their own role.",
      userId,
      email,
    );
  }

  if (existing.error) {
    return authError(
      "user_roles admin role query",
      existing.error.message,
      "Apply the auth migration and confirm user_roles has a select policy for the current user.",
      userId,
      email,
    );
  }

  if (existing.data?.role === "admin") return { status: "allowed", userId, email };

  let claimed: { data: boolean | null; error: { message: string } | null };

  try {
    claimed = await withTimeout(
      db.rpc("claim_allowed_admin_role"),
      "Admin role claim timed out. Check Supabase RPC/RLS configuration.",
    );
  } catch (error) {
    return authError(
      "claim_allowed_admin_role RPC",
      error instanceof Error ? error.message : "Unable to run claim_allowed_admin_role.",
      "Confirm the claim_allowed_admin_role function exists, then manually insert the admin row in user_roles if needed.",
      userId,
      email,
    );
  }

  if (!claimed.error && claimed.data === true) {
    let verified: typeof existing;

    try {
      verified = await withTimeout(
        supabase
          .from("user_roles")
          .select("role")
          .or(`user_id.eq.${userId},email.eq.${email}`)
          .eq("role", "admin")
          .maybeSingle(),
        "Admin role verification timed out. Check Supabase RLS and network access.",
      );
    } catch (error) {
      return authError(
        "user_roles admin role verification",
        error instanceof Error ? error.message : "Unable to verify the claimed admin role.",
        "Confirm the user_roles select policy lets the current user read their role.",
        userId,
        email,
      );
    }

    if (verified.error) {
      return authError(
        "user_roles admin role verification",
        verified.error.message,
        "Confirm the user_roles select policy lets the current user read their role.",
        userId,
        email,
      );
    }

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
