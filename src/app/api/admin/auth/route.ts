import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, validCredentials } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password } = await request.json() as { email?: string; password?: string };
  if (!validCredentials(email ?? "", password ?? "")) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(email!), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 10,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
