import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { EventCard } from "@/components/unify/EventCard";
import { Stat, SectionHead } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { useDemo, recommendedEvents, recommendedBuddies } from "@/lib/demo/store";
import { EVENTS, byId } from "@/lib/demo/data";
import { Ticket, HeartHandshake, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/u/")({
  head: () => ({ meta: [{ title: "Your UNIFY home — USER dashboard" }, { name: "description", content: "Your personalised UNIFY home: matched events, buddy suggestions and your impact snapshot." }, { property: "og:title", content: "Your UNIFY home" }, { property: "og:description", content: "Matched events, buddy suggestions and your impact snapshot." }] }),
  component: UserHome,
});

function UserHome() {
  const demo = useDemo();
  const top = recommendedEvents(demo.user).slice(0, 3);
  const buddies = recommendedBuddies(demo.user).slice(0, 3);
  const hours = demo.joined.reduce((s, id) => s + (byId(EVENTS, id)?.hours ?? 0), 0);

  return (
    <Shell role="user">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-4xl md:text-5xl font-semibold">Hi {demo.user?.name?.split(" ")[0] ?? "there"} 👋</h1>
        <p className="text-muted-foreground mt-2">Here's what's worth showing up for this week.</p>

        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <Stat icon={<Ticket className="h-5 w-5" />} tint="bg-peach/60" label="Events joined" value={demo.joined.length} sub="this season" />
          <Stat icon={<Clock className="h-5 w-5" />} tint="bg-mint/60" label="Impact hours" value={`${hours} h`} sub="volunteered" />
          <Stat icon={<HeartHandshake className="h-5 w-5" />} tint="bg-lavender/60" label="Buddies" value={demo.buddies.length} sub={`${demo.buddyRequests.length} requests sent`} />
        </div>

        <div className="mt-10">
          <SectionHead title="For you" sub="Ranked by how well each event fits your profile."
            action={<Button asChild variant="outline" className="rounded-full"><Link to="/u/for-you">See all suggestions</Link></Button>} />
          <div className="grid md:grid-cols-3 gap-5">
            {top.map(({ event, match }) => (
              <EventCard key={event.id} ev={event} match={match} footer={
                demo.joined.includes(event.id)
                  ? <span className="text-xs font-medium text-primary">✓ You're going</span>
                  : <Button size="sm" className="rounded-full h-8 w-full" onClick={() => { demo.set({ joined: [...demo.joined, event.id] }); demo.notify("user", "Registered ✅", `You're going to ${event.title}.`); toast.success("Registered — see you there!"); }}>Register</Button>
              } />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <SectionHead title="Buddy Up" sub="People with shared interests attending events near you."
            action={<Button asChild variant="outline" className="rounded-full"><Link to="/u/buddy">Find buddies</Link></Button>} />
          <div className="grid md:grid-cols-3 gap-5">
            {buddies.map(({ user, match }) => (
              <div key={user.id} className="card-soft bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{user.avatar}</div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.city} · {user.eventsAttended} events</div>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-primary inline-flex items-center gap-1"><Sparkles className="h-3 w-3" />{match.score}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{user.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
