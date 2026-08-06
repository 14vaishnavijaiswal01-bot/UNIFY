import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Meter, Verified, ImpactScore } from "@/components/unify/bits";
import { EVENTS, COMPANIES, MANAGERS, NGOS, byId, inr, prettyDate } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";
import { toast } from "sonner";
import { CalendarDays, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/event/$id")({
  loader: ({ params }) => { const ev = byId(EVENTS, params.id); if (!ev) throw notFound(); return { ev }; },
  head: ({ loaderData }) => loaderData
    ? { meta: [{ title: `${loaderData.ev.title} — UNIFY` }, { name: "description", content: loaderData.ev.about }, { property: "og:title", content: loaderData.ev.title }, { property: "og:description", content: loaderData.ev.about }] }
    : { meta: [{ title: "Event unavailable — UNIFY" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <Shell><div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="font-display text-3xl font-semibold">Event not found</h1><Button asChild className="rounded-full mt-4"><Link to="/u/explore">Browse events</Link></Button></div></Shell>,
  component: EventPage,
});

function EventPage() {
  const { ev } = Route.useLoaderData();
  const demo = useDemo();
  const csr = byId(COMPANIES, ev.csrId);
  const em = byId(MANAGERS, ev.managerId);
  const ngo = byId(NGOS, ev.ngoId);
  const joined = demo.joined.includes(ev.id);

  return (
    <Shell>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="card-soft bg-card p-6 md:p-8">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="text-5xl">{ev.emoji}</div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-semibold">{ev.title}</h1>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{prettyDate(ev.date)}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{ev.online ? "Online" : `${ev.area}, ${ev.city}`}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{ev.participants}/{ev.capacity} registered</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary">{ev.cause}</Badge><Badge variant="secondary">{ev.type}</Badge>
                {ev.verified && <Verified label="UNIFY verified" />}
                <ImpactScore score={ev.impactScore} />
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{ev.about}</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Meter label="Funding raised" value={ev.funded} max={ev.fundingGoal} format={inr} />
            <Meter label="Beneficiaries reached" value={ev.beneficiaries} max={ev.beneficiaryGoal} />
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
            <Info label="Organised by" value={ev.organizer} />
            {csr && <Info label="CSR partner" value={`${csr.logo} ${csr.name}`} />}
            {em && <Info label="Event manager" value={`${em.logo} ${em.name}`} />}
            {ngo && <Info label="NGO partner" value={`${ngo.emoji} ${ngo.name}`} />}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {joined ? <Button size="lg" variant="outline" className="rounded-full" onClick={() => { demo.set({ joined: demo.joined.filter((i) => i !== ev.id) }); toast("Registration cancelled"); }}>Cancel registration</Button>
              : <Button size="lg" className="rounded-full" onClick={() => { demo.set({ joined: [...demo.joined, ev.id] }); demo.notify("user", "Registered ✅", `You're going to ${ev.title}.`); toast.success("Registered!"); }}>Register for this event</Button>}
            <Button asChild size="lg" variant="outline" className="rounded-full"><Link to="/u/buddy">Find a buddy</Link></Button>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-muted/60 p-3"><div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div><div className="font-medium mt-0.5">{value}</div></div>;
}
