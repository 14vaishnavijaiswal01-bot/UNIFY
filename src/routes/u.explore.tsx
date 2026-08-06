import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/unify/Shell";
import { EventCard } from "@/components/unify/EventCard";
import { SectionHead } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EVENTS, CAUSES, CITIES } from "@/lib/demo/data";
import { useDemo, matchEvent } from "@/lib/demo/store";
import { toast } from "sonner";

export const Route = createFileRoute("/u/explore")({
  head: () => ({ meta: [{ title: "Explore impact events — UNIFY" }, { name: "description", content: "Browse verified social-impact events by cause, city and format, and register in one tap." }, { property: "og:title", content: "Explore impact events — UNIFY" }, { property: "og:description", content: "Browse verified social-impact events by cause, city and format, and register in one tap." }] }),
  component: Explore,
});

function Explore() {
  const demo = useDemo();
  const [q, setQ] = useState("");
  const [cause, setCause] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const list = EVENTS.filter((e) =>
    (cause === "All" || e.cause === cause) &&
    (city === "All" || e.city === city) &&
    (q.trim() === "" || (e.title + e.about + e.organizer).toLowerCase().includes(q.toLowerCase())));

  return (
    <Shell role="user">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="Explore events" sub="Every event is verified and tied to a real beneficiary goal." />
        <div className="card-soft bg-card p-4 space-y-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events, causes, organisers…" />
          <div className="flex flex-wrap gap-1.5">
            {["All", ...CAUSES].map((c) => (
              <button key={c} onClick={() => setCause(c)} className={`rounded-full px-3 py-1 text-xs border transition ${cause === c ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-muted"}`}>{c}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...CITIES].map((c) => (
              <button key={c} onClick={() => setCity(c)} className={`rounded-full px-3 py-1 text-xs border transition ${city === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((e) => (
            <EventCard key={e.id} ev={e} match={matchEvent(e, demo.user)} footer={
              demo.joined.includes(e.id)
                ? <span className="text-xs font-medium text-primary">✓ Registered</span>
                : <Button size="sm" className="rounded-full h-8 w-full" onClick={() => { demo.set({ joined: [...demo.joined, e.id] }); demo.notify("user", "Registered ✅", `You're going to ${e.title}.`); toast.success("Registered!"); }}>Register</Button>
            } />
          ))}
          {list.length === 0 && <p className="text-sm text-muted-foreground">No events match those filters yet.</p>}
        </div>
      </section>
    </Shell>
  );
}
