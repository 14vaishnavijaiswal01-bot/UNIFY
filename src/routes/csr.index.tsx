import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { Stat, SectionHead, Meter } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/unify/EventCard";
import { useDemo } from "@/lib/demo/store";
import { EVENTS, byId, inr } from "@/lib/demo/data";
import { IndianRupee, Users, Building2, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/csr/")({
  head: () => ({ meta: [{ title: "CSR dashboard — UNIFY" }, { name: "description", content: "Track your CSR budget, sponsored events, beneficiaries reached and impact score in one place." }, { property: "og:title", content: "CSR dashboard — UNIFY" }, { property: "og:description", content: "Track your CSR budget, sponsored events, beneficiaries reached and impact score in one place." }] }),
  component: CsrHome,
});

function CsrHome() {
  const demo = useDemo();
  const budget = demo.csr?.budget ?? 5000000;
  const spent = demo.supported.reduce((s, x) => s + x.amount, 0);
  const events = demo.supported.map((s) => byId(EVENTS, s.eventId)).filter(Boolean);
  const beneficiaries = events.reduce((s, e) => s + (e?.beneficiaries ?? 0), 0);

  return (
    <Shell role="csr">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title={demo.csr?.company ?? "CSR dashboard"} sub="Fund what matters. Prove what changed."
          action={<div className="flex gap-2"><Button asChild className="rounded-full"><Link to="/csr/create">Create event</Link></Button><Button asChild variant="outline" className="rounded-full"><Link to="/csr/discover">Choose event</Link></Button></div>} />
        <div className="grid sm:grid-cols-4 gap-4">
          <Stat icon={<IndianRupee className="h-5 w-5" />} tint="bg-lavender/60" label="CSR budget" value={inr(budget)} sub="this year" />
          <Stat icon={<BarChart3 className="h-5 w-5" />} tint="bg-peach/60" label="Deployed" value={inr(spent)} sub={`${Math.round((spent / Math.max(budget,1)) * 100)}% used`} />
          <Stat icon={<Building2 className="h-5 w-5" />} tint="bg-mint/60" label="Events supported" value={demo.supported.length} />
          <Stat icon={<Users className="h-5 w-5" />} tint="bg-butter/60" label="Beneficiaries" value={beneficiaries} />
        </div>
        <div className="card-soft bg-card p-6 mt-6"><Meter label="Budget utilisation" value={spent} max={budget} format={inr} /></div>

        <h3 className="font-display text-2xl font-semibold mt-10 mb-4">Your supported events</h3>
        {events.length === 0 ? (
          <div className="card-soft bg-card p-8 text-center text-sm text-muted-foreground">
            Nothing funded yet. <Link to="/csr/discover" className="text-primary underline">Discover events</Link> that match your focus areas.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">{events.map((e) => e && <EventCard key={e.id} ev={e} />)}</div>
        )}
      </section>
    </Shell>
  );
}
