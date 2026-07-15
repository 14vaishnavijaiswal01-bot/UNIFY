import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Ticket, Calendar, HeartHandshake, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app")({
  component: IndividualHome,
});

type Ev = { id: string; title: string; starts_at: string; cover_emoji: string | null; cause: string | null; price: number | null };
type Booking = { id: string; event_id: string; looking_for_buddy: boolean; checked_in: boolean; events: Ev | null };
type Pass = { credits_total: number; credits_used: number; tier: string };

function IndividualHome() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pass, setPass] = useState<Pass | null>(null);
  const [impact, setImpact] = useState<number>(0);

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user!.id;
    const [{ data: ev }, { data: bk }, { data: ps }, { data: im }] = await Promise.all([
      supabase.from("events").select("id,title,starts_at,cover_emoji,cause,price").eq("status", "published").order("starts_at").limit(6),
      supabase.from("bookings").select("id,event_id,looking_for_buddy,checked_in,events(id,title,starts_at,cover_emoji,cause,price)").eq("user_id", uid),
      supabase.from("passes").select("credits_total,credits_used,tier").eq("user_id", uid).maybeSingle(),
      supabase.from("impact_log").select("hours").eq("user_id", uid),
    ]);
    setEvents((ev as unknown as Ev[]) ?? []);
    setBookings((bk as unknown as Booking[]) ?? []);
    setPass(ps as Pass | null);
    setImpact((im ?? []).reduce((s, r: { hours: number | null }) => s + Number(r.hours ?? 0), 0));
  };

  useEffect(() => { load(); }, []);

  const reserve = async (eventId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("bookings").insert({ user_id: userData.user!.id, event_id: eventId });
    if (error) return toast.error(error.message);
    toast.success("Reserved! See you there.");
    load();
  };

  const toggleBuddy = async (id: string, val: boolean) => {
    await supabase.from("bookings").update({ looking_for_buddy: !val }).eq("id", id);
    load();
  };

  const bookedIds = new Set(bookings.map((b) => b.event_id));
  const creditsLeft = pass ? pass.credits_total - pass.credits_used : 0;
  const creditsPct = pass ? (pass.credits_used / Math.max(pass.credits_total, 1)) * 100 : 0;

  return (
    <div className="min-h-screen bg-blush-gradient">
      <AppNav />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl md:text-5xl font-semibold">Your community, curated.</h1>
        <p className="text-muted-foreground mt-2">Reserve a pass, bring a buddy, log the impact.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <StatCard tint="bg-peach/60" icon={<Ticket className="h-5 w-5" />} label="Pass credits" value={`${creditsLeft} left`} sub={pass?.tier ?? "free"}>
            <Progress value={creditsPct} className="mt-3 h-2" />
          </StatCard>
          <StatCard tint="bg-mint/60" icon={<Calendar className="h-5 w-5" />} label="Upcoming" value={String(bookings.length)} sub="reserved events" />
          <StatCard tint="bg-lavender/60" icon={<HeartHandshake className="h-5 w-5" />} label="Impact" value={`${impact.toFixed(1)} h`} sub="community hours" />
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionTitle icon={<Sparkles className="h-4 w-4" />}>Recommended for you</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {events.map((e) => (
                <div key={e.id} className="card-soft bg-white/80 p-4">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{e.cover_emoji ?? "✨"}</div>
                    {e.cause && <Badge variant="secondary" className="capitalize">{e.cause}</Badge>}
                  </div>
                  <h3 className="font-display text-lg font-semibold mt-2 leading-tight">{e.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(e.starts_at), "EEE, MMM d · h:mm a")}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium">{Number(e.price ?? 0) === 0 ? "Free" : `₹${e.price}`}</span>
                    {bookedIds.has(e.id) ? (
                      <Badge className="bg-mint text-foreground">Reserved</Badge>
                    ) : (
                      <Button size="sm" className="rounded-full h-8" onClick={() => reserve(e.id)}>Reserve</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="rounded-full"><Link to="/events">Browse all events</Link></Button>
            </div>
          </div>

          <div>
            <SectionTitle icon={<Ticket className="h-4 w-4" />}>Your passes</SectionTitle>
            <div className="mt-4 space-y-3">
              {bookings.length === 0 && (
                <div className="card-soft bg-white/70 p-5 text-sm text-muted-foreground">No reservations yet. Pick one on the left ✨</div>
              )}
              {bookings.map((b) => (
                <div key={b.id} className="card-soft bg-white/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{b.events?.cover_emoji ?? "🎟️"}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{b.events?.title}</div>
                      <div className="text-xs text-muted-foreground">{b.events && format(new Date(b.events.starts_at), "MMM d · h:mm a")}</div>
                    </div>
                    {b.checked_in && <Badge className="bg-mint text-foreground">Attended</Badge>}
                  </div>
                  <button
                    onClick={() => toggleBuddy(b.id, b.looking_for_buddy)}
                    className={`mt-3 w-full rounded-lg text-xs px-3 py-2 border transition ${
                      b.looking_for_buddy ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border hover:bg-white"
                    }`}
                  >
                    {b.looking_for_buddy ? "🤝 Looking for a buddy" : "Bring a buddy?"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ tint, icon, label, value, sub, children }: { tint: string; icon: React.ReactNode; label: string; value: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="card-soft bg-white/80 p-5">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl grid place-items-center ${tint}`}>{icon}</div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-semibold">{value}</div>
          {sub && <div className="text-xs text-muted-foreground capitalize">{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
      {icon} {children}
    </div>
  );
}