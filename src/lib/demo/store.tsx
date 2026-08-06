import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EVENTS, USERS, MANAGERS, OPPORTUNITIES, type Cause, type UnifyEvent, type BuddyUser, type EventManager } from "./data";

export type Role = "user" | "csr" | "manager" | null;

export type UserProfile = {
  name: string; city: string; ageGroup: string; interests: Cause[]; skills: string[];
  availability: string[]; eventTypes: string[]; mode: string; previous: string;
};
export type CsrProfile = {
  company: string; industry: string; focus: Cause[]; cities: string[]; budget: number;
  eventTypes: string[]; employees: number; goals: string;
};
export type ManagerProfile = {
  name: string; about: string; services: string[]; specializations: string[]; cities: string[];
  availability: string[]; budgetMin: number; budgetMax: number; teamSize: number; pastEvents: string; clients: string;
};

export type Notification = { id: string; role: Exclude<Role, null>; title: string; body: string; at: string };

type State = {
  role: Role;
  user: UserProfile | null;
  csr: CsrProfile | null;
  manager: ManagerProfile | null;
  joined: string[];
  buddyRequests: string[];
  buddies: string[];
  supported: { eventId: string; type: string; amount: number; managerId?: string }[];
  createdEvents: UnifyEvent[];
  appliedOps: string[];
  notifications: Notification[];
  premium: string | null;
};

const initial: State = {
  role: null, user: null, csr: null, manager: null,
  joined: [], buddyRequests: [], buddies: [], supported: [], createdEvents: [], appliedOps: [],
  notifications: [], premium: null,
};

type Ctx = State & {
  set: (p: Partial<State>) => void;
  notify: (role: Exclude<Role, null>, title: string, body: string) => void;
  reset: () => void;
};

const DemoCtx = createContext<Ctx | null>(null);
const KEY = "unify-demo-v1";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<Ctx>(() => ({
    ...state,
    set: (p) => setState((s) => ({ ...s, ...p })),
    notify: (role, title, body) =>
      setState((s) => ({
        ...s,
        notifications: [{ id: crypto.randomUUID(), role, title, body, at: new Date().toISOString() }, ...s.notifications].slice(0, 30),
      })),
    reset: () => setState(initial),
  }), [state]);

  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoCtx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}

/* ---------- matching engine ---------- */

export type Match = { score: number; reasons: string[] };

export function matchEvent(ev: UnifyEvent, p: UserProfile | null): Match {
  const reasons: string[] = [];
  let score = 55;
  if (p) {
    if (p.interests.includes(ev.cause)) { score += 22; reasons.push(`Matches your interest in ${ev.cause}`); }
    if (ev.city === p.city || ev.online) { score += 12; reasons.push(ev.online ? "Available online, anywhere" : `Within your preferred location (${ev.city})`); }
    const weekend = ["2026-08-15", "2026-08-22", "2026-08-29", "2026-09-05", "2026-09-12", "2026-09-19", "2026-09-26", "2026-10-03", "2026-10-10"].includes(ev.date);
    if (p.availability.includes("Weekends") && weekend) { score += 8; reasons.push("Fits your weekend availability"); }
    if (p.eventTypes.includes(ev.type)) { score += 6; reasons.push(`You prefer ${ev.type.toLowerCase()} formats`); }
    if (p.skills.some((s) => ev.cause.includes(s.split(" ")[0]!))) { score += 4; reasons.push("Uses skills on your profile"); }
  }
  if (ev.csrId) { score += 3; reasons.push("CSR-supported event with verified reporting"); }
  if (reasons.length === 0) reasons.push("Popular with users similar to you");
  return { score: Math.min(98, score), reasons };
}

export function matchBuddy(b: BuddyUser, p: UserProfile | null): Match {
  const reasons: string[] = [];
  let score = 50;
  const common = p ? b.interests.filter((i) => p.interests.includes(i)) : [];
  score += common.length * 12;
  if (common.length) reasons.push(`${common.length} shared interests: ${common.join(", ")}`);
  if (p && b.city === p.city) { score += 12; reasons.push(`Also based in ${b.city}`); }
  if (p && b.availability.some((a) => p.availability.includes(a))) { score += 10; reasons.push("Overlapping availability"); }
  if (p && b.skills.some((s) => p.skills.includes(s))) { score += 6; reasons.push("Complementary skills"); }
  if (b.commonEvents > 0) { score += 4; reasons.push(`${b.commonEvents} events in common`); }
  if (reasons.length === 0) reasons.push("Active in causes you follow");
  return { score: Math.min(97, score), reasons };
}

export function matchManager(m: EventManager, opts: { budget?: number; city?: string }): Match {
  const reasons: string[] = [];
  let score = 55;
  if (opts.budget && opts.budget >= m.budgetMin && opts.budget <= m.budgetMax * 1.2) { score += 18; reasons.push("Budget range fits your event"); }
  if (opts.city && m.cities.includes(opts.city)) { score += 14; reasons.push(`Operates in ${opts.city}`); }
  if (m.availability.length) { score += 6; reasons.push(`Available in ${m.availability[0]}`); }
  score += Math.round((m.successRate - 85) / 2);
  reasons.push(`${m.pastEvents} past events · ${m.successRate}% success rate`);
  return { score: Math.min(96, Math.max(60, score)), reasons };
}

export function recommendedEvents(p: UserProfile | null, all = EVENTS) {
  return all.map((e) => ({ event: e, match: matchEvent(e, p) })).sort((a, b) => b.match.score - a.match.score);
}
export function recommendedBuddies(p: UserProfile | null) {
  return USERS.map((u) => ({ user: u, match: matchBuddy(u, p) })).sort((a, b) => b.match.score - a.match.score);
}
export function recommendedManagers(opts: { budget?: number; city?: string }) {
  return MANAGERS.map((m) => ({ manager: m, match: matchManager(m, opts) })).sort((a, b) => b.match.score - a.match.score);
}
export { OPPORTUNITIES };
