import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PreferenceControls } from "@/components/preference-controls";
import { supabase } from "@/integrations/supabase/client";
import { alSe7r, alSe7rFilters } from "@/lib/al-se7r-data";
import { getPreviewSrcSet } from "@/lib/image-delivery";
import { localizeProject, translateFilter } from "@/lib/portfolio-i18n";
import { fetchPublishedAlSe7rProject } from "@/lib/portfolio-cms";
import { useSitePreferences } from "@/lib/site-preferences";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfolio - Mohannad Architectural Design" },
      { name: "description", content: "Al Se7r Tower architectural case study by Mohannad." },
    ],
  }),
});

function Portfolio() {
  const [active, setActive] = useState("Overview");
  const { isArabic, language, theme, t } = useSitePreferences();
  const projectQuery = useQuery({
    queryKey: ["public-project", "al-se7r-tower"],
    queryFn: fetchPublishedAlSe7rProject,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const rawProject = projectQuery.data ?? (projectQuery.isLoading ? alSe7r : null);
  const project = rawProject ? localizeProject(rawProject, language) : null;
  const rawSections = !rawProject
    ? []
    : active === "Overview"
      ? rawProject.sections
      : active === "Final Presentation"
        ? rawProject.sections.filter(
            (section) => section.title.includes("Final") || section.category === "Visualization",
          )
        : active === "Technical Drawings"
          ? rawProject.sections.filter((section) =>
              section.assets.some((asset) => asset.type === "pdf" && asset.category !== "poster"),
            )
          : rawProject.sections.filter((section) => section.category === active);
  const sections = rawProject
    ? localizeProject({ ...rawProject, sections: rawSections }, language).sections
    : [];

  if (!project) {
    return (
      <main className="min-h-screen bg-onyx text-ivory">
        <nav className="border-b border-ivory/10 px-6 py-4 md:px-12">
          <Link to="/" className="flex items-center gap-3 text-ivory/70 hover:text-gold">
            <ArrowLeft className={`h-3.5 w-3.5 ${isArabic ? "rotate-180" : ""}`} /> {t("home")}
          </Link>
        </nav>
        <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">{t("portfolio")}</p>
          <h1 className="mt-4 font-display text-5xl">{t("noProjects")}</h1>
          <p className="mt-4 text-sm text-ivory/60">{t("unavailablePortfolio")}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-onyx text-ivory">
      <nav className="sticky top-0 z-40 border-b border-ivory/10 bg-onyx/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <Link
            to="/"
            className="flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isArabic ? "rotate-180" : ""}`} />
            <span className="text-[10px] uppercase tracking-[0.35em]">{t("home")}</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="border border-ivory/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] hover:border-gold hover:text-gold"
            >
              {t("contact")}
            </a>
            <PreferenceControls />
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <img
          src={project.hero}
          srcSet={getPreviewSrcSet(project.hero, [900, 1600, 1920])}
          sizes="100vw"
          alt="Al Se7r Tower exterior render"
          width={1920}
          height={1400}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div
          className={`absolute inset-0 ${theme === "light" ? "bg-gradient-to-b from-white/80 via-onyx/75 to-onyx" : "bg-gradient-to-b from-black/70 via-onyx/75 to-onyx"}`}
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
          <div className="md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.5em] text-gold reveal-up">
              {t("mohannadPortfolio")}
            </p>
            <h1 className="mt-7 font-display text-6xl leading-[0.95] reveal-up delay-100 md:text-8xl">
              {t("featuredCaseStudy")}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory/75">
              {project.longDescription}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/projects/al-se7r-tower"
                className="inline-flex items-center gap-3 bg-ivory px-7 py-4 text-[11px] uppercase tracking-[0.3em] text-onyx hover:bg-gold"
              >
                {t("viewCaseStudy")}{" "}
                <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 border border-ivory/25 px-7 py-4 text-[11px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold"
              >
                {t("projectInquiry")}{" "}
                <ArrowUpRight className={`h-4 w-4 ${isArabic ? "-rotate-90" : ""}`} />
              </a>
            </div>
          </div>
          <aside className="border-l border-ivory/10 pl-8 md:col-span-4">
            {project.metadata.map((item) => (
              <div key={item.label} className="border-b border-ivory/10 py-5 first:pt-0">
                <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ivory/82">{item.value}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="border-y border-ivory/10">
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
          <div className="flex flex-wrap gap-2">
            {alSe7rFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActive(filter)}
                className={`border px-4 py-2 text-[10px] uppercase tracking-[0.24em] ${
                  active === filter
                    ? "border-gold bg-gold text-onyx"
                    : "border-ivory/15 text-ivory/65 hover:border-ivory/50 hover:text-ivory"
                }`}
              >
                {translateFilter(filter, language)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <Link
            to="/projects/al-se7r-tower"
            className="group block overflow-hidden border border-ivory/10 bg-ivory/[0.03] lg:col-span-2"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={project.hero}
                srcSet={getPreviewSrcSet(project.hero, [600, 900, 1200])}
                alt="Al Se7r Tower exterior render"
                loading="lazy"
                decoding="async"
                width={1600}
                height={1000}
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
              />
            </div>
            <div className="p-8">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold">
                {project.category}
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">{project.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/65">
                {project.shortDescription}
              </p>
            </div>
          </Link>
          <div className="space-y-4">
            {sections.map((section) => (
              <Link
                key={section.id}
                to="/projects/al-se7r-tower"
                className="block border border-ivory/10 p-5 transition-colors hover:border-gold hover:text-gold"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">
                  {section.category}
                </p>
                <h3 className="mt-2 font-display text-2xl">{section.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ivory/55">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </main>
  );
}

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const { t } = useSitePreferences();
  const contactQuery = useQuery({
    queryKey: ["public-contact"],
    queryFn: fetchPublicContactInfo,
    staleTime: 1000 * 60 * 5,
  });
  const contact = contactQuery.data ?? defaultContactInfo;
  const mutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      const { error } = await supabase.from("contact_messages").insert(payload as never);
      if (error) throw error;
    },
    onSuccess: () => toast.success(t("messageSent")),
    onError: () => toast.error(t("messageFailed")),
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      toast.error(t("requiredFields"));
      return;
    }
    setSubmitting(true);
    await mutation.mutateAsync(payload).catch(() => undefined);
    setSubmitting(false);
    event.currentTarget.reset();
  }

  return (
    <section id="contact" className="border-t border-ivory/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:px-12">
        <div className="md:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">{t("contact")}</p>
          <h2 className="mt-4 font-display text-5xl">{t("contactTitle")}</h2>
          <div className="mt-10 space-y-4 text-sm text-ivory/70">
            <a className="flex items-center gap-3 hover:text-gold" href={`mailto:${contact.email}`}>
              <Mail className="h-4 w-4" /> {contact.email}
            </a>
            <a
              className="flex items-center gap-3 hover:text-gold"
              href={`tel:${contact.phoneHref}`}
            >
              <Phone className="h-4 w-4" /> {contact.phone}
            </a>
            <a
              className="flex items-center gap-3 hover:text-gold"
              href={contact.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="h-4 w-4" /> {t("contactInstagram")}
            </a>
            <span className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4" /> {t("contactNote")}
            </span>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 md:col-span-7">
          <input
            name="name"
            placeholder={t("name")}
            className="w-full border-b border-ivory/20 bg-transparent py-3 outline-none placeholder:text-ivory/35 focus:border-gold"
          />
          <input
            name="email"
            type="email"
            placeholder={t("email")}
            className="w-full border-b border-ivory/20 bg-transparent py-3 outline-none placeholder:text-ivory/35 focus:border-gold"
          />
          <input
            name="phone"
            placeholder={t("phone")}
            className="w-full border-b border-ivory/20 bg-transparent py-3 outline-none placeholder:text-ivory/35 focus:border-gold"
          />
          <textarea
            name="message"
            rows={5}
            placeholder={t("message")}
            className="w-full resize-none border-b border-ivory/20 bg-transparent py-3 outline-none placeholder:text-ivory/35 focus:border-gold"
          />
          <button
            disabled={submitting}
            className="bg-ivory px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-onyx hover:bg-gold disabled:opacity-50"
          >
            {submitting ? t("sending") : t("sendInquiry")}
          </button>
        </form>
      </div>
    </section>
  );
}

const defaultContactInfo = {
  email: "mohandelnady33@gmail.com",
  phone: "+20 101 151 7780",
  phoneHref: "+201011517780",
  instagram:
    "https://www.instagram.com/muhvnd?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
};

let publicContactInfoPromise: Promise<typeof defaultContactInfo> | null = null;

async function fetchPublicContactInfo() {
  publicContactInfoPromise ??= fetchPublicContactInfoUncached();
  return publicContactInfoPromise;
}

async function fetchPublicContactInfoUncached() {
  const { data, error } = await supabase
    .from("contact_info")
    .select("email, phone, whatsapp, linkedin")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return defaultContactInfo;

  const phone = data.phone || data.whatsapp || defaultContactInfo.phone;
  return {
    email: data.email || defaultContactInfo.email,
    phone,
    phoneHref: phone.replace(/[^\d+]/g, ""),
    instagram: data.linkedin || defaultContactInfo.instagram,
  };
}
