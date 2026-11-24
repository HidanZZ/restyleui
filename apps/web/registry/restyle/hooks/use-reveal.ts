"use client"

/**
 * useReveal: tells an element when it scrolls into view, for entrance
 * animations and staged (staggered) entrances.
 *
 * Uses one IntersectionObserver per element. With `once` (the default) the
 * element stays visible after its first entrance; otherwise `visible` follows
 * the viewport. With reduced motion, `visible` is true at once. It is false
 * on the server, so style the hidden state with `data-visible` and keep it
 * cheap (opacity and translate). Pair the transition with
 * `motion-reduce:transition-none`.
 *
 * `delayStyle(index)` returns `{ "--reveal-delay": "<ms>" }`, which is
 * `delay + index * stagger`. Put it on each child and use
 * `delay-(--reveal-delay)` (transition) or
 * `[animation-delay:var(--reveal-delay)]` (keyframes) to stage them.
 *
 * Signature:
 *   useReveal<T extends Element = HTMLDivElement>(options?: {
 *     once?: boolean        // default true
 *     threshold?: number    // default 0.15
 *     rootMargin?: string   // default "0px 0px -10% 0px"
 *     delay?: number        // ms before the first item, default 0
 *     stagger?: number      // ms between items, default 80
 *   }): {
 *     ref: (node: T | null) => void
 *     visible: boolean
 *     delayStyle: (index?: number) => React.CSSProperties
 *   }
 *
 * Usage:
 *   const { ref, visible, delayStyle } = useReveal({ delay: 100 })
 *   <ul ref={ref} data-visible={visible || undefined} className="group">
 *     {items.map((item, i) => (
 *       <li
 *         key={item.id}
 *         style={delayStyle(i)}
 *         className="translate-y-4 opacity-0 transition duration-700 delay-(--reveal-delay)
 *           group-data-visible:translate-y-0 group-data-visible:opacity-100
 *           motion-reduce:transition-none"
 *       >
 *         {item.label}
 *       </li>
 *     ))}
 *   </ul>
 */
import { useCallback, useEffect, useState, type CSSProperties } from "react"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

export type RevealOptions = {
  once?: boolean
  threshold?: number
  rootMargin?: string
  delay?: number
  stagger?: number
}

export function useReveal<T extends Element = HTMLDivElement>({
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  delay = 0,
  stagger = 80,
}: RevealOptions = {}) {
  const [node, setNode] = useState<T | null>(null)
  const [inView, setInView] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, once, threshold, rootMargin])

  const delayStyle = useCallback(
    (index = 0) => ({ "--reveal-delay": `${delay + index * stagger}ms` }) as CSSProperties,
    [delay, stagger]
  )

  return { ref: setNode as (node: T | null) => void, visible: inView || reduced, delayStyle }
}
