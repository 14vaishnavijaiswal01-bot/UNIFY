import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Verified } from "@/components/unify/bits";
import { MANAGERS, byId, inr } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";
import { toast } from "sonner";

export const Route = createFileRoute("/csr/managers/$id")({
  loader: ({ params }) => { const m = byId(MANAGERS, params.id); if (!m) throw notFound(); return { m }; },
  head: ({ loaderData }) => loaderData
    ? { meta: [{ title: `${loaderData.m.name} — event manager on UNIFY` }, { name: "description", content: loaderData.m.about }, { property: "og:title", content: loaderData.m.name }, { property: "og:description", content: loaderData.m.about }] }
    : { meta: [{ title: "Manager unavailable — UNIFY" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <Shell><div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="font-display text-3xl font-semibold">Manager not found</h1><Button asChild className="rounded-full mt-4"><Link to="/csr/managers">Back to list</Link></Button></div></Shell>,
  component: ManagerProfilePage,
});

function ManagerProfilePage() {
  const { m } = Route.useLoaderData();
  const demo = useDemo();
  return (
    <Shell role="csr">
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="card-soft bg-card p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{m.logo}</span>
            <div>
              <h1 className="font-display text-3xl font-semibold flex items-center gap-2">{m.name} {m.verified && <Verified />}</h1>
              <div className="text-sm text-muted-foreground mt-1">⭐ {m.rating} · {m.pastEvents} events · {m.successRate}% success · team of {m.teamSize}</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{m.about}</p>
          <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
            <Box title="Services">{m.services.join(" · ")}</Box>
            <Box title="Budget range">{inr(m.budgetMin)} – {inr(m.budgetMax)}</Box>
            <Box title="Cities">{m.cities.join(", ")}</Box>
            <Box title="Availability">{m.availability.join(", ")}</Box>
          </div>
          <h2 className="font-display text-xl font-semibold mt-8">Portfolio</h2>
          <div className="mt-3 space-y-2">
            {m.portfolio.map((p: { title: string; scale: string }) => (
              <div key={p.title} className="rounded-xl bg-muted/60 p-3 text-sm flex justify-between"><span>{p.title}</span><Badge variant="secondary" className="text-[11px]">{p.scale}</Badge></div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">Clients: {m.clients.join(", ")}</div>
          <Button className="rounded-full mt-6" size="lg" onClick={() => { demo.notify("manager", "New hire request 📩", `${demo.csr?.company ?? "A CSR company"} wants to work with you.`); toast.success(`Request sent to ${m.name}`); }}>Send hire request</Button>
        </div>
      </section>
    </Shell>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl bg-muted/60 p-3"><div className="text-[11px] uppercase tracking-wide text-muted-foreground">{title}</div><div className="mt-0.5">{children}</div></div>;
}
