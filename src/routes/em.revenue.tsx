import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead, Stat, Meter } from "@/components/unify/bits";
import { useDemo, OPPORTUNITIES } from "@/lib/demo/store";
import { inr } from "@/lib/demo/data";
import { IndianRupee, TrendingUp, Briefcase } from "lucide-react";

export const Route = createFileRoute("/em/revenue")({
  head: () => ({ meta: [{ title: "Revenue and pipeline — UNIFY" }, { name: "description", content: "Track won work, pipeline value and how close you are to your quarterly target." }, { property: "og:title", content: "Revenue and pipeline — UNIFY" }, { property: "og:description", content: "Track won work, pipeline value and how close you are to your quarterly target." }] }),
  component: Revenue,
});

function Revenue() {
  const demo = useDemo();
  const pipeline = demo.appliedOps.reduce((s, id) => s + (OPPORTUNITIES.find((o) => o.id === id)?.budget ?? 0), 0);
  const earned = 4820000;
  const target = 6000000;
  return (
    <Shell role="manager">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <SectionHead title="Revenue" sub="Everything you've earned and everything in play." />
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat icon={<IndianRupee className="h-5 w-5" />} tint="bg-lavender/60" label="Earned this year" value={inr(earned)} />
          <Stat icon={<Briefcase className="h-5 w-5" />} tint="bg-butter/60" label="Pipeline" value={inr(pipeline)} />
          <Stat icon={<TrendingUp className="h-5 w-5" />} tint="bg-mint/60" label="Win rate" value="72%" />
        </div>
        <div className="card-soft bg-card p-6 mt-6"><Meter label="Annual target" value={earned} max={target} format={inr} /></div>
      </section>
    </Shell>
  );
}
