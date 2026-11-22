"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const params = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    if (!response.ok) {
      setError("The email or password is incorrect.");
      setLoading(false);
      return;
    }
    const next = params.get("next");
    window.location.href = next?.startsWith("/admin") && next !== "/admin/login" ? next : "/admin";
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.18em] text-white/45">Email address</span>
        <span className="flex h-13 items-center gap-3 border border-white/12 bg-white/[.025] px-4 focus-within:border-white/30">
          <Mail size={16} className="text-white/35" />
          <input name="email" type="email" required autoComplete="email" placeholder="veltroadmin@gmail.com" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/22" />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.18em] text-white/45">Password</span>
        <span className="flex h-13 items-center gap-3 border border-white/12 bg-white/[.025] px-4 focus-within:border-white/30">
          <LockKeyhole size={16} className="text-white/35" />
          <input name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" placeholder="Enter your password" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/22" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="text-white/35 hover:text-white">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </span>
      </label>
      {error ? <p role="alert" className="border-l-2 border-red-500 bg-red-500/8 px-3 py-2 text-xs text-red-200">{error}</p> : null}
      <button disabled={loading} className="flex h-13 w-full items-center justify-center gap-2 bg-[var(--brand-red)] text-[11px] font-semibold uppercase tracking-[.17em] transition hover:bg-[#c7182e] disabled:opacity-60">
        {loading ? "Signing in…" : "Sign in to dashboard"}<ArrowRight size={15} />
      </button>
    </form>
  );
}
