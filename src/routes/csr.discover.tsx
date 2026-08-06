import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/unify/Shell";
import { SectionHead } from "@/components/unify/bits";
import { EventCard } from "@/components/unify/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EVENTS, inr, type UnifyEvent } from "@/lib/demo/data";
import { useDemo, matchEvent } from "@/lib/demo/store";
import { toast } from "sonner";

export const Route = createFileRoute("/csr/discover")({
  head: () => ({ meta: [{ title: "Discover impact events to fund — UNIFY" }, { name: "description", content: "Browse verified events that match your CSR focus areas, budget and locations, then fund them in a click." }, { property: "og:title", content: "Discover impact events to fund — UNIFY" }, { property: "og:description", content: "Browse verified events that match your CSR focus areas, budget and locations, then fund them in a click." }] }),
  component: Discover,
});

function Discover() {
  const demo = useDemo();
  const focus = demo.csr?.focus ?? [];
  const ranked = [...EVENTS].sort((a, b) => (focus.includes(b.cause) ? 1 : 0) - (focus.includes(a.cause) ? 1 : 0));
  return (
    <Shell role="csr">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHead title="Discover events" sub="Ranked against your CSR focus areas and preferred cities." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ranked.map((e) => (
            <EventCard key={e.id} ev={e} match={matchEvent(e, null)} footer={<Fund ev={e} />} />
          ))}
        </div>
      </section>
    </Shell>
  );
}

function Fund({ ev }: { ev: UnifyEvent }) {
  const demo = useDemo();
  const already = demo.supported.some((s) => s.eventId === ev.id);
  const [amount, setAmount] = useState(Math.max(50000, ev.fundingGoal - ev.funded));
  const [open, setOpen] = useState(false);
  if (already) return <span className="text-xs font-medium text-primary">✓ Funded by you</span>;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" className="rounded-full h-8 w-full">Support this event</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Support {ev.title}</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">Remaining need: {inr(Math.max(0, ev.fundingGoal - ev.funded))}</p>
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <div className="grid sm:grid-cols-3 gap-2">
          {["Funding only", "Funding + employees", "Full partnership"].map((t) => (
            <Button key={t} variant="outline" className="rounded-full text-xs" onClick={() => {
              demo.set({ supported: [...demo.supported, { eventId: ev.id, type: t, amount }] });
              demo.notify("csr", "Partnership confirmed 🤝", `${ev.title} — ${inr(amount)} (${t}).`);
              demo.notify("manager", "New CSR partnership", `A company just funded ${ev.title}.`);
              toast.success("Partnership confirmed");
              setOpen(false);
            }}>{t}</Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
