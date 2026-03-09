import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validateEmail, validatePassword, signToken, setAuthCookie } from "@/lib/auth";
import { rateLimitRegister } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimitRegister(ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, confirmPassword } = body;

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

    // Confirm password match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email: normalizedEmail, password: hashedPassword },
    });

    // Sign JWT and set cookie
    const token = await signToken({ userId: user.id, email: user.email });
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
    setAuthCookie(response, token);

    return response;
  } catch (err) {
    console.error("Registration error:", err);
    const message = String(err).includes("better-sqlite3") || String(err).includes("SQLITE") || String(err).includes("no such table")
      ? "Authentication service is not available in this environment."
      : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
