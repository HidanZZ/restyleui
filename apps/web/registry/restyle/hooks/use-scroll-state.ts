"use client"

/**
 * useScrollState: whether the page has scrolled past a threshold, and which
 * way it last moved. Drives sticky navbars: a border or blur once scrolled,
 * and hide-on-scroll-down, show-on-scroll-up.
 *
 * Reads `window.scrollY` once per animation frame and re-renders only when
 * `scrolled` or `direction` changes. Moves smaller than `tolerance` px are
 * ignored, so trackpad jitter does not flip the direction. Near the top the
 * direction is always "up", so a hiding navbar shows again. On the server and
 * on the first client render it returns `{ scrolled: false, direction: "up" }`.
 *
 * Signature:
 *   useScrollState(options?: { threshold?: number; tolerance?: number }):
 *     { scrolled: boolean; direction: "up" | "down" }
 *   threshold: px from the top before `scrolled` is true. Default 8.
 *   tolerance: px of travel before the direction changes. Default 6.
 *
 * Usage:
 *   const { scrolled, direction } = useScrollState({ threshold: 24 })
 *   const hidden = direction === "down" && !menuOpen
 *   <header
 *     data-scrolled={scrolled || undefined}
 *     data-hidden={hidden || undefined}
 *     className="sticky top-0 transition-transform data-hidden:-translate-y-full motion-reduce:transition-none"
 *   />
 */
import { useEffect, useState } from "react"

export type ScrollState = { scrolled: boolean; direction: "up" | "down" }

export function useScrollState({
  threshold = 8,
  tolerance = 6,
}: { threshold?: number; tolerance?: number } = {}): ScrollState {
  const [state, setState] = useState<ScrollState>({ scrolled: false, direction: "up" })

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = Math.max(0, window.scrollY)
      const delta = y - lastY
      setState((prev) => {
        const scrolled = y > threshold
        let direction = prev.direction
        if (y <= threshold) direction = "up"
        else if (Math.abs(delta) >= tolerance) direction = delta > 0 ? "down" : "up"
        if (scrolled === prev.scrolled && direction === prev.direction) return prev
        return { scrolled, direction }
      })
      if (y <= threshold || Math.abs(delta) >= tolerance) lastY = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [threshold, tolerance])

  return state
}
