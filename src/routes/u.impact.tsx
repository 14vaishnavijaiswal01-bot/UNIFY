import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { Stat, SectionHead, ImpactScore } from "@/components/unify/bits";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDemo } from "@/lib/demo/store";
import { EVENTS, prettyDate } from "@/lib/demo/data";
import { Clock, Users, Heart, Trophy } from "lucide-react";

export const Route = createFileRoute("/u/impact")({
  head: () => ({ meta: [{ title: "My impact profile — UNIFY" }, { name: "description", content: "Your volunteer hours, events attended, causes supported and beneficiaries reached." }, { property: "og:title", content: "My impact profile — UNIFY" }, { property: "og:description", content: "Your volunteer hours, events attended, causes supported and beneficiaries reached." }] }),
  component: Impact,
});

function Impact() {
  const demo = useDemo();
  const mine = EVENTS.filter((e) => demo.joined.includes(e.id));
  const hours = mine.reduce((s, e) => s + e.hours, 0);
  const causes = Array.from(new Set(mine.map((e) => e.cause)));
  const beneficiaries = mine.reduce((s, e) => s + Math.round(e.beneficiaries / Math.max(e.participants, 1)), 0);
  const score = Math.min(100, 30 + hours * 4 + mine.length * 6);
  const next = score < 60 ? "Community Helper" : score < 85 ? "Impact Champion" : "UNIFY Legend";

  return (
    <Shell role="user">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="My impact profile" sub="Everything you do on UNIFY builds a verifiable record." />
        <div className="grid sm:grid-cols-4 gap-4">
          <Stat icon={<Clock className="h-5 w-5" />} tint="bg-mint/60" label="Volunteer hours" value={`${hours} h`} />
          <Stat icon={<Users className="h-5 w-5" />} tint="bg-peach/60" label="Events attended" value={mine.length} />
          <Stat icon={<Heart className="h-5 w-5" />} tint="bg-rose/50" label="Causes supported" value={causes.length} />
          <Stat icon={<Trophy className="h-5 w-5" />} tint="bg-butter/60" label="Lives touched" value={beneficiaries} />
        </div>

        <div className="card-soft bg-card p-6 mt-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">UNIFY impact score</div>
              <div className="font-display text-4xl font-semibold">{score}<span className="text-lg text-muted-foreground">/100</span></div>
            </div>
            <ImpactScore score={score} />
          </div>
          <Progress value={score} className="h-2 mt-4" />
          <p className="text-xs text-muted-foreground mt-2">Next milestone: {next}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {causes.map((c) => <Badge key={c} variant="secondary" className="text-[11px]">{c}</Badge>)}
          </div>
        </div>

        <h3 className="font-display text-2xl font-semibold mt-10">Activity log</h3>
        <div className="mt-4 card-soft bg-card divide-y divide-border/60">
          {mine.length === 0 && <div className="p-5 text-sm text-muted-foreground">No activity yet — register for an event to start your log.</div>}
          {mine.map((e) => (
            <div key={e.id} className="p-4 flex items-center gap-3">
              <span className="text-2xl">{e.emoji}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{e.title}</div>
                <div className="text-xs text-muted-foreground">{prettyDate(e.date)} · {e.city}</div>
              </div>
              <Badge variant="secondary" className="ml-auto text-[11px]">+{e.hours} h</Badge>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
