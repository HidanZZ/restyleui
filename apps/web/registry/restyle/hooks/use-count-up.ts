"use client"

/**
 * useCountUp: a number that counts from `from` to `value` when it scrolls
 * into view, eased, formatted with Intl.NumberFormat.
 *
 * The server render, the first client render and reduced motion all show the
 * final value, so the real number is in the HTML. After hydration an element
 * below the fold switches to `from` and counts once it enters the viewport;
 * one already in view counts at once. It counts once.
 *
 * Unless `format` sets fraction digits, it shows as many decimals as `value`
 * has, so 98.6 counts as 0.0, 0.1, ... 98.6. `locale` defaults to "en-US" so
 * server and browser format alike.
 *
 * For screen readers, render `final` in a visually hidden element and hide the
 * moving `text` with `aria-hidden`, so the number is read once.
 *
 * Signature:
 *   useCountUp<T extends Element = HTMLSpanElement>(options: {
 *     value: number
 *     from?: number                        // default 0
 *     duration?: number                    // ms, default 1600
 *     format?: Intl.NumberFormatOptions
 *     locale?: string                      // default "en-US"
 *     easing?: (t: number) => number       // default ease-out expo
 *   }): { ref: (node: T | null) => void; text: string; final: string }
 *
 * Usage:
 *   const { ref, text, final } = useCountUp({ value: 12500, format: { notation: "compact" } })
 *   <span ref={ref} className="tabular-nums">
 *     <span aria-hidden>{prefix}{text}{suffix}</span>
 *     <span className="sr-only">{prefix}{final}{suffix}</span>
 *   </span>
 */
import { useEffect, useEffectEvent, useMemo, useState } from "react"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

export type CountUpOptions = {
  value: number
  from?: number
  duration?: number
  format?: Intl.NumberFormatOptions
  locale?: string
  easing?: (t: number) => number
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function useCountUp<T extends Element = HTMLSpanElement>({
  value,
  from = 0,
  duration = 1600,
  format,
  locale = "en-US",
  easing = easeOutExpo,
}: CountUpOptions) {
  const [node, setNode] = useState<T | null>(null)
  // null shows the final value.
  const [current, setCurrent] = useState<number | null>(null)
  const reduced = useReducedMotion()

  const formatKey = JSON.stringify(format ?? {})
  const formatter = useMemo(() => {
    const options: Intl.NumberFormatOptions = JSON.parse(formatKey)
    const decimals = (String(value).split(".")[1] ?? "").length
    const fixed = options.minimumFractionDigits === undefined && options.maximumFractionDigits === undefined
    return new Intl.NumberFormat(
      locale,
      fixed ? { ...options, minimumFractionDigits: decimals, maximumFractionDigits: decimals } : options
    )
  }, [formatKey, locale, value])

  const ease = useEffectEvent((t: number) => easing(t))

  useEffect(() => {
    if (!node || reduced) return
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setCurrent(from)
          return
        }
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / Math.max(1, duration))
          setCurrent(t >= 1 ? null : from + (value - from) * ease(t))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [node, reduced, value, from, duration])

  return {
    ref: setNode as (node: T | null) => void,
    text: formatter.format(reduced || current === null ? value : current),
    final: formatter.format(value),
  }
}
