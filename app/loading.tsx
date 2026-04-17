import { BanditIllustration } from "@/components/brand/bandit-illustration";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center py-16">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <BanditIllustration variant="loading" priority />
        <h1 className="font-display text-3xl text-[var(--ink)]">Bandit&apos;s rummaging for the good stuff.</h1>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">Give it a second. He&apos;s got a basket, zero shame, and usually the right page.</p>
      </div>
    </div>
  );
}
