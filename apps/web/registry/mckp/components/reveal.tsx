"use client"

import { Children } from "react"
import type { RevealProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

// The clone's data-reveal: up 50px and fade in over 0.9s, staged 100ms apart.
const motion =
  "translate-y-[50px] opacity-0 transition-[opacity,translate] duration-900 ease-kit delay-(--reveal-delay) motion-reduce:transition-none"

export function Reveal({ children, delay = 0, stagger = false, className }: RevealProps) {
  const { ref, visible, delayStyle } = useReveal({
    delay,
    stagger: 100,
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  })

  if (!stagger) {
    return (
      <div
        ref={ref}
        data-visible={visible || undefined}
        style={delayStyle()}
        className={cn(motion, "data-visible:translate-y-0 data-visible:opacity-100", className)}
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
          className={cn(motion, "group-data-visible/reveal:translate-y-0 group-data-visible/reveal:opacity-100")}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
