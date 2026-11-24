"use client"

import type { MarqueeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"

/**
 * Source: the logo marquee. A 64px edge fade (half of it eased) and an even gap,
 * set with `--marquee-gap` (default 40px, the homepage value). Lists passed as children lay out in a row.
 */
export function Marquee({ children, speed = 40, direction = "left", pauseOnHover = true, className }: MarqueeProps) {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed, direction, pauseOnHover })
  return (
    <div
      ref={rootRef}
      className={cn(
        "max-w-full select-none [--marquee-gap:40px]",
        "[mask-image:linear-gradient(to_right,transparent_0%,#0003_32px,black_64px,black_calc(100%-64px),#0003_calc(100%-32px),transparent_100%)]",
        moving ? "overflow-hidden" : "overflow-x-auto [scrollbar-width:none]",
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
              "flex shrink-0 items-center gap-(--marquee-gap) pr-(--marquee-gap)",
              "text-[1.0625rem] leading-[1.6] text-(--linear-text-secondary)",
              "[&>ol]:flex [&>ol]:items-center [&>ol]:gap-(--marquee-gap) [&>ul]:flex [&>ul]:items-center [&>ul]:gap-(--marquee-gap)",
              "[&_li]:shrink-0 [&_li]:whitespace-nowrap"
            )}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
