"use client"

/**
 * useMarquee: an endless horizontal scroll at a fixed speed in px per second.
 *
 * Measures one copy of the content and the visible width, returns how many
 * copies to render so the row never shows a gap, and moves the track by one
 * copy width per loop with the Web Animations API (no keyframes to define).
 * It measures again when the content or the container changes size.
 *
 * Pauses while the pointer is over it or focus is inside it (`pauseOnHover`),
 * and while it is off screen. With reduced motion it does not move and
 * returns `copies: 1` and `moving: false`; let the row scroll or wrap then.
 *
 * Markup rules: the track is `flex w-max` and holds `copies` children, each a
 * full copy of the content with its trailing gap inside it (`pr-*`, not `gap`
 * on the track), so one copy width is exactly one loop. Mark every copy after
 * the first `aria-hidden` and `inert` so screen readers and Tab see the
 * content once.
 *
 * Signature:
 *   useMarquee(options?: {
 *     speed?: number                  // px per second, default 40
 *     direction?: "left" | "right"    // default "left"
 *     pauseOnHover?: boolean          // default true
 *   }): {
 *     rootRef: (node: HTMLElement | null) => void
 *     trackRef: (node: HTMLElement | null) => void
 *     copies: number
 *     moving: boolean
 *   }
 *
 * Usage:
 *   const { rootRef, trackRef, copies, moving } = useMarquee({ speed, direction, pauseOnHover })
 *   <div ref={rootRef} className={moving ? "overflow-hidden" : "overflow-x-auto"}>
 *     <div ref={trackRef} className="flex w-max">
 *       {Array.from({ length: copies }, (_, i) => (
 *         <div key={i} aria-hidden={i > 0 || undefined} inert={i > 0} className="flex shrink-0 items-center gap-12 pr-12">
 *           {children}
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 */
import { useEffect, useState } from "react"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

export type MarqueeOptions = {
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
}

export function useMarquee({ speed = 40, direction = "left", pauseOnHover = true }: MarqueeOptions = {}) {
  const [root, setRoot] = useState<HTMLElement | null>(null)
  const [track, setTrack] = useState<HTMLElement | null>(null)
  const [copies, setCopies] = useState(2)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root || !track || reduced) return
    let animation: Animation | undefined
    let duration = 0
    let hovered = false
    let focused = false
    let inView = true

    const update = () => {
      if (!animation) return
      if (hovered || focused || !inView) animation.pause()
      else animation.play()
    }

    const measure = () => {
      const copy = track.firstElementChild as HTMLElement | null
      const width = copy?.getBoundingClientRect().width ?? 0
      if (width === 0) return
      setCopies(Math.max(2, Math.ceil(root.clientWidth / width) + 1))
      // Keep the position through a re-measure so the row does not jump.
      const ratio = animation && duration ? (Number(animation.currentTime) % duration) / duration : 0
      animation?.cancel()
      duration = (width / Math.max(1, speed)) * 1000
      animation = track.animate(
        [{ transform: "translate3d(0, 0, 0)" }, { transform: `translate3d(${-width}px, 0, 0)` }],
        { duration, iterations: Infinity, direction: direction === "right" ? "reverse" : "normal" }
      )
      animation.currentTime = ratio * duration
      update()
    }

    const resize = new ResizeObserver(measure)
    resize.observe(root)
    if (track.firstElementChild) resize.observe(track.firstElementChild)
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    })
    visibility.observe(root)

    const enter = () => {
      hovered = pauseOnHover
      update()
    }
    const leave = () => {
      hovered = false
      update()
    }
    const focusIn = () => {
      focused = pauseOnHover
      update()
    }
    const focusOut = (event: FocusEvent) => {
      focused = pauseOnHover && root.contains(event.relatedTarget as Node | null)
      update()
    }
    root.addEventListener("pointerenter", enter)
    root.addEventListener("pointerleave", leave)
    root.addEventListener("focusin", focusIn)
    root.addEventListener("focusout", focusOut)

    return () => {
      resize.disconnect()
      visibility.disconnect()
      root.removeEventListener("pointerenter", enter)
      root.removeEventListener("pointerleave", leave)
      root.removeEventListener("focusin", focusIn)
      root.removeEventListener("focusout", focusOut)
      animation?.cancel()
    }
  }, [root, track, speed, direction, pauseOnHover, reduced])

  return {
    rootRef: setRoot as (node: HTMLElement | null) => void,
    trackRef: setTrack as (node: HTMLElement | null) => void,
    copies: reduced ? 1 : copies,
    moving: !reduced,
  }
}
