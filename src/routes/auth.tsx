import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getMyRoles, homeForRoles, setMyRole, type AppRole } from "@/lib/roles";
import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional() }).parse,
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — UNIFY" }, { name: "description", content: "Sign in to UNIFY or create your account." }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" }) as { redirect?: string };
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AppRole>("individual");
  const [busy, setBusy] = useState(false);
  const [needsRole, setNeedsRole] = useState(false);

  // If already signed in, jump straight to dashboard
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const roles = await getMyRoles();
        if (roles.length === 0) { setNeedsRole(true); return; }
        navigate({ to: search.redirect ?? homeForRoles(roles) });
      }
    })();
  }, [navigate, search.redirect]);

  const afterAuth = async () => {
    const roles = await getMyRoles();
    if (roles.length === 0) {
      await setMyRole(role);
      navigate({ to: search.redirect ?? homeForRoles([role]) });
    } else {
      navigate({ to: search.redirect ?? homeForRoles(roles) });
    }
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    await afterAuth();
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error, data } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data.session) return toast.info("Check your inbox to confirm your email, then sign in.");
    toast.success("Account created!");
    await setMyRole(role);
    navigate({ to: homeForRoles([role]) });
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) return toast.error(result.error.message ?? "Google sign-in failed");
    if (result.redirected) return;
    await afterAuth();
  };

  if (needsRole) {
    return (
      <RoleChooser
        value={role}
        onChange={setRole}
        onConfirm={async () => {
          await setMyRole(role);
          navigate({ to: homeForRoles([role]) });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-blush-gradient grid md:grid-cols-2">
      <aside className="hidden md:flex flex-col justify-between p-10">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
          UNIFY
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-5xl leading-tight">Show up. <br /><span className="italic text-primary">Together.</span></h2>
          <p className="mt-4 text-muted-foreground max-w-sm">Discover verified community events, sponsor causes that matter, or run the workshops your city needs.</p>
        </motion.div>
        <p className="text-xs text-muted-foreground">© UNIFY · Mumbai</p>
      </aside>
      <main className="grid place-items-center p-6">
        <div className="card-soft bg-white/80 w-full max-w-md p-8">
          <h1 className="font-display text-3xl font-semibold">Welcome to UNIFY</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in or create an account to begin.</p>

          <Button variant="outline" className="w-full mt-6 rounded-full h-11 bg-white" onClick={onGoogle} disabled={busy}>
            Continue with Google
          </Button>
          <div className="relative my-5 text-center text-xs text-muted-foreground">
            <span className="bg-white/80 px-2 relative z-10">or with email</span>
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full bg-muted/60">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={onSignIn} className="space-y-3 mt-4">
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <Field label="Password" type="password" value={password} onChange={setPassword} />
                <Button type="submit" disabled={busy} className="w-full rounded-full h-11">{busy ? "…" : "Sign in"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={onSignUp} className="space-y-3 mt-4">
                <Field label="Full name" value={fullName} onChange={setFullName} />
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <Field label="Password (min 6 chars)" type="password" value={password} onChange={setPassword} />
                <div>
                  <Label className="text-sm">I'm joining as</Label>
                  <RoleGrid value={role} onChange={setRole} />
                </div>
                <Button type="submit" disabled={busy} className="w-full rounded-full h-11">{busy ? "…" : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required className="h-11 rounded-xl bg-white" />
    </div>
  );
}

const ROLE_OPTIONS: { value: AppRole; emoji: string; title: string; hint: string }[] = [
  { value: "individual", emoji: "🌿", title: "Individual", hint: "Discover & attend" },
  { value: "manager", emoji: "🎪", title: "Manager", hint: "Run events" },
  { value: "corporate", emoji: "💼", title: "Corporate", hint: "Sponsor CSR" },
];

function RoleGrid({ value, onChange }: { value: AppRole; onChange: (v: AppRole) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {ROLE_OPTIONS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`rounded-xl border p-3 text-left transition-all ${
            value === r.value ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-white hover:bg-muted"
          }`}
        >
          <div className="text-2xl">{r.emoji}</div>
          <div className="text-sm font-medium mt-1">{r.title}</div>
          <div className="text-[11px] text-muted-foreground">{r.hint}</div>
        </button>
      ))}
    </div>
  );
}

function RoleChooser({ value, onChange, onConfirm }: { value: AppRole; onChange: (v: AppRole) => void; onConfirm: () => void }) {
  return (
    <div className="min-h-screen bg-blush-gradient grid place-items-center p-6">
      <div className="card-soft bg-white/80 w-full max-w-md p-8">
        <h1 className="font-display text-3xl font-semibold">Which side of the bridge?</h1>
        <p className="text-sm text-muted-foreground mt-1">Pick how you'll use UNIFY. You can change this later.</p>
        <div className="mt-4">
          <RoleGrid value={value} onChange={onChange} />
        </div>
        <Button onClick={onConfirm} className="mt-6 w-full rounded-full h-11">Continue</Button>
      </div>
    </div>
  );
}