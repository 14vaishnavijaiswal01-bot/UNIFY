import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MapPin, Users, Clock } from "lucide-react";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({ meta: [{ title: "Discover events — UNIFY" }, { name: "description", content: "Discover verified community events across Mumbai." }] }),
});

type Ev = {
  id: string; title: string; description: string | null; cause: string | null;
  starts_at: string; duration_min: number | null; price: number | null;
  cover_emoji: string | null; tags: string[] | null; capacity: number | null;
  venues?: { name: string; neighborhood: string | null } | null;
};

function EventsPage() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("id,title,description,cause,starts_at,duration_min,price,cover_emoji,tags,capacity,venues(name,neighborhood)")
        .eq("status", "published")
        .order("starts_at", { ascending: true });
      setEvents((data as unknown as Ev[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const causes = Array.from(new Set(events.map((e) => e.cause).filter(Boolean))) as string[];
  const filtered = filter === "all" ? events : events.filter((e) => e.cause === filter);

  return (
    <div className="min-h-screen bg-blush-gradient">
      <AppNav />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-5xl font-semibold">What's happening near you</h1>
        <p className="text-muted-foreground mt-2">Verified community events across Mumbai's public spaces.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
          {causes.map((c) => (
            <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</FilterChip>
          ))}
        </div>

        {loading ? (
          <p className="mt-10 text-muted-foreground">Loading events…</p>
        ) : filtered.length === 0 ? (
          <div className="card-soft bg-white/70 p-10 mt-10 text-center">
            <div className="text-4xl">🌤️</div>
            <p className="mt-3 text-muted-foreground">No events yet in this category. Check back soon.</p>
          </div>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((e) => <EventCard key={e.id} e={e} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm border transition ${
        active ? "bg-primary text-primary-foreground border-primary" : "bg-white/70 border-border hover:bg-white"
      }`}
    >{children}</button>
  );
}

function EventCard({ e }: { e: Ev }) {
  return (
    <div className="card-soft bg-white/80 p-5 flex flex-col">
      <div className="flex items-start justify-between">
        <div className="text-4xl">{e.cover_emoji ?? "✨"}</div>
        {e.cause && <Badge variant="secondary" className="capitalize">{e.cause}</Badge>}
      </div>
      <h3 className="font-display text-xl font-semibold mt-3 leading-tight">{e.title}</h3>
      {e.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.description}</p>}
      <div className="mt-4 space-y-1.5 text-sm text-foreground/70">
        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {format(new Date(e.starts_at), "EEE, MMM d · h:mm a")}</div>
        {e.venues && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {e.venues.name}{e.venues.neighborhood ? `, ${e.venues.neighborhood}` : ""}</div>}
        {e.capacity && <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Up to {e.capacity}</div>}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium">{Number(e.price ?? 0) === 0 ? "Free" : `₹${e.price}`}</span>
        <Button asChild size="sm" className="rounded-full"><Link to="/app">Reserve</Link></Button>
      </div>
    </div>
  );
}