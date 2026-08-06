import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead } from "@/components/unify/bits";
import { EventCard } from "@/components/unify/EventCard";
import { Button } from "@/components/ui/button";
import { EVENTS } from "@/lib/demo/data";

export const Route = createFileRoute("/em/events")({
  head: () => ({ meta: [{ title: "My managed events — UNIFY" }, { name: "description", content: "Events you're executing, with participant counts, funding status and beneficiary progress." }, { property: "og:title", content: "My managed events — UNIFY" }, { property: "og:description", content: "Events you're executing, with participant counts, funding status and beneficiary progress." }] }),
  component: EmEvents,
});

function EmEvents() {
  const mine = EVENTS.filter((e) => e.managerId === "em-1");
  return (
    <Shell role="manager">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="My events" sub="Events assigned to your agency."
          action={<Button asChild variant="outline" className="rounded-full"><Link to="/em/opportunities">Find more work</Link></Button>} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mine.map((e) => <EventCard key={e.id} ev={e} footer={<Button asChild size="sm" variant="outline" className="rounded-full h-8 w-full"><Link to="/event/$id" params={{ id: e.id }}>Manage</Link></Button>} />)}
        </div>
      </section>
    </Shell>
  );
}
