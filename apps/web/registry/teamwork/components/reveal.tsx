"use client"

import { Children } from "react"
import type { RevealProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

// The source's staged hero entrance: a short rise with a fade, cubic ease-out, 150ms between steps.
const motion =
  "transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] delay-(--reveal-delay) motion-reduce:transition-none"

export function Reveal({ children, delay = 0, stagger = false, className }: RevealProps) {
  const { ref, visible, delayStyle } = useReveal({ delay, stagger: 150 })

  if (!stagger) {
    return (
      <div
        ref={ref}
        data-visible={visible || undefined}
        style={delayStyle()}
        className={cn(motion, "translate-y-3 opacity-0 data-visible:translate-y-0 data-visible:opacity-100", className)}
      >
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} data-visible={visible || undefined} className={cn("group", className)}>
      {Children.toArray(children).map((child, i) => (
        <div
          key={i}
          style={delayStyle(i)}
          className={cn(motion, "translate-y-3 opacity-0 group-data-visible:translate-y-0 group-data-visible:opacity-100")}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
