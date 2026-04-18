"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, subtitle, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(45,42,38,0.44)] p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "w-full max-w-xl overflow-hidden rounded-t-[28px] border border-[color:var(--border)] bg-[var(--page)] shadow-card motion-safe:animate-pop sm:rounded-[28px]",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[color:var(--border)] bg-[var(--surface)] px-5 py-4">
          <div>
            <h2 className="font-display text-2xl text-[var(--ink)]">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm leading-5 text-[var(--ink-soft)]">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-2.5 py-1 text-xl leading-none text-[var(--ink-soft)] transition hover:bg-[var(--surface-strong)]"
          >
            ×
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
