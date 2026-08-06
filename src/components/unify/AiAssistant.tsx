import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemo } from "@/lib/demo/store";
import { EVENTS, MANAGERS, USERS, inr } from "@/lib/demo/data";

type Msg = { from: "ai" | "me"; text: string };

const PROMPTS: Record<string, string[]> = {
  user: ["Find events near me this weekend", "Find events related to cybersecurity", "Who should I Buddy Up with?", "Suggest an event based on my interests"],
  csr: ["Find events under ₹5 lakh", "Which event matches our CSR focus?", "Recommend an Event Manager", "Show events with the highest impact score"],
  manager: ["Find CSR events in Mumbai", "Which opportunities match our availability?", "Find opportunities within our budget range"],
};

function answer(q: string, role: string): string {
  const s = q.toLowerCase();
  if (s.includes("buddy")) {
    const top = USERS.slice(0, 2).map((u) => u.name).join(" and ");
    return `Top buddy matches for you: ${top}. ${USERS[0]!.name} is a 94% match — shared interests in ${USERS[0]!.interests.slice(0, 2).join(" and ")}, both free on weekends.`;
  }
  if (s.includes("manager") || s.includes("event manager")) {
    const m = MANAGERS[0]!;
    return `${m.name} is a 93% match — ${inr(m.budgetMin)}–${inr(m.budgetMax)}, available ${m.availability[0]}, ${m.pastEvents} past events, ${m.successRate}% success rate.`;
  }
  if (s.includes("impact score")) {
    const top = [...EVENTS].sort((a, b) => b.impactScore - a.impactScore).slice(0, 3);
    return "Highest impact events: " + top.map((e) => `${e.title} (${e.impactScore}/100)`).join(", ") + ".";
  }
  if (s.includes("lakh") || s.includes("budget") || s.includes("₹")) {
    const list = EVENTS.filter((e) => e.fundingGoal <= 500000).slice(0, 3);
    return "Within budget: " + list.map((e) => `${e.title} — ${inr(e.fundingGoal)}`).join("; ") + ".";
  }
  if (s.includes("cyber")) {
    const list = EVENTS.filter((e) => e.cause.includes("Cyber")).map((e) => e.title);
    return "Cybersecurity events: " + list.join(", ") + ". Digital Safety for Senior Citizens is your strongest match at 96%.";
  }
  if (s.includes("mumbai")) {
    return "Mumbai has " + EVENTS.filter((e) => e.city === "Mumbai").length + " live events. The largest CSR opportunity right now is the Digital Literacy Drive with Aether Technologies (₹2,00,000).";
  }
  if (s.includes("weekend") || s.includes("near me")) {
    const list = EVENTS.slice(0, 3).map((e) => `${e.title} (${e.city})`);
    return "This weekend near you: " + list.join(", ") + ".";
  }
  if (role === "manager") return "You have 3 open opportunities matching your services. The best fit is the CSR Digital Literacy Drive — ₹2,00,000, Mumbai, 15 Aug 2026.";
  if (role === "csr") return "Based on your focus areas, Digital Safety for Senior Citizens (92/100 impact) is your strongest fit — 72/100 participants already registered.";
  return "Digital Safety for Senior Citizens is your top pick at 96% match — it lines up with your interests, city and weekend availability.";
}

export function AiAssistant() {
  const { role } = useDemo();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "ai", text: "Hi! I'm UNIFY AI. Ask me about events, buddies, managers or impact." }]);
  const prompts = PROMPTS[role ?? "user"] ?? PROMPTS['user']!;

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "me", text }, { from: "ai", text: answer(text, role ?? "user") }]);
    setQ("");
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-3 text-sm font-medium shadow-lg hover:opacity-90 transition"
        >
          <Sparkles className="h-4 w-4" /> UNIFY AI
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-40 w-[min(92vw,22rem)] card-soft bg-card border border-border/60 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <div className="flex items-center gap-2 font-medium text-sm"><Sparkles className="h-4 w-4 text-primary" /> UNIFY AI</div>
            <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-72 overflow-y-auto p-3 space-y-2">
            {msgs.map((m, i) => (
              <div key={i} className={`text-sm rounded-2xl px-3 py-2 ${m.from === "ai" ? "bg-muted" : "bg-primary text-primary-foreground ml-auto"} max-w-[85%] w-fit`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {prompts.slice(0, 3).map((p) => (
              <button key={p} onClick={() => send(p)} className="text-[11px] rounded-full border border-border px-2 py-1 hover:bg-muted">{p}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(q); }} className="flex gap-2 p-3 border-t border-border/60">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask UNIFY AI…" className="h-9" />
            <Button size="icon" className="h-9 w-9 shrink-0" type="submit"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      )}
    </>
  );
}
