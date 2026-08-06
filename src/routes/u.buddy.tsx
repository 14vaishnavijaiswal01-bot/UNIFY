import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { MatchBadge, SectionHead, Verified } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo, recommendedBuddies } from "@/lib/demo/store";
import { toast } from "sonner";

export const Route = createFileRoute("/u/buddy")({
  head: () => ({ meta: [{ title: "Buddy Up — never attend an event alone" }, { name: "description", content: "Match with people who share your interests and are attending the same UNIFY events." }, { property: "og:title", content: "Buddy Up — never attend an event alone" }, { property: "og:description", content: "Match with people who share your interests and are attending the same UNIFY events." }] }),
  component: Buddy,
});

function Buddy() {
  const demo = useDemo();
  const list = recommendedBuddies(demo.user);
  return (
    <Shell role="user">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="Buddy Up" sub="Send a request, and once they accept you can plan the day together." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(({ user, match }) => {
            const sent = demo.buddyRequests.includes(user.id);
            const friend = demo.buddies.includes(user.id);
            return (
              <div key={user.id} className="card-soft bg-card p-5">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{user.avatar}</div>
                  <div className="min-w-0">
                    <div className="font-medium flex items-center gap-2">{user.name} {user.verified && <Verified />}</div>
                    <div className="text-xs text-muted-foreground">{user.city} · {user.age} · {user.eventsAttended} events</div>
                  </div>
                  <div className="ml-auto"><MatchBadge score={match.score} reasons={match.reasons} /></div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{user.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {user.interests.map((i) => <Badge key={i} variant="secondary" className="text-[10px]">{i}</Badge>)}
                </div>
                <div className="mt-4">
                  {friend ? <span className="text-xs font-medium text-primary">🤝 You're buddies — say hi!</span>
                    : sent ? <Button size="sm" variant="outline" className="rounded-full w-full h-8" onClick={() => { demo.set({ buddies: [...demo.buddies, user.id] }); demo.notify("user", "Buddy accepted 🤝", `${user.name} accepted your buddy request.`); toast.success(`${user.name} accepted!`); }}>Request sent · simulate accept</Button>
                    : <Button size="sm" className="rounded-full w-full h-8" onClick={() => { demo.set({ buddyRequests: [...demo.buddyRequests, user.id] }); toast.success("Buddy request sent"); }}>Send buddy request</Button>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}
