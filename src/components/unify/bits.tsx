import { useState, type ReactNode } from "react";
import { BadgeCheck, Info, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function Verified({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky/50 px-2 py-0.5 text-[11px] font-medium">
      <BadgeCheck className="h-3.5 w-3.5 text-primary" /> {label}
    </span>
  );
}

export function MatchBadge({ score, reasons, label = "Match" }: { score: number; reasons: string[]; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-semibold hover:bg-primary/20 transition">
          <Sparkles className="h-3 w-3" /> {score}% {label}
          <Info className="h-3 w-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="text-sm font-semibold">Why we recommended this</div>
        <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
          {reasons.map((r) => (
            <li key={r} className="flex gap-2"><span className="text-primary">✓</span><span>{r}</span></li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function Stat({ label, value, sub, icon, tint = "bg-peach/60" }: { label: string; value: ReactNode; sub?: string; icon?: ReactNode; tint?: string }) {
  return (
    <div className="card-soft bg-card p-5">
      <div className="flex items-center gap-3">
        {icon && <div className={`h-10 w-10 shrink-0 rounded-xl grid place-items-center ${tint}`}>{icon}</div>}
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-semibold truncate">{value}</div>
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export function Meter({ label, value, max, format }: { label: string; value: number; max: number; format?: (n: number) => string }) {
  const f = format ?? ((n: number) => n.toLocaleString("en-IN"));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{f(value)} / {f(max)}</span>
      </div>
      <Progress value={Math.min(100, (value / Math.max(max, 1)) * 100)} className="h-2" />
    </div>
  );
}

export function ImpactScore({ score }: { score: number }) {
  const tier = score >= 85 ? "HIGH IMPACT" : score >= 70 ? "STRONG IMPACT" : "GROWING";
  return (
    <Badge variant="secondary" className="rounded-full text-[11px]">
      UNIFY Impact {score}/100 · {tier}
    </Badge>
  );
}

export function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold">{title}</h2>
        {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
