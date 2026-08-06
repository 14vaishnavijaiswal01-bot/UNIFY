import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead, Verified } from "@/components/unify/bits";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/demo/store";
import { MANAGERS, inr } from "@/lib/demo/data";

export const Route = createFileRoute("/em/portfolio")({
  head: () => ({ meta: [{ title: "Agency portfolio — UNIFY" }, { name: "description", content: "Your public agency profile: services, specialisations, past events, clients and budget range." }, { property: "og:title", content: "Agency portfolio — UNIFY" }, { property: "og:description", content: "Your public agency profile: services, specialisations, past events, clients and budget range." }] }),
  component: Portfolio,
});

function Portfolio() {
  const demo = useDemo();
  const base = MANAGERS[0]!;
  const p = demo.manager;
  return (
    <Shell role="manager">
      <section className="mx-auto max-w-4xl px-4 py-10">
        <SectionHead title="Portfolio" sub="This is what CSR companies see when they find you." />
        <div className="card-soft bg-card p-6 md:p-8">
          <h2 className="font-display text-3xl font-semibold flex items-center gap-2">{p?.name ?? base.name} <Verified /></h2>
          <p className="text-sm text-muted-foreground mt-2">{p?.about ?? base.about}</p>
          <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
            <Box t="Services">{(p?.services ?? base.services).join(" · ")}</Box>
            <Box t="Specializations">{(p?.specializations ?? base.specializations).join(" · ")}</Box>
            <Box t="Cities">{(p?.cities ?? base.cities).join(", ")}</Box>
            <Box t="Budget range">{inr(p?.budgetMin ?? base.budgetMin)} – {inr(p?.budgetMax ?? base.budgetMax)}</Box>
            <Box t="Availability">{(p?.availability ?? base.availability).join(", ")}</Box>
            <Box t="Team size">{p?.teamSize ?? base.teamSize} people</Box>
          </div>
          <h3 className="font-display text-xl font-semibold mt-8">Past work</h3>
          <p className="text-sm text-muted-foreground mt-1">{p?.pastEvents ?? `${base.pastEvents} events delivered`}</p>
          <div className="mt-3 space-y-2">
            {base.portfolio.map((x) => (
              <div key={x.title} className="rounded-xl bg-muted/60 p-3 text-sm flex justify-between"><span>{x.title}</span><Badge variant="secondary" className="text-[11px]">{x.scale}</Badge></div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">Clients: {p?.clients ?? base.clients.join(", ")}</div>
        </div>
      </section>
    </Shell>
  );
}

function Box({ t, children }: { t: string; children: React.ReactNode }) {
  return <div className="rounded-xl bg-muted/60 p-3"><div className="text-[11px] uppercase tracking-wide text-muted-foreground">{t}</div><div className="mt-0.5">{children}</div></div>;
}
