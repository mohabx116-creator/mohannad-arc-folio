import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Download, Eye, FileText, X, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PreferenceControls } from "@/components/preference-controls";
import {
  alSe7r,
  alSe7rFilters,
  type CaseStudySection,
  type PortfolioAsset,
} from "@/lib/al-se7r-data";
import { localizeProject, translateFilter } from "@/lib/portfolio-i18n";
import { fetchPublishedAlSe7rProject } from "@/lib/portfolio-cms";
import { useSitePreferences } from "@/lib/site-preferences";

export const Route = createFileRoute("/projects/al-se7r-tower")({
  component: CaseStudy,
  head: () => ({
    meta: [
      { title: "Al Se7r Tower - Mixed-Use Mall & Tower Development | Mohannad" },
      { name: "description", content: alSe7r.longDescription },
      { property: "og:title", content: "Al Se7r Tower - Mixed-Use Architecture" },
      { property: "og:image", content: alSe7r.cover },
      { name: "twitter:image", content: alSe7r.cover },
    ],
  }),
});

function CaseStudy() {
  const [filter, setFilter] = useState("Overview");
  const [lightbox, setLightbox] = useState<PortfolioAsset | null>(null);
  const { isArabic, language, theme, t } = useSitePreferences();
  const projectQuery = useQuery({
    queryKey: ["public-project", "al-se7r-tower"],
    queryFn: fetchPublishedAlSe7rProject,
  });
  const rawProject = projectQuery.data ?? (projectQuery.isLoading ? alSe7r : null);
  const project = rawProject ? localizeProject(rawProject, language) : null;

  const sections = useMemo(() => {
    if (!rawProject) return [];
    const rawSections =
      filter === "Overview"
        ? rawProject.sections
        : filter === "Final Presentation"
          ? rawProject.sections.filter(
              (section) => section.title.includes("Final") || section.category === "Visualization",
            )
          : filter === "Technical Drawings"
            ? rawProject.sections.filter((section) =>
                section.assets.some((asset) => asset.type === "pdf" && asset.category !== "poster"),
              )
            : rawProject.sections.filter((section) => section.category === filter);
    return localizeProject({ ...rawProject, sections: rawSections }, language).sections;
  }, [filter, language, rawProject]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-onyx px-6 text-center text-ivory">
        <div className="max-w-lg">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">{t("portfolio")}</p>
          <h1 className="mt-4 font-display text-5xl">{t("caseStudyUnavailable")}</h1>
          <p className="mt-4 text-sm text-ivory/60">{t("caseStudyUnavailableBody")}</p>
          <Link
            to="/portfolio"
            className="mt-8 inline-block border border-ivory/25 px-6 py-3 text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
          >
            {t("returnPortfolio")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-onyx text-ivory">
      <header className="sticky top-0 z-40 border-b border-ivory/10 bg-onyx/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <Link
            to="/portfolio"
            className="flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isArabic ? "rotate-180" : ""}`} />
            <span className="text-[10px] uppercase tracking-[0.35em]">{t("portfolio")}</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-[10px] uppercase tracking-[0.35em] text-ivory/40 md:block">
              {t("featuredCaseStudy")}
            </span>
            <PreferenceControls />
          </div>
        </div>
      </header>

      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src={project.hero}
          alt="Al Se7r Tower exterior render"
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />
        <div
          className={`absolute inset-0 ${theme === "light" ? "bg-gradient-to-b from-white/45 via-onyx/45 to-onyx" : "bg-gradient-to-b from-black/55 via-onyx/45 to-onyx"}`}
        />
        <div className="absolute inset-0 grid-architectural opacity-50" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-28 md:px-12 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] uppercase tracking-[0.5em] text-gold"
          >
            {project.category}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-5xl font-display text-6xl leading-[0.92] md:text-8xl lg:text-9xl"
          >
            {project.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/78 md:text-xl"
          >
            {project.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="border-y border-ivory/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-18 md:grid-cols-12 md:px-12 md:py-24">
          <div className="md:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
              {t("projectOverview")}
            </p>
            <p className="mt-6 text-xl leading-relaxed text-ivory/82 md:text-2xl">
              {project.longDescription}
            </p>
          </div>
          <dl className="grid gap-6 border-l border-ivory/10 pl-8 md:col-span-5">
            {project.metadata.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] uppercase tracking-[0.35em] text-ivory/40">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ivory/85">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="sticky top-[57px] z-30 border-b border-ivory/10 bg-onyx/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 py-4 md:px-12">
          <div className="flex min-w-max gap-2">
            {alSe7rFilters.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`border px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  filter === category
                    ? "border-gold bg-gold text-onyx"
                    : "border-ivory/15 text-ivory/65 hover:border-ivory/50 hover:text-ivory"
                }`}
              >
                {translateFilter(category, language)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        {sections.map((section, index) => (
          <SectionBlock key={section.id} section={section} index={index + 1} onOpen={setLightbox} />
        ))}
      </div>

      <footer className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
              {t("projectInquiry")}
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">{t("discussProject")}</h2>
          </div>
          <Link
            to="/portfolio"
            hash="contact"
            className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-[11px] uppercase tracking-[0.3em] transition-colors hover:border-gold hover:text-gold"
          >
            {t("contactMohannad")}{" "}
            <ArrowUpRight className={`h-4 w-4 ${isArabic ? "-rotate-90" : ""}`} />
          </Link>
        </div>
      </footer>

      <Lightbox asset={lightbox} onClose={() => setLightbox(null)} />
    </main>
  );
}

function SectionBlock({
  section,
  index,
  onOpen,
}: {
  section: CaseStudySection;
  index: number;
  onOpen: (asset: PortfolioAsset) => void;
}) {
  const images = section.assets.filter((asset) => asset.type === "image");
  const documents = section.assets.filter((asset) => asset.type === "pdf");

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="border-t border-ivory/10 py-18 md:py-24"
    >
      <div className="grid gap-10 md:grid-cols-12">
        <aside className="md:col-span-4">
          <div className="sticky top-36">
            <span className="font-mono text-xs text-gold">{String(index).padStart(2, "0")}</span>
            <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-ivory/40">
              {section.category}
            </p>
            <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
              {section.title}
            </h2>
            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-gold/80">
              {section.subtitle}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-ivory/65">{section.description}</p>
          </div>
        </aside>

        <div className="space-y-7 md:col-span-8">
          {images.length > 0 && (
            <div className={images.length === 1 ? "grid gap-6" : "grid gap-6 sm:grid-cols-2"}>
              {images.map((asset, assetIndex) => (
                <ImageCard
                  key={asset.id}
                  asset={asset}
                  priority={assetIndex === 0 && section.id === "overview"}
                  onOpen={onOpen}
                />
              ))}
            </div>
          )}
          {documents.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              {documents.map((asset) => (
                <PdfCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function ImageCard({
  asset,
  priority,
  onOpen,
}: {
  asset: PortfolioAsset;
  priority?: boolean;
  onOpen: (asset: PortfolioAsset) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(asset)}
      className={
        priority ? "group block w-full text-left sm:col-span-2" : "group block w-full text-left"
      }
    >
      <div
        className={`relative overflow-hidden border border-ivory/10 bg-card ${priority ? "aspect-[16/10]" : "aspect-[4/3]"}`}
      >
        <img
          src={asset.src}
          alt={asset.displayName}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center bg-onyx/85 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-[0.35em] text-gold">{asset.displayName}</p>
      <p className="mt-2 text-sm leading-relaxed text-ivory/55">{asset.caption}</p>
    </button>
  );
}

function PdfCard({ asset }: { asset: PortfolioAsset }) {
  const { t } = useSitePreferences();

  return (
    <article className="group border border-ivory/12 bg-ivory/[0.035] transition-colors hover:border-gold/60">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f4efe6]">
        {asset.thumbnailUrl ? (
          <img
            src={asset.thumbnailUrl}
            alt={asset.displayName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <iframe
            title={asset.displayName}
            src={`${asset.src}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
            className="h-full w-full scale-[1.02]"
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/10 via-transparent to-transparent ring-1 ring-inset ring-onyx/10" />
        <div className="absolute left-3 top-3 bg-onyx/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-ivory">
          {t("pdfPreview")}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">{asset.category}</p>
            <h3 className="mt-2 font-display text-2xl">{asset.displayName}</h3>
          </div>
          <FileText className="mt-1 h-5 w-5 text-ivory/45" />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ivory/58">{asset.caption}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={asset.src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-ivory/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] hover:border-gold hover:text-gold"
          >
            <Eye className="h-3.5 w-3.5" /> {t("viewPdf")}
          </a>
          <a
            href={asset.src}
            download
            className="inline-flex items-center gap-2 border border-ivory/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] hover:border-gold hover:text-gold"
          >
            <Download className="h-3.5 w-3.5" /> {t("download")}
          </a>
        </div>
      </div>
    </article>
  );
}

function Lightbox({ asset, onClose }: { asset: PortfolioAsset | null; onClose: () => void }) {
  const { t } = useSitePreferences();

  return (
    <AnimatePresence>
      {asset?.type === "image" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-onyx/95 p-4 backdrop-blur-sm md:p-10"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-ivory/20 hover:border-gold hover:text-gold"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </button>
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            className="max-h-[88vh] max-w-[92vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={asset.src}
              alt={asset.displayName}
              className="block max-h-[80vh] max-w-[88vw] object-contain"
            />
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.35em] text-gold">
              {asset.displayName}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
