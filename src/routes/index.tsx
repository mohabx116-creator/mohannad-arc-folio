import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { PreferenceControls } from "@/components/preference-controls";
import { alSe7r } from "@/lib/al-se7r-data";
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
          alt=""
          className="h-full w-full object-cover opacity-60"
          width={1920}
          height={1080}
        />
        <div
          className={`absolute inset-0 ${isLight ? "bg-gradient-to-b from-white/75 via-white/38 to-onyx/95" : "bg-gradient-to-b from-black/70 via-black/40 to-black/90"}`}
        />
        <div className="absolute inset-0 grid-architectural" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-6 py-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <span className="text-gold font-display text-2xl">M</span>
          <span className="hidden text-[10px] uppercase tracking-[0.4em] text-ivory/70 sm:block">
            {t("studio")}
          </span>
        </motion.div>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden text-[10px] uppercase tracking-[0.4em] text-ivory/60 md:block"
          >
            {t("portfolioLabel")}
          </motion.div>
          <PreferenceControls />
        </div>
      </header>

      {/* Center stage */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col items-center justify-center px-6 pb-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-[11px] uppercase tracking-[0.5em] text-gold"
        >
          {t("heroKicker")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="mt-8 font-display text-5xl leading-[0.95] text-balance md:text-7xl lg:text-8xl"
        >
          {t("heroTitleName")}
          <br />
          <span className={isArabic ? "text-gold-soft" : "italic text-gold-soft"}>
            {t("heroTitlePortfolio")}
          </span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 h-px w-40 origin-center bg-gold"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="mt-10 max-w-xl text-sm leading-relaxed text-ivory/75 md:text-base"
        >
          {t("heroDescription")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-14 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
        >
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
        </motion.div>
      </section>

      {/* Footer mark */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.4 }}
        className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-between px-6 text-[10px] uppercase tracking-[0.4em] text-ivory/40 md:px-12"
      >
        <span>{t("egypt")}</span>
        <span className="hidden sm:block">{t("caseStudyFooter")}</span>
        <span>{new Date().getFullYear()}</span>
      </motion.footer>
    </main>
  );
}
