"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

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
            Welcome back
          </h1>
          <p className="text-[11px] mt-1" style={{ color: "var(--color-t2)" }}>
            Sign in to your account
          </p>
        </div>

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
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[10px] font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--color-a2)" }}
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-[11px] mt-5" style={{ color: "var(--color-t2)" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold transition-opacity hover:opacity-80"
            style={{ color: "var(--color-ac)" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
