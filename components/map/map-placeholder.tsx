import { Card } from "@/components/ui/card";

export function MapPlaceholder() {
  return (
    <Card className="relative overflow-hidden p-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(218,165,32,0.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(58,90,64,0.22),transparent_35%)]" />
      <div className="relative grid min-h-[320px] place-items-center bg-[linear-gradient(135deg,rgba(245,240,232,0.74),rgba(255,255,255,0.22))]">
        <div className="w-full max-w-xl space-y-4 px-6 py-8">
          <div className="flex items-center justify-between rounded-full bg-white/70 px-4 py-2 text-sm text-[var(--ink-soft)]">
            <span>Map stub for Powell River</span>
            <span>Willingdon Beach → Cranberry</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-[24px] bg-white/80 p-4 text-sm text-[var(--ink-soft)]">Producer pin cluster</div>
            <div className="rounded-[24px] bg-[rgba(217,79,48,0.16)] p-4 text-sm font-semibold text-[var(--ink)]">
              Eggs preview card
            </div>
            <div className="rounded-[24px] bg-white/80 p-4 text-sm text-[var(--ink-soft)]">Watched area glow</div>
          </div>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            Phase 4 map goes here. For this slice, it stays a good-looking stand-in while follows, pings, and producer tools do the heavy lifting.
          </p>
        </div>
      </div>
    </Card>
  );
}
