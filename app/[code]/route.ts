
export const dynamic = "force-dynamic"; 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Redirect route: /:code
export async function GET(
  _req: Request,
  context: { params: Promise<{ code: string }> }
) {
  // Next.js 14+: params must be awaited
  const { code } = await context.params;

  if (!code || typeof code !== "string") {
    return new NextResponse("Invalid short code", { status: 400 });
  }

  // Find link by short code
  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Update click count + last clicked timestamp
  await prisma.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  // Perform redirect
  return NextResponse.redirect(link.url, 302);
}
