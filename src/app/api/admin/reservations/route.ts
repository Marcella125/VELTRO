import { NextResponse } from "next/server";
import { createReservation, updateReservation } from "@/lib/database";
import { assertAdminApi } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await assertAdminApi();
    return NextResponse.json({ id: createReservation(await request.json(), session.email) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ error: message.includes("UNIQUE") ? "This car already has an active reservation." : message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await assertAdminApi();
    const { id, status, returnAvailable } = await request.json() as { id: string; status: string; returnAvailable?: boolean };
    updateReservation(id, status, Boolean(returnAvailable), session.email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}
