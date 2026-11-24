"use client"

/**
 * useScrollProgress: how far an element has travelled through the viewport,
 * from 0 to 1, for scroll-scrubbed video, parallax and progress bars.
 *
 * Measures once per animation frame while the page scrolls or resizes. It
 * never re-renders: it writes the value to a CSS variable on the element
 * (default `--scroll-progress`, unitless) and calls `onProgress`, only when the
 * value changes.
 *
 * Ranges:
 *   "cover"   (default) 0 when the element's top meets the viewport bottom,
 *             1 when its bottom leaves the viewport top. Parallax.
 *   "contain" 0 when the element starts filling the viewport, 1 when it stops.
 *             For a tall section with a `sticky` child: 0 when its top reaches
 *             the viewport top, 1 when its bottom reaches the viewport bottom.
 *             Scroll-scrubbed video and pinned scenes.
 *
 * With reduced motion it stops tracking and reports `reducedMotionValue` once
 * (default 1, the end state). Pass `null` to keep tracking, for example for a
 * reading progress bar that only changes a width.
 *
 * Signature:
 *   useScrollProgress<T extends HTMLElement = HTMLDivElement>(options?: {
 *     range?: "cover" | "contain"
 *     cssVar?: string | false              // default "--scroll-progress"
 *     onProgress?: (progress: number) => void
 *     reducedMotionValue?: number | null   // default 1
 *   }): (node: T | null) => void
 *
 * Usage (parallax, no JS per frame beyond the variable):
 *   const ref = useScrollProgress({ reducedMotionValue: 0.5 })
 *   <div ref={ref}>
 *     <img className="translate-y-[calc((var(--scroll-progress,0.5)_-_0.5)_*_-120px)]" src={src} alt="" />
 *   </div>
 *
 * Usage (scrub a video through a pinned section):
 *   const video = useRef<HTMLVideoElement>(null)
 *   const ref = useScrollProgress({
 *     range: "contain",
 *     onProgress: (p) => {
 *       const v = video.current
 *       if (v?.duration) v.currentTime = p * v.duration
 *     },
 *   })
 *   <section ref={ref} className="h-[300vh]">
 *     <div className="sticky top-0 h-svh">
 *       <video ref={video} src={src} muted playsInline preload="auto" />
 *     </div>
 *   </section>
 */
import { useEffect, useEffectEvent, useState } from "react"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

export type ScrollProgressOptions = {
  range?: "cover" | "contain"
  cssVar?: string | false
  onProgress?: (progress: number) => void
  reducedMotionValue?: number | null
}

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>({
  range = "cover",
  cssVar = "--scroll-progress",
  onProgress,
  reducedMotionValue = 1,
}: ScrollProgressOptions = {}) {
  const [node, setNode] = useState<T | null>(null)
  const reduced = useReducedMotion()

  const report = useEffectEvent((element: T, progress: number) => {
    if (cssVar) element.style.setProperty(cssVar, progress.toFixed(4))
    onProgress?.(progress)
  })

  useEffect(() => {
    if (!node) return
    if (reduced && reducedMotionValue !== null) {
      report(node, reducedMotionValue)
      return
    }

    let frame = 0
    let last = -1
    const measure = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight
      let progress: number
      if (range === "cover") {
        progress = (vh - rect.top) / (vh + rect.height)
      } else {
        // Top position at 0 and at 1. A tall element scrolls past the viewport,
        // a short one travels inside it.
        const start = Math.max(0, vh - rect.height)
        const end = Math.min(0, vh - rect.height)
        progress = start === end ? (rect.top <= start ? 1 : 0) : (start - rect.top) / (start - end)
      }
      progress = Math.min(1, Math.max(0, progress))
      if (progress !== last) {
        last = progress
        report(node, progress)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [node, range, reduced, reducedMotionValue])

  return setNode as (node: T | null) => void
}
