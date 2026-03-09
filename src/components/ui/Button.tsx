"use client";

import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: {
    background: "var(--color-ac)",
    color: "#000",
    border: "1px solid var(--color-ac)",
  },
  secondary: {
    background: "var(--color-b2)",
    color: "var(--color-t0)",
    border: "1px solid var(--color-bd)",
  },
  danger: {
    background: "rgba(239,68,68,0.12)",
    color: "var(--color-rd)",
    border: "1px solid rgba(239,68,68,0.25)",
  },
};

export default function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <button
      className={`px-4 py-2 rounded-md text-[13px] font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? "w-full" : ""} ${className}`}
      style={{
        ...styles,
        opacity: loading ? 0.7 : undefined,
        ...style,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
