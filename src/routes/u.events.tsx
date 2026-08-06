import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/unify/EventCard";
import { useDemo } from "@/lib/demo/store";
import { EVENTS } from "@/lib/demo/data";
import { toast } from "sonner";

export const Route = createFileRoute("/u/events")({
  head: () => ({ meta: [{ title: "My events — UNIFY" }, { name: "description", content: "All the impact events you've registered for, with dates, locations and organisers." }, { property: "og:title", content: "My events — UNIFY" }, { property: "og:description", content: "All the impact events you've registered for, with dates, locations and organisers." }] }),
  component: MyEvents,
});

function MyEvents() {
  const demo = useDemo();
  const mine = EVENTS.filter((e) => demo.joined.includes(e.id));
  return (
    <Shell role="user">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="My events" sub={`${mine.length} registered`}
          action={<Button asChild variant="outline" className="rounded-full"><Link to="/u/explore">Find more</Link></Button>} />
        {mine.length === 0 ? (
          <div className="card-soft bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">You haven't registered for anything yet.</p>
            <Button asChild className="rounded-full mt-4"><Link to="/u/for-you">See your matches</Link></Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mine.map((e) => (
              <EventCard key={e.id} ev={e} footer={
                <Button size="sm" variant="outline" className="rounded-full h-8 w-full" onClick={() => { demo.set({ joined: demo.joined.filter((id) => id !== e.id) }); toast("Registration cancelled"); }}>Cancel registration</Button>
              } />
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}
