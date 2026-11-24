"use client"

import { useCallback, useEffect, useState } from "react"
import { cn } from "@/registry/restyle/lib/utils"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

export type LibraryTile = {
  /** Device name, shown on hover (always on phones). */
  label: string
  /** Short silent 4:3 loop. */
  video: string
  /** First frame of the loop, shown until the clip plays. */
  poster?: string
  /** Optional link; the tile renders as a plain block without it. */
  href?: string
}

export type LibraryPreviewProps = {
  /** Section heading; `\n` breaks the line. */
  title?: string
  subtitle?: string
  tiles?: LibraryTile[]
  /** How many tiles to show, picked at random on load. `null` shows every tile in order. */
  pick?: number | null
  className?: string
}

const scene = (file: string, label: string): LibraryTile => ({
  label,
  video: `/kits/mckp/library-${file}.mp4`,
  poster: `/kits/mckp/library-${file}-poster.webp`,
})

const defaultTiles: LibraryTile[] = [
  scene("display-pedestal", "Studio Display"),
  scene("display-turn", "Studio Display"),
  scene("fold-phone", "Fold Phone"),
  scene("laptop-desk", "Laptop"),
  scene("laptop-fog", "Laptop"),
  scene("laptop-open", "Laptop"),
  scene("phone-cradle", "Phone"),
  scene("phone-float", "Phone"),
  scene("phone-hand", "Phone"),
  scene("phone-stack", "Phone"),
  scene("tablet-angle", "Tablet"),
  scene("tablet-rock", "Tablet"),
]

// ---------------------------------------------------------------------------
// Play queue, shared by every tile on the page: a clip joins the queue when it
// is at least half on screen and leaves it (paused) when it scrolls away.
// Clips start one at a time, 100 ms apart, so a screen of tiles never decodes
// all at once.
// ---------------------------------------------------------------------------

const queue: HTMLVideoElement[] = []
let drainTimer = 0

function drain() {
  if (drainTimer) return
  const next = queue.shift()
  if (!next) return
  if (next.paused) next.play().catch(() => {})
  drainTimer = window.setTimeout(() => {
    drainTimer = 0
    drain()
  }, 100)
}

function enqueue(video: HTMLVideoElement) {
  if (!video.paused || queue.includes(video)) return
  queue.push(video)
  drain()
}

function dequeue(video: HTMLVideoElement) {
  const index = queue.indexOf(video)
  if (index !== -1) queue.splice(index, 1)
  video.pause()
}

/** Shuffle, then take `count` tiles, keeping neighbouring labels different where possible. */
function pickTiles(tiles: LibraryTile[], count: number) {
  const pool = [...tiles]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picked: LibraryTile[] = []
  while (picked.length < count && pool.length) {
    const previous = picked[picked.length - 1]?.label
    const index = pool.findIndex((tile) => tile.label !== previous)
    picked.push(pool.splice(index === -1 ? 0 : index, 1)[0])
  }
  return picked
}

/** The random pick runs on the client only, after hydration, so server and client markup match. */
function usePickedTiles(tiles: LibraryTile[], pick: number | null) {
  const [picked, setPicked] = useState<LibraryTile[] | null>(null)
  useEffect(() => {
    if (pick === null) return
    const frame = requestAnimationFrame(() => setPicked(pickTiles(tiles, pick)))
    return () => cancelAnimationFrame(frame)
  }, [tiles, pick])
  return pick === null ? tiles : picked
}

// Source reveal: 50px rise and fade, 0.9s, staggered through --reveal-delay.
const reveal =
  "translate-y-[50px] opacity-0 transition-[opacity,translate] duration-900 ease-kit delay-(--reveal-delay) data-visible:translate-y-0 data-visible:opacity-100 motion-reduce:transition-none"
const headReveal =
  "translate-y-[50px] opacity-0 transition-[opacity,translate] duration-900 ease-kit delay-(--reveal-delay) group-data-visible/head:translate-y-0 group-data-visible/head:opacity-100 motion-reduce:transition-none"

const tileBox = "relative block aspect-[4/3] overflow-hidden rounded-kit-lg"

function Tile({ tile, index }: { tile: LibraryTile; index: number }) {
  const reduced = useReducedMotion()
  const { ref, visible, delayStyle } = useReveal<HTMLElement>({
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
    stagger: 60,
  })

  // Load the clip 200px before it enters, play it through the queue while half
  // of it is on screen. Reduced motion keeps the poster (the first frame).
  const videoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video || reduced) return
      video.muted = true
      let onScreen = false
      const loader = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          loader.disconnect()
          video.src = tile.video
          if (onScreen) enqueue(video)
        },
        { rootMargin: "200px" }
      )
      const playback = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting
          if (!onScreen) dequeue(video)
          else if (video.getAttribute("src")) enqueue(video)
        },
        { threshold: 0.5 }
      )
      loader.observe(video)
      playback.observe(video)
      return () => {
        loader.disconnect()
        playback.disconnect()
        dequeue(video)
      }
    },
    [tile.video, reduced]
  )

  const className = cn(tileBox, "group bg-(--mckp-surface) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", reveal)
  const content = (
    <>
      <video
        ref={videoRef}
        poster={tile.poster}
        aria-hidden="true"
        loop
        muted
        playsInline
        preload="none"
        className="block size-full object-cover"
      />
      <span className="absolute bottom-4 left-4 text-[13px] leading-5 text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none [@media(width<=768px)]:opacity-100">
        {tile.label}
      </span>
    </>
  )

  return tile.href ? (
    <a
      ref={ref}
      href={tile.href}
      data-visible={visible || undefined}
      style={delayStyle(index)}
      className={className}
    >
      {content}
    </a>
  ) : (
    <div ref={ref} data-visible={visible || undefined} style={delayStyle(index)} className={className}>
      {content}
    </div>
  )
}

export function LibraryPreview({
  title = "12 scenes, 5 devices\nand growing",
  subtitle = "New scenes land every month",
  tiles = defaultTiles,
  pick = 8,
  className,
}: LibraryPreviewProps) {
  const picked = usePickedTiles(tiles, pick)
  const {
    ref: headRef,
    visible: headVisible,
    delayStyle: headDelay,
  } = useReveal({ threshold: 0.12, rootMargin: "0px 0px -40px 0px", stagger: 120 })
  const lines = title.split("\n")

  return (
    <section className={cn("mx-auto max-w-kit px-gutter pt-section pb-(--mckp-section-y-sm)", className)}>
      <div
        ref={headRef}
        data-visible={headVisible || undefined}
        className="group/head mb-20 grid grid-cols-9 [@media(width<=1024px)]:mb-10 [@media(width<=1024px)]:grid-cols-1 [@media(width<=1024px)]:gap-4"
      >
        <h2
          style={headDelay(0)}
          className={cn(
            "col-[2/7] font-display text-[length:var(--mckp-type-h2)] leading-(--mckp-type-h2-line) font-normal tracking-(--mckp-type-h2-tracking) text-foreground [@media(width<=1024px)]:col-[1]",
            headReveal
          )}
        >
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h2>
        {subtitle && (
          <p
            style={headDelay(1)}
            className={cn(
              "col-[7/9] self-end text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-(--mckp-ink-dim) [@media(width<=1024px)]:col-[1]",
              headReveal
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-(--mckp-tile-gap) [@media(width<=1024px)]:grid-cols-3 [@media(width<=768px)]:grid-cols-1">
        {picked
          ? picked.map((tile, i) => <Tile key={tile.video} tile={tile} index={i} />)
          : // Same boxes before the pick lands, so the grid keeps its height.
            Array.from({ length: Math.min(pick ?? tiles.length, tiles.length) }, (_, i) => (
              <div key={i} aria-hidden="true" className={tileBox} />
            ))}
      </div>
    </section>
  )
}
