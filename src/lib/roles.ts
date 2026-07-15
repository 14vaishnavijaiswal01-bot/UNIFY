import { supabase } from "@/integrations/supabase/client";

export type AppRole = "individual" | "manager" | "corporate" | "admin";

export async function getMyRoles(): Promise<AppRole[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
  return (data ?? []).map((r) => r.role as AppRole);
}

export async function setMyRole(role: AppRole) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in");
  const userId = userData.user.id;
  await supabase.from("user_roles").upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
  if (role === "manager") {
    await supabase.from("manager_profiles").upsert({ user_id: userId }, { onConflict: "user_id" });
  }
  if (role === "corporate") {
    await supabase.from("corporate_profiles").upsert({ user_id: userId, company_name: "My Company" }, { onConflict: "user_id" });
  }
  if (role === "individual") {
    // ensure a free pass exists
    const { data: existing } = await supabase.from("passes").select("id").eq("user_id", userId).maybeSingle();
    if (!existing) await supabase.from("passes").insert({ user_id: userId, credits_total: 4, tier: "free" });
  }
}

export function homeForRoles(roles: AppRole[]): string {
  if (roles.includes("manager")) return "/manager";
  if (roles.includes("corporate")) return "/corporate";
  return "/app";
}