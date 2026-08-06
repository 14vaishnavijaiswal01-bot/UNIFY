import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { EventCard } from "@/components/unify/EventCard";
import { SectionHead } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { useDemo, recommendedEvents } from "@/lib/demo/store";
import { toast } from "sonner";

export const Route = createFileRoute("/u/for-you")({
  head: () => ({ meta: [{ title: "For You — personalised event matches" }, { name: "description", content: "Events ranked by your interests, city, availability and preferred formats, with the reasoning shown." }, { property: "og:title", content: "For You — personalised event matches" }, { property: "og:description", content: "Events ranked by your interests, city, availability and preferred formats, with the reasoning shown." }] }),
  component: ForYou,
});

function ForYou() {
  const demo = useDemo();
  const list = recommendedEvents(demo.user);
  return (
    <Shell role="user">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="For you" sub="Tap any match score to see exactly why we suggested it." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(({ event, match }) => (
            <EventCard key={event.id} ev={event} match={match} footer={
              demo.joined.includes(event.id)
                ? <span className="text-xs font-medium text-primary">✓ Registered</span>
                : <Button size="sm" className="rounded-full h-8 w-full" onClick={() => { demo.set({ joined: [...demo.joined, event.id] }); demo.notify("user", "Registered ✅", `You're going to ${event.title}.`); toast.success("Registered!"); }}>Register</Button>
            } />
          ))}
        </div>
      </section>
    </Shell>
  );
}
