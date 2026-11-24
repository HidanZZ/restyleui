"use client"

import type { CountUpProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useCountUp } from "@/registry/restyle/hooks/use-count-up"

/**
 * A display number in Inter 500 with the H1 tracking. Prefix and suffix drop
 * to the kit's dark grey so the figure carries the message.
 */
export function CountUp({ value, from = 0, duration = 1800, format, prefix, suffix, className }: CountUpProps) {
  const { ref, text, final } = useCountUp({
    value,
    from,
    duration,
    format,
    // The kit's cubic-bezier(.16, 1, .3, 1) is close to a quintic ease-out.
    easing: (t) => 1 - Math.pow(1 - t, 5),
  })
  return (
    <span
      ref={ref}
      className={cn(
        "inline-block font-display text-[length:var(--mckp-type-h1)] font-medium leading-(--mckp-type-h1-line) tracking-(--mckp-type-h1-tracking) text-foreground tabular-nums",
        className
      )}
    >
      <span aria-hidden="true">
        {prefix && <span className="text-(--mckp-ink-dim)">{prefix}</span>}
        {text}
        {suffix && <span className="text-(--mckp-ink-dim)">{suffix}</span>}
      </span>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
    </span>
  )
}
