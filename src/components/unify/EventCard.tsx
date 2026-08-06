import { Link } from "@tanstack/react-router";
import { MapPin, CalendarDays, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MatchBadge, Verified } from "./bits";
import { prettyDate, type UnifyEvent } from "@/lib/demo/data";

export function EventCard({ ev, match, footer }: { ev: UnifyEvent; match?: { score: number; reasons: string[] }; footer?: React.ReactNode }) {
  return (
    <div className="card-soft bg-card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="text-3xl">{ev.emoji}</div>
        {match ? <MatchBadge score={match.score} reasons={match.reasons} /> : <Badge variant="secondary" className="text-[11px]">{ev.type}</Badge>}
      </div>
      <Link to="/event/$id" params={{ id: ev.id }} className="font-display text-lg font-semibold mt-2 leading-tight hover:text-primary transition">
        {ev.title}
      </Link>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{prettyDate(ev.date)}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{ev.online ? "Online" : `${ev.area}, ${ev.city}`}</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{ev.participants}/{ev.capacity}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-[11px]">{ev.cause}</Badge>
        {ev.verified && <Verified label="UNIFY verified" />}
        {ev.popular && <Badge className="bg-butter text-foreground text-[11px]">Popular</Badge>}
      </div>
      <Progress value={(ev.participants / ev.capacity) * 100} className="h-1.5 mt-3" />
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{ev.about}</p>
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">{footer}</div>
    </div>
  );
}
