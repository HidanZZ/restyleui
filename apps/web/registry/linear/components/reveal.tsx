"use client"

import { Children } from "react"
import type { RevealProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

// Source: the hero entrance. Resolves from a 10px blur and a 26% drop (capped
// at 24px for tall blocks) over 750ms, staggered 90ms, on the entrance curve.
const motion =
  "transition-[opacity,filter,translate] duration-[750ms] ease-(--linear-ease-entrance) delay-(--reveal-delay) motion-reduce:transition-none"
const hidden = "translate-y-[min(26%,1.5rem)] opacity-0 blur-[10px]"

export function Reveal({ children, delay = 0, stagger = false, className }: RevealProps) {
  const { ref, visible, delayStyle } = useReveal({ delay, stagger: 90 })

  if (!stagger) {
    return (
      <div
        ref={ref}
        data-visible={visible || undefined}
        style={delayStyle()}
        className={cn(motion, hidden, "data-visible:translate-y-0 data-visible:opacity-100 data-visible:blur-[0px]", className)}
      >
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} data-visible={visible || undefined} className={cn("group/reveal", className)}>
      {Children.toArray(children).map((child, i) => (
        <div
          key={i}
          style={delayStyle(i)}
          className={cn(
            motion,
            hidden,
            "group-data-visible/reveal:translate-y-0 group-data-visible/reveal:opacity-100 group-data-visible/reveal:blur-[0px]"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
