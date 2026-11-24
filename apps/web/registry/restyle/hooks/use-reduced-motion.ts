"use client"

/**
 * useReducedMotion: whether the user asked the system for less motion.
 *
 * Follows `(prefers-reduced-motion: reduce)` live. Returns `false` on the
 * server and during hydration, then the real value, so markup always matches.
 * The other Restyle hooks use it to skip their animation and show the end
 * state at once.
 *
 * Signature:
 *   useReducedMotion(): boolean
 *
 * Usage:
 *   const reduced = useReducedMotion()
 *   return <div className={reduced ? "" : "transition-transform"} />
 */
import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
