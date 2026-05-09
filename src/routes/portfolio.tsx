import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { alSe7r, alSe7rFilters } from "@/lib/al-se7r-data";
import { fetchPublishedAlSe7rProject } from "@/lib/portfolio-cms";

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
  const projectQuery = useQuery({ queryKey: ["public-project", "al-se7r-tower"], queryFn: fetchPublishedAlSe7rProject });
  const project = projectQuery.data ?? (projectQuery.isLoading ? alSe7r : null);
  const sections =
    !project
      ? []
      : active === "Overview"
      ? project.sections
      : active === "Final Presentation"
        ? project.sections.filter((section) => section.title.includes("Final") || section.category === "Visualization")
        : active === "Technical Drawings"
          ? project.sections.filter((section) => section.assets.some((asset) => asset.type === "pdf" && asset.category !== "poster"))
          : project.sections.filter((section) => section.category === active);

  if (!project) {
    return (
      <main className="min-h-screen bg-onyx text-ivory">
        <nav className="border-b border-ivory/10 px-6 py-4 md:px-12">
          <Link to="/" className="flex items-center gap-3 text-ivory/70 hover:text-gold"><ArrowLeft className="h-3.5 w-3.5" /> Home</Link>
        </nav>
        <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Portfolio</p>
          <h1 className="mt-4 font-display text-5xl">No published projects</h1>
          <p className="mt-4 text-sm text-ivory/60">The portfolio content is currently unavailable.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-onyx text-ivory">
      <nav className="sticky top-0 z-40 border-b border-ivory/10 bg-onyx/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <Link to="/" className="flex items-center gap-3 text-ivory/70 transition-colors hover:text-gold">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-[0.35em]">Home</span>
          </Link>
          <a href="#contact" className="border border-ivory/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] hover:border-gold hover:text-gold">
            Contact
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <img src={project.cover} alt="Al Se7r Tower final presentation board" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-onyx/75 to-onyx" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32">
          <div className="md:col-span-8">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] uppercase tracking-[0.5em] text-gold">
              Mohannad Portfolio
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-7 font-display text-6xl leading-[0.95] md:text-8xl">
              Featured Architectural Case Study
            </motion.h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory/75">{project.longDescription}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/projects/al-se7r-tower" className="inline-flex items-center gap-3 bg-ivory px-7 py-4 text-[11px] uppercase tracking-[0.3em] text-onyx hover:bg-gold">
                View Case Study <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#contact" className="inline-flex items-center gap-3 border border-ivory/25 px-7 py-4 text-[11px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold">
                Project Inquiry <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <aside className="border-l border-ivory/10 pl-8 md:col-span-4">
            {project.metadata.map((item) => (
              <div key={item.label} className="border-b border-ivory/10 py-5 first:pt-0">
                <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40">{item.label}</p>
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
                  active === filter ? "border-gold bg-gold text-onyx" : "border-ivory/15 text-ivory/65 hover:border-ivory/50 hover:text-ivory"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <Link to="/projects/al-se7r-tower" className="group block overflow-hidden border border-ivory/10 bg-ivory/[0.03] lg:col-span-2">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={project.hero} alt="Al Se7r Tower exterior render" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
            </div>
            <div className="p-8">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{project.category}</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">{project.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/65">{project.shortDescription}</p>
            </div>
          </Link>
          <div className="space-y-4">
            {sections.map((section) => (
              <Link key={section.id} to="/projects/al-se7r-tower" className="block border border-ivory/10 p-5 transition-colors hover:border-gold hover:text-gold">
                <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">{section.category}</p>
                <h3 className="mt-2 font-display text-2xl">{section.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ivory/55">{section.description}</p>
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
  const mutation = useMutation({
    mutationFn: async (payload: { name: string; email: string; phone: string; message: string }) => {
      const { error } = await supabase.from("contact_messages").insert(payload as never);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Message sent."),
    onError: () => toast.error("Could not send message."),
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
      toast.error("Please complete the required fields.");
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
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Contact</p>
          <h2 className="mt-4 font-display text-5xl">Start a project conversation.</h2>
          <div className="mt-10 space-y-4 text-sm text-ivory/70">
            <a className="flex items-center gap-3 hover:text-gold" href="mailto:hello@mohannad.studio"><Mail className="h-4 w-4" /> hello@mohannad.studio</a>
            <a className="flex items-center gap-3 hover:text-gold" href="tel:+200000000000"><Phone className="h-4 w-4" /> Available on request</a>
            <span className="flex items-center gap-3"><MessageCircle className="h-4 w-4" /> Architectural portfolio inquiries</span>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 md:col-span-7">
          <input name="name" placeholder="Name" className="w-full border-b border-ivory/20 bg-transparent py-3 outline-none placeholder:text-ivory/35 focus:border-gold" />
          <input name="email" type="email" placeholder="Email" className="w-full border-b border-ivory/20 bg-transparent py-3 outline-none placeholder:text-ivory/35 focus:border-gold" />
          <input name="phone" placeholder="Phone" className="w-full border-b border-ivory/20 bg-transparent py-3 outline-none placeholder:text-ivory/35 focus:border-gold" />
          <textarea name="message" rows={5} placeholder="Message" className="w-full resize-none border-b border-ivory/20 bg-transparent py-3 outline-none placeholder:text-ivory/35 focus:border-gold" />
          <button disabled={submitting} className="bg-ivory px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-onyx hover:bg-gold disabled:opacity-50">
            {submitting ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}
