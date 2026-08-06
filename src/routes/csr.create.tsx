import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/unify/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDemo, recommendedManagers } from "@/lib/demo/store";
import { CAUSES, CITIES, inr, type Cause, type UnifyEvent } from "@/lib/demo/data";
import { MatchBadge } from "@/components/unify/bits";
import { toast } from "sonner";

export const Route = createFileRoute("/csr/create")({
  head: () => ({ meta: [{ title: "Create a CSR event — UNIFY" }, { name: "description", content: "Publish an event brief, get matched with verified event managers and start reaching beneficiaries." }, { property: "og:title", content: "Create a CSR event — UNIFY" }, { property: "og:description", content: "Publish an event brief, get matched with verified event managers and start reaching beneficiaries." }] }),
  component: CreateEvent,
});

function CreateEvent() {
  const demo = useDemo();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Digital Literacy Drive for Senior Citizens");
  const [cause, setCause] = useState<Cause>("Digital Literacy");
  const [city, setCity] = useState("Mumbai");
  const [date, setDate] = useState("2026-08-15");
  const [budget, setBudget] = useState(200000);
  const [capacity, setCapacity] = useState(100);
  const [about, setAbout] = useState("A one-day drive teaching senior citizens smartphone basics, UPI safety and how to spot online fraud.");
  const [created, setCreated] = useState<UnifyEvent | null>(null);
  const managers = recommendedManagers({ budget, city });

  const create = () => {
    const ev: UnifyEvent = {
      id: "new-" + Date.now(), title, cause, type: "Drive", city, area: "Central", date, online: false, verified: true,
      organizer: demo.csr?.company ?? "Your company", csrId: "csr-1", participants: 0, capacity,
      beneficiaryGoal: capacity * 5, beneficiaries: 0, fundingGoal: budget, funded: budget, impactScore: 80,
      hours: 4, emoji: "✨", about, popular: false,
    };
    setCreated(ev);
    demo.set({ createdEvents: [...demo.createdEvents, ev], supported: [...demo.supported, { eventId: ev.id, type: "Full partnership", amount: budget }] });
    demo.notify("csr", "Event published 🎉", `${title} is live and open to event managers.`);
    demo.notify("manager", "New opportunity", `${title} · ${inr(budget)} · ${city}`);
    toast.success("Event published");
  };

  return (
    <Shell role="csr">
      <section className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <h1 className="font-display text-4xl font-semibold">Create an event</h1>
        <div className="card-soft bg-card p-6 space-y-4">
          <div className="space-y-2"><Label>Event title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Cause</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={cause} onChange={(e) => setCause(e.target.value as Cause)}>
                {CAUSES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label>City</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Budget (₹)</Label><Input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Expected participants</Label><Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} /></div>
          </div>
          <div className="space-y-2"><Label>About</Label><Textarea rows={3} value={about} onChange={(e) => setAbout(e.target.value)} /></div>
          <Button className="rounded-full w-full" size="lg" onClick={create} disabled={!!created}>{created ? "Published ✓" : "Publish event"}</Button>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold">Recommended event managers</h2>
          <p className="text-sm text-muted-foreground">Matched to your budget of {inr(budget)} in {city}.</p>
          <div className="mt-4 space-y-3">
            {managers.slice(0, 3).map(({ manager, match }) => (
              <div key={manager.id} className="card-soft bg-card p-4 flex items-center gap-3">
                <span className="text-2xl">{manager.logo}</span>
                <div className="min-w-0">
                  <div className="font-medium">{manager.name}</div>
                  <div className="text-xs text-muted-foreground">{inr(manager.budgetMin)}–{inr(manager.budgetMax)} · {manager.pastEvents} events · ⭐ {manager.rating}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <MatchBadge score={match.score} reasons={match.reasons} />
                  <Button size="sm" className="rounded-full h-8" onClick={() => { demo.notify("manager", "You've been invited 📩", `${demo.csr?.company ?? "A CSR company"} invited you to run ${title}.`); toast.success(`Request sent to ${manager.name}`); navigate({ to: "/csr/partnerships" }); }}>Hire</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
