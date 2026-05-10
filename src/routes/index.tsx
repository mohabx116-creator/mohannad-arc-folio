import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";
import { PreferenceControls } from "@/components/preference-controls";
import { alSe7r } from "@/lib/al-se7r-data";
import { getPreviewSrcSet } from "@/lib/image-delivery";
import { useSitePreferences } from "@/lib/site-preferences";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Mohannad Architectural Portfolio - Al Se7r Tower" },
      {
        name: "description",
        content:
          "A luxury architectural portfolio centered on the Al Se7r Tower mixed-use case study.",
      },
    ],
  }),
});

function Landing() {
  const { isArabic, theme, t } = useSitePreferences();
  const isLight = theme === "light";

  return (
    <main className="relative min-h-screen overflow-hidden bg-onyx text-ivory">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={alSe7r.hero}
          srcSet={getPreviewSrcSet(alSe7r.hero, [900, 1184])}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover opacity-60"
          width={1184}
          height={864}
          fetchPriority="high"
          decoding="async"
        />
        <div
          className={`absolute inset-0 ${isLight ? "bg-gradient-to-b from-white/75 via-white/38 to-onyx/95" : "bg-gradient-to-b from-black/70 via-black/40 to-black/90"}`}
        />
        <div className="absolute inset-0 grid-architectural" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-6 py-6 md:px-12">
        <div className="flex items-center gap-3 reveal-up delay-100">
          <span className="text-gold font-display text-2xl">M</span>
          <span className="hidden text-[10px] uppercase tracking-[0.4em] text-ivory/70 sm:block">
            {t("studio")}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-[10px] uppercase tracking-[0.4em] text-ivory/60 reveal-fade delay-200 md:block">
            {t("portfolioLabel")}
          </div>
          <PreferenceControls />
        </div>
      </header>

      {/* Center stage */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col items-center justify-center px-6 pb-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.5em] text-gold reveal-up delay-300">
          {t("heroKicker")}
        </p>

        <h1 className="mt-8 font-display text-5xl leading-[0.95] text-balance reveal-up delay-500 md:text-7xl lg:text-8xl">
          {t("heroTitleName")}
          <br />
          <span className={isArabic ? "text-gold-soft" : "italic text-gold-soft"}>
            {t("heroTitlePortfolio")}
          </span>
        </h1>

        <div className="mx-auto mt-10 h-px w-40 origin-center bg-gold line-grow delay-700" />

        <p className="mt-10 max-w-xl text-sm leading-relaxed text-ivory/75 reveal-fade delay-900 md:text-base">
          {t("heroDescription")}
        </p>

        {/* CTA buttons */}
        <div className="mt-14 flex flex-col items-stretch gap-4 reveal-up delay-1000 sm:flex-row sm:items-center">
          <Link
            to="/portfolio"
            className="group inline-flex items-center justify-center gap-3 bg-ivory px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-onyx transition-all hover:bg-gold"
          >
            {t("viewPortfolio")}
            <ArrowRight
              className={`h-3.5 w-3.5 transition-transform ${isArabic ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
            />
          </Link>
          <Link
            to="/admin"
            className="group inline-flex items-center justify-center gap-3 border border-ivory/30 px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-ivory/90 transition-all hover:border-gold hover:text-gold"
          >
            <Lock className="h-3.5 w-3.5" />
            {t("adminDashboard")}
          </Link>
        </div>
      </section>

      {/* Footer mark */}
      <footer className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-between px-6 text-[10px] uppercase tracking-[0.4em] text-ivory/40 reveal-fade delay-1000 md:px-12">
        <span>{t("egypt")}</span>
        <span className="hidden sm:block">{t("caseStudyFooter")}</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
