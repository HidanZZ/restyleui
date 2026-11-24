import type { KitSlug } from "@/lib/catalog"
import { cn } from "@/registry/restyle/lib/utils"

/** A tiny specimen of a kit, drawn with the kit's own tokens: its ground, display face and primary color. */
export function KitSwatch({ kit, className }: { kit: KitSlug; className?: string }) {
  return (
    <span
      data-kit={kit}
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/10 font-display text-[11px] leading-none font-semibold dark:border-white/15",
        className,
      )}
    >
      Aa
      <span className="absolute right-1 bottom-1 size-1.5 rounded-full bg-primary" />
    </span>
  )
}
