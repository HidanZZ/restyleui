"use client"

import { useCallback, useRef } from "react"
import type { Action } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"
import { useScrollProgress } from "@/registry/restyle/hooks/use-scroll-progress"

export type ScrollVideoRevealProps = {
  /** Short clip, muted, encoded with frequent keyframes so seeking stays smooth. */
  src?: string
  poster?: string
  /** Accessible description of the clip. */
  alt?: string
  title?: string
  /** Pill under the headline. */
  action?: Action
  className?: string
}

type Playhead = { progress: number; current: number; frame: number }

function ArrowIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300 ease-kit group-hover:translate-x-1 motion-reduce:transition-none rtl:rotate-180"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

/**
 * A full-screen clip scrubbed by scroll. Progress runs from the section top at
 * 70% of the viewport to 10% above it; the playhead eases toward the target
 * (0.12 per frame) and follows the scroll backward too. With reduced motion the
 * clip plays once when 40% of it is visible.
 */
export function ScrollVideoReveal({
  src = "/kits/norma/reveal.mp4",
  poster = "/kits/norma/reveal-poster.webp",
  alt = "A hand sets a brushed steel disc down on a walnut table.",
  title = "Take yours home.",
  action = { label: "Order", href: "#" },
  className,
}: ScrollVideoRevealProps) {
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement | null>(null)
  const video = useRef<HTMLVideoElement | null>(null)
  const playhead = useRef<Playhead>({ progress: 0, current: 0, frame: 0 })

  // Ease the playhead toward the scroll target, then stop until the next scroll.
  const kick = useCallback(() => {
    const state = playhead.current
    if (state.frame) return
    const tick = () => {
      const clip = video.current
      state.frame = 0
      if (!clip || !Number.isFinite(clip.duration) || clip.duration <= 0) return
      const target = state.progress * clip.duration
      state.current += (target - state.current) * 0.12
      if (Math.abs(target - state.current) < 0.002) state.current = target
      if (clip.readyState >= 2 && Math.abs(clip.currentTime - state.current) > 0.004) clip.currentTime = state.current
      if (state.current !== target) state.frame = requestAnimationFrame(tick)
    }
    state.frame = requestAnimationFrame(tick)
  }, [])

  const scrollRef = useScrollProgress<HTMLElement>({
    cssVar: false,
    onProgress: (cover) => {
      const node = section.current
      if (reduced || !node) return
      // "cover" progress back to the section top, then the source window: 0.7vh down to -0.1vh.
      const vh = window.innerHeight
      const top = vh - cover * (vh + node.offsetHeight)
      playhead.current.progress = Math.min(1, Math.max(0, (0.7 * vh - top) / (0.8 * vh)))
      kick()
    },
  })

  const sectionRef = useCallback(
    (node: HTMLElement | null) => {
      section.current = node
      scrollRef(node)
    },
    [scrollRef]
  )

  const videoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      video.current = node
      if (!node) return
      if (reduced) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return
            node.play().catch(() => {})
            observer.disconnect()
          },
          { threshold: 0.4 }
        )
        observer.observe(node)
        return () => observer.disconnect()
      }
      // Some mobile browsers only paint seeked frames after one play() call.
      let live = true
      node
        .play()
        .then(() => live && node.pause())
        .catch(() => {})
      return () => {
        live = false
        cancelAnimationFrame(playhead.current.frame)
        playhead.current.frame = 0
      }
    },
    [reduced]
  )

  return (
    <section ref={sectionRef} className={cn("relative h-svh overflow-hidden bg-background", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={alt}
        muted
        playsInline
        preload="auto"
        onLoadedData={kick}
        className="size-full object-cover object-[42%_50%]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[14vh] bg-linear-to-b from-background to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[48vh] bg-linear-to-t from-background from-35% to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-gutter pb-10 sm:pb-14">
        <h2 className="text-center font-display text-(length:--norma-text-h2) leading-(--norma-leading-heading) font-semibold tracking-(--norma-tracking-heading) text-balance text-foreground">
          {title}
        </h2>
        {action && (
          <a
            href={action.href}
            className="group pointer-events-auto inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-[background-color,scale] duration-200 ease-kit hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.99] motion-reduce:transition-none"
          >
            {action.label}
            <ArrowIcon />
          </a>
        )}
      </div>
    </section>
  )
}
