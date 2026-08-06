import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Search, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDemo } from "@/lib/demo/store";
import { EVENTS, USERS, COMPANIES, MANAGERS, NGOS, CAUSES } from "@/lib/demo/data";
import { AiAssistant } from "./AiAssistant";

const NAV = {
  user: [
    { to: "/u", label: "Home" },
    { to: "/u/explore", label: "Explore" },
    { to: "/u/for-you", label: "For You" },
    { to: "/u/buddy", label: "Buddy Up" },
    { to: "/u/events", label: "My Events" },
    { to: "/u/impact", label: "My Impact" },
  ],
  csr: [
    { to: "/csr", label: "Dashboard" },
    { to: "/csr/discover", label: "Discover Events" },
    { to: "/csr/create", label: "Create Event" },
    { to: "/csr/managers", label: "Event Managers" },
    { to: "/csr/partnerships", label: "My Partnerships" },
    { to: "/csr/reports", label: "Impact Reports" },
  ],
  manager: [
    { to: "/em", label: "Dashboard" },
    { to: "/em/opportunities", label: "Opportunities" },
    { to: "/em/events", label: "My Events" },
    { to: "/em/portfolio", label: "Portfolio" },
    { to: "/em/revenue", label: "Revenue" },
  ],
} as const;

export function Shell({ children, role }: { children: ReactNode; role?: "user" | "csr" | "manager" }) {
  const demo = useDemo();
  const active = role ?? demo.role ?? undefined;
  const items = active ? NAV[active] : [];
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [openMenu, setOpenMenu] = useState(false);
  const notes = demo.notifications.filter((n) => n.role === active);

  return (
    <div className="min-h-screen bg-blush-gradient">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/75 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold shrink-0">
            <span className="grid place-items-center h-8 w-8 rounded-xl bg-foreground text-background"><Sparkles className="h-4 w-4" /></span>
            UNIFY<span className="text-primary">.</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4 text-sm">
            {items.map((i) => (
              <Link key={i.to} to={i.to} className={`px-3 py-1.5 rounded-full transition ${path === i.to ? "bg-foreground text-background" : "hover:bg-muted"}`}>
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <UniversalSearch />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {notes.length > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="px-4 py-3 border-b border-border/60 text-sm font-semibold">Notifications</div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
                  {notes.length === 0 && <div className="p-4 text-sm text-muted-foreground">Nothing yet — actions you take will show up here.</div>}
                  {notes.map((n) => (
                    <div key={n.id} className="p-3">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {active ? (
              <Button asChild variant="outline" size="sm" className="rounded-full hidden sm:inline-flex">
                <Link to="/profile">Profile</Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="rounded-full"><Link to="/join">Join UNIFY</Link></Button>
            )}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpenMenu((v) => !v)}>
              {openMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {openMenu && items.length > 0 && (
          <div className="lg:hidden border-t border-border/60 bg-background/95 px-4 py-3 grid grid-cols-2 gap-2">
            {items.map((i) => (
              <Link key={i.to} to={i.to} onClick={() => setOpenMenu(false)} className="rounded-lg px-3 py-2 text-sm bg-muted">{i.label}</Link>
            ))}
          </div>
        )}
      </header>
      {children}
      <AiAssistant />
    </div>
  );
}

function UniversalSearch() {
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const hit = (t: string) => s.length > 1 && t.toLowerCase().includes(s);
  const events = EVENTS.filter((e) => hit(e.title) || hit(e.cause) || hit(e.city)).slice(0, 4);
  const users = USERS.filter((u) => hit(u.name) || u.interests.some(hit)).slice(0, 3);
  const cos = COMPANIES.filter((c) => hit(c.name) || hit(c.industry)).slice(0, 3);
  const mans = MANAGERS.filter((m) => hit(m.name) || m.specializations.some(hit)).slice(0, 3);
  const ngos = NGOS.filter((n) => hit(n.name) || hit(n.focus)).slice(0, 3);
  const causes = CAUSES.filter(hit).slice(0, 4);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full gap-2 text-muted-foreground">
          <Search className="h-4 w-4" /> <span className="hidden sm:inline">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-display">What are you looking for?</DialogTitle></DialogHeader>
        <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Events, users, CSR companies, event managers, NGOs, causes…" />
        <div className="max-h-80 overflow-y-auto space-y-4 text-sm">
          <Group title="Events" empty={events.length === 0}>
            {events.map((e) => (
              <Link key={e.id} to="/event/$id" params={{ id: e.id }} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
                <span>{e.emoji}</span><span className="truncate">{e.title}</span>
                <Badge variant="secondary" className="ml-auto text-[10px]">{e.city}</Badge>
              </Link>
            ))}
          </Group>
          <Group title="Users" empty={users.length === 0}>
            {users.map((u) => <div key={u.id} className="px-2 py-1.5">{u.avatar} {u.name} <span className="text-muted-foreground text-xs">· {u.city}</span></div>)}
          </Group>
          <Group title="CSR companies" empty={cos.length === 0}>
            {cos.map((c) => <div key={c.id} className="px-2 py-1.5">{c.logo} {c.name} <span className="text-muted-foreground text-xs">· {c.industry}</span></div>)}
          </Group>
          <Group title="Event managers" empty={mans.length === 0}>
            {mans.map((m) => (
              <Link key={m.id} to="/csr/managers/$id" params={{ id: m.id }} className="block px-2 py-1.5 rounded-lg hover:bg-muted">{m.logo} {m.name}</Link>
            ))}
          </Group>
          <Group title="NGO partners" empty={ngos.length === 0}>
            {ngos.map((n) => <div key={n.id} className="px-2 py-1.5">{n.emoji} {n.name} <span className="text-muted-foreground text-xs">· {n.focus}</span></div>)}
          </Group>
          <Group title="Causes" empty={causes.length === 0}>
            {causes.map((c) => <div key={c} className="px-2 py-1.5">🏷️ {c}</div>)}
          </Group>
          {s.length < 2 && <p className="text-xs text-muted-foreground">Type at least two characters to search across the whole ecosystem.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Group({ title, children, empty }: { title: string; children: ReactNode; empty: boolean }) {
  if (empty) return null;
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{title}</div>
      {children}
    </div>
  );
}
