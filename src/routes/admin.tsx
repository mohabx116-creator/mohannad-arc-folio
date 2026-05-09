import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin · Mohannad El Nady" }] }),
});

function Admin() {
  const [session, setSession] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const s = session as { user?: { id: string } } | null;
    if (!s?.user) { setIsAdmin(null); return; }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", s.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  async function signInWithGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    setLoading(false);
    if (result.error) toast.error("Sign in failed");
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  const s = session as { user?: { email?: string; id: string } } | null;

  return (
    <main className="min-h-screen bg-onyx text-ivory">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link to="/" className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-ivory/60 hover:text-gold">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <span className="font-display text-xl text-gold">Admin</span>
        <span className="w-16" />
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
        {!s?.user ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="w-full max-w-md"
          >
            <Lock className="mx-auto h-6 w-6 text-gold" />
            <h1 className="mt-6 font-display text-4xl md:text-5xl">Studio Access</h1>
            <p className="mt-4 text-sm text-ivory/60">
              The admin dashboard is restricted to authorized accounts. Sign in with Google to continue.
            </p>
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="mt-10 w-full bg-ivory px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-onyx transition-colors hover:bg-gold disabled:opacity-50"
            >
              {loading ? "Connecting…" : "Continue with Google"}
            </button>
          </motion.div>
        ) : isAdmin === null ? (
          <p className="text-sm text-ivory/60">Verifying access…</p>
        ) : !isAdmin ? (
          <div className="max-w-md">
            <h1 className="font-display text-3xl">Access not authorized</h1>
            <p className="mt-4 text-sm text-ivory/60">
              You're signed in as <span className="text-ivory">{s.user.email}</span>. This account does not have admin access.
            </p>
            <p className="mt-4 text-xs text-ivory/40">
              To grant admin: in the database, insert a row in <code className="text-gold">user_roles</code> with this user_id and role = 'admin'.
            </p>
            <p className="mt-2 text-xs text-gold/80 break-all">user_id: {s.user.id}</p>
            <button onClick={signOut} className="mt-8 border border-ivory/30 px-6 py-3 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold">
              Sign out
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl text-left">
            <h1 className="font-display text-4xl md:text-5xl">Welcome back.</h1>
            <p className="mt-3 text-sm text-ivory/60">Signed in as {s.user.email}</p>
            <div className="mt-12 grid gap-px bg-ivory/10 md:grid-cols-2">
              {[
                { t: "Projects", d: "Add, edit, reorder, and publish projects." },
                { t: "Media Library", d: "Upload images and project files (PDF, DWG, RVT, ZIP)." },
                { t: "Sections", d: "Edit hero, about, services, skills, contact." },
                { t: "AI Knowledge", d: "Manage Gemini assistant knowledge base." },
              ].map((c) => (
                <div key={c.t} className="bg-onyx p-8">
                  <h3 className="font-display text-2xl text-gold">{c.t}</h3>
                  <p className="mt-2 text-sm text-ivory/60">{c.d}</p>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-ivory/40">Coming next iteration</p>
                </div>
              ))}
            </div>
            <button onClick={signOut} className="mt-10 border border-ivory/30 px-6 py-3 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold">
              Sign out
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
