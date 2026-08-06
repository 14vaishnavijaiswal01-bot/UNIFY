import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead } from "@/components/unify/bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo/store";
import { EVENTS, byId, inr, prettyDate } from "@/lib/demo/data";

export const Route = createFileRoute("/csr/partnerships")({
  head: () => ({ meta: [{ title: "My partnerships — UNIFY CSR" }, { name: "description", content: "Every event you fund, the partnership type, amount deployed and current status." }, { property: "og:title", content: "My partnerships — UNIFY CSR" }, { property: "og:description", content: "Every event you fund, the partnership type, amount deployed and current status." }] }),
  component: Partnerships,
});

function Partnerships() {
  const demo = useDemo();
  const all = [...EVENTS, ...demo.createdEvents];
  return (
    <Shell role="csr">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <SectionHead title="My partnerships" sub={`${demo.supported.length} active`} />
        {demo.supported.length === 0 ? (
          <div className="card-soft bg-card p-8 text-center text-sm text-muted-foreground">
            No partnerships yet. <Link to="/csr/discover" className="text-primary underline">Find an event to support</Link>.
          </div>
        ) : (
          <div className="card-soft bg-card divide-y divide-border/60">
            {demo.supported.map((s) => {
              const e = byId(all, s.eventId);
              return (
                <div key={s.eventId} className="p-4 flex items-center gap-3 flex-wrap">
                  <span className="text-2xl">{e?.emoji ?? "✨"}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{e?.title ?? "Event"}</div>
                    <div className="text-xs text-muted-foreground">{e ? `${prettyDate(e.date)} · ${e.city}` : ""}</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-[11px]">{s.type}</Badge>
                  <Badge className="bg-mint text-foreground text-[11px]">{inr(s.amount)}</Badge>
                  <Button asChild size="sm" variant="outline" className="rounded-full h-8"><Link to="/csr/reports">Report</Link></Button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Shell>
  );
}
