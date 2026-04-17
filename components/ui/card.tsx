import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[color:var(--border)] bg-[var(--surface)] p-5 shadow-card backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
