import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Calendar, Building2, HeartHandshake, ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-blush-gradient">
      <AppNav />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Mumbai's first three-sided community marketplace
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.05]">
            Turning empty spaces into <span className="italic text-primary">shared moments</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            A lonely individual. An underused event manager. An untouched CSR budget.
            Three separate problems, minutes apart. UNIFY is the bridge that lets them solve each other.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full h-12 px-6">
              <Link to="/auth">Join the bridge</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-6 bg-white/60">
              <Link to="/events">Browse events</Link>
            </Button>
          </div>
        </motion.div>

        {/* three floating cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-4 md:gap-6" id="roles">
          {[
            { emoji: "🌿", color: "bg-mint/60", title: "For Individuals", body: "Discover safe, verified events near you. Bring a buddy — or find one on the way.", to: "/auth" },
            { emoji: "🎪", color: "bg-butter/60", title: "For Event Managers", body: "Get matched with corporates and audiences. Stop chasing venues that ghost you.", to: "/auth" },
            { emoji: "💼", color: "bg-lavender/60", title: "For Corporates", body: "Plug CSR budgets into real events with measurable, shareable impact.", to: "/auth" },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`card-soft p-6 ${c.color}`}
            >
              <div className="text-4xl">{c.emoji}</div>
              <h3 className="font-display text-2xl mt-3">{c.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{c.body}</p>
              <Link to={c.to} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">Get started →</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-semibold">One platform. Three sides. <span className="italic text-primary">One bridge.</span></h2>
          <p className="mt-4 text-muted-foreground">Each side solves the other's exact problem.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <FeatureCard icon={<Users className="h-5 w-5" />} tint="bg-mint/50" title="Discover, safely" body="Aadhaar-verified profiles, buddy tags for first-timers, organizer reviews, and public venues by default." />
          <FeatureCard icon={<Calendar className="h-5 w-5" />} tint="bg-butter/60" title="Run, easily" body="Curated venues, matched audiences, marketing baked in, commission-based earnings." />
          <FeatureCard icon={<Building2 className="h-5 w-5" />} tint="bg-lavender/50" title="Sponsor, credibly" body="CSR + brand together. Choose data-only or full-service. Get a shareable ESG certificate." />
          <FeatureCard icon={<HeartHandshake className="h-5 w-5" />} tint="bg-peach/60" title="Buddy up" body="Nervous about walking in alone? Match with someone going to the same event." />
          <FeatureCard icon={<MapPin className="h-5 w-5" />} tint="bg-sky/60" title="Suggest a space" body="Flag a vacant park or hall near you and turn it into a venue." />
          <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} tint="bg-rose/50" title="Impact tracker" body="Every event you attend counts toward pass credits and a shareable impact log." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="card-soft p-10 md:p-16 text-center bg-white/70">
          <h2 className="font-display text-4xl md:text-5xl font-semibold">Ready to stop scrolling and start showing up?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Join UNIFY and pick your side of the bridge.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full h-12 px-6"><Link to="/auth">Create your account</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-6"><Link to="/events">See what's on</Link></Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        Built with 💚 in Mumbai · UNIFY {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function FeatureCard({ icon, tint, title, body }: { icon: React.ReactNode; tint: string; title: string; body: string }) {
  return (
    <div className="card-soft p-6 bg-white/70">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${tint} text-foreground`}>{icon}</div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-foreground/70">{body}</p>
    </div>
  );
}
