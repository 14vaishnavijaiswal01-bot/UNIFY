import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead, MatchBadge, Verified } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo, recommendedManagers } from "@/lib/demo/store";
import { inr } from "@/lib/demo/data";

export const Route = createFileRoute("/csr/managers/")({
  head: () => ({ meta: [{ title: "Find verified event managers — UNIFY" }, { name: "description", content: "Compare event managers by budget range, specialisation, city, rating and success rate." }, { property: "og:title", content: "Find verified event managers — UNIFY" }, { property: "og:description", content: "Compare event managers by budget range, specialisation, city, rating and success rate." }] }),
  component: Managers,
});

function Managers() {
  const demo = useDemo();
  const list = recommendedManagers({ budget: demo.csr?.budget ? Math.round(demo.csr.budget / 20) : 200000, city: demo.csr?.cities?.[0] ?? "Mumbai" });
  return (
    <Shell role="csr">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="Event managers" sub="Verified partners who can execute your events end to end." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(({ manager: m, match }) => (
            <div key={m.id} className="card-soft bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{m.logo}</span>
                <div className="min-w-0">
                  <div className="font-medium flex items-center gap-2">{m.name} {m.verified && <Verified />}</div>
                  <div className="text-xs text-muted-foreground">⭐ {m.rating} · {m.pastEvents} events · {m.successRate}% success</div>
                </div>
                <div className="ml-auto"><MatchBadge score={match.score} reasons={match.reasons} /></div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{m.about}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{m.specializations.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}</div>
              <div className="text-xs text-muted-foreground mt-3">{inr(m.budgetMin)}–{inr(m.budgetMax)} · {m.cities.join(", ")}</div>
              <Button asChild size="sm" className="rounded-full w-full mt-4 h-8"><Link to="/csr/managers/$id" params={{ id: m.id }}>View profile</Link></Button>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
