import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "veltro_admin_session";
const sessionLength = 60 * 60 * 10;

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? (process.env.NODE_ENV === "production" ? "" : "veltro-local-development-secret-change-me");
}

function signature(value: string) {
  const key = secret();
  if (!key) return "";
  return createHmac("sha256", key).update(value).digest("hex");
}

export function createSessionToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + sessionLength })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifySessionToken(token?: string) {
  if (!token) return null;
  const [payload, provided] = token.split(".");
  if (!payload || !provided) return null;
  const expected = signature(payload);
  if (!expected || provided.length !== expected.length || !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as { email: string; exp: number };
    return parsed.exp > Date.now() / 1000 ? parsed : null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function assertAdminApi() {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export function validCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL ?? (process.env.NODE_ENV === "production" ? "" : "veltroadmin@gmail.com");
  const expectedPassword = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV === "production" ? "" : "Veltro123");
  if (!expectedEmail || !expectedPassword) return false;
  const left = Buffer.from(password);
  const right = Buffer.from(expectedPassword);
  return email.toLowerCase() === expectedEmail.toLowerCase() && left.length === right.length && timingSafeEqual(left, right);
}
