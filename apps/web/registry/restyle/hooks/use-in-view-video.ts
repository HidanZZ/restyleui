"use client"

/**
 * useInViewVideo: plays a muted background video while it is in view and
 * pauses it when it leaves, when the tab is hidden, or when the user pauses it.
 *
 * Sets `muted` on the element (React does not render the attribute, and
 * browsers only autoplay muted video). With reduced motion it never starts on
 * its own and the poster shows; `toggle()` still plays it on request. A user
 * pause sticks: scrolling back into view does not restart it. Render a
 * play/pause button with `toggle` for videos longer than 5 seconds.
 *
 * Signature:
 *   useInViewVideo(options?: { threshold?: number; rootMargin?: string }): {
 *     ref: (node: HTMLVideoElement | null) => void
 *     playing: boolean
 *     toggle: () => void
 *   }
 *   threshold: share of the video in view before it plays. Default 0.25.
 *
 * Usage:
 *   const { ref, playing, toggle } = useInViewVideo()
 *   <video ref={ref} src={src} poster={poster} loop muted playsInline preload="metadata" aria-label={alt} />
 *   <button type="button" onClick={toggle}>{playing ? "Pause" : "Play"}</button>
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

export function useInViewVideo({
  threshold = 0.25,
  rootMargin = "0px",
}: { threshold?: number; rootMargin?: string } = {}) {
  // The element lives in a ref (mutated in effects and handlers); `node` state
  // only re-runs the effect when the element attaches or changes.
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [node, setNode] = useState<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const reduced = useReducedMotion()
  // Set by toggle(), read by the observers: the user's choice wins over autoplay.
  const userPaused = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    let inView = false

    const sync = () => {
      if (!inView || document.hidden) video.pause()
      else if (video.paused && !userPaused.current && !reduced) video.play().catch(() => {})
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        sync()
      },
      { threshold, rootMargin }
    )
    observer.observe(video)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    document.addEventListener("visibilitychange", sync)
    return () => {
      observer.disconnect()
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      document.removeEventListener("visibilitychange", sync)
    }
  }, [node, threshold, rootMargin, reduced])

  const toggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      userPaused.current = false
      video.play().catch(() => {})
    } else {
      userPaused.current = true
      video.pause()
    }
  }, [])

  const ref = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element
    setNode(element)
  }, [])

  return { ref, playing, toggle }
}
