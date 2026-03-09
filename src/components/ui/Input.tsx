"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-medium"
            style={{ color: "var(--color-t1)" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`px-3 py-2 rounded-md text-[13px] border outline-none transition-colors placeholder:opacity-40 ${className}`}
          style={{
            background: "var(--color-b2)",
            borderColor: error ? "var(--color-rd)" : "var(--color-bd)",
            color: "var(--color-t0)",
          }}
          {...props}
        />
        {error && (
          <span className="text-[10px]" style={{ color: "var(--color-rd)" }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
