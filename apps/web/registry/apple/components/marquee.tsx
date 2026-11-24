"use client"

import type { MarqueeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"

/**
 * Designed: a slow, endless line of short headlines in the display face,
 * soft-faded at both edges. Lists inside lay out in a row.
 */
export function Marquee({ children, speed = 40, direction = "left", pauseOnHover = true, className }: MarqueeProps) {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed, direction, pauseOnHover })
  return (
    <div
      ref={rootRef}
      className={cn(
        moving ? "overflow-hidden" : "overflow-x-auto [scrollbar-width:none]",
        "font-display text-(length:--apple-promo-subhead-size-compact) leading-(--apple-promo-subhead-line-height-compact) font-semibold tracking-(--apple-promo-subhead-letter-spacing-compact) text-foreground antialiased min-[1069px]:text-(length:--apple-tile-subhead-size) min-[1069px]:leading-(--apple-tile-subhead-line-height) min-[1069px]:tracking-(--apple-tile-subhead-letter-spacing)",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
    >
      <div ref={trackRef} className="flex w-max">
        {Array.from({ length: copies }, (_, i) => (
          // The gap lives inside each copy (pe-*), so one copy width is one loop.
          <div
            key={i}
            aria-hidden={i > 0 || undefined}
            inert={i > 0}
            className={cn(
              "flex shrink-0 items-center gap-6 pe-6 whitespace-nowrap",
              // Lists run in a row with a small gray dot between items, and one after the last so copies join evenly.
              "[&_ul]:flex [&_ul]:items-center [&_ul]:gap-6 [&_li]:flex [&_li]:items-center",
              "[&_li+li]:before:me-6 [&_li+li]:before:size-1.5 [&_li+li]:before:rounded-full [&_li+li]:before:bg-(--apple-tertiary-text) [&_li+li]:before:content-['']",
              "[&_ul]:after:size-1.5 [&_ul]:after:rounded-full [&_ul]:after:bg-(--apple-tertiary-text) [&_ul]:after:content-['']"
            )}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
