import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, X, ZoomIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { alSe7r, alSe7rFilters, type Asset, type CaseStudySection } from "@/lib/al-se7r-data";

export const Route = createFileRoute("/projects/al-se7r-tower")({
  component: CaseStudy,
  head: () => ({
    meta: [
      { title: "Al Se7r Tower — Mixed-Use Mall & Tower Development | Mohannad El Nady" },
      {
        name: "description",
        content:
          "Al Se7r Tower — a mixed-use architectural development integrating retail, hospitality, workplace, and tower functions. Case study by Mohannad El Nady.",
      },
      { property: "og:title", content: "Al Se7r Tower — Mixed-Use Architecture" },
      { property: "og:image", content: alSe7r.poster },
      { name: "twitter:image", content: alSe7r.poster },
    ],
  }),
});

function CaseStudy() {
  const [filter, setFilter] = useState<string>("Overview");
  const [lightbox, setLightbox] = useState<Asset | null>(null);

  const sections = useMemo<CaseStudySection[]>(() => {
    if (filter === "Overview") return alSe7r.sections;
    return alSe7r.sections.filter((s) => s.category === filter);
  }, [filter]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="min-h-screen bg-onyx text-ivory">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ivory/10 bg-onyx/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <Link to="/portfolio" className="flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-[0.4em]">Back to Portfolio</span>
          </Link>
          <span className="hidden text-[10px] uppercase tracking-[0.4em] text-ivory/40 md:block">
            Featured Case Study · 2026
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={alSe7r.hero}
            alt="Al Se7r Tower exterior"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-onyx/60 to-onyx" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 md:px-12 md:pt-40 md:pb-48">
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-[11px] uppercase tracking-[0.5em] text-gold"
          >
            {alSe7r.category}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }}
            className="mt-8 font-display text-6xl leading-[0.95] text-balance md:text-8xl lg:text-9xl"
          >
            Al Se7r
            <br />
            <span className="italic text-gold-soft">Tower</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg text-ivory/70 md:text-xl"
          >
            {alSe7r.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Summary + metadata */}
      <section className="border-t border-ivory/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:px-12 md:py-28">
          <div className="md:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Project Summary</p>
            <p className="mt-6 text-lg leading-relaxed text-ivory/80 md:text-xl">{alSe7r.summary}</p>
          </div>
          <dl className="space-y-6 border-l border-ivory/10 pl-8 md:col-span-5">
            {alSe7r.metadata.map((m) => (
              <div key={m.label}>
                <dt className="text-[10px] uppercase tracking-[0.4em] text-ivory/40">{m.label}</dt>
                <dd className="mt-2 text-sm text-ivory/85">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Filters */}
      <section className="border-t border-ivory/10 bg-onyx">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-12">
          <div className="flex flex-wrap gap-2">
            {alSe7rFilters.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`border px-4 py-2 text-[10px] uppercase tracking-[0.3em] transition-colors ${
                  filter === c
                    ? "border-gold bg-gold text-onyx"
                    : "border-ivory/20 text-ivory/70 hover:border-ivory/60 hover:text-ivory"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        {sections.map((s) => (
          <SectionBlock key={s.id} section={s} onOpen={setLightbox} />
        ))}
      </div>

      {/* Footer nav */}
      <footer className="border-t border-ivory/10 bg-onyx">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center md:px-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">End of Case Study</p>
            <h3 className="mt-3 font-display text-3xl md:text-4xl">Discuss a project</h3>
          </div>
          <Link
            to="/portfolio"
            hash="contact"
            className="group inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-[11px] uppercase tracking-[0.35em] text-ivory transition-all hover:border-gold hover:text-gold"
          >
            Contact the Studio
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
        <div className="border-t border-ivory/10 px-6 py-6 text-center text-[10px] uppercase tracking-[0.4em] text-ivory/30 md:px-12">
          © {new Date().getFullYear()} · Mohannad El Nady · Al Se7r Tower Case Study
        </div>
      </footer>

      <Lightbox asset={lightbox} onClose={() => setLightbox(null)} />
    </main>
  );
}

/* ---------------- Section Block ---------------- */

function SectionBlock({ section, onOpen }: { section: CaseStudySection; onOpen: (a: Asset) => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="border-t border-ivory/10 py-20 md:py-28"
    >
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="sticky top-24">
            <span className="font-mono text-xs text-gold">{section.index}</span>
            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-ivory/40">{section.category}</p>
            <h2 className="mt-5 font-display text-3xl text-ivory md:text-4xl">{section.title}</h2>
            <p className="mt-6 text-sm leading-relaxed text-ivory/65">{section.description}</p>
          </div>
        </div>

        <div className="md:col-span-8">
          {section.layout === "single" ? (
            <AssetCard asset={section.assets[0]} onOpen={onOpen} variant="single" />
          ) : section.layout === "wide" ? (
            <div className="grid gap-6">
              {section.assets.map((a) => (
                <AssetCard key={a.src} asset={a} onOpen={onOpen} variant="wide" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {section.assets.map((a) => (
                <AssetCard key={a.src} asset={a} onOpen={onOpen} variant="grid" />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------- Asset Card ---------------- */

function AssetCard({
  asset,
  onOpen,
  variant,
}: {
  asset: Asset;
  onOpen: (a: Asset) => void;
  variant: "grid" | "wide" | "single";
}) {
  const isDrawing = asset.kind === "drawing";
  return (
    <button
      type="button"
      onClick={() => onOpen(asset)}
      className="group block w-full text-left"
    >
      <div
        className={`relative overflow-hidden border ${
          isDrawing ? "border-ivory/15 bg-ivory" : "border-ivory/10 bg-onyx-soft"
        }`}
      >
        <div
          className={`relative ${
            variant === "single"
              ? "aspect-[3/4] md:aspect-[4/5]"
              : variant === "wide"
                ? "aspect-[16/10]"
                : "aspect-[4/3]"
          }`}
        >
          <img
            src={asset.src}
            alt={asset.label}
            loading="lazy"
            className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.03] ${
              isDrawing ? "object-contain p-4 md:p-6" : "object-cover"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-onyx/80 text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{asset.label}</p>
        <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/30">
          {isDrawing ? "Drawing" : "Render"}
        </span>
      </div>
    </button>
  );
}

/* ---------------- Lightbox ---------------- */

function Lightbox({ asset, onClose }: { asset: Asset | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {asset && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-onyx/95 p-4 backdrop-blur-sm md:p-10"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold md:right-8 md:top-8"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-h-[88vh] max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`overflow-hidden ${
                asset.kind === "drawing" ? "border border-ivory/15 bg-ivory p-3 md:p-6" : ""
              }`}
            >
              <img
                src={asset.src}
                alt={asset.label}
                className="block max-h-[80vh] max-w-[88vw] object-contain"
              />
            </div>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.4em] text-gold">{asset.label}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
