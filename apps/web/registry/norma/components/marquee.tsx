"use client"

import type { MarqueeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"

/**
 * Norma marquee: a calm line of tightly tracked statements that drifts
 * sideways, each item led by a small steel dot. The edges fade into paper.
 * Lists inside it lay out in one row.
 */
export function Marquee({ children, speed = 32, direction = "left", pauseOnHover = true, className }: MarqueeProps) {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed, direction, pauseOnHover })
  return (
    <div
      ref={rootRef}
      className={cn(
        "font-body text-foreground",
        moving ? "overflow-hidden" : "overflow-x-auto [scrollbar-width:none]",
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
    >
      <div ref={trackRef} className="flex w-max">
        {Array.from({ length: copies }, (_, i) => (
          // The gap lives inside each copy (pr-*), so one copy width is one loop.
          <div
            key={i}
            aria-hidden={i > 0 || undefined}
            inert={i > 0}
            className={cn(
              "flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14",
              "text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.015em] whitespace-nowrap",
              "[&_ul]:flex [&_ul]:items-center [&_ul]:gap-10 sm:[&_ul]:gap-14",
              "[&_li]:flex [&_li]:items-center [&_li]:gap-10 sm:[&_li]:gap-14",
              "[&_li]:before:size-2 [&_li]:before:shrink-0 [&_li]:before:rounded-full [&_li]:before:bg-(--norma-ink-3) [&_li]:before:content-['']",
              "[&_li:nth-child(even)]:text-muted-foreground"
            )}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
