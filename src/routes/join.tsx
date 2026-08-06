import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Shell } from "@/components/unify/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useDemo, type Role } from "@/lib/demo/store";
import { AVAILABILITY, CAUSES, CITIES, EVENT_TYPES, SKILLS, type Cause } from "@/lib/demo/data";

export const Route = createFileRoute("/join")({
  validateSearch: z.object({ role: z.enum(["user", "csr", "manager"]).optional() }).parse,
  head: () => ({
    meta: [
      { title: "Join UNIFY — Choose your role" },
      { name: "description", content: "Sign up as an individual, a CSR company or an event manager and get matched with the right impact events." },
      { property: "og:title", content: "Join UNIFY — Choose your role" },
      { property: "og:description", content: "Set up your UNIFY profile in under a minute and start creating measurable impact." },
    ],
  }),
  component: Join,
});

const ROLE_CARDS = [
  { key: "user" as const, emoji: "🧑‍🤝‍🧑", title: "USER", desc: "Discover events, buddy up and build an impact profile.", tint: "bg-mint/60" },
  { key: "csr" as const, emoji: "🏢", title: "CSR COMPANY", desc: "Fund or create events and report impact automatically.", tint: "bg-lavender/60" },
  { key: "manager" as const, emoji: "🎪", title: "EVENT MANAGER", desc: "Win CSR opportunities and run events end to end.", tint: "bg-butter/60" },
];

function Chips({ options, value, onChange }: { options: readonly string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button type="button" key={o} onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
            className={`rounded-full px-3 py-1.5 text-xs border transition ${on ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-muted"}`}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Join() {
  const { role: preset } = Route.useSearch();
  const demo = useDemo();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(preset ?? null);

  if (!role) {
    return (
      <Shell>
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-center">Who are you joining as?</h1>
          <p className="text-center text-muted-foreground mt-3">You can switch roles any time from your profile.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {ROLE_CARDS.map((r) => (
              <button key={r.key} onClick={() => setRole(r.key)} className={`card-soft p-7 text-left ${r.tint} hover:-translate-y-1 transition`}>
                <div className="text-4xl">{r.emoji}</div>
                <div className="font-display text-2xl mt-3 font-semibold">{r.title}</div>
                <p className="text-sm text-foreground/70 mt-2">{r.desc}</p>
                <span className="mt-4 inline-flex text-sm font-medium text-primary">Continue →</span>
              </button>
            ))}
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <button onClick={() => setRole(null)} className="text-sm text-muted-foreground hover:text-foreground">← Change role</button>
        {role === "user" && <UserForm onDone={(p) => { demo.set({ role: "user", user: p }); demo.notify("user", "Welcome to UNIFY 🎉", "We've prepared personalised event suggestions for you."); toast.success("Profile created"); navigate({ to: "/u" }); }} />}
        {role === "csr" && <CsrForm onDone={(p) => { demo.set({ role: "csr", csr: p }); demo.notify("csr", "CSR account ready 🏢", "Discover events that match your focus areas."); toast.success("Company profile created"); navigate({ to: "/csr" }); }} />}
        {role === "manager" && <ManagerForm onDone={(p) => { demo.set({ role: "manager", manager: p }); demo.notify("manager", "You're listed ✨", "3 CSR opportunities match your services."); toast.success("Agency profile created"); navigate({ to: "/em" }); }} />}
      </section>
    </Shell>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function UserForm({ onDone }: { onDone: (p: import("@/lib/demo/store").UserProfile) => void }) {
  const [name, setName] = useState("Aarav Sharma");
  const [city, setCity] = useState("Mumbai");
  const [ageGroup, setAgeGroup] = useState("25-34");
  const [interests, setInterests] = useState<string[]>(["Cybersecurity Awareness", "Education", "Senior Citizens"]);
  const [skills, setSkills] = useState<string[]>(["Communication", "Teaching"]);
  const [availability, setAvailability] = useState<string[]>(["Weekends"]);
  const [eventTypes, setEventTypes] = useState<string[]>(["Workshop", "Awareness"]);
  const [mode, setMode] = useState("In person");
  const [previous, setPrevious] = useState("Volunteered at two beach cleanups and one book drive.");

  return (
    <form className="card-soft bg-card p-6 md:p-8 mt-4 space-y-6" onSubmit={(e) => { e.preventDefault(); onDone({ name, city, ageGroup, interests: interests as Cause[], skills, availability, eventTypes, mode, previous }); }}>
      <div>
        <h1 className="font-display text-3xl font-semibold">Set up your USER profile</h1>
        <p className="text-sm text-muted-foreground mt-1">The more you tell us, the sharper your matches.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <Field label="City">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Age group">
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["18-24", "25-34", "35-44", "45+"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Preferred mode">
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["In person", "Online", "Both"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Interests / causes you care about"><Chips options={CAUSES} value={interests} onChange={setInterests} /></Field>
      <Field label="Skills you can contribute"><Chips options={SKILLS} value={skills} onChange={setSkills} /></Field>
      <Field label="Availability"><Chips options={AVAILABILITY} value={availability} onChange={setAvailability} /></Field>
      <Field label="Preferred event types"><Chips options={EVENT_TYPES} value={eventTypes} onChange={setEventTypes} /></Field>
      <Field label="Previous volunteering experience" hint="Optional — helps us understand your experience level.">
        <Textarea value={previous} onChange={(e) => setPrevious(e.target.value)} rows={3} />
      </Field>
      <Button type="submit" size="lg" className="rounded-full w-full">Create my impact profile</Button>
    </form>
  );
}

function CsrForm({ onDone }: { onDone: (p: import("@/lib/demo/store").CsrProfile) => void }) {
  const [company, setCompany] = useState("Aether Technologies");
  const [industry, setIndustry] = useState("IT Services");
  const [focus, setFocus] = useState<string[]>(["Digital Literacy", "Cybersecurity Awareness", "Education"]);
  const [cities, setCities] = useState<string[]>(["Mumbai"]);
  const [budget, setBudget] = useState(5000000);
  const [eventTypes, setEventTypes] = useState<string[]>(["Workshop", "Drive"]);
  const [employees, setEmployees] = useState(4200);
  const [goals, setGoals] = useState("Reach 5,000 beneficiaries this year through digital literacy and cyber-safety programmes.");

  return (
    <form className="card-soft bg-card p-6 md:p-8 mt-4 space-y-6" onSubmit={(e) => { e.preventDefault(); onDone({ company, industry, focus: focus as Cause[], cities, budget, eventTypes, employees, goals }); }}>
      <div>
        <h1 className="font-display text-3xl font-semibold">Set up your CSR COMPANY profile</h1>
        <p className="text-sm text-muted-foreground mt-1">We'll match your budget with the right events and event managers.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Company name"><Input value={company} onChange={(e) => setCompany(e.target.value)} required /></Field>
        <Field label="Industry"><Input value={industry} onChange={(e) => setIndustry(e.target.value)} /></Field>
        <Field label="Annual CSR budget (₹)"><Input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></Field>
        <Field label="Employees"><Input type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} /></Field>
      </div>
      <Field label="CSR focus areas"><Chips options={CAUSES} value={focus} onChange={setFocus} /></Field>
      <Field label="Preferred locations"><Chips options={CITIES} value={cities} onChange={setCities} /></Field>
      <Field label="Preferred event types"><Chips options={EVENT_TYPES} value={eventTypes} onChange={setEventTypes} /></Field>
      <Field label="Impact goals"><Textarea value={goals} onChange={(e) => setGoals(e.target.value)} rows={3} /></Field>
      <Button type="submit" size="lg" className="rounded-full w-full">Create company profile</Button>
    </form>
  );
}

function ManagerForm({ onDone }: { onDone: (p: import("@/lib/demo/store").ManagerProfile) => void }) {
  const [name, setName] = useState("EventX Solutions");
  const [about, setAbout] = useState("Mumbai-based experiential agency specialising in large-scale CSR and community programmes.");
  const [services, setServices] = useState<string[]>(["Event Setup", "User Management", "Logistics", "Documentation"]);
  const [specializations, setSpecializations] = useState<string[]>(["CSR Events", "Community Events"]);
  const [cities, setCities] = useState<string[]>(["Mumbai", "Pune"]);
  const [availability, setAvailability] = useState<string[]>(["Aug 2026", "Sep 2026"]);
  const [budgetMin, setBudgetMin] = useState(150000);
  const [budgetMax, setBudgetMax] = useState(300000);
  const [teamSize, setTeamSize] = useState(24);
  const [pastEvents, setPastEvents] = useState("128 events delivered including Digital Literacy Mela 2025 (1,200 participants).");
  const [clients, setClients] = useState("Aether Technologies, Northwind Bank");

  return (
    <form className="card-soft bg-card p-6 md:p-8 mt-4 space-y-6" onSubmit={(e) => { e.preventDefault(); onDone({ name, about, services, specializations, cities, availability, budgetMin, budgetMax, teamSize, pastEvents, clients }); }}>
      <div>
        <h1 className="font-display text-3xl font-semibold">Set up your EVENT MANAGER profile</h1>
        <p className="text-sm text-muted-foreground mt-1">CSR companies search this profile when they need a partner.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Agency name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <Field label="Team size"><Input type="number" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} /></Field>
        <Field label="Budget range — min (₹)"><Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} /></Field>
        <Field label="Budget range — max (₹)"><Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} /></Field>
      </div>
      <Field label="About your agency"><Textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={3} /></Field>
      <Field label="Services offered"><Chips options={["Event Setup", "User Management", "Logistics", "On-ground Coordination", "Documentation", "Branding", "Media", "Volunteer Ops"]} value={services} onChange={setServices} /></Field>
      <Field label="Specializations"><Chips options={["CSR Events", "Community Events", "Volunteer Drives", "Workshops", "Fundraisers", "Health Camps", "Environment Drives"]} value={specializations} onChange={setSpecializations} /></Field>
      <Field label="Cities served"><Chips options={CITIES} value={cities} onChange={setCities} /></Field>
      <Field label="Availability"><Chips options={["Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026"]} value={availability} onChange={setAvailability} /></Field>
      <Field label="Past events"><Textarea value={pastEvents} onChange={(e) => setPastEvents(e.target.value)} rows={2} /></Field>
      <Field label="Notable clients"><Input value={clients} onChange={(e) => setClients(e.target.value)} /></Field>
      <Button type="submit" size="lg" className="rounded-full w-full">Publish agency profile</Button>
    </form>
  );
}
