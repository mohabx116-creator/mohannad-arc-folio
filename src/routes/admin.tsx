import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Eye, FileUp, GripVertical, Library, Lock, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { alSe7r } from "@/lib/al-se7r-data";
import { type AdminAuthState, requireAdminAction, resolveAdminAuth, signInWithEmailAdmin, signInWithGoogleAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Portfolio CMS - Mohannad" }] }),
});

type ProjectRow = {
  id?: string;
  title: string;
  subtitle?: string | null;
  slug?: string | null;
  category?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  cover_image?: string | null;
  hero_asset_id?: string | null;
  cover_asset_id?: string | null;
  is_featured?: boolean;
  is_published?: boolean;
  display_order?: number;
  metadata?: Record<string, unknown>;
};
type SectionRow = {
  id?: string;
  project_id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  category?: string | null;
  is_published?: boolean;
  display_order?: number;
  metadata?: Record<string, unknown> | null;
};
type AssetRow = {
  id?: string;
  project_id: string;
  section_id?: string | null;
  file_url: string;
  storage_path: string;
  original_filename?: string | null;
  display_name: string;
  caption?: string | null;
  asset_type: string;
  mime_type?: string | null;
  category?: string | null;
  metadata?: Record<string, unknown> | null;
  is_hero?: boolean;
  is_cover?: boolean;
  is_published?: boolean;
  display_order?: number;
};
type SiteContentRow = { id?: string; key: string; value?: string | null; type?: string };
type ContactInfoRow = { id?: number; email?: string | null; phone?: string | null; whatsapp?: string | null; linkedin?: string | null };
type FieldOption = { label: string; value: string; preview?: string; meta?: string };

const db = supabase as any;
const assetTypeOptions = ["image", "pdf", "render", "plan", "elevation", "section", "poster", "board", "other"].map((value) => ({ label: value, value }));
const categoryOptions = [
  "Overview",
  "Master Planning",
  "Basement & Parking",
  "Commercial Mall",
  "Hospitality",
  "Workplace",
  "Elevations & Sections",
  "Visualization",
  "Final Presentation",
].map((value) => ({ label: value, value }));

export default function Admin() {
  const [auth, setAuth] = useState<AdminAuthState>({ status: "loading" });
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailLoginError, setEmailLoginError] = useState("");
  const [emailLogin, setEmailLogin] = useState({ email: "", password: "" });

  async function recheckAccess() {
    setAuth({ status: "loading" });
    setAuth(await resolveAdminAuth());
  }

  useEffect(() => {
    recheckAccess();
    const { data: sub } = supabase.auth.onAuthStateChange(() => recheckAccess());
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    setLoading(true);
    const result = await signInWithGoogleAdmin();
    setLoading(false);
    if (result.error) toast.error("Sign in failed.");
  }

  async function signInWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailLoginError("");
    setEmailLoading(true);
    const result = await signInWithEmailAdmin(emailLogin.email.trim(), emailLogin.password);
    setEmailLoading(false);

    if (result.error) {
      setEmailLoginError(result.error.message || "Email sign in failed.");
      return;
    }

    await recheckAccess();
  }

  async function signOut() {
    await supabase.auth.signOut();
    setAuth({ status: "login_required" });
    toast.success("Signed out.");
  }

  if (auth.status === "loading") {
    return <Shell><p className="px-6 py-24 text-center text-sm text-ivory/60">Verifying admin access...</p></Shell>;
  }

  if (auth.status === "login_required") {
    return (
      <Shell>
        <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col items-center justify-center px-6 text-center">
          <Lock className="h-6 w-6 text-gold" />
          <h1 className="mt-6 font-display text-5xl">Admin Studio</h1>
          <p className="mt-4 text-sm leading-relaxed text-ivory/60">
            Manage Mohannad's architectural portfolio, project sections, media, and presentation content.
          </p>
          <button onClick={signInWithGoogle} disabled={loading} className="mt-10 w-full bg-ivory px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-onyx hover:bg-gold disabled:opacity-50">
            {loading ? "Connecting..." : "Continue with Google"}
          </button>
          <div className="my-8 flex w-full items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-ivory/35">
            <span className="h-px flex-1 bg-ivory/10" />
            Or
            <span className="h-px flex-1 bg-ivory/10" />
          </div>
          <form onSubmit={signInWithEmail} className="w-full space-y-4 text-left">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/45">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={emailLogin.email}
                onChange={(event) => setEmailLogin((current) => ({ ...current, email: event.target.value }))}
                className="mt-2 w-full border border-ivory/20 bg-onyx px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/45">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={emailLogin.password}
                onChange={(event) => setEmailLogin((current) => ({ ...current, password: event.target.value }))}
                className="mt-2 w-full border border-ivory/20 bg-onyx px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold"
              />
            </label>
            {emailLoginError && (
              <p className="border border-red-300/30 bg-red-500/10 px-4 py-3 text-xs leading-relaxed text-red-100">
                {emailLoginError}
              </p>
            )}
            <button
              type="submit"
              disabled={emailLoading}
              className="w-full border border-gold px-8 py-4 text-center text-[11px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-onyx disabled:opacity-50"
            >
              {emailLoading ? "Signing in..." : "Sign in with Email"}
            </button>
          </form>
          <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-ivory/35">Access is restricted to authorized admin accounts only.</p>
        </section>
      </Shell>
    );
  }

  if (auth.status === "access_denied") {
    return (
      <Shell>
        <section className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="font-display text-5xl">Access Denied</h1>
          <p className="mt-4 text-sm text-ivory/60">This account is authenticated but not authorized to access the portfolio CMS.</p>
          <p className="mt-5 break-all text-xs text-gold/80">email: {auth.email}</p>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={signOut} className="border border-ivory/25 px-6 py-3 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold">Logout</button>
            <Link to="/portfolio" className="border border-ivory/25 px-6 py-3 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold">Return to Portfolio</Link>
          </div>
        </section>
      </Shell>
    );
  }

  if (auth.status === "missing_role") {
    return (
      <Shell>
        <section className="mx-auto max-w-2xl px-6 py-24">
          <h1 className="text-center font-display text-5xl">Admin Role Setup Required</h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-ivory/60">
            Login succeeded, but the admin role has not been created in Supabase yet.
          </p>
          <div className="mt-8 border border-ivory/10 bg-ivory/[0.03] p-6">
            <CopyLine label="user_id" value={auth.userId ?? ""} />
            <CopyLine label="email" value={auth.email ?? ""} />
            <CopyLine label="role" value="admin" />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ivory/60">
            Open Supabase Dashboard &gt; Table Editor &gt; user_roles and insert a row with these values. Automatic role creation is only attempted for the two allowed Gmail accounts and may be blocked by RLS until the migration is applied.
          </p>
          {auth.setupError && <p className="mt-3 text-xs text-gold/70">Setup detail: {auth.setupError}</p>}
          <div className="mt-8 flex gap-3">
            <button onClick={recheckAccess} className="bg-ivory px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-onyx hover:bg-gold">Recheck Access</button>
            <button onClick={signOut} className="border border-ivory/25 px-6 py-3 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold">Logout</button>
          </div>
        </section>
      </Shell>
    );
  }

  return <CmsApp userEmail={auth.email} onSignOut={signOut} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-onyx text-ivory">
      <header className="flex items-center justify-between border-b border-ivory/10 px-6 py-5 md:px-12">
        <Link to="/" className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-ivory/60 hover:text-gold">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <span className="font-display text-2xl text-gold">Portfolio CMS</span>
        <span className="w-16" />
      </header>
      {children}
    </main>
  );
}

function CopyLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-ivory/10 py-3 last:border-b-0">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{label}</p>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value);
          toast.success("Copied.");
        }}
        className="mt-2 block w-full break-all text-left font-mono text-xs text-ivory/80 hover:text-gold"
      >
        {value || "-"}
      </button>
    </div>
  );
}

function CmsApp({ userEmail, onSignOut }: { userEmail?: string; onSignOut: () => void }) {
  const [mode, setMode] = useState<"preview" | "projects" | "sections" | "assets" | "site">("preview");
  const qc = useQueryClient();
  const projects = useQuery({ queryKey: ["cms-projects"], queryFn: fetchProjects });
  const projectId = projects.data?.[0]?.id;
  const sections = useQuery({ queryKey: ["cms-sections", projectId], queryFn: () => fetchSections(projectId), enabled: !!projectId });
  const assets = useQuery({ queryKey: ["cms-assets", projectId], queryFn: () => fetchAssets(projectId), enabled: !!projectId });
  const allAssets = useQuery({ queryKey: ["cms-assets-all"], queryFn: fetchAllAssets });
  const site = useQuery({ queryKey: ["cms-site"], queryFn: fetchSiteContent });
  const contact = useQuery({ queryKey: ["cms-contact"], queryFn: fetchContactInfo });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cms-projects"] });
    qc.invalidateQueries({ queryKey: ["cms-sections"] });
    qc.invalidateQueries({ queryKey: ["cms-assets"] });
    qc.invalidateQueries({ queryKey: ["cms-assets-all"] });
    qc.invalidateQueries({ queryKey: ["cms-site"] });
    qc.invalidateQueries({ queryKey: ["cms-contact"] });
  };

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <div className="flex flex-col justify-between gap-5 border-b border-ivory/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Signed in as {userEmail}</p>
            <h1 className="mt-3 font-display text-5xl">Editorial portfolio editor</h1>
          </div>
          <button onClick={onSignOut} className="self-start border border-ivory/20 px-5 py-3 text-[10px] uppercase tracking-[0.25em] hover:border-gold hover:text-gold">Sign out</button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {[
            ["preview", Eye],
            ["projects", Pencil],
            ["sections", Plus],
            ["assets", Library],
            ["site", Save],
          ].map(([key, Icon]) => (
            <button key={String(key)} onClick={() => setMode(key as typeof mode)} className={`inline-flex items-center gap-2 border px-4 py-2 text-[10px] uppercase tracking-[0.25em] ${mode === key ? "border-gold bg-gold text-onyx" : "border-ivory/15 hover:border-gold hover:text-gold"}`}>
              <Icon className="h-3.5 w-3.5" /> {String(key)}
            </button>
          ))}
        </div>

        {projects.isLoading ? (
          <p className="py-16 text-sm text-ivory/60">Loading CMS data...</p>
        ) : (
          <div className="mt-10">
            {mode === "preview" && <PreviewPanel project={projects.data?.[0]} sections={sections.data ?? []} assets={assets.data ?? []} />}
            {mode === "projects" && <ProjectsPanel projects={projects.data ?? []} assets={allAssets.data ?? []} invalidate={invalidate} />}
            {mode === "sections" && projectId && <SectionsPanel projectId={projectId} sections={sections.data ?? []} invalidate={invalidate} />}
            {mode === "assets" && projectId && <AssetsPanel projectId={projectId} sections={sections.data ?? []} assets={assets.data ?? []} invalidate={invalidate} />}
            {mode === "site" && <SitePanel rows={site.data ?? []} contact={contact.data} invalidate={invalidate} />}
          </div>
        )}
      </div>
    </Shell>
  );
}

async function fetchProjects(): Promise<ProjectRow[]> {
  const { data, error } = await db.from("projects").select("*").order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function fetchSections(projectId?: string): Promise<SectionRow[]> {
  if (!projectId) return [];
  const { data, error } = await db.from("portfolio_sections").select("*").eq("project_id", projectId).order("display_order");
  if (error) throw error;
  return data ?? [];
}

async function fetchAssets(projectId?: string): Promise<AssetRow[]> {
  if (!projectId) return [];
  const { data, error } = await db.from("portfolio_assets").select("*").eq("project_id", projectId).order("display_order");
  if (error) throw error;
  return data ?? [];
}

async function fetchAllAssets(): Promise<AssetRow[]> {
  const { data, error } = await db.from("portfolio_assets").select("*").order("display_order");
  if (error) throw error;
  return data ?? [];
}

async function fetchSiteContent(): Promise<SiteContentRow[]> {
  const { data, error } = await db.from("site_content").select("*").order("key");
  if (error) throw error;
  return data ?? [];
}

async function fetchContactInfo(): Promise<ContactInfoRow | null> {
  const { data, error } = await db.from("contact_info").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data ?? { id: 1 };
}

function PreviewPanel({ project, sections, assets }: { project?: ProjectRow; sections: SectionRow[]; assets: AssetRow[] }) {
  const hero =
    assets.find((asset) => asset.id === project?.hero_asset_id)?.file_url ??
    assets.find((asset) => asset.is_hero)?.file_url ??
    project?.cover_image ??
    alSe7r.hero;
  return (
    <section className="overflow-hidden border border-ivory/10">
      <div className="relative min-h-[520px]">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-onyx" />
        <div className="relative p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Preview mode</p>
          <h2 className="mt-5 max-w-4xl font-display text-6xl">{project?.title ?? alSe7r.title}</h2>
          <p className="mt-5 max-w-2xl text-lg text-ivory/75">{project?.long_description ?? alSe7r.longDescription}</p>
        </div>
      </div>
      <div className="grid gap-px bg-ivory/10 md:grid-cols-2">
        {sections.map((section) => (
          <article key={section.id} className="bg-onyx p-7">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{section.category}</p>
            <h3 className="mt-2 font-display text-3xl">{section.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ivory/60">{section.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsPanel({ projects, assets, invalidate }: { projects: ProjectRow[]; assets: AssetRow[]; invalidate: () => void }) {
  return (
    <CrudPanel
      title="Projects"
      empty="No projects yet."
      rows={projects}
      createDefaults={() => ({ title: "Untitled Project", slug: "untitled-project", category: "Architecture", is_published: false, is_featured: false, display_order: projects.length + 1 })}
      save={async (row) => {
        const payload = row as ProjectRow;
        const { error } = payload.id ? await db.from("projects").update(payload).eq("id", payload.id) : await db.from("projects").insert(payload);
        if (error) throw error;
        if (payload.id) await syncProjectHeroCover(payload.id, payload.hero_asset_id ?? null, payload.cover_asset_id ?? null);
      }}
      remove={async (row) => {
        const { error } = await db.from("projects").delete().eq("id", row.id);
        if (error) throw error;
      }}
      fields={["title", "subtitle", "slug", "category", "short_description", "long_description", "cover_image", "hero_asset_id", "cover_asset_id", "display_order", "is_featured", "is_published"]}
      invalidate={invalidate}
      fieldOptions={(editing) => ({
        hero_asset_id: buildHeroCoverOptions(assets.filter((asset) => asset.project_id === editing.id)),
        cover_asset_id: buildHeroCoverOptions(assets.filter((asset) => asset.project_id === editing.id)),
      })}
      onReorder={(ordered) => updateDisplayOrder("projects", ordered)}
    />
  );
}

function SectionsPanel({ projectId, sections, invalidate }: { projectId: string; sections: SectionRow[]; invalidate: () => void }) {
  return (
    <CrudPanel
      title="Sections"
      empty="Create the first project section."
      rows={sections}
      createDefaults={() => ({ project_id: projectId, title: "New Section", category: "Overview", is_published: true, display_order: sections.length + 1 })}
      save={async (row) => {
        const payload = row as SectionRow;
        const { error } = payload.id ? await db.from("portfolio_sections").update(payload).eq("id", payload.id) : await db.from("portfolio_sections").insert(payload);
        if (error) throw error;
      }}
      remove={async (row) => {
        const { error } = await db.from("portfolio_sections").delete().eq("id", row.id);
        if (error) throw error;
      }}
      fields={["title", "subtitle", "description", "category", "display_order", "is_published"]}
      invalidate={invalidate}
      fieldOptions={{ category: categoryOptions }}
      onReorder={(ordered) => updateDisplayOrder("portfolio_sections", ordered)}
    />
  );
}

function AssetsPanel({ projectId, sections, assets, invalidate }: { projectId: string; sections: SectionRow[]; assets: AssetRow[]; invalidate: () => void }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const filtered = typeFilter === "all" ? assets : assets.filter((asset) => asset.asset_type === typeFilter || asset.category === typeFilter);
  const groups = [
    ...sections.map((section) => ({
      id: section.id ?? "",
      title: section.title,
      rows: filtered.filter((asset) => asset.section_id === section.id).sort(sortByOrder),
    })),
    {
      id: "unassigned",
      title: "Unassigned Assets",
      rows: filtered.filter((asset) => !asset.section_id).sort(sortByOrder),
    },
  ].filter((group) => group.rows.length > 0 || typeFilter === "all");

  const saveAsset = async (row: Partial<AssetRow>) => {
    const payload = row as AssetRow;
    let savedId = payload.id;
    if (payload.id) {
      const { error } = await db.from("portfolio_assets").update(payload).eq("id", payload.id);
      if (error) throw error;
    } else {
      const { data, error } = await db.from("portfolio_assets").insert(payload).select("id").single();
      if (error) throw error;
      savedId = data?.id;
    }
    if (savedId) await syncAssetHeroCover(payload.project_id, savedId, payload.is_hero === true, payload.is_cover === true);
  };

  const removeAsset = async (row: AssetRow) => {
    if (row.is_hero) await db.from("projects").update({ hero_asset_id: null }).eq("id", row.project_id);
    if (row.is_cover) await db.from("projects").update({ cover_asset_id: null }).eq("id", row.project_id);
    const { error } = await db.from("portfolio_assets").delete().eq("id", row.id);
    if (error) throw error;
  };

  return (
    <div className="space-y-8">
      <UploadCard projectId={projectId} sections={sections} invalidate={invalidate} />
      <div className="flex flex-wrap gap-2">
        {["all", "image", "pdf", "render", "plan", "elevation", "section", "poster"].map((filter) => (
          <button key={filter} onClick={() => setTypeFilter(filter)} className={`border px-3 py-2 text-[10px] uppercase tracking-[0.22em] ${typeFilter === filter ? "border-gold bg-gold text-onyx" : "border-ivory/15 hover:border-gold"}`}>{filter}</button>
        ))}
      </div>
      <div className="space-y-8">
        {groups.map((group) => (
          <CrudPanel
            key={group.id}
            title={`Media Library / ${group.title}`}
            empty="No assets in this section yet."
            rows={group.rows}
            createDefaults={() => ({ project_id: projectId, section_id: group.id === "unassigned" ? null : group.id, file_url: "", storage_path: "", display_name: "New Asset", asset_type: "image", category: "other", is_published: true, display_order: group.rows.length + 1 })}
            save={saveAsset}
            remove={removeAsset}
            fields={["display_name", "caption", "category", "asset_type", "file_url", "storage_path", "section_id", "display_order", "is_hero", "is_cover", "is_published"]}
            invalidate={invalidate}
            fieldOptions={{
              section_id: sections.slice().sort(sortByOrder).map((section) => ({ label: section.title, value: section.id ?? "" })),
              asset_type: assetTypeOptions,
              category: categoryOptions,
            }}
            renderExtra={(row) => row.file_url ? <AssetPreview asset={row as AssetRow} /> : null}
            renderActions={(row) => (
              <div className="flex flex-col gap-2">
                <ReplaceAssetFile asset={row as AssetRow} invalidate={invalidate} />
                {(row as AssetRow).asset_type === "pdf" && <ReplacePdfThumbnail asset={row as AssetRow} invalidate={invalidate} />}
              </div>
            )}
            onReorder={typeFilter === "all" ? (ordered) => updateDisplayOrder("portfolio_assets", ordered) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function UploadCard({ projectId, sections, invalidate }: { projectId: string; sections: SectionRow[]; invalidate: () => void }) {
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      await requireAdminAction();
    } catch (error) {
      setUploading(false);
      toast.error(error instanceof Error ? error.message : "Admin authorization is required.");
      return;
    }
    const selected = Array.from(files);
    for (const [index, file] of selected.entries()) {
      setUploadStatus(`Uploading ${index + 1} of ${selected.length}: ${file.name}`);
      const safe = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
      const path = `al-se7r/${safe}`;
      const { error: uploadError } = await supabase.storage.from("portfolio-assets").upload(path, file, { upsert: true });
      if (uploadError) {
        toast.error(`Upload failed: ${file.name}`);
        continue;
      }
      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
      const assetType = file.type.includes("pdf") ? "pdf" : file.type.startsWith("image/") ? "image" : "file";
      const { error } = await db.from("portfolio_assets").insert({
        project_id: projectId,
        section_id: sectionId || null,
        storage_path: path,
        file_url: data.publicUrl,
        original_filename: file.name,
        display_name: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        caption: "",
        asset_type: assetType,
        mime_type: file.type,
        file_size: file.size,
        category: assetType,
        is_published: true,
      });
      if (error) toast.error(`Database insert failed: ${file.name}`);
    }
    setUploading(false);
    setUploadStatus("");
    invalidate();
    toast.success("Upload complete.");
  }

  return (
    <div className="border border-ivory/10 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Upload</p>
          <h3 className="mt-2 font-display text-3xl">Add files to the media library</h3>
        </div>
        <select value={sectionId} onChange={(event) => setSectionId(event.target.value)} className="border border-ivory/20 bg-onyx px-4 py-3 text-sm">
          {sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
        </select>
      </div>
      <label className="mt-6 flex cursor-pointer flex-col items-center justify-center border border-dashed border-ivory/20 p-10 text-center hover:border-gold">
        <FileUp className="h-6 w-6 text-gold" />
        <span className="mt-3 text-sm text-ivory/70">{uploading ? "Uploading..." : "Select images, PDFs, boards, drawings, or files"}</span>
        {uploadStatus && <span className="mt-2 max-w-full truncate text-xs text-gold/80">{uploadStatus}</span>}
        <input type="file" multiple className="hidden" onChange={(event) => onFiles(event.target.files)} />
      </label>
    </div>
  );
}

function ReplaceAssetFile({ asset, invalidate }: { asset: AssetRow; invalidate: () => void }) {
  async function replaceFile(file: File | undefined) {
    if (!file || !asset.id) return;
    try {
      await requireAdminAction();
      const safe = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
      const path = `al-se7r/${safe}`;
      const { error: uploadError } = await supabase.storage.from("portfolio-assets").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
      const assetType = file.type.includes("pdf") ? "pdf" : file.type.startsWith("image/") ? "image" : "file";
      const { error } = await db.from("portfolio_assets").update({
        storage_path: path,
        file_url: data.publicUrl,
        original_filename: file.name,
        asset_type: assetType,
        mime_type: file.type,
        file_size: file.size,
      }).eq("id", asset.id);
      if (error) throw error;
      toast.success("Asset file replaced.");
      invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Replace failed.");
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 border border-ivory/20 px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-gold hover:text-gold">
      Replace
      <input type="file" className="hidden" onChange={(event) => replaceFile(event.target.files?.[0])} />
    </label>
  );
}

function ReplacePdfThumbnail({ asset, invalidate }: { asset: AssetRow; invalidate: () => void }) {
  async function uploadThumbnail(file: File | undefined) {
    if (!file || !asset.id) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Upload an image preview for the PDF.");
      return;
    }
    try {
      await requireAdminAction();
      const safe = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
      const path = `al-se7r/pdf-thumbnails/${safe}`;
      const { error: uploadError } = await supabase.storage.from("portfolio-assets").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
      const metadata = { ...(asset.metadata ?? {}), thumbnail_url: data.publicUrl };
      const { error } = await db.from("portfolio_assets").update({ metadata }).eq("id", asset.id);
      if (error) throw error;
      toast.success("PDF preview image updated.");
      invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Preview update failed.");
    }
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 border border-ivory/20 px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-gold hover:text-gold">
      PDF Preview
      <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadThumbnail(event.target.files?.[0])} />
    </label>
  );
}

function SitePanel({ rows, contact, invalidate }: { rows: SiteContentRow[]; contact?: ContactInfoRow | null; invalidate: () => void }) {
  return (
    <div className="space-y-10">
      <CrudPanel
        title="Site Text"
        empty="No editable site text yet."
        rows={rows}
        createDefaults={() => ({ key: "new.content.key", value: "", type: "text" })}
        save={async (row) => {
          const payload = row as SiteContentRow;
          const { error } = payload.id ? await db.from("site_content").update(payload).eq("id", payload.id) : await db.from("site_content").insert(payload);
          if (error) throw error;
        }}
        remove={async (row) => {
          const { error } = await db.from("site_content").delete().eq("id", row.id);
          if (error) throw error;
        }}
        fields={["key", "value", "type"]}
        invalidate={invalidate}
      />
      <CrudPanel
        title="Contact Information"
        empty="No contact information yet."
        rows={contact ? [contact] : []}
        createDefaults={() => ({ id: 1, email: "", phone: "", whatsapp: "", linkedin: "" })}
        save={async (row) => {
          const payload = { id: 1, ...(row as ContactInfoRow) };
          const { error } = await db.from("contact_info").upsert(payload);
          if (error) throw error;
        }}
        remove={async () => {
          const { error } = await db.from("contact_info").update({ email: null, phone: null, whatsapp: null, linkedin: null }).eq("id", 1);
          if (error) throw error;
        }}
        fields={["email", "phone", "whatsapp", "linkedin"]}
        invalidate={invalidate}
      />
    </div>
  );
}

async function updateDisplayOrder<T extends { id?: string }>(table: string, rows: T[]) {
  await requireAdminAction();
  const updates = rows.map((row, index) => {
    if (!row.id) return Promise.resolve({ error: null });
    return db.from(table).update({ display_order: index + 1 }).eq("id", row.id);
  });
  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

function sortByOrder<T extends { display_order?: number }>(a: T, b: T) {
  return (a.display_order ?? 0) - (b.display_order ?? 0);
}

function isVisualAsset(asset: AssetRow) {
  return asset.asset_type === "image" || asset.asset_type === "render" || asset.asset_type === "poster" || asset.asset_type === "board" || asset.mime_type?.startsWith("image/");
}

function buildHeroCoverOptions(assets: AssetRow[]): FieldOption[] {
  return assets
    .filter(isVisualAsset)
    .sort((a, b) => visualRank(a) - visualRank(b) || sortByOrder(a, b))
    .map((asset) => ({
      label: asset.display_name,
      value: asset.id ?? "",
      preview: asset.file_url,
      meta: [asset.category, asset.asset_type].filter(Boolean).join(" / "),
    }));
}

function visualRank(asset: AssetRow) {
  if (asset.category === "render" || asset.asset_type === "render") return 1;
  if (asset.category === "poster" || asset.asset_type === "poster" || asset.asset_type === "board") return 2;
  if (asset.asset_type === "image" || asset.mime_type?.startsWith("image/")) return 3;
  return 9;
}

async function syncProjectHeroCover(projectId: string, heroAssetId: string | null, coverAssetId: string | null) {
  await db.from("portfolio_assets").update({ is_hero: false }).eq("project_id", projectId);
  await db.from("portfolio_assets").update({ is_cover: false }).eq("project_id", projectId);
  if (heroAssetId) await db.from("portfolio_assets").update({ is_hero: true }).eq("id", heroAssetId).eq("project_id", projectId);
  if (coverAssetId) await db.from("portfolio_assets").update({ is_cover: true }).eq("id", coverAssetId).eq("project_id", projectId);
}

async function syncAssetHeroCover(projectId: string, assetId: string, makeHero: boolean, makeCover: boolean) {
  if (makeHero) {
    await db.from("portfolio_assets").update({ is_hero: false }).eq("project_id", projectId);
    await db.from("portfolio_assets").update({ is_hero: true }).eq("id", assetId).eq("project_id", projectId);
    await db.from("projects").update({ hero_asset_id: assetId }).eq("id", projectId);
  } else {
    await db.from("projects").update({ hero_asset_id: null }).eq("id", projectId).eq("hero_asset_id", assetId);
  }
  if (makeCover) {
    await db.from("portfolio_assets").update({ is_cover: false }).eq("project_id", projectId);
    await db.from("portfolio_assets").update({ is_cover: true }).eq("id", assetId).eq("project_id", projectId);
    await db.from("projects").update({ cover_asset_id: assetId }).eq("id", projectId);
  } else {
    await db.from("projects").update({ cover_asset_id: null }).eq("id", projectId).eq("cover_asset_id", assetId);
  }
}

function CrudPanel<T extends Record<string, any>>({
  title,
  empty,
  rows,
  fields,
  createDefaults,
  save,
  remove,
  invalidate,
  renderExtra,
  renderActions,
  fieldOptions,
  onReorder,
}: {
  title: string;
  empty: string;
  rows: T[];
  fields: string[];
  createDefaults: () => Partial<T>;
  save: (row: Partial<T>) => Promise<void>;
  remove: (row: T) => Promise<void>;
  invalidate: () => void;
  renderExtra?: (row: T) => React.ReactNode;
  renderActions?: (row: T) => React.ReactNode;
  fieldOptions?: Record<string, FieldOption[]> | ((editing: Partial<T>) => Record<string, FieldOption[]>);
  onReorder?: (rows: T[]) => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [orderedRows, setOrderedRows] = useState<T[]>(rows);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const activeFieldOptions = typeof fieldOptions === "function" && editing ? fieldOptions(editing) : fieldOptions;

  useEffect(() => setOrderedRows(rows), [rows]);

  const mutation = useMutation({
    mutationFn: async (row: Partial<T>) => {
      await requireAdminAction();
      await save(row);
    },
    onSuccess: () => {
      toast.success("Saved.");
      setEditing(null);
      invalidate();
    },
    onError: () => toast.error("Save failed."),
  });

  async function commitReorder(targetId: string) {
    if (!draggedId || draggedId === targetId || !onReorder) return;
    const from = orderedRows.findIndex((row) => String(row.id) === draggedId);
    const to = orderedRows.findIndex((row) => String(row.id) === targetId);
    if (from < 0 || to < 0) return;
    const next = [...orderedRows];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    const reordered = next.map((row, index) => ({ ...row, display_order: index + 1 }));
    const previous = orderedRows;
    setOrderedRows(reordered);
    setReordering(true);
    try {
      await onReorder(reordered);
      toast.success("Order updated.");
      invalidate();
    } catch (error) {
      setOrderedRows(previous);
      toast.error(error instanceof Error ? error.message : "Reorder failed.");
    } finally {
      setDraggedId(null);
      setReordering(false);
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-4xl">{title}</h2>
          {onReorder && <p className="mt-2 text-xs text-ivory/45">{reordering ? "Saving order..." : "Drag the handle to reorder. Numeric order remains available as fallback."}</p>}
        </div>
        <button onClick={() => setEditing(createDefaults())} className="inline-flex items-center gap-2 bg-ivory px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-onyx hover:bg-gold">
          <Plus className="h-3.5 w-3.5" /> Create
        </button>
      </div>

      {editing && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate(editing);
          }}
          className="mb-8 border border-gold/50 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <EditorField key={field} field={field} value={editing[field]} options={activeFieldOptions?.[field]} onChange={(value) => setEditing((current) => ({ ...current, [field]: value }))} />
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button disabled={mutation.isPending} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-onyx">
              <Save className="h-3.5 w-3.5" /> Save
            </button>
            <button type="button" onClick={() => setEditing(null)} className="border border-ivory/20 px-5 py-3 text-[10px] uppercase tracking-[0.25em]">Cancel</button>
          </div>
        </form>
      )}

      {orderedRows.length === 0 ? <p className="border border-ivory/10 bg-ivory/[0.025] p-8 text-sm text-ivory/55">{empty}</p> : (
        <div className="grid gap-4">
          {orderedRows.map((row) => (
            <article
              key={row.id ?? JSON.stringify(row)}
              draggable={!!onReorder}
              onDragStart={() => setDraggedId(String(row.id))}
              onDragOver={(event) => onReorder && event.preventDefault()}
              onDrop={() => commitReorder(String(row.id))}
              className={`grid gap-4 border p-5 transition-colors md:grid-cols-[auto_1fr_auto] ${draggedId === String(row.id) ? "border-gold bg-gold/10" : "border-ivory/10"}`}
            >
              <button type="button" className="hidden cursor-grab border border-ivory/15 p-3 text-ivory/45 hover:border-gold hover:text-gold md:block" aria-label="Drag to reorder">
                <GripVertical className="h-4 w-4" />
              </button>
              <div>
                {renderExtra?.(row)}
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl">{row.title ?? row.display_name ?? row.key}</h3>
                  {row.is_hero && <span className="border border-gold px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-gold">Hero</span>}
                  {row.is_cover && <span className="border border-ivory/30 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-ivory/70">Cover</span>}
                  <span className={`border px-2 py-1 text-[9px] uppercase tracking-[0.2em] ${row.is_published === false ? "border-ivory/20 text-ivory/45" : "border-gold/60 text-gold"}`}>
                    {row.is_published === false ? "Hidden" : "Published"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ivory/55">{row.description ?? row.caption ?? row.value ?? row.short_description}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-gold">Order {row.display_order ?? "-"}</p>
              </div>
              <div className="flex items-start gap-2">
                <button onClick={() => setEditing(row)} className="border border-ivory/20 p-3 hover:border-gold hover:text-gold" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                {renderActions?.(row)}
                <button
                  onClick={async () => {
                    if (!confirm("Delete this item?")) return;
                    try {
                      await requireAdminAction();
                      await remove(row);
                      toast.success("Deleted.");
                      invalidate();
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Delete failed.");
                    }
                  }}
                  className="border border-ivory/20 p-3 hover:border-red-400 hover:text-red-300"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function EditorField({ field, value, options, onChange }: { field: string; value: any; options?: FieldOption[]; onChange: (value: any) => void }) {
  const isBoolean = typeof value === "boolean" || field.startsWith("is_");
  const isLong = field.includes("description") || field === "value" || field === "caption";
  const isAssetSelector = field === "hero_asset_id" || field === "cover_asset_id";
  return (
    <label className={isLong || isAssetSelector ? "md:col-span-2" : ""}>
      <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/45">{field}</span>
      {isAssetSelector && options ? (
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => onChange(null)}
            className={`min-h-28 border p-4 text-left text-sm ${!value ? "border-gold text-gold" : "border-ivory/15 text-ivory/55 hover:border-gold hover:text-gold"}`}
          >
            Clear selection
            <span className="mt-2 block text-xs text-ivory/40">Use fallback visual asset</span>
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`overflow-hidden border text-left transition-colors ${value === option.value ? "border-gold text-gold" : "border-ivory/15 text-ivory/70 hover:border-gold hover:text-gold"}`}
            >
              {option.preview && <img src={option.preview} alt="" className="h-28 w-full object-cover" />}
              <span className="block px-3 pt-3 font-display text-lg">{option.label}</span>
              <span className="block px-3 pb-3 pt-1 text-[10px] uppercase tracking-[0.2em] text-ivory/40">{option.meta}</span>
            </button>
          ))}
        </div>
      ) : options ? (
        <select value={value ?? ""} onChange={(event) => onChange(event.target.value || null)} className="mt-2 w-full border border-ivory/20 bg-onyx px-3 py-3">
          <option value="">Unassigned</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : isBoolean ? (
        <select value={String(Boolean(value))} onChange={(event) => onChange(event.target.value === "true")} className="mt-2 w-full border border-ivory/20 bg-onyx px-3 py-3">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      ) : isLong ? (
        <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-2 w-full border border-ivory/20 bg-onyx px-3 py-3 outline-none focus:border-gold" />
      ) : (
        <input value={value ?? ""} onChange={(event) => onChange(field.includes("order") ? Number(event.target.value) : event.target.value)} className="mt-2 w-full border border-ivory/20 bg-onyx px-3 py-3 outline-none focus:border-gold" />
      )}
    </label>
  );
}

function AssetPreview({ asset }: { asset: AssetRow }) {
  if (isVisualAsset(asset)) {
    return <img src={asset.file_url} alt="" className="mb-4 h-40 w-full object-cover" />;
  }
  if (asset.asset_type === "pdf") {
    const thumbnailUrl = typeof asset.metadata?.thumbnail_url === "string" ? asset.metadata.thumbnail_url : "";
    return (
      <div className="mb-4 overflow-hidden border border-ivory/10 bg-ivory">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="h-40 w-full object-cover" />
        ) : (
          <iframe title={asset.display_name} src={`${asset.file_url}#page=1&toolbar=0&navpanes=0&scrollbar=0`} className="h-40 w-full" />
        )}
        <div className="bg-onyx px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-gold">PDF Preview</div>
      </div>
    );
  }
  return null;
}
