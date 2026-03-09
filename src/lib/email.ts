import { Resend } from "resend";

const APP_NAME = "KBY Biotech Index";
const FROM_EMAIL = "KBY Biotech <onboarding@resend.dev>"; // Use verified domain in production

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `${APP_NAME} — Password Reset Request`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f1319;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;padding:32px;background:#161c26;border:1px solid #2a3a4e;border-radius:12px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:18px;font-weight:800;color:#f1f5f9;letter-spacing:-0.5px;">KBY Biotech Index</span>
    </div>
    <h1 style="color:#f1f5f9;font-size:20px;font-weight:700;margin:0 0 16px 0;text-align:center;">
      Password Reset
    </h1>
    <p style="color:#c0cdd9;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
      We received a request to reset the password for your account. Click the button below to set a new password.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}" style="display:inline-block;padding:12px 32px;background:#00f5b0;color:#0f1319;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;">
        Reset Password
      </a>
    </div>
    <p style="color:#7e92a6;font-size:12px;line-height:1.5;margin:24px 0 0 0;">
      This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
    </p>
    <hr style="border:none;border-top:1px solid #2a3a4e;margin:24px 0;">
    <p style="color:#7e92a6;font-size:11px;text-align:center;margin:0;">
      ${APP_NAME} — Biotech Investment Research
    </p>
  </div>
</body>
</html>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: "Failed to send email" };
  }
}
