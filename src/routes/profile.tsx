import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/unify/Shell";
import { SectionHead } from "@/components/unify/bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/demo/store";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Your UNIFY profile" }, { name: "description", content: "Review your role, profile details and switch between the user, CSR and event manager experiences." }, { property: "og:title", content: "Your UNIFY profile" }, { property: "og:description", content: "Review your role, profile details and switch between the user, CSR and event manager experiences." }] }),
  component: Profile,
});

function Profile() {
  const demo = useDemo();
  const navigate = useNavigate();
  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <SectionHead title="Your profile" sub="Switch roles or reset the prototype at any time." />
        <div className="card-soft bg-card p-6 space-y-4">
          <div className="text-sm"><span className="text-muted-foreground">Active role:</span> <Badge variant="secondary" className="ml-1">{demo.role ?? "none"}</Badge></div>
          {demo.user && <Row t="Name" v={demo.user.name} />}
          {demo.user && <Row t="Interests" v={demo.user.interests.join(", ")} />}
          {demo.csr && <Row t="Company" v={demo.csr.company} />}
          {demo.manager && <Row t="Agency" v={demo.manager.name} />}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" className="rounded-full" onClick={() => { demo.set({ role: "user" }); navigate({ to: "/u" }); }}>User view</Button>
            <Button variant="outline" className="rounded-full" onClick={() => { demo.set({ role: "csr" }); navigate({ to: "/csr" }); }}>CSR view</Button>
            <Button variant="outline" className="rounded-full" onClick={() => { demo.set({ role: "manager" }); navigate({ to: "/em" }); }}>Event manager view</Button>
            <Button variant="ghost" className="rounded-full" onClick={() => { demo.reset(); toast("Prototype reset"); navigate({ to: "/" }); }}>Reset demo</Button>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Row({ t, v }: { t: string; v: string }) {
  return <div className="text-sm"><span className="text-muted-foreground">{t}:</span> {v}</div>;
}
