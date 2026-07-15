import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar, Plus, TrendingUp, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/manager")({ component: ManagerHome });

type Venue = { id: string; name: string; neighborhood: string | null };
type Ev = { id: string; title: string; starts_at: string; status: string; capacity: number | null; cover_emoji: string | null; cause: string | null; price: number | null };

function ManagerHome() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<Ev[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", cause: "wellness", venue_id: "",
    starts_at: "", duration_min: 60, capacity: 30, price: 0, cover_emoji: "✨",
  });

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user!.id;
    const [{ data: vs }, { data: ev }] = await Promise.all([
      supabase.from("venues").select("id,name,neighborhood").order("name"),
      supabase.from("events").select("id,title,starts_at,status,capacity,cover_emoji,cause,price").eq("organizer_id", uid).order("starts_at", { ascending: false }),
    ]);
    setVenues((vs as Venue[]) ?? []);
    setEvents((ev as Ev[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!form.title || !form.starts_at || !form.venue_id) return toast.error("Fill title, venue, and date");
    const { error } = await supabase.from("events").insert({
      ...form, organizer_id: userData.user!.id, status: "published",
      starts_at: new Date(form.starts_at).toISOString(),
    });
    if (error) return toast.error(error.message);
    toast.success("Event published!");
    setOpen(false);
    load();
  };

  const published = events.filter((e) => e.status === "published").length;

  return (
    <div className="min-h-screen bg-blush-gradient">
      <AppNav />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold">Manager studio</h1>
            <p className="text-muted-foreground mt-1">Curate a venue. Match an audience. Get paid.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="rounded-full h-11"><Plus className="h-4 w-4 mr-1" /> Create event</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create a new event</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Row label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Row>
                <Row label="Description"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Row>
                <div className="grid grid-cols-2 gap-3">
                  <Row label="Cause">
                    <Select value={form.cause} onValueChange={(v) => setForm({ ...form, cause: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["wellness", "education", "environment", "arts", "community", "sports"].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Row>
                  <Row label="Venue">
                    <Select value={form.venue_id} onValueChange={(v) => setForm({ ...form, venue_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Pick venue" /></SelectTrigger>
                      <SelectContent>
                        {venues.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}{v.neighborhood ? ` · ${v.neighborhood}` : ""}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Row>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Row label="Start"><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></Row>
                  <Row label="Duration (min)"><Input type="number" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })} /></Row>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Row label="Capacity"><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></Row>
                  <Row label="Price ₹"><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Row>
                  <Row label="Emoji"><Input value={form.cover_emoji} onChange={(e) => setForm({ ...form, cover_emoji: e.target.value })} /></Row>
                </div>
              </div>
              <DialogFooter><Button onClick={create} className="rounded-full">Publish</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Stat tint="bg-butter/60" icon={<Calendar className="h-5 w-5" />} label="Published" value={String(published)} />
          <Stat tint="bg-mint/60" icon={<TrendingUp className="h-5 w-5" />} label="Total events" value={String(events.length)} />
          <Stat tint="bg-lavender/60" icon={<MapPin className="h-5 w-5" />} label="Venues in network" value={String(venues.length)} />
        </div>

        <h2 className="font-display text-2xl font-semibold mt-10">Your events</h2>
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length === 0 && <div className="card-soft bg-white/70 p-6 text-sm text-muted-foreground">No events yet. Click Create event to publish your first one.</div>}
          {events.map((e) => (
            <div key={e.id} className="card-soft bg-white/80 p-4">
              <div className="flex items-start justify-between">
                <div className="text-3xl">{e.cover_emoji ?? "✨"}</div>
                <Badge variant={e.status === "published" ? "default" : "secondary"} className="capitalize">{e.status}</Badge>
              </div>
              <div className="font-display text-lg font-semibold mt-2">{e.title}</div>
              <div className="text-xs text-muted-foreground">{format(new Date(e.starts_at), "MMM d · h:mm a")}</div>
              <div className="text-xs text-muted-foreground mt-1">Capacity {e.capacity ?? "—"} · {Number(e.price ?? 0) === 0 ? "Free" : `₹${e.price}`}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-sm">{label}</Label>{children}</div>;
}
function Stat({ tint, icon, label, value }: { tint: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-soft bg-white/80 p-5 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${tint}`}>{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-display text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}