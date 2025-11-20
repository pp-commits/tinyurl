import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Validate short code
function isValidCode(code: string) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// Validate URLs (http or https)
function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Generate random short codes
function genRandomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

// GET — List all links
export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}

// POST — Create a new link
export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url, code: providedCode } = body;

  // URL validation
  if (!url || typeof url !== "string" || !isValidUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // User-provided code
  let code = "";
  if (typeof providedCode === "string" && providedCode.trim().length > 0) {
    code = providedCode.trim();

    if (!isValidCode(code)) {
      return NextResponse.json(
        { error: "Code must match [A-Za-z0-9]{6,8}" },
        { status: 400 }
      );
    }

    // Check for existing custom code
    const exists = await prisma.link.findUnique({ where: { code } });
    if (exists) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 }
      );
    }
  }

  // Auto-generate code if not provided
  if (!code) {
    let unique = false;

    while (!unique) {
      const length = 6 + Math.floor(Math.random() * 3); // 6–8 characters
      code = genRandomCode(length);

      const exists = await prisma.link.findUnique({ where: { code } });
      if (!exists) unique = true;
    }
  }

  // Create the link
  const created = await prisma.link.create({
    data: { code, url },
  });

  return NextResponse.json(created, { status: 201 });
}
