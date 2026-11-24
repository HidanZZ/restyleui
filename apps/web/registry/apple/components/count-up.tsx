"use client"

import type { CountUpProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useCountUp } from "@/registry/restyle/hooks/use-count-up"

// Ease-in-out cubic, close to the kit's gallery curve. Module level keeps its identity stable.
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Designed: a stat figure in the tile headline style (56px, 48px and 32px by
 * breakpoint), semibold display type with tabular digits.
 */
export function CountUp({ value, from = 0, duration = 1600, format, prefix, suffix, className }: CountUpProps) {
  const { ref, text, final } = useCountUp({ value, from, duration, format, easing: easeInOut })
  return (
    <span
      ref={ref}
      className={cn(
        "inline-block font-display font-semibold text-foreground tabular-nums antialiased",
        "text-(length:--apple-tile-title-size-mobile) leading-(--apple-tile-title-line-height-mobile) tracking-(--apple-tile-title-letter-spacing-mobile)",
        "min-[735px]:text-(length:--apple-tile-title-size-tablet) min-[735px]:leading-(--apple-tile-title-line-height-tablet) min-[735px]:tracking-(--apple-tile-title-letter-spacing-tablet)",
        "min-[1069px]:text-(length:--apple-tile-title-size) min-[1069px]:leading-(--apple-tile-title-line-height) min-[1069px]:tracking-(--apple-tile-title-letter-spacing)",
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
