import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Users, Building2, CalendarRange, HeartHandshake, ShieldCheck, Search, BarChart3, Handshake, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/unify/Shell";
import { EVENTS, COMPANIES, MANAGERS, NGOS, inr } from "@/lib/demo/data";
import { EventCard } from "@/components/unify/EventCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UNIFY — Where people, purpose and companies meet" },
      { name: "description", content: "UNIFY connects individuals, CSR companies and event managers around real social-impact events, with smart matching, Buddy Up and verified impact reporting." },
      { property: "og:title", content: "UNIFY — Where people, purpose and companies meet" },
      { property: "og:description", content: "One platform for individuals, CSR companies and event managers to create measurable social impact together." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const ROLES = [
  { key: "user", emoji: "🧑‍🤝‍🧑", tint: "bg-mint/60", title: "USER", tagline: "Find events. Find people. Find purpose.", bullets: ["Personalised event suggestions", "Buddy Up with like-minded people", "Track your impact profile"] },
  { key: "csr", emoji: "🏢", tint: "bg-lavender/60", title: "CSR COMPANY", tagline: "Turn CSR budgets into visible impact.", bullets: ["Create or join impact events", "Hire verified event managers", "Automated impact reports"] },
  { key: "manager", emoji: "🎪", tint: "bg-butter/60", title: "EVENT MANAGER", tagline: "Get discovered. Get hired. Get paid.", bullets: ["Live CSR opportunity board", "Showcase your portfolio", "Manage events end to end"] },
] as const;

function Landing() {
  const featured = EVENTS.filter((e) => e.popular).slice(0, 3);
  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-4 pt-14 md:pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-card/70 border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> One ecosystem · three stakeholders · real impact
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.03]">
            Where people, purpose and <span className="italic text-primary">companies</span> meet.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            UNIFY connects individuals looking for meaningful things to do, companies with CSR budgets, and
            event managers who make it all happen — matched intelligently, measured transparently.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full h-12 px-7"><Link to="/join">Join UNIFY</Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-7 bg-card/70"><Link to="/u/explore">Explore events</Link></Button>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { n: `${EVENTS.length * 47}+`, l: "Live events" },
              { n: `${COMPANIES.length * 26}+`, l: "CSR partners" },
              { n: `${MANAGERS.length * 31}+`, l: "Event managers" },
              { n: `${NGOS.length * 42}+`, l: "NGO partners" },
            ].map((s) => (
              <div key={s.l} className="card-soft bg-card/70 py-4">
                <div className="font-display text-2xl font-semibold">{s.n}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div id="roles" className="mt-16 grid md:grid-cols-3 gap-5">
          {ROLES.map((r, i) => (
            <motion.div key={r.key} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`card-soft p-6 ${r.tint}`}>
              <div className="text-4xl">{r.emoji}</div>
              <h3 className="font-display text-2xl mt-3 font-semibold">{r.title}</h3>
              <p className="text-sm text-foreground/70 mt-1">{r.tagline}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {r.bullets.map((b) => <li key={b} className="flex gap-2"><span className="text-primary">✓</span>{b}</li>)}
              </ul>
              <Button asChild className="mt-5 rounded-full w-full"><Link to="/join" search={{ role: r.key }}>Continue as {r.title}</Link></Button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-semibold">The loop that keeps giving</h2>
          <p className="mt-3 text-muted-foreground">Companies fund. Managers execute. People show up. Everyone gets proof of impact.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Feature icon={<Search className="h-5 w-5" />} tint="bg-mint/60" title="Smart matching" body="Every recommendation shows a match score and the exact reasons behind it — interests, city, availability, budget and past behaviour." />
          <Feature icon={<HeartHandshake className="h-5 w-5" />} tint="bg-peach/60" title="Buddy Up" body="Never attend alone. Get matched with people going to the same event who share your interests, then chat before you go." />
          <Feature icon={<BarChart3 className="h-5 w-5" />} tint="bg-lavender/60" title="Impact profiles" body="Hours, events, causes and beneficiaries — every participant, company and manager builds a verifiable impact record." />
          <Feature icon={<Handshake className="h-5 w-5" />} tint="bg-butter/60" title="Opportunity board" body="CSR briefs become live opportunities that event managers apply to, with budget, city, date and services listed upfront." />
          <Feature icon={<ShieldCheck className="h-5 w-5" />} tint="bg-sky/60" title="Verified everything" body="Verified users, verified NGOs, verified managers and verified companies — trust is built into the ecosystem." />
          <Feature icon={<Award className="h-5 w-5" />} tint="bg-rose/50" title="Automated reporting" body="Beneficiaries reached, funds deployed and volunteer hours roll up into shareable CSR and ESG reports." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Happening now</h2>
          <Button asChild variant="outline" className="rounded-full"><Link to="/u/explore">See all events</Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((e) => (
            <EventCard key={e.id} ev={e} footer={
              <>
                <span className="text-xs text-muted-foreground">{inr(e.funded)} of {inr(e.fundingGoal)} funded</span>
                <Button asChild size="sm" className="rounded-full ml-auto h-8"><Link to="/event/$id" params={{ id: e.id }}>View</Link></Button>
              </>
            } />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="card-soft bg-card p-10 md:p-16 text-center">
          <CalendarRange className="h-8 w-8 mx-auto text-primary" />
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-semibold">Pick your side of the bridge.</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Three dashboards, one shared mission. Set up your profile in under a minute.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full h-12 px-7"><Link to="/join">Get started</Link></Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Individuals</span>
            <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> CSR companies</span>
            <span className="inline-flex items-center gap-1"><CalendarRange className="h-3.5 w-3.5" /> Event managers</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        UNIFY · Where people, purpose and companies meet · {new Date().getFullYear()}
      </footer>
    </Shell>
  );
}

function Feature({ icon, tint, title, body }: { icon: React.ReactNode; tint: string; title: string; body: string }) {
  return (
    <div className="card-soft bg-card p-6">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${tint}`}>{icon}</div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
