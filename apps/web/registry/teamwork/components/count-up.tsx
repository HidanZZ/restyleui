"use client"

import type { CountUpProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useCountUp } from "@/registry/restyle/hooks/use-count-up"

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// The source's odometer: mono digits in fixed cells, each rolling a 0-9 column into place.
export function CountUp({ value, from = 0, duration = 1800, format, prefix, suffix, className }: CountUpProps) {
  const { ref, text, final } = useCountUp({ value, from, duration, format, easing: easeOutCubic })
  const chars = `${prefix ?? ""}${text}${suffix ?? ""}`.split("")

  return (
    <span ref={ref} className={cn("inline-block font-mono text-[28px] leading-10 [font-kerning:none]", className)}>
      <span aria-hidden className="inline-flex items-start whitespace-nowrap">
        {chars.map((char, i) => {
          // Keyed from the right, so a cell keeps rolling while the number grows on the left.
          const key = chars.length - i
          const digit = Number(char)
          if (char === " " || Number.isNaN(digit)) {
            return (
              <span key={key} className="inline-flex h-[1lh] min-w-[0.42em] justify-center">
                {char}
              </span>
            )
          }
          return (
            <span key={key} className="relative inline-block h-[1lh] w-[1ch] overflow-hidden">
              <span
                className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] motion-reduce:transition-none"
                style={{ transform: `translateY(${-digit * 10}%)` }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="block h-[1lh] text-center">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          )
        })}
      </span>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
    </span>
  )
}
