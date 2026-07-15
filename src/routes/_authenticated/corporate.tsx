import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format } from "date-fns";
import { Building2, Award, IndianRupee, Leaf } from "lucide-react";

export const Route = createFileRoute("/_authenticated/corporate")({ component: CorporateHome });

type CProfile = { company_name: string; industry: string | null; csr_budget_quarter: number | null; csr_spent_quarter: number | null; is_premium: boolean };
type Ev = { id: string; title: string; starts_at: string; cause: string | null; cover_emoji: string | null; price: number | null; capacity: number | null; sponsor_id: string | null };

function CorporateHome() {
  const [profile, setProfile] = useState<CProfile | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [sponsored, setSponsored] = useState<Ev[]>([]);
  const [budget, setBudget] = useState<number>(0);

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user!.id;
    const [{ data: prof }, { data: ev }, { data: sp }] = await Promise.all([
      supabase.from("corporate_profiles").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("events").select("id,title,starts_at,cause,cover_emoji,price,capacity,sponsor_id").eq("status", "published").is("sponsor_id", null).order("starts_at").limit(9),
      supabase.from("events").select("id,title,starts_at,cause,cover_emoji,price,capacity,sponsor_id").eq("sponsor_id", uid),
    ]);
    setProfile(prof as CProfile | null);
    setEvents((ev as Ev[]) ?? []);
    setSponsored((sp as Ev[]) ?? []);
    setBudget(Number((prof as CProfile | null)?.csr_budget_quarter ?? 0));
  };
  useEffect(() => { load(); }, []);

  const saveBudget = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("corporate_profiles").update({ csr_budget_quarter: budget }).eq("user_id", userData.user!.id);
    if (error) return toast.error(error.message);
    toast.success("Budget saved");
    load();
  };

  const sponsor = async (eventId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("events").update({ sponsor_id: userData.user!.id }).eq("id", eventId);
    if (error) return toast.error(error.message);
    toast.success("Event sponsored — ESG certificate available after the event.");
    load();
  };

  const spent = Number(profile?.csr_spent_quarter ?? 0);
  const b = Number(profile?.csr_budget_quarter ?? 0);
  const pct = b > 0 ? Math.min(100, (spent / b) * 100) : 0;

  return (
    <div className="min-h-screen bg-blush-gradient">
      <AppNav />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold">Impact desk</h1>
            <p className="text-muted-foreground mt-1">Sponsor real events. Track real impact. Share the certificate.</p>
          </div>
          <Badge variant="secondary" className="rounded-full">{profile?.company_name ?? "Company"}</Badge>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="card-soft bg-white/80 p-5 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl grid place-items-center bg-lavender/60"><IndianRupee className="h-5 w-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">CSR budget · this quarter</div>
                <div className="font-display text-2xl font-semibold">₹{b.toLocaleString()} <span className="text-sm text-muted-foreground">spent ₹{spent.toLocaleString()}</span></div>
              </div>
            </div>
            <Progress value={pct} className="mt-3 h-2" />
            <div className="mt-4 flex items-end gap-2">
              <div className="flex-1"><Label className="text-xs">Set quarterly budget (₹)</Label><Input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></div>
              <Button onClick={saveBudget} className="rounded-full">Save</Button>
            </div>
          </div>
          <div className="card-soft bg-white/80 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl grid place-items-center bg-mint/60"><Leaf className="h-5 w-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Events sponsored</div>
                <div className="font-display text-2xl font-semibold">{sponsored.length}</div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-full" disabled={sponsored.length === 0}>
              <Award className="h-4 w-4 mr-1" /> Download ESG report
            </Button>
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold mt-10">Events looking for a sponsor</h2>
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((e) => (
            <div key={e.id} className="card-soft bg-white/80 p-4">
              <div className="flex items-start justify-between">
                <div className="text-3xl">{e.cover_emoji ?? "🌱"}</div>
                {e.cause && <Badge variant="secondary" className="capitalize">{e.cause}</Badge>}
              </div>
              <div className="font-display text-lg font-semibold mt-2">{e.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{format(new Date(e.starts_at), "MMM d · h:mm a")} · up to {e.capacity ?? "—"} people</div>
              <Button size="sm" className="rounded-full mt-3 w-full" onClick={() => sponsor(e.id)}>
                <Building2 className="h-4 w-4 mr-1" /> Sponsor this
              </Button>
            </div>
          ))}
          {events.length === 0 && <div className="card-soft bg-white/70 p-5 text-sm text-muted-foreground">No open events right now — check back soon.</div>}
        </div>

        {sponsored.length > 0 && (
          <>
            <h2 className="font-display text-2xl font-semibold mt-10">Your sponsorships</h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {sponsored.map((e) => (
                <div key={e.id} className="card-soft bg-white/80 p-4">
                  <div className="text-3xl">{e.cover_emoji ?? "✨"}</div>
                  <div className="font-display text-lg font-semibold mt-2">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(e.starts_at), "MMM d")}</div>
                  <Badge className="mt-2 bg-mint text-foreground">Sponsored</Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}