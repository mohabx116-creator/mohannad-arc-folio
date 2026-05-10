const SUPABASE_RENDER_IMAGE_PATH = "/storage/v1/render/image/public/";

const LOCAL_PREVIEW_SETS: Record<string, string> = {
  "/portfolio/alse7r/archive/renders/optimized/exterior-render-01-1184-q75.jpg":
    "/portfolio/alse7r/archive/renders/optimized/exterior-render-01-900-q75.jpg 900w, /portfolio/alse7r/archive/renders/optimized/exterior-render-01-1184-q75.jpg 1184w",
  "/portfolio/alse7r/archive/poster/optimized/final-presentation-board-1200-q75.jpg":
    "/portfolio/alse7r/archive/poster/optimized/final-presentation-board-900-q75.jpg 900w, /portfolio/alse7r/archive/poster/optimized/final-presentation-board-1200-q75.jpg 1200w",
};

export function getPreviewSrcSet(src: string | undefined, widths: number[]) {
  if (!src) return undefined;
  if (LOCAL_PREVIEW_SETS[src]) return LOCAL_PREVIEW_SETS[src];
  if (!src.includes(SUPABASE_RENDER_IMAGE_PATH)) return undefined;

  return widths.map((width) => `${setImageWidth(src, width)} ${width}w`).join(", ");
}

function setImageWidth(src: string, width: number) {
  const url = new URL(src, "https://placeholder.local");
  url.searchParams.set("width", String(width));
  url.searchParams.set("quality", url.searchParams.get("quality") ?? "75");
  return src.startsWith("http") ? url.toString() : `${url.pathname}${url.search}`;
}
