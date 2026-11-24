"use client"

import { Children } from "react"
import type { RevealProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

// Designed: a calm fade that rises 30px over one second, staged 100ms apart.
const motion = "transition-[opacity,translate] duration-1000 ease-kit-in-out delay-(--reveal-delay) motion-reduce:transition-none"

export function Reveal({ children, delay = 0, stagger = false, className }: RevealProps) {
  const { ref, visible, delayStyle } = useReveal({ delay, stagger: 100 })

  if (!stagger) {
    return (
      <div
        ref={ref}
        data-visible={visible || undefined}
        style={delayStyle()}
        className={cn(motion, "translate-y-[30px] opacity-0 data-visible:translate-y-0 data-visible:opacity-100", className)}
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
          className={cn(motion, "translate-y-[30px] opacity-0 group-data-visible:translate-y-0 group-data-visible:opacity-100")}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
