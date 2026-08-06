import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead, Stat } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo/store";
import { EVENTS, byId, inr } from "@/lib/demo/data";
import { toast } from "sonner";
import { Award, IndianRupee, Users, Clock } from "lucide-react";

export const Route = createFileRoute("/csr/reports")({
  head: () => ({ meta: [{ title: "Impact reports — UNIFY CSR" }, { name: "description", content: "Automated CSR and ESG reporting: funds deployed, beneficiaries reached and volunteer hours generated." }, { property: "og:title", content: "Impact reports — UNIFY CSR" }, { property: "og:description", content: "Automated CSR and ESG reporting: funds deployed, beneficiaries reached and volunteer hours generated." }] }),
  component: Reports,
});

function Reports() {
  const demo = useDemo();
  const all = [...EVENTS, ...demo.createdEvents];
  const rows = demo.supported.map((s) => ({ s, e: byId(all, s.eventId) }));
  const spent = demo.supported.reduce((a, s) => a + s.amount, 0);
  const ben = rows.reduce((a, r) => a + (r.e?.beneficiaries ?? 0), 0);
  const hours = rows.reduce((a, r) => a + (r.e?.hours ?? 0) * (r.e?.participants ?? 0), 0);

  return (
    <Shell role="csr">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <SectionHead title="Impact reports" sub="Auto-generated from verified event data."
          action={<Button className="rounded-full" onClick={() => toast.success("ESG report generated — ready to share")}><Award className="h-4 w-4 mr-1" /> Generate ESG report</Button>} />
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat icon={<IndianRupee className="h-5 w-5" />} tint="bg-lavender/60" label="Funds deployed" value={inr(spent)} />
          <Stat icon={<Users className="h-5 w-5" />} tint="bg-mint/60" label="Beneficiaries reached" value={ben} />
          <Stat icon={<Clock className="h-5 w-5" />} tint="bg-peach/60" label="Volunteer hours enabled" value={hours} />
        </div>
        <div className="card-soft bg-card mt-6 divide-y divide-border/60">
          {rows.length === 0 && <div className="p-6 text-sm text-muted-foreground">Fund an event to start generating reports.</div>}
          {rows.map(({ s, e }) => (
            <div key={s.eventId} className="p-4 text-sm flex flex-wrap items-center gap-3">
              <span className="text-xl">{e?.emoji}</span>
              <span className="font-medium">{e?.title}</span>
              <span className="ml-auto text-xs text-muted-foreground">{e?.beneficiaries} beneficiaries · impact {e?.impactScore}/100</span>
              <span className="text-xs font-medium">{inr(s.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
