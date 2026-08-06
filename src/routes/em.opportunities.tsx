import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo, OPPORTUNITIES } from "@/lib/demo/store";
import { COMPANIES, byId, inr, prettyDate } from "@/lib/demo/data";
import { toast } from "sonner";

export const Route = createFileRoute("/em/opportunities")({
  head: () => ({ meta: [{ title: "CSR opportunities board — UNIFY" }, { name: "description", content: "Live CSR briefs with budget, city, date and required services — apply in one click." }, { property: "og:title", content: "CSR opportunities board — UNIFY" }, { property: "og:description", content: "Live CSR briefs with budget, city, date and required services — apply in one click." }] }),
  component: Opportunities,
});

function Opportunities() {
  const demo = useDemo();
  return (
    <Shell role="manager">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <SectionHead title="Opportunities" sub="CSR companies looking for an execution partner right now." />
        <div className="space-y-4">
          {OPPORTUNITIES.map((o) => {
            const co = byId(COMPANIES, o.csrId);
            const applied = demo.appliedOps.includes(o.id);
            return (
              <div key={o.id} className="card-soft bg-card p-5">
                <div className="flex items-start gap-3 flex-wrap">
                  <span className="text-2xl">{co?.logo}</span>
                  <div className="min-w-0">
                    <div className="font-display text-lg font-semibold">{o.title}</div>
                    <div className="text-xs text-muted-foreground">{co?.name} · {o.city} · {prettyDate(o.date)} · {o.expectedUsers} participants</div>
                  </div>
                  <Badge className="ml-auto bg-mint text-foreground">{inr(o.budget)}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">{o.services.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}</div>
                <div className="mt-4">
                  {applied || o.status !== "open"
                    ? <span className="text-xs font-medium text-primary capitalize">✓ {applied ? "applied" : o.status}</span>
                    : <Button size="sm" className="rounded-full h-8" onClick={() => { demo.set({ appliedOps: [...demo.appliedOps, o.id] }); demo.notify("manager", "Application sent 📨", `${o.title} — ${inr(o.budget)}`); demo.notify("csr", "New manager application", `An event manager applied to ${o.title}.`); toast.success("Application sent"); }}>Apply</Button>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}
