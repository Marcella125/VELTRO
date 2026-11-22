import { NextResponse } from "next/server";
import { createOwner } from "@/lib/database";
import { assertAdminApi } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await assertAdminApi();
    return NextResponse.json({ id: createOwner(await request.json(), session.email) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}
