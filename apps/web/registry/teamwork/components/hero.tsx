"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import type { HeroProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"
import { useScrollProgress } from "@/registry/restyle/hooks/use-scroll-progress"
import { Badge } from "@/registry/teamwork/components/badge"
import { Button } from "@/registry/teamwork/components/button"

// ---------------------------------------------------------------------------
// Icon field: app tiles, people and status chips linked by dotted graph lines.
// Positions are percentages of the stage, which crops at narrow widths.
// ---------------------------------------------------------------------------

type Tone = "blue" | "green" | "yellow" | "lilac"
type FieldNode = { x: number; y: number } & (
  | { kind: "tile"; name: string; size: number }
  | { kind: "avatar"; n: 1 | 2 | 3; tone: Tone; size: number }
  | { kind: "badge"; label: string; tone: "neutral" | Tone }
  | { kind: "glyph"; glyph: "plus" | "asterisk" | "squiggle" }
)

const tile = (name: string, x: number, y: number, size: number): FieldNode => ({ kind: "tile", name, x, y, size })
const person = (n: 1 | 2 | 3, tone: Tone, x: number, y: number, size: number): FieldNode => ({ kind: "avatar", n, tone, x, y, size })
const chip = (label: string, tone: "neutral" | Tone, x: number, y: number): FieldNode => ({ kind: "badge", label, tone, x, y })
const glyph = (name: "plus" | "asterisk" | "squiggle", x: number, y: number): FieldNode => ({ kind: "glyph", glyph: name, x, y })

const NODES: FieldNode[] = [
  // Top band
  tile("weave", 21, 10, 52),
  person(1, "green", 39, 11, 60),
  tile("spark", 55, 9, 56),
  tile("pulse", 29, 17, 44),
  person(3, "lilac", 51, 20, 40),
  tile("orbit", 63, 19, 44),
  glyph("plus", 67, 13),
  tile("kite", 74, 19, 56),
  tile("signal", 77, 8, 32),
  person(2, "yellow", 86, 24, 60),
  chip("On track", "blue", 95, 17),
  person(1, "yellow", 83, 13, 40),
  glyph("asterisk", 9, 21),
  chip("To do", "neutral", 13, 28),
  tile("anchor", 3, 31, 48),
  person(2, "green", 19, 20, 40),
  tile("prism", 19, 27, 28),
  // Left side
  tile("thread", 1, 44, 60),
  tile("bridge", 14, 42, 32),
  tile("circuit", 8, 50, 32),
  person(3, "blue", 15, 55, 60),
  tile("lattice", 4, 60, 48),
  chip("At risk", "yellow", 7, 68),
  tile("node", 18, 65, 56),
  person(1, "yellow", 16, 72, 60),
  tile("beacon", 2, 77, 56),
  // Right side
  person(3, "blue", 96, 31, 60),
  glyph("squiggle", 88, 56),
  tile("ripple", 86, 43, 44),
  tile("compass", 96, 46, 56),
  tile("bridge", 91, 61, 56),
  tile("signal", 84, 66, 40),
  // Bottom band
  tile("weave", 19, 86, 56),
  tile("pulse", 27, 80, 32),
  person(2, "yellow", 34, 81, 60),
  tile("prism", 41, 90, 52),
  tile("node", 49, 83, 60),
  tile("kite", 63, 78, 40),
  person(1, "lilac", 63, 88, 60),
  chip("Done", "green", 74, 87),
  tile("beacon", 75, 78, 52),
  tile("thread", 83, 75, 44),
  person(3, "lilac", 86, 87, 60),
  tile("circuit", 94, 75, 44),
  tile("anchor", 97, 88, 56),
  tile("lattice", 29, 93, 28),
]

// The stage is wider than tall, so horizontal distance counts for more.
const distance = (a: FieldNode, b: { x: number; y: number }) => Math.hypot((a.x - b.x) * 1.5, a.y - b.y)

// Center-out entrance: nodes near the middle pop first.
const DELAYS = NODES.map((node) => Math.round(120 + (distance(node, { x: 50, y: 50 }) / 90) * 1100))

// Each linked node connects to its two nearest linked neighbours.
const EDGES: [number, number][] = (() => {
  const seen = new Set<string>()
  const edges: [number, number][] = []
  NODES.forEach((node, i) => {
    if (node.kind === "glyph") return
    NODES.map((other, j) => ({ j, d: other.kind === "glyph" || i === j ? Infinity : distance(node, other) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        // Draw from the node that appears first.
        const [from, to] = DELAYS[i] <= DELAYS[j] ? [i, j] : [j, i]
        const key = `${from}-${to}`
        if (seen.has(key)) return
        seen.add(key)
        edges.push([from, to])
      })
  })
  return edges
})()

// A few connections carry a travelling highlight after the entrance.
const SHIMMER = EDGES.filter((_, i) => i % 7 === 3)

const AVATAR_TONES: Record<Tone, string> = {
  blue: "bg-(--teamwork-blue-strong)",
  green: "bg-(--teamwork-green)",
  yellow: "bg-(--teamwork-yellow)",
  lilac: "bg-(--teamwork-lilac)",
}

const BADGE_TONES: Record<"neutral" | Tone, string> = {
  neutral: "",
  blue: "",
  green: "border-[color-mix(in_srgb,var(--teamwork-green)_45%,var(--background))] bg-[color-mix(in_srgb,var(--teamwork-green)_22%,var(--background))] text-[color-mix(in_srgb,var(--teamwork-green)_70%,var(--foreground))]",
  yellow: "border-[color-mix(in_srgb,var(--teamwork-yellow)_45%,var(--background))] bg-[color-mix(in_srgb,var(--teamwork-yellow)_22%,var(--background))] text-[color-mix(in_srgb,var(--teamwork-yellow)_70%,var(--foreground))]",
  lilac: "",
}

function Glyph({ name }: { name: "plus" | "asterisk" | "squiggle" }) {
  if (name === "plus")
    return (
      <svg viewBox="0 0 24 24" className="size-6 text-foreground">
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  if (name === "asterisk")
    return (
      <svg viewBox="0 0 36 36" className="size-9 text-foreground">
        <path d="M18 3v30M5 10.5l26 15M5 25.5l26-15M10 5l16 26M26 5 10 31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  return (
    <svg viewBox="0 0 84 30" fill="none" className="h-[30px] w-[84px] text-foreground">
      <path d="M2 24c14 4 30-2 40-12 6-6 2-10-3-6-7 6-4 20 8 20 12 0 22-10 34-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function FieldNodeView({ node }: { node: FieldNode }) {
  if (node.kind === "tile")
    return (
      // eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-agnostic
      <img src={`/kits/teamwork/connector-${node.name}.svg`} alt="" width={node.size} height={node.size} draggable={false} className="block select-none" />
    )
  if (node.kind === "avatar")
    return (
      <span
        style={{ width: node.size, height: node.size }}
        className={cn("block overflow-hidden rounded-full", AVATAR_TONES[node.tone])}
      >
        {/* Luminosity blend tints the portrait with the node colour, like the source's cut-out people. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-agnostic */}
        <img
          src={`/kits/teamwork/avatar-${node.n}.webp`}
          alt=""
          draggable={false}
          className="size-full scale-110 object-cover mix-blend-luminosity contrast-125 select-none"
        />
      </span>
    )
  if (node.kind === "badge")
    return (
      <Badge variant={node.tone === "blue" ? "accent" : "neutral"} className={cn("min-h-7 px-2.5 py-0.5 text-[13px]", BADGE_TONES[node.tone])}>
        {node.label}
      </Badge>
    )
  return <Glyph name={node.glyph} />
}

function IconField({ visible }: { visible: boolean }) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // After the entrance: slow ambient drift on every node and a highlight along a few lines.
  useEffect(() => {
    const field = fieldRef.current
    if (!field || !visible || reduced) return
    const animations: Animation[] = []
    field.querySelectorAll<HTMLElement>("[data-drift]").forEach((element, i) => {
      const dx = ((i * 37) % 7) - 3
      const dy = ((i * 53) % 9) - 4
      animations.push(
        element.animate([{ transform: "translate(0, 0)" }, { transform: `translate(${dx}px, ${dy}px)` }], {
          duration: 4200 + ((i * 611) % 3400),
          delay: 1800,
          direction: "alternate",
          iterations: Infinity,
          easing: "ease-in-out",
        })
      )
    })
    field.querySelectorAll<SVGLineElement>("[data-shimmer]").forEach((line, i) => {
      animations.push(
        line.animate([{ strokeDashoffset: 14, opacity: 1 }, { strokeDashoffset: -100, opacity: 1 }], {
          duration: 2400,
          delay: 2200 + i * 900,
          endDelay: 3000 + ((i * 1300) % 4000),
          iterations: Infinity,
          easing: "ease-in-out",
        })
      )
    })
    return () => animations.forEach((animation) => animation.cancel())
  }, [visible, reduced])

  return (
    <div ref={fieldRef} className="absolute inset-0">
      <svg aria-hidden className="absolute inset-0 size-full overflow-visible">
        <g strokeWidth="1" strokeDasharray="1 3" className="stroke-[color-mix(in_srgb,var(--input)_45%,transparent)]">
          {EDGES.map(([from, to]) => {
            const a = NODES[from]
            const b = NODES[to]
            return (
              <line
                key={`${from}-${to}`}
                x1={`${a.x}%`}
                y1={`${a.y}%`}
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                style={{ transformOrigin: `${a.x}% ${a.y}%`, transitionDelay: `${DELAYS[from] + 120}ms` }}
                className="scale-0 transition-[scale] duration-800 ease-[cubic-bezier(0.215,0.61,0.355,1)] [transform-box:view-box] group-data-visible/hero:scale-100 motion-reduce:transition-none"
              />
            )
          })}
        </g>
        <g strokeWidth="1.5" strokeLinecap="round" className="stroke-(--ring)">
          {SHIMMER.map(([from, to]) => {
            const a = NODES[from]
            const b = NODES[to]
            return (
              <line
                key={`${from}-${to}`}
                data-shimmer
                x1={`${a.x}%`}
                y1={`${a.y}%`}
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                pathLength={100}
                strokeDasharray="14 200"
                strokeDashoffset={14}
                opacity={0}
              />
            )
          })}
        </g>
      </svg>
      {NODES.map((node, i) => (
        <div
          key={i}
          style={{ left: `${node.x}%`, top: `${node.y}%`, transitionDelay: `${DELAYS[i]}ms` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 scale-40 opacity-0 transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.34,1.8,0.64,1)] group-data-visible/hero:scale-100 group-data-visible/hero:opacity-100 motion-reduce:transition-none"
        >
          <div data-drift>
            <FieldNodeView node={node} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Media artboard that rises over the pinned stage.
// ---------------------------------------------------------------------------

function HeroVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
  const { ref, playing, toggle } = useInViewVideo()
  return (
    <>
      <video
        ref={ref}
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        loop
        muted
        playsInline
        preload="metadata"
        className="aspect-[16/10] w-full rounded-kit object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-5 bottom-5 grid size-8 cursor-pointer place-items-center rounded-kit bg-background/80 text-foreground transition-colors duration-150 ease-kit hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 fill-current">
          {playing ? <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" /> : <path d="M5 3.25v9.5L12.5 8z" />}
        </svg>
      </button>
    </>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

const arrow = (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.44 7.25 8.72 3.53l1.06-1.06 5 5a.75.75 0 0 1 0 1.06l-5 5-1.06-1.06 3.72-3.72H1v-1.5z" />
  </svg>
)

// Scroll: the field scales up, softens and dims; the copy lifts and fades as the hero leaves.
const backgroundMotion: CSSProperties = {
  transform: "scale(calc(1 + var(--hero-p, 0) * 0.08))",
  opacity: "calc(1 - var(--hero-p, 0) * 0.48)",
  filter: "blur(calc(var(--hero-p, 0) * 8px))",
}
const foregroundMotion: CSSProperties = {
  transform: "translateY(calc(var(--hero-p, 0) * -14%)) scale(calc(1 + var(--hero-p, 0) * 0.04))",
  opacity: "clamp(0, (1 - var(--hero-p, 0)) * 5.5, 1)",
}

// Staged intro: copy after the first nodes, the stroke after the title, then subtitle and actions.
const intro =
  "opacity-0 transition-[opacity,translate] duration-400 ease-out group-data-visible/hero:translate-y-0 group-data-visible/hero:opacity-100 motion-reduce:transition-none"

export function Hero({ eyebrow, title, description, actions, media, className }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null)
  const { ref: stageRef, visible } = useReveal<HTMLDivElement>({ threshold: 0, rootMargin: "0px" })
  const progressRef = useScrollProgress<HTMLDivElement>({
    range: "contain",
    cssVar: false,
    reducedMotionValue: 0,
    onProgress: (progress) => rootRef.current?.style.setProperty("--hero-p", progress.toFixed(4)),
  })
  // Short titles read as a wordmark; longer ones step down to a headline size.
  const wordmark = typeof title === "string" && title.length <= 16

  return (
    <section ref={rootRef} className={cn("relative w-full overflow-clip bg-background font-body text-foreground", className)}>
      <div className="relative h-[118svh] min-h-[680px]">
        {/* Scroll sentinel: progress runs from 0 to 1 over the height of the pinned track. */}
        <div ref={progressRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%+100svh)]" />

        <div
          ref={stageRef}
          data-visible={visible || undefined}
          className="group/hero sticky top-[88px] h-[calc(100svh-88px)] min-h-[560px] overflow-hidden"
        >
          <div aria-hidden style={backgroundMotion} className="absolute inset-0 will-change-[transform,opacity,filter]">
            <div className="absolute top-1/2 left-1/2 h-[94%] w-[max(104%,880px)] -translate-x-1/2 -translate-y-1/2">
              <IconField visible={visible} />
            </div>
          </div>

          <div style={foregroundMotion} className="relative z-2 flex h-full items-center justify-center px-gutter will-change-[transform,opacity]">
            <div className="flex w-full max-w-[min(860px,calc(100vw-2*var(--kit-gutter)))] flex-col items-center gap-8 text-center sm:gap-10">
              <div className="flex flex-col items-center gap-5">
                {eyebrow && (
                  <p
                    style={{ transitionDelay: "380ms" }}
                    className={cn(intro, "translate-y-2 font-mono text-xs leading-5 font-medium tracking-[1px] text-(--teamwork-text-subtle) uppercase")}
                  >
                    {eyebrow}
                  </p>
                )}
                <h1
                  style={{ transitionDelay: "480ms" }}
                  className={cn(
                    intro,
                    "relative translate-y-3 font-display font-semibold tracking-[-0.02em] text-balance text-foreground uppercase",
                    wordmark
                      ? "text-[clamp(3.25rem,10.5vw,8.5rem)] leading-[0.9] max-sm:text-[clamp(3.25rem,15vw,5rem)]"
                      : "text-[clamp(2.5rem,6.4vw,5.5rem)] leading-[0.96]"
                  )}
                >
                  {title}
                  {/* Hand-drawn stroke that loops over the end of the title. */}
                  <svg
                    aria-hidden
                    viewBox="0 0 160 130"
                    fill="none"
                    className="pointer-events-none absolute -top-[14%] right-[4%] w-[min(22%,170px)] text-(--teamwork-yellow)"
                  >
                    <path
                      d="M38 70c2-30 46-54 84-46 30 6 34 38 10 58-26 22-78 26-98 4-18-20 4-52 44-62 36-9 72 4 70 32-2 26-38 46-72 44-30-2-44-24-30-44 14-20 52-28 78-16 20 9 20 30 2 42-18 12-48 12-60-2"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={1}
                      strokeDasharray="1"
                      className="[stroke-dashoffset:1] transition-[stroke-dashoffset] delay-700 duration-1000 ease-in-out group-data-visible/hero:[stroke-dashoffset:0] motion-reduce:transition-none"
                    />
                  </svg>
                </h1>
              </div>

              {(description || (actions && actions.length > 0)) && (
                <div className="flex flex-col items-center gap-8 sm:gap-10">
                  {description && (
                    <p
                      style={{ transitionDelay: "1000ms" }}
                      className={cn(
                        intro,
                        "max-w-[640px] font-display text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.2] tracking-[-0.01em] text-balance text-foreground/90"
                      )}
                    >
                      {description}
                    </p>
                  )}
                  {actions && actions.length > 0 && (
                    <div style={{ transitionDelay: "1150ms" }} className={cn(intro, "flex flex-wrap items-center justify-center gap-3")}>
                      {actions.map((action) => (
                        <Button
                          key={action.label}
                          href={action.href}
                          // The source's hero action is the outlined control; secondary links stay quiet.
                          variant={action.variant === "secondary" ? "ghost" : "secondary"}
                          icon={action.variant === "secondary" ? arrow : undefined}
                          className={action.variant === "secondary" ? undefined : "border-[1.5px] text-foreground"}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {media && (
        <div className="relative z-10 mx-auto -mt-[24svh] w-full max-w-[calc(1180px+2*var(--kit-gutter))] px-gutter pb-section max-sm:pb-20">
          <div className="relative rounded-kit-lg border border-border bg-(--teamwork-surface-sunken) p-2 shadow-(--teamwork-shadow-overlay) sm:p-3">
            {media.type === "video" ? (
              <HeroVideo media={media} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-agnostic
              <img
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                className="aspect-[16/10] w-full rounded-kit object-cover"
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}
