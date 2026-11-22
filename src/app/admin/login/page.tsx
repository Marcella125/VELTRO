import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdminSession } from "@/lib/session";
import { LoginForm } from "@/views/admin/LoginForm";

export const metadata: Metadata = { title: "Admin Sign In | Veltro" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <main className="admin-cms-light admin-login-light relative grid min-h-dvh place-items-center overflow-hidden bg-[#050505] px-5 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(177,18,38,.2),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,.06),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[.025] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:44px_44px]" />
      <section className="relative w-full max-w-md border border-white/10 bg-[#0b0b0c]/95 p-7 shadow-[0_35px_100px_rgba(0,0,0,.65)] sm:p-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Image src="/icons/veltro_logo.svg" alt="Veltro" width={132} height={38} className="h-9 w-auto brightness-0 invert" priority />
          <span className="rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[.22em] text-white/45">Admin CMS</span>
        </div>
        <div className="py-7">
          <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[var(--brand-red)]">Secure access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Welcome back.</h1>
          <p className="mt-2 text-sm leading-6 text-white/48">Sign in to manage the Veltro rental fleet, availability, and reservations.</p>
        </div>
        <Suspense fallback={<div className="h-52 animate-pulse bg-white/[.025]" />}><LoginForm /></Suspense>
        <p className="mt-7 text-center text-[10px] leading-5 text-white/28">Protected dealership operations · Authorized staff only</p>
      </section>
    </main>
  );
}
