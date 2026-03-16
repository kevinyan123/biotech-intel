import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimitPasswordReset } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimitPasswordReset(ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many password reset requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    const emailError = validateEmail(email);
    if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });

    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link.",
    });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      // Don't reveal whether email exists
      return successResponse;
    }

    // Generate secure token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    // Send email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    return successResponse;
  } catch (err) {
    console.error("Forgot password error:", err);
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
