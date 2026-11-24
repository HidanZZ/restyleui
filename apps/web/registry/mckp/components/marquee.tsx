"use client"

import type { MarqueeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"

/**
 * A slow endless row at H2 scale. Lists alternate white and the kit's dark
 * grey, like the clone's two-tone headings. No edge masks: the row runs
 * straight into the black.
 */
export function Marquee({ children, speed = 40, direction = "left", pauseOnHover = true, className }: MarqueeProps) {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed, direction, pauseOnHover })
  return (
    <div
      ref={rootRef}
      className={cn(
        moving ? "overflow-hidden" : "overflow-x-auto [scrollbar-width:none]",
        "text-[length:var(--mckp-type-h2)] font-normal leading-(--mckp-type-h2-line) tracking-(--mckp-type-h2-tracking) text-foreground",
        className
      )}
    >
      <div ref={trackRef} className="flex w-max">
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            aria-hidden={i > 0 || undefined}
            inert={i > 0}
            className={cn(
              "flex shrink-0 items-center gap-12 pr-12 whitespace-nowrap",
              "[&_ul]:flex [&_ul]:items-center [&_ul]:gap-12 [&_li:nth-child(even)]:text-(--mckp-ink-dim) [&_img]:h-40 [&_img]:w-auto [&_img]:rounded-kit-lg"
            )}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
