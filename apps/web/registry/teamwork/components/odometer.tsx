"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { cn } from "@/registry/restyle/lib/utils"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

export type OdometerProps = {
  /** Whole number to roll to. */
  value?: number
  /** Metric label above the number. Pass an empty string for the number only. */
  label?: string
  prefix?: string
  suffix?: string
  /** Total roll time in ms, cascade included. */
  duration?: number
  className?: string
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

// One-pixel dotted frame (1px dot, 3px period) drawn with backgrounds, as in the source stat cells.
const DOTS = "color-mix(in srgb, var(--input) 60%, transparent)"
const H = `repeating-linear-gradient(90deg, ${DOTS} 0 1px, transparent 1px 3px)`
const V = `repeating-linear-gradient(180deg, ${DOTS} 0 1px, transparent 1px 3px)`
const dottedFrame: CSSProperties = {
  backgroundImage: `${H}, ${H}, ${V}, ${V}`,
  backgroundSize: "100% 1px, 100% 1px, 1px 100%, 1px 100%",
  backgroundPosition: "0 0, 0 100%, 0 0, 100% 0",
  backgroundRepeat: "no-repeat",
}

const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

export function Odometer({
  value = 48215906374,
  label = "Work items linked",
  prefix,
  suffix,
  duration = 1800,
  className,
}: OdometerProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()
  const final = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value))

  useEffect(() => {
    if (!node || reduced) return
    const columns = [...node.querySelectorAll<HTMLElement>("[data-odometer-column]")]
    if (columns.length === 0) return
    for (const column of columns) column.style.setProperty("--roll", "0")

    // Columns start left to right; each spins one full turn plus its digit, so they settle in a cascade.
    const stagger = Math.min(60, duration / 3 / columns.length)
    const run = Math.max(1, duration - stagger * (columns.length - 1))
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          let done = true
          columns.forEach((column, i) => {
            const t = Math.min(1, Math.max(0, (now - start - i * stagger) / run))
            const travel = 10 + Number(column.dataset.digit)
            column.style.setProperty("--roll", ((travel * easeOutCubic(t)) % 10).toFixed(4))
            if (t < 1) done = false
          })
          if (!done) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.2, rootMargin: "0px 0px -20% 0px" }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      columns.forEach((column) => column.style.removeProperty("--roll"))
    }
  }, [node, reduced, duration, final])

  return (
    <div
      ref={setNode}
      style={dottedFrame}
      className={cn(
        "flex min-w-0 flex-col items-start justify-between gap-6 bg-background p-8 text-foreground/90",
        label ? "h-60 max-md:h-45" : "w-fit",
        className
      )}
    >
      {label && <p className="font-display text-[20px] leading-[30px] tracking-[0.5px]">{label}</p>}
      <p className="font-mono text-(length:--teamwork-text-stat) leading-(--teamwork-leading-stat) whitespace-nowrap tabular-nums [font-kerning:none]">
        <span className="sr-only">
          {prefix}
          {final}
          {suffix}
        </span>
        <span aria-hidden className="inline-flex items-baseline leading-none">
          {prefix}
          {final.split("").map((char, i) =>
            /\d/.test(char) ? (
              <span key={i} className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-[-0.03em]">
                <span className="invisible">{char}</span>
                <span
                  data-odometer-column
                  data-digit={char}
                  style={{ "--digit": char } as CSSProperties}
                  className="absolute inset-x-0 top-0 flex translate-y-[calc(var(--roll,var(--digit))*-1em)] flex-col will-change-transform"
                >
                  {STRIP.map((digit, row) => (
                    <span key={row} className="flex h-[1em] items-center justify-center">
                      {digit}
                    </span>
                  ))}
                </span>
              </span>
            ) : (
              <span key={i} className="inline-flex min-w-[0.42em] items-center justify-center">
                {char}
              </span>
            )
          )}
          {suffix}
        </span>
      </p>
    </div>
  )
}
