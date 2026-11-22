import { NextResponse } from "next/server";
import { updateSettings } from "@/lib/database";
import { assertAdminApi } from "@/lib/session";

export async function PATCH(request: Request) {
  try {
    await assertAdminApi();
    updateSettings(await request.json());
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ error: message }, { status: message === "UNAUTHORIZED" ? 401 : 400 });
  }
}
