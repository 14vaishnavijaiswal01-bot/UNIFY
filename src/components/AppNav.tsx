import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { getMyRoles, homeForRoles, type AppRole } from "@/lib/roles";
import { Sparkles } from "lucide-react";

export function AppNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
      if (data.user) setRoles(await getMyRoles());
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setEmail(s?.user?.email ?? null);
      setRoles(s?.user ? await getMyRoles() : []);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          UNIFY
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/events" className="hover:text-primary transition-colors">Discover</Link>
          <a href="/#how" className="hover:text-primary transition-colors">How it works</a>
          <a href="/#roles" className="hover:text-primary transition-colors">For you</a>
        </nav>
        <div className="flex items-center gap-2">
          {email ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={homeForRoles(roles)}>Dashboard</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
              <Button asChild size="sm"><Link to="/auth">Join UNIFY</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}