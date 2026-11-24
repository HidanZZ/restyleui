"use client"

import { Children } from "react"
import type { RevealProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

/** Source reveal: blur 10px to 0, 12px lift, fade in, 700ms on the signature curve. */
const motion =
  "translate-y-3 opacity-0 blur-[10px] transition-[opacity,filter,translate] duration-700 ease-kit delay-(--reveal-delay) motion-reduce:transition-none"

/** Norma reveal: content blurs into focus once, at 15% in view. Stagger steps 80ms. */
export function Reveal({ children, delay = 0, stagger = false, className }: RevealProps) {
  const { ref, visible, delayStyle } = useReveal({ delay, stagger: 80, rootMargin: "0px 0px -8% 0px" })

  if (!stagger) {
    return (
      <div
        ref={ref}
        data-visible={visible || undefined}
        style={delayStyle()}
        className={cn(motion, "data-visible:translate-y-0 data-visible:opacity-100 data-visible:blur-none", className)}
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
            "group-data-visible/reveal:translate-y-0 group-data-visible/reveal:opacity-100 group-data-visible/reveal:blur-none"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
