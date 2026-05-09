import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Phone, MessageCircle, Linkedin, MapPin,
  Compass, Layers, Home, Box, Ruler, FileText, Trees, ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fallback } from "@/lib/portfolio-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfolio — Mohannad El Nady" },
      { name: "description", content: "Architectural and interior design projects by Mohannad Mohamed El Nady, Egypt." },
    ],
  }),
});

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Interior Design": Home,
  "Architectural Design": Compass,
  "Residential Facade Design": Layers,
  "3D Visualization": Box,
  "Space Planning": Ruler,
  "Technical Drawings": FileText,
  "Landscape Concepts": Trees,
};

function Portfolio() {
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await supabase.from("profile").select("*").maybeSingle()).data,
  });
  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await supabase.from("projects").select("*").order("sort_order")).data ?? [],
  });
  const skills = useQuery({
    queryKey: ["skills"],
    queryFn: async () => (await supabase.from("skills").select("*").order("sort_order")).data ?? [],
  });
  const services = useQuery({
    queryKey: ["services"],
    queryFn: async () => (await supabase.from("services").select("*").order("sort_order")).data ?? [],
  });
  const experience = useQuery({
    queryKey: ["experience"],
    queryFn: async () => (await supabase.from("experience").select("*").order("sort_order")).data ?? [],
  });
  const education = useQuery({
    queryKey: ["education"],
    queryFn: async () => (await supabase.from("education").select("*").order("sort_order")).data ?? [],
  });
  const contact = useQuery({
    queryKey: ["contact_info"],
    queryFn: async () => (await supabase.from("contact_info").select("*").maybeSingle()).data,
  });

  const p = profile.data ?? fallback.profile;
  const projs = (projects.data?.length ? projects.data : fallback.projects) as typeof fallback.projects;
  const skillList = skills.data?.length ? skills.data.map((s) => s.name) : fallback.skills;
  const serviceList = services.data?.length ? services.data : fallback.services;
  const expList = experience.data?.length ? experience.data : fallback.experience;
  const eduList = education.data?.length ? education.data : fallback.education;
  const c = contact.data ?? fallback.contact;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero name={p.name} title={p.title} location={p.location} />
      <Divider label="About" />
      <About bio={p.bio ?? fallback.profile.bio} />
      <Divider label="Experience" />
      <Experience items={expList} />
      <Divider label="Education" />
      <Education items={eduList} />
      <Divider label="Skills" />
      <Skills items={skillList} />
      <Divider label="Selected Projects" />
      <Projects items={projs} />
      <Divider label="Services" />
      <Services items={serviceList} />
      <Divider label="Contact" />
      <Contact info={c} />
      <Footer />
    </main>
  );
}

/* ---------------- Nav ---------------- */

function Nav() {
  const links = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-display text-xl">M. El Nady</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>
        <a href="#contact" className="border border-foreground px-4 py-2 text-[10px] uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background">
          Get in touch
        </a>
      </div>
    </nav>
  );
}

/* ---------------- Hero ---------------- */

function Hero({ name, title, location }: { name: string; title: string; location: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0 grid-architectural-light opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 md:px-12 md:pt-36 md:pb-44">
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-[11px] uppercase tracking-[0.5em] text-gold"
        >
          Portfolio · 2024 — 2026
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }}
          className="mt-8 font-display text-5xl leading-[0.95] text-balance md:text-7xl lg:text-8xl"
        >
          {name.split(" ").slice(0, 2).join(" ")}
          <br />
          <span className="italic">{name.split(" ").slice(2).join(" ")}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          {title} <span className="mx-2 text-gold">·</span> <MapPin className="inline h-3.5 w-3.5" /> {location}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <a href="#projects" className="bg-foreground px-7 py-3.5 text-[11px] uppercase tracking-[0.3em] text-background transition-opacity hover:opacity-90">
            View Projects
          </a>
          <a href="#contact" className="border border-foreground px-7 py-3.5 text-[11px] uppercase tracking-[0.3em] transition-colors hover:bg-foreground hover:text-background">
            Contact Me
          </a>
          <button
            onClick={() => toast("AI Assistant launching soon — knowledge base in progress.")}
            className="border border-gold px-7 py-3.5 text-[11px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-onyx"
          >
            Ask AI Assistant
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Section divider ---------------- */

function Divider({ label }: { label: string }) {
  return (
    <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-16 md:px-12">
      <span className="text-[10px] uppercase tracking-[0.5em] text-gold">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ---------------- About ---------------- */

function About({ bio }: { bio: string }) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 pb-12 md:px-12">
      <div className="grid gap-12 md:grid-cols-12">
        <h2 className="font-display text-4xl md:col-span-5 md:text-5xl">A practice rooted in <span className="italic text-gold">precision</span> and warmth.</h2>
        <p className="text-lg leading-relaxed text-muted-foreground md:col-span-7">{bio}</p>
      </div>
    </section>
  );
}

/* ---------------- Experience ---------------- */

function Experience({ items }: { items: { role: string; company: string; location?: string | null }[] }) {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 pb-12 md:px-12">
      <ol className="divide-y divide-border border-y border-border">
        {items.map((e, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="grid grid-cols-12 items-baseline gap-4 py-8"
          >
            <span className="col-span-1 font-mono text-xs text-gold">0{i + 1}</span>
            <h3 className="col-span-12 font-display text-2xl md:col-span-5 md:text-3xl">{e.role}</h3>
            <p className="col-span-12 text-sm uppercase tracking-[0.2em] text-muted-foreground md:col-span-4">{e.company}</p>
            <p className="col-span-12 text-sm text-muted-foreground md:col-span-2 md:text-right">{e.location}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- Education ---------------- */

function Education({ items }: { items: { degree: string; institution: string; end_date?: string | null; gpa?: string | null }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 md:px-12">
      {items.map((ed, i) => (
        <div key={i} className="grid gap-6 border border-border bg-card p-8 md:grid-cols-12 md:p-12">
          <div className="md:col-span-7">
            <h3 className="font-display text-3xl md:text-4xl">{ed.degree}</h3>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">{ed.institution}</p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="text-sm text-muted-foreground">{ed.end_date}</p>
            <p className="mt-2 font-display text-2xl text-gold">GPA · {ed.gpa}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ---------------- Skills ---------------- */

function Skills({ items }: { items: string[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 md:px-12">
      <div className="flex flex-wrap gap-3">
        {items.map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="border border-border bg-card px-5 py-3 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            {s}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */

function Projects({ items }: { items: typeof fallback.projects }) {
  const cats = ["All", ...Array.from(new Set(items.map((p) => p.category).filter(Boolean) as string[]))];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? items : items.filter((p) => p.category === active);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 pb-12 md:px-12">
      <div className="mb-10 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`border px-4 py-2 text-[10px] uppercase tracking-[0.3em] transition-colors ${
              active === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {filtered.map((p, i) => {
          const slug = (p as { slug?: string }).slug;
          const featured = (p as { featured?: boolean }).featured;
          const Wrapper = ({ children }: { children: React.ReactNode }) =>
            slug === "al-se7r-tower" ? (
              <Link to="/projects/al-se7r-tower" className="block">{children}</Link>
            ) : (
              <div>{children}</div>
            );
          return (
            <motion.article
              key={p.id ?? p.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className={`group ${featured ? "md:col-span-2" : ""}`}
            >
              <Wrapper>
                <div className={`relative overflow-hidden bg-muted ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  {p.cover_image ? (
                    <img
                      src={p.cover_image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {featured && (
                    <span className="absolute left-4 top-4 bg-gold px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-onyx">
                      Featured Case Study
                    </span>
                  )}
                  {slug && (
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-background/90 text-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.category}{p.location ? ` · ${p.location}` : ""}{p.year ? ` · ${p.year}` : ""}</p>
                    <h3 className={`mt-2 font-display ${featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>{p.title}</h3>
                  </div>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                {p.software && p.software.length > 0 && (
                  <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {p.software.join(" · ")}
                  </p>
                )}
                {slug && (
                  <p className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground">
                    View Case Study <ArrowUpRight className="h-3 w-3" />
                  </p>
                )}
              </Wrapper>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */

function Services({ items }: { items: { title: string; description: string | null }[] }) {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 pb-12 md:px-12">
      <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => {
          const Icon = serviceIcons[s.title] ?? Compass;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group bg-card p-8 transition-colors hover:bg-foreground hover:text-background md:p-10"
            >
              <Icon className="h-7 w-7 text-gold transition-colors group-hover:text-gold" />
              <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-background/70">{s.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

function Contact({ info }: { info: { email?: string | null; phone?: string | null; whatsapp?: string | null; linkedin?: string | null } }) {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      message: String(form.get("message") || "").trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill all fields.");
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("contact_messages").insert(payload);
    setSubmitting(false);
    if (error) {
      toast.error("Could not send message. Please try again.");
      return;
    }
    toast.success("Message sent. Thank you.");
    (e.target as HTMLFormElement).reset();
  }

  const items = [
    { icon: Mail, label: "Email", value: info.email, href: info.email ? `mailto:${info.email}` : undefined },
    { icon: Phone, label: "Phone", value: info.phone, href: info.phone ? `tel:${info.phone}` : undefined },
    { icon: MessageCircle, label: "WhatsApp", value: info.whatsapp, href: info.whatsapp ? `https://wa.me/${info.whatsapp.replace(/\D/g, "")}` : undefined },
    { icon: Linkedin, label: "LinkedIn", value: "Profile", href: info.linkedin ?? undefined },
  ].filter((i) => i.value);

  return (
    <section id="contact" className="border-t border-border bg-onyx text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
        <div className="md:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.5em] text-gold">Let's collaborate</p>
          <h2 className="mt-6 font-display text-5xl text-balance md:text-6xl">
            Have a project <span className="italic text-gold-soft">in mind?</span>
          </h2>
          <ul className="mt-12 space-y-5">
            {items.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  target={it.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-4 text-ivory/80 transition-colors hover:text-gold"
                >
                  <it.icon className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/50">{it.label}</span>
                  <span className="text-sm">{it.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 md:col-span-7">
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">Name</label>
            <input name="name" required maxLength={100} className="mt-2 w-full border-0 border-b border-ivory/20 bg-transparent py-3 text-ivory outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">Email</label>
            <input name="email" type="email" required maxLength={255} className="mt-2 w-full border-0 border-b border-ivory/20 bg-transparent py-3 text-ivory outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">Message</label>
            <textarea name="message" rows={5} required maxLength={1500} className="mt-2 w-full resize-none border-0 border-b border-ivory/20 bg-transparent py-3 text-ivory outline-none focus:border-gold" />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-ivory px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-onyx transition-colors hover:bg-gold disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-onyx pb-10 pt-2 text-ivory/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-[10px] uppercase tracking-[0.4em] md:flex-row md:px-12">
        <span>© {new Date().getFullYear()} · Mohannad El Nady</span>
        <span>Architectural Engineering · Interior Design</span>
        <Link to="/" className="hover:text-gold">Home</Link>
      </div>
    </footer>
  );
}
