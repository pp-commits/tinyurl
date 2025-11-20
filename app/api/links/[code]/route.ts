import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/links/:code → fetch stats for one link
export async function GET(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params; // FIX: unwrap params

  if (!code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(link, { status: 200 });
}

// DELETE /api/links/:code → delete link
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params; // FIX: unwrap params

  if (!code) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const existing = await prisma.link.findUnique({
    where: { code },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.link.delete({
    where: { code },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
