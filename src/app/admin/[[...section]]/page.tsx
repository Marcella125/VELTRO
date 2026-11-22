import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSnapshot } from "@/lib/database";
import { requireAdmin } from "@/lib/session";
import { AdminShell } from "@/views/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Veltro Admin", description: "Veltro inventory and dealership operations." };

export default async function AdminPage({ params }: { params: Promise<{ section?: string[] }> }) {
  const [session, route] = await Promise.all([requireAdmin(), params]);
  if (route.section?.[0] === "owners") redirect("/admin");
  return <AdminShell snapshot={getAdminSnapshot()} route={route.section ?? []} userEmail={session.email} />;
}
