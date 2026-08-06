import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { Stat, SectionHead } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { useDemo, OPPORTUNITIES } from "@/lib/demo/store";
import { inr } from "@/lib/demo/data";
import { Briefcase, IndianRupee, Star, CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/em/")({
  head: () => ({ meta: [{ title: "Event manager dashboard — UNIFY" }, { name: "description", content: "Track opportunities, live events, revenue and ratings as a UNIFY event manager." }, { property: "og:title", content: "Event manager dashboard — UNIFY" }, { property: "og:description", content: "Track opportunities, live events, revenue and ratings as a UNIFY event manager." }] }),
  component: EmHome,
});

function EmHome() {
  const demo = useDemo();
  const open = OPPORTUNITIES.filter((o) => o.status === "open").length;
  const won = demo.appliedOps.length;
  const revenue = demo.appliedOps.reduce((s, id) => s + (OPPORTUNITIES.find((o) => o.id === id)?.budget ?? 0), 0);
  return (
    <Shell role="manager">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title={demo.manager?.name ?? "Event manager"} sub="Your pipeline at a glance."
          action={<Button asChild className="rounded-full"><Link to="/em/opportunities">View opportunities</Link></Button>} />
        <div className="grid sm:grid-cols-4 gap-4">
          <Stat icon={<Briefcase className="h-5 w-5" />} tint="bg-butter/60" label="Open opportunities" value={open} />
          <Stat icon={<CalendarCheck className="h-5 w-5" />} tint="bg-mint/60" label="Applications sent" value={won} />
          <Stat icon={<IndianRupee className="h-5 w-5" />} tint="bg-lavender/60" label="Pipeline value" value={inr(revenue)} />
          <Stat icon={<Star className="h-5 w-5" />} tint="bg-peach/60" label="Rating" value="4.8" sub="from 128 events" />
        </div>
      </section>
    </Shell>
  );
}
