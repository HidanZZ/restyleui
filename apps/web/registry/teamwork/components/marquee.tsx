"use client"

import type { MarqueeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"

// The source's connector rail: tiles drift at 60px/s, each keeps a slight authored tilt,
// and the row fades out at both edges.
export function Marquee({ children, speed = 60, direction = "left", pauseOnHover = true, className }: MarqueeProps) {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed, direction, pauseOnHover })
  return (
    <div
      ref={rootRef}
      className={cn(
        moving ? "overflow-hidden" : "overflow-x-auto",
        "py-4 font-body [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
    >
      <div ref={trackRef} className="flex w-max">
        {Array.from({ length: copies }, (_, i) => (
          // The gap lives inside each copy (pe-4), so one copy width is one loop.
          <div
            key={i}
            aria-hidden={i > 0 || undefined}
            inert={i > 0}
            className={cn(
              "flex shrink-0 items-center gap-4 pe-4",
              "[&_ul]:flex [&_ul]:items-center [&_ul]:gap-4",
              "[&_li]:flex [&_li]:h-14 [&_li]:items-center [&_li]:gap-3 [&_li]:rounded-kit-lg [&_li]:bg-card [&_li]:px-5 [&_li]:font-display [&_li]:text-lg [&_li]:leading-7 [&_li]:tracking-[0.5px] [&_li]:whitespace-nowrap [&_li]:text-foreground [&_li]:shadow-(--teamwork-shadow-overlay)",
              "[&_li]:before:size-2 [&_li]:before:shrink-0 [&_li]:before:rounded-full [&_li]:before:bg-(--teamwork-blue) [&_li]:before:content-['']",
              "[&_li:nth-child(4n+2)]:before:bg-(--teamwork-yellow) [&_li:nth-child(4n+3)]:before:bg-(--teamwork-green) [&_li:nth-child(4n)]:before:bg-(--teamwork-lilac)",
              "[&_li:nth-child(4n+1)]:-rotate-2 [&_li:nth-child(4n+2)]:rotate-1 [&_li:nth-child(4n+3)]:-rotate-1 [&_li:nth-child(4n)]:rotate-2"
            )}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
