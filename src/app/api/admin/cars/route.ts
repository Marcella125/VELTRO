import { NextResponse } from "next/server";
import { createCar, removeCar, updateCar } from "@/lib/database";
import { assertAdminApi } from "@/lib/session";

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed";
  return NextResponse.json({ error: message }, { status: message === "UNAUTHORIZED" ? 401 : 400 });
}

export async function POST(request: Request) {
  try {
    const session = await assertAdminApi();
    return NextResponse.json({ id: createCar(await request.json(), session.email) }, { status: 201 });
  } catch (error) { return failure(error); }
}

export async function PATCH(request: Request) {
  try {
    const session = await assertAdminApi();
    const { id, ...input } = await request.json() as Record<string, unknown> & { id: string };
    updateCar(id, input, session.email);
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}

export async function DELETE(request: Request) {
  try {
    const session = await assertAdminApi();
    const { id } = await request.json() as { id: string };
    removeCar(id, session.email);
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
