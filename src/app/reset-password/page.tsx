"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <div
          className="px-3 py-3 rounded-md text-[12px] border mb-4"
          style={{
            background: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.2)",
            color: "var(--color-rd)",
          }}
        >
          <p className="font-medium">Invalid reset link</p>
          <p className="text-[10px] mt-1 opacity-80">
            This password reset link is invalid or has expired.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="text-[11px] font-semibold transition-opacity hover:opacity-80"
          style={{ color: "var(--color-a2)" }}
        >
          Request a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div
          className="px-3 py-3 rounded-md text-[12px] border mb-4"
          style={{
            background: "rgba(0,223,162,0.06)",
            borderColor: "rgba(0,223,162,0.15)",
            color: "var(--color-ac)",
          }}
        >
          <p className="font-medium mb-1">Password reset successful</p>
          <p className="text-[10px] opacity-80">
            Your password has been updated. You can now sign in.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex px-4 py-2 rounded-md text-[13px] font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--color-ac)", color: "#000" }}
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Error */}
      {error && (
        <div
          className="mb-4 px-3 py-2 rounded-md text-[11px] border"
          style={{
            background: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.2)",
            color: "var(--color-rd)",
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="New Password"
          type="password"
          placeholder="Min 8 chars, upper, lower, number"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth loading={loading} className="mt-1">
          Reset Password
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-[11px] mt-5" style={{ color: "var(--color-t2)" }}>
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold transition-opacity hover:opacity-80"
          style={{ color: "var(--color-ac)" }}
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div
        className="w-full max-w-[380px] rounded-xl border p-6"
        style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-ac)" }}>
              <path d="M2 15c6.667-6 13.333 0 20-6"/>
              <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>
              <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/>
            </svg>
            <span className="font-serif font-[800] text-[17px] tracking-tight" style={{ color: "var(--color-t0)" }}>
              KBY Biotech Index
            </span>
          </div>
          <h1 className="text-[15px] font-semibold" style={{ color: "var(--color-t0)" }}>
            Set new password
          </h1>
          <p className="text-[11px] mt-1" style={{ color: "var(--color-t2)" }}>
            Choose a strong password for your account
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center py-4">
            <span className="text-[11px]" style={{ color: "var(--color-t2)" }}>Loading...</span>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
