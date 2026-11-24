"use client"

import type { CountUpProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useCountUp } from "@/registry/restyle/hooks/use-count-up"

/** The source stat counters ease out on a cubic. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Norma count-up: the screen-time numerals. Tabular lining figures, 600
 * weight, tight -0.04em tracking; it counts once on view in 1.1s.
 */
export function CountUp({ value, from = 0, duration = 1100, format, prefix, suffix, className }: CountUpProps) {
  const { ref, text, final } = useCountUp({ value, from, duration, format, easing: easeOutCubic })
  return (
    <span
      ref={ref}
      className={cn(
        "inline-block whitespace-nowrap font-display text-[clamp(1.875rem,1.1rem+2.1vw,2.75rem)] font-semibold leading-none tracking-[-0.04em]",
        "tabular-nums lining-nums [font-feature-settings:var(--norma-font-features-nums)]",
        className
      )}
    >
      <span aria-hidden="true">
        {prefix}
        {text}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
    </span>
  )
}
