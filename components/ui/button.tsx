import * as React from "react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function buttonStyles(variant: ButtonProps["variant"] = "primary", className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-[var(--accent)] text-[var(--accent-ink)] shadow-card hover:brightness-95",
    variant === "secondary" &&
      "border border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]",
    variant === "ghost" && "text-[var(--ink-soft)] hover:bg-[var(--surface)]",
    className
  );
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}
