import { supabase } from "@/integrations/supabase/client";
import {
  alSe7r,
  type CaseStudySection,
  type PortfolioAsset,
  type PortfolioProject,
} from "@/lib/al-se7r-data";

type SupabaseQueryClient = {
  from: typeof supabase.from;
};

const db = supabase as SupabaseQueryClient;
let publicAlSe7rProjectPromise: Promise<PortfolioProject | null> | null = null;
const SUPABASE_OBJECT_PUBLIC_PATH = "/storage/v1/object/public/";

type ProjectDb = {
  id: string;
  slug: string | null;
  title: string;
  subtitle?: string | null;
  category?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  cover_image?: string | null;
  hero_asset_id?: string | null;
  cover_asset_id?: string | null;
  is_featured?: boolean | null;
  is_published?: boolean | null;
  display_order?: number | null;
  metadata?: Record<string, unknown> | null;
};

type SectionDb = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  category?: string | null;
  is_published?: boolean | null;
  display_order?: number | null;
};

type AssetDb = {
  id: string;
  section_id?: string | null;
  storage_path: string;
  file_url: string;
  original_filename?: string | null;
  display_name: string;
  caption?: string | null;
  asset_type: string;
  mime_type?: string | null;
  file_size?: number | null;
  category?: string | null;
  metadata?: Record<string, unknown> | null;
  is_hero?: boolean | null;
  is_cover?: boolean | null;
  is_published?: boolean | null;
  display_order?: number | null;
};

export async function fetchPublishedAlSe7rProject(): Promise<PortfolioProject | null> {
  publicAlSe7rProjectPromise ??= fetchPublishedAlSe7rProjectUncached();
  return publicAlSe7rProjectPromise;
}

async function fetchPublishedAlSe7rProjectUncached(): Promise<PortfolioProject | null> {
  const { data: project, error: projectError } = await db
    .from("projects")
    .select(
      "id, slug, title, subtitle, category, short_description, long_description, cover_image, hero_asset_id, cover_asset_id, is_featured, is_published, display_order, metadata",
    )
    .eq("slug", "al-se7r-tower")
    .eq("is_published", true)
    .maybeSingle();

  if (projectError) return alSe7r;
  if (!project) return null;

  const [{ data: sections, error: sectionsError }, { data: assets, error: assetsError }] =
    await Promise.all([
      db
        .from("portfolio_sections")
        .select("id, title, subtitle, description, category, is_published, display_order")
        .eq("project_id", project.id)
        .eq("is_published", true)
        .order("display_order"),
      db
        .from("portfolio_assets")
        .select(
          "id, section_id, storage_path, file_url, original_filename, display_name, caption, asset_type, mime_type, file_size, category, metadata, is_hero, is_cover, is_published, display_order",
        )
        .eq("project_id", project.id)
        .eq("is_published", true)
        .order("display_order"),
    ]);

  if (sectionsError || assetsError) return alSe7r;

  return mapProject(project, sections, assets ?? []);
}

function mapProject(
  project: ProjectDb,
  sections: SectionDb[],
  assets: AssetDb[],
): PortfolioProject {
  const mappedAssets = assets.map(mapAsset);
  const visualAssets = mappedAssets
    .filter(isVisualAsset)
    .sort((a, b) => visualRank(a) - visualRank(b) || a.order - b.order);
  const anyAsset = mappedAssets.find((asset) => asset.type === "image") ?? mappedAssets[0];
  const selectedHeroAsset = mappedAssets.find((asset) => asset.id === project.hero_asset_id);
  const selectedCoverAsset = mappedAssets.find((asset) => asset.id === project.cover_asset_id);
  const heroAsset =
    (selectedHeroAsset && (isVisualAsset(selectedHeroAsset) || visualAssets.length === 0)
      ? selectedHeroAsset
      : undefined) ??
    mappedAssets.find((asset) => asset.isHero && isVisualAsset(asset)) ??
    visualAssets[0] ??
    anyAsset;
  const coverAsset =
    (selectedCoverAsset && (isVisualAsset(selectedCoverAsset) || visualAssets.length === 0)
      ? selectedCoverAsset
      : undefined) ??
    mappedAssets.find((asset) => asset.isCover && isVisualAsset(asset)) ??
    visualAssets[0] ??
    anyAsset;
  const mappedSections: CaseStudySection[] = sections.map((section) => ({
    id: section.id,
    title: section.title,
    subtitle: section.subtitle ?? "",
    description: section.description ?? "",
    category: section.category ?? "Overview",
    order: section.display_order ?? 0,
    published: section.is_published !== false,
    assets: mappedAssets
      .filter((asset) => asset.sectionId === section.id)
      .sort((a, b) => a.order - b.order),
  }));

  return {
    id: project.id,
    slug: project.slug ?? alSe7r.slug,
    title: project.title,
    subtitle: project.subtitle ?? alSe7r.subtitle,
    category: project.category ?? alSe7r.category,
    shortDescription: project.short_description ?? alSe7r.shortDescription,
    longDescription: project.long_description ?? alSe7r.longDescription,
    hero: getImagePreviewUrl(heroAsset?.src ?? project.cover_image, 1920) ?? alSe7r.hero,
    cover: getImagePreviewUrl(coverAsset?.src ?? project.cover_image, 1920) ?? alSe7r.cover,
    isFeatured: project.is_featured !== false,
    isPublished: project.is_published !== false,
    displayOrder: project.display_order ?? 0,
    metadata: metadataToList(project.metadata),
    sections: mappedSections,
  };
}

function isVisualAsset(asset: PortfolioAsset) {
  return asset.type === "image" || ["render", "poster", "board"].includes(asset.category);
}

function visualRank(asset: PortfolioAsset) {
  if (asset.category === "render") return 1;
  if (asset.category === "poster" || asset.category === "board") return 2;
  if (asset.type === "image") return 3;
  return 9;
}

function mapAsset(asset: AssetDb): PortfolioAsset {
  return {
    id: asset.id,
    src: asset.file_url,
    originalUrl: asset.file_url,
    originalFilename: asset.original_filename ?? "",
    storagePath: asset.storage_path,
    displayName: asset.display_name,
    caption: asset.caption ?? "",
    type:
      asset.asset_type === "pdf"
        ? "pdf"
        : asset.mime_type?.startsWith("image/") ||
            ["image", "render", "poster", "board"].includes(asset.asset_type)
          ? "image"
          : "file",
    mimeType: asset.mime_type ?? "",
    fileSize: asset.file_size ?? undefined,
    thumbnailUrl:
      typeof asset.metadata?.thumbnail_url === "string"
        ? asset.metadata.thumbnail_url
        : getImagePreviewUrl(asset.file_url, 900),
    category: asset.category ?? asset.asset_type,
    sectionId: asset.section_id ?? "",
    isHero: asset.is_hero === true,
    isCover: asset.is_cover === true,
    published: asset.is_published !== false,
    order: asset.display_order ?? 0,
  };
}

function getImagePreviewUrl(src: string | null | undefined, width: number) {
  if (!src || !src.includes(SUPABASE_OBJECT_PUBLIC_PATH)) return undefined;
  const [baseUrl, query = ""] = src.split("?");
  const renderUrl = baseUrl.replace(
    SUPABASE_OBJECT_PUBLIC_PATH,
    "/storage/v1/render/image/public/",
  );
  const params = new URLSearchParams(query);
  params.set("width", String(width));
  params.set("quality", "75");
  return `${renderUrl}?${params.toString()}`;
}

function metadataToList(metadata: Record<string, unknown> | null | undefined) {
  if (!metadata || Array.isArray(metadata)) return alSe7r.metadata;
  const entries = Object.entries(metadata);
  if (!entries.length) return alSe7r.metadata;
  return entries.map(([key, value]) => ({
    label: key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    value: String(value),
  }));
}
