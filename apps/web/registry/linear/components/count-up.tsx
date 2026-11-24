"use client"

import type { CountUpProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useCountUp } from "@/registry/restyle/hooks/use-count-up"

// Ease-out cubic, close to the hero entrance curve. Module level keeps its identity stable.
const easeEntrance = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Designed: a stat figure in the title scale (48px, 40px on small screens),
 * medium weight, tight tracking and tabular digits. Prefix and suffix sit in
 * the quaternary tone, like the source's secondary marks.
 */
export function CountUp({ value, from = 0, duration = 1600, format, prefix, suffix, className }: CountUpProps) {
  const { ref, text, final } = useCountUp({ value, from, duration, format, easing: easeEntrance })
  return (
    <span
      ref={ref}
      className={cn(
        "inline-block text-[length:var(--linear-title-5-size)] font-[510] leading-none tracking-[-0.022em] text-foreground tabular-nums sm:text-[length:var(--linear-title-6-size)]",
        className
      )}
    >
      <span aria-hidden>
        {prefix && <span className="text-(--linear-text-quaternary)">{prefix}</span>}
        {text}
        {suffix && <span className="text-(--linear-text-quaternary)">{suffix}</span>}
      </span>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
    </span>
  )
}
