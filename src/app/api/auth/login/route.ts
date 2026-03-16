import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { rateLimitLogin } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Rate limiting by email+IP
    const rl = rateLimitLogin(`${normalizedEmail}:${ip}`);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify password
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Sign JWT and set cookie
    const token = await signToken({ userId: user.id, email: user.email });
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
    setAuthCookie(response, token);

    return response;
  } catch (err) {
    console.error("Login error:", err);
    const errStr = err instanceof Error ? err.message : String(err);
    let message = "Internal server error";
    if (errStr.includes("does not exist") || errStr.includes("relation")) {
      message = "Database tables not initialized. Please redeploy.";
    } else if (errStr.includes("No database URL")) {
      message = "Database not configured.";
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
