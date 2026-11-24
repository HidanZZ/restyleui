"use client"

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react"
import { cn } from "@/registry/restyle/lib/utils"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

/**
 * Graph scenes are drawn on an 840 x 840 board with a 60-unit grid. The hub
 * covers 300..540 on both axes. `at` is when an element starts appearing,
 * as a share (0..1) of the 1400 ms scene build.
 */
export type OverviewNode = {
  x: number
  y: number
  at: number
} & (
  | { kind: "tile"; src: string }
  | { kind: "chip"; icon: ChipIcon }
  | { kind: "avatar"; src: string; tone: Tone }
  | { kind: "bubble"; text: string; align: "start" | "end" }
)

/** Orthogonal connector, drawn from `from` to `to`. */
export type OverviewLine = { from: [number, number]; to: [number, number]; at: number }

export type OverviewScene = { nodes: OverviewNode[]; lines: OverviewLine[] }

export type OverviewItem = {
  title: string
  description: string
  /** Line icon beside the title, drawn with currentColor. */
  icon?: ReactNode
  /** Graph scene for this item. Defaults to the built-in scenes in turn. */
  scene?: OverviewScene
}

export type OverviewCarouselProps = {
  items?: OverviewItem[]
  /** Accessible name of the carousel. */
  label?: string
  /** Auto-advance delay in ms while at least a quarter of it is in view. */
  interval?: number
  className?: string
}

type Tone = "blue" | "green" | "yellow" | "lilac"
type ChipIcon = "doc" | "calendar" | "person" | "check" | "chat" | "link" | "flag" | "clock"

const BUILD_MS = 1400
const NODE_SPAN = 0.16
const LINE_SPAN = 0.2

// Spring (stiffness 420, damping 34) sampled into a linear() easing for the progress marker.
const SPRING =
  "linear(0,0.099,0.297,0.503,0.677,0.808,0.897,0.953,0.985,1.001,1.008,1.009,1.008,1.007,1.005,1.003,1.002,1.001,1,1,1)"

// CSS ease-in-out as a function, for the scene build progress.
function easeInOut(progress: number) {
  const x = Math.max(0, Math.min(1, progress))
  if (x === 0 || x === 1) return x
  let lo = 0
  let hi = 1
  let t = x
  for (let i = 0; i < 14; i++) {
    const value = 3 * (1 - t) ** 2 * t * 0.42 + 3 * (1 - t) * t * t * 0.58 + t ** 3
    if (value < x) lo = t
    else hi = t
    t = (lo + hi) / 2
  }
  return 3 * (1 - t) * t * t + t ** 3
}

const TONES: Record<Tone, string> = {
  blue: "bg-(--teamwork-blue-strong)",
  green: "bg-(--teamwork-green)",
  yellow: "bg-(--teamwork-yellow)",
  lilac: "bg-(--teamwork-lilac)",
}

const CHIP_PATHS: Record<ChipIcon, string> = {
  doc: "M4 2.5h8v11H4zM6 5.5h4M6 8h4M6 10.5h2.5",
  calendar: "M2.5 4h11v9.5h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3",
  person: "M8 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M3 13.5c.5-2.5 2.5-4 5-4s4.5 1.5 5 4",
  check: "M2.5 2.5h11v11h-11zM5.5 8l2 2 3.5-4",
  chat: "M2.5 3h11v8H7l-3 2.5V11H2.5zM5 6h6M5 8.5h4",
  link: "M7 9.5l2.5-3M6.5 6L5 7.5a2 2 0 0 0 3 3L9.5 9M9.5 10l1.5-1.5a2 2 0 0 0-3-3L6.5 7",
  flag: "M4 14V2.5M4 3h8l-1.5 3L12 9H4",
  clock: "M8 2.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11M8 5v3.5l2 1.5",
}

const tile = (name: string) => `/kits/teamwork/connector-${name}.svg`
const avatar = (n: number) => `/kits/teamwork/avatar-${n}.webp`

/** Spreads `list` start times evenly between `start` and `end`. */
function stagger<T>(list: readonly T[], start: number, end: number): (T & { at: number })[] {
  return list.map((item, i) => ({ ...item, at: start + (list.length > 1 ? (i * (end - start)) / (list.length - 1) : 0) }))
}

const SOURCES: OverviewScene = {
  nodes: [
    ...stagger(
      [
        { kind: "tile", src: tile("orbit"), x: 360, y: 120 },
        { kind: "tile", src: tile("prism"), x: 480, y: 180 },
        { kind: "tile", src: tile("signal"), x: 720, y: 360 },
        { kind: "tile", src: tile("node"), x: 660, y: 480 },
        { kind: "tile", src: tile("weave"), x: 480, y: 720 },
        { kind: "tile", src: tile("spark"), x: 360, y: 660 },
        { kind: "tile", src: tile("compass"), x: 180, y: 480 },
        { kind: "tile", src: tile("ripple"), x: 120, y: 360 },
      ] as const,
      0.08,
      0.36
    ),
    ...stagger(
      [
        { kind: "chip", icon: "doc", x: 360, y: 210 },
        { kind: "chip", icon: "calendar", x: 480, y: 240 },
        { kind: "chip", icon: "link", x: 630, y: 360 },
        { kind: "chip", icon: "check", x: 600, y: 480 },
        { kind: "chip", icon: "chat", x: 480, y: 630 },
        { kind: "chip", icon: "clock", x: 360, y: 600 },
        { kind: "chip", icon: "person", x: 240, y: 480 },
        { kind: "chip", icon: "flag", x: 210, y: 360 },
      ] as const,
      0.5,
      0.84
    ),
  ],
  lines: stagger(
    [
      { from: [360, 300], to: [360, 120] },
      { from: [480, 300], to: [480, 180] },
      { from: [540, 360], to: [720, 360] },
      { from: [540, 480], to: [660, 480] },
      { from: [480, 540], to: [480, 720] },
      { from: [360, 540], to: [360, 660] },
      { from: [300, 480], to: [180, 480] },
      { from: [300, 360], to: [120, 360] },
    ] as { from: [number, number]; to: [number, number] }[],
    0.42,
    0.78
  ),
}

const PEOPLE: OverviewScene = {
  nodes: stagger(
    [
      { kind: "avatar", src: avatar(1), tone: "lilac", x: 180, y: 180 },
      { kind: "chip", icon: "doc", x: 360, y: 180 },
      { kind: "avatar", src: avatar(2), tone: "green", x: 480, y: 120 },
      { kind: "chip", icon: "calendar", x: 240, y: 240 },
      { kind: "avatar", src: avatar(3), tone: "yellow", x: 660, y: 240 },
      { kind: "chip", icon: "link", x: 600, y: 240 },
      { kind: "avatar", src: avatar(2), tone: "blue", x: 120, y: 420 },
      { kind: "chip", icon: "person", x: 240, y: 420 },
      { kind: "chip", icon: "check", x: 600, y: 420 },
      { kind: "avatar", src: avatar(1), tone: "lilac", x: 720, y: 420 },
      { kind: "chip", icon: "chat", x: 360, y: 600 },
      { kind: "avatar", src: avatar(3), tone: "yellow", x: 240, y: 600 },
      { kind: "chip", icon: "flag", x: 600, y: 600 },
      { kind: "avatar", src: avatar(1), tone: "green", x: 360, y: 720 },
      { kind: "chip", icon: "clock", x: 480, y: 660 },
      { kind: "avatar", src: avatar(2), tone: "yellow", x: 720, y: 660 },
    ] as const,
    0.06,
    0.42
  ),
  lines: stagger(
    [
      { from: [180, 180], to: [480, 180] },
      { from: [480, 120], to: [480, 300] },
      { from: [240, 240], to: [660, 240] },
      { from: [240, 240], to: [240, 600] },
      { from: [600, 240], to: [600, 600] },
      { from: [120, 420], to: [300, 420] },
      { from: [540, 420], to: [720, 420] },
      { from: [240, 600], to: [600, 600] },
      { from: [360, 540], to: [360, 720] },
      { from: [480, 540], to: [480, 660] },
      { from: [480, 660], to: [720, 660] },
    ] as { from: [number, number]; to: [number, number] }[],
    0.46,
    0.84
  ),
}

// Primary clients arrive one at a time with their prompts, then the rest follow.
const CLIENTS: OverviewScene = {
  nodes: [
    { kind: "tile", src: tile("beacon"), x: 360, y: 180, at: 0.04 },
    { kind: "bubble", text: "What changed in the roadmap?", align: "end", x: 324, y: 180, at: 0.14 },
    { kind: "tile", src: tile("thread"), x: 600, y: 480, at: 0.26 },
    { kind: "tile", src: tile("kite"), x: 480, y: 720, at: 0.48 },
    { kind: "bubble", text: "Summarize this sprint for me", align: "start", x: 516, y: 720, at: 0.58 },
    ...stagger(
      [
        { kind: "tile", src: tile("lattice"), x: 480, y: 240 },
        { kind: "tile", src: tile("bridge"), x: 240, y: 360 },
        { kind: "tile", src: tile("anchor"), x: 180, y: 480 },
        { kind: "tile", src: tile("circuit"), x: 660, y: 360 },
        { kind: "tile", src: tile("pulse"), x: 360, y: 660 },
      ] as const,
      0.8,
      0.9
    ),
  ],
  lines: [
    { from: [360, 300], to: [360, 180], at: 0.12 },
    { from: [540, 480], to: [600, 480], at: 0.34 },
    { from: [480, 540], to: [480, 720], at: 0.56 },
    ...stagger(
      [
        { from: [480, 300], to: [480, 240] },
        { from: [300, 360], to: [240, 360] },
        { from: [300, 480], to: [180, 480] },
        { from: [540, 360], to: [660, 360] },
        { from: [360, 540], to: [360, 660] },
      ] as { from: [number, number]; to: [number, number] }[],
      0.66,
      0.78
    ),
  ],
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-14 w-14 shrink-0">
      {children}
    </svg>
  )
}

const DEFAULT_ITEMS: OverviewItem[] = [
  {
    title: "Every source of work, mapped in one view",
    description:
      "Docs, tickets, meetings and owners land in a single connected map that keeps itself current as your teams work.",
    icon: (
      <Glyph>
        <circle cx="32" cy="32" r="5" />
        <circle cx="10" cy="12" r="3.5" />
        <circle cx="54" cy="10" r="3.5" />
        <circle cx="12" cy="52" r="3.5" />
        <circle cx="52" cy="54" r="3.5" />
        <path d="M13 14.5l15.5 14M51.5 12.5L35.5 28.5M14.5 49.5l14-14M49.5 51.5l-14-16" />
      </Glyph>
    ),
    scene: SOURCES,
  },
  {
    title: "Context that helps people find each other",
    description:
      "See who worked on what, which decisions link them and where to go next, so questions reach the right person faster.",
    icon: (
      <Glyph>
        <path d="M32 6l22 12.5v27L32 58 10 45.5v-27z" />
      </Glyph>
    ),
    scene: PEOPLE,
  },
  {
    title: "Answers inside the tools you already use",
    description: "Assistants and command lines read the same map, so every answer starts from the full picture of your work.",
    icon: (
      <Glyph>
        <path d="M6 46a26 26 0 0 1 52 0M6 50h52M32 46l10-12M32 24v-4M14 38l-3-2M50 38l3-2M20 28l-2.5-3M44 28l2.5-3" />
        <circle cx="32" cy="46" r="2.5" />
      </Glyph>
    ),
    scene: CLIENTS,
  },
]

const SCENES = [SOURCES, PEOPLE, CLIENTS]

const pct = (value: number) => `${(value / 840) * 100}%`
const units = (value: number) => `calc(var(--u) * ${value})`

// Progress of one element: 0 before `--start`, 1 after `--start + --span`, linear in between.
function stage(at: number, span: number): CSSProperties {
  return {
    "--start": at,
    "--span": span,
    "--v": "clamp(0, (var(--p, 0) - var(--start)) / var(--span), 1)",
  } as CSSProperties
}

function Line({ line }: { line: OverviewLine }) {
  const [x1, y1] = line.from
  const [x2, y2] = line.to
  const horizontal = y1 === y2
  const direction = horizontal ? (x2 > x1 ? "to right" : "to left") : y2 > y1 ? "to bottom" : "to top"
  const mask = `linear-gradient(${direction}, black calc(var(--v) * 100%), transparent calc(var(--v) * 100%))`
  return (
    <span
      style={{
        ...stage(line.at, LINE_SPAN),
        left: pct(Math.min(x1, x2)),
        top: pct(Math.min(y1, y2)),
        width: horizontal ? pct(Math.abs(x2 - x1)) : 1,
        height: horizontal ? 1 : pct(Math.abs(y2 - y1)),
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
      className={cn(
        "absolute",
        horizontal
          ? "bg-[repeating-linear-gradient(90deg,var(--foreground)_0_1px,transparent_1px_3px)]"
          : "bg-[repeating-linear-gradient(180deg,var(--foreground)_0_1px,transparent_1px_3px)]"
      )}
    />
  )
}

function GraphNode({ node }: { node: OverviewNode }) {
  const style: CSSProperties = {
    ...stage(node.at, NODE_SPAN),
    left: pct(node.x),
    top: pct(node.y),
    opacity: "var(--v)",
    scale: "calc(0.85 + 0.15 * var(--v))",
  }
  const base = "absolute z-4 -translate-x-1/2 -translate-y-1/2"

  if (node.kind === "tile") {
    return <img src={node.src} alt="" style={{ ...style, width: units(36), height: units(36) }} className={base} />
  }
  if (node.kind === "chip") {
    return (
      <span
        style={{ ...style, width: units(32), height: units(32) }}
        className={cn(base, "flex items-center justify-center rounded-kit border border-(--input) bg-(--teamwork-surface-sunken) text-(--input)")}
      >
        <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" style={{ width: units(14), height: units(14) }}>
          <path d={CHIP_PATHS[node.icon]} />
        </svg>
      </span>
    )
  }
  if (node.kind === "avatar") {
    return (
      <span style={{ ...style, width: units(26), height: units(26), padding: units(2) }} className={cn(base, "rounded-full", TONES[node.tone])}>
        <img src={node.src} alt="" className="size-full rounded-full object-cover grayscale" />
      </span>
    )
  }
  return (
    <span
      style={{
        ...style,
        fontSize: units(12),
        lineHeight: units(16),
        padding: `${units(8)} ${units(14)}`,
        transformOrigin: node.align === "end" ? "right center" : "left center",
      }}
      className={cn(
        "absolute z-4 -translate-y-1/2 rounded-full whitespace-nowrap text-(--teamwork-surface-sunken)",
        "bg-linear-to-r from-(--teamwork-blue-strong) to-(--teamwork-blue)",
        node.align === "end" ? "-translate-x-full" : ""
      )}
    >
      {node.text}
    </span>
  )
}

function Board({ scenes, active, layerRefs }: { scenes: OverviewScene[]; active: number; layerRefs: RefObject<(HTMLDivElement | null)[]> }) {
  const grid = Array.from({ length: 13 }, (_, i) => (i + 1) * 60)
  return (
    <div
      aria-hidden
      className="@container relative aspect-square min-w-0 max-w-[840px] grow basis-[840px] max-lg:w-[min(100%,54dvh)] max-lg:max-w-[560px] max-lg:grow-0 max-lg:basis-auto"
    >
      <div style={{ "--u": "min(1px, 100cqw / 840)" } as CSSProperties} className="absolute inset-0 overflow-hidden bg-background">
        <svg viewBox="0 0 840 840" className="absolute inset-0 size-full">
          <g fill="none" className="stroke-(--teamwork-grid)" strokeWidth="1" strokeDasharray="1 2">
            {grid.map((v) => (
              <path key={v} d={`M${v} 0V840M0 ${v}H840`} />
            ))}
          </g>
        </svg>

        {/* Hub */}
        <div
          className="absolute border border-dotted border-(--input)/50 bg-(--teamwork-surface-sunken)"
          style={{ left: pct(300), top: pct(300), width: pct(240), height: pct(240) }}
        >
          <svg viewBox="0 0 240 240" className="absolute inset-0 size-full">
            <g fill="none" className="stroke-(--teamwork-line)" strokeWidth="1" strokeDasharray="1 2">
              <path d="M60 0V240M120 0V240M180 0V240M0 60H240M0 120H240M0 180H240" />
            </g>
          </svg>
          <div className="absolute top-1/2 left-1/2 z-3 flex size-[49%] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-(--teamwork-surface-sunken)">
            <svg viewBox="0 0 64 64" fill="none" strokeWidth="5" className="size-[56%]">
              <path d="M18 18L46 46M18 46L32 32" className="stroke-(--teamwork-text-subtle)" strokeWidth="3" />
              <circle cx="18" cy="18" r="7" className="stroke-(--teamwork-blue-strong)" />
              <circle cx="46" cy="18" r="7" className="stroke-(--teamwork-green)" />
              <circle cx="18" cy="46" r="7" className="stroke-(--teamwork-lilac)" />
              <circle cx="46" cy="46" r="7" className="stroke-(--teamwork-yellow)" />
            </svg>
          </div>
        </div>

        {scenes.map((scene, index) => (
          <div
            key={index}
            ref={(node) => {
              layerRefs.current[index] = node
            }}
            data-active={index === active || undefined}
            className="pointer-events-none absolute inset-0 z-2 opacity-0 transition-opacity duration-300 ease-out data-active:opacity-100 data-active:duration-400 motion-reduce:transition-none"
          >
            {scene.lines.map((line, i) => (
              <Line key={i} line={line} />
            ))}
            {scene.nodes.map((node, i) => (
              <GraphNode key={i} node={node} />
            ))}
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_srgb,var(--background)_55%,transparent)_80%,var(--background)_100%)]" />
      </div>
    </div>
  )
}

function Chevron({ up }: { up?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <path d={up ? "M2.5 10.5L8 5l5.5 5.5" : "M2.5 5.5L8 11l5.5-5.5"} />
    </svg>
  )
}

export function OverviewCarousel({ items = DEFAULT_ITEMS, label = "Product overview", interval = 7000, className }: OverviewCarouselProps) {
  const id = useId()
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [started, setStarted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  const count = items.length
  const scenes = items.map((item, i) => item.scene ?? SCENES[i % SCENES.length])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.25 }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  // Build the active scene. An interrupted build keeps its last frame while it fades out.
  useEffect(() => {
    const layer = layerRefs.current[active]
    if (!layer) return
    if (reduced) {
      for (const each of layerRefs.current) each?.style.setProperty("--p", "1")
      return
    }
    if (!started) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / BUILD_MS)
      layer.style.setProperty("--p", easeInOut(t).toFixed(4))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, started, reduced])

  // Advance only while it is on screen, not hovered and not focused.
  useEffect(() => {
    if (reduced || !inView || hovered || focused || count < 2) return
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), interval)
    return () => window.clearTimeout(timer)
  }, [active, inView, hovered, focused, reduced, count, interval])

  const current = Math.min(active, count - 1)

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(event) => event.pointerType !== "touch" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      className={cn("w-full overflow-hidden bg-background py-section text-foreground max-lg:px-4 max-lg:py-8", className)}
    >
      <div className="relative mx-auto flex w-full max-w-[1312px] items-center gap-5 px-8 max-lg:flex-col max-lg:gap-6 max-lg:px-0">
        <div className="flex min-w-0 grow items-center gap-10 max-lg:w-full max-lg:flex-col max-lg:gap-6">
          <Board scenes={scenes} active={current} layerRefs={layerRefs} />

          <div className="flex shrink-0 grow-0 basis-[380px] flex-col gap-6 max-lg:w-full max-lg:max-w-[380px] max-lg:basis-auto">
            {items.map((item, index) => {
              const selected = index === current
              const copyId = `${id}-copy-${index}`
              return (
                <div key={index} className="contents">
                  {index > 0 && <hr className="h-0 w-full border-0 border-t border-(--teamwork-grid)" />}
                  <div
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${count}`}
                    data-selected={selected || undefined}
                    className={cn("group/row relative flex flex-col gap-6", !selected && "py-1")}
                  >
                    <div
                      className={cn(
                        "flex min-h-10 items-center justify-between gap-4 transition-colors duration-300 ease-out motion-reduce:transition-none",
                        selected ? "text-foreground" : "text-muted-foreground/60 group-hover/row:text-muted-foreground"
                      )}
                    >
                      <h3 className="min-w-0 flex-auto font-display text-(length:--teamwork-text-title) leading-[1.5] font-normal tracking-[0.5px]">
                        <button
                          type="button"
                          aria-expanded={selected}
                          aria-controls={copyId}
                          onClick={() => setActive(index)}
                          className="text-left outline-none after:absolute after:inset-0 after:rounded-kit-sm after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-foreground group-data-selected/row:cursor-default"
                        >
                          {item.title}
                        </button>
                      </h3>
                      {item.icon}
                    </div>
                    <div
                      id={copyId}
                      aria-hidden={!selected}
                      inert={!selected}
                      className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-350 ease-kit-in-out group-data-selected/row:grid-rows-[1fr] motion-reduce:transition-none"
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="text-(length:--teamwork-text-body) leading-(--teamwork-leading-body) text-muted-foreground/70 opacity-0 transition-opacity duration-250 ease-out group-data-selected/row:opacity-100 group-data-selected/row:delay-100 motion-reduce:transition-none">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-center gap-6 self-stretch pe-3 max-lg:hidden">
          <button
            type="button"
            aria-label="Show previous"
            onClick={() => setActive((index) => (index + count - 1) % count)}
            className="flex size-8 items-center justify-center rounded-full text-(--input) transition-colors duration-150 hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground motion-reduce:transition-none"
          >
            <Chevron up />
          </button>
          <div className="z-6 flex w-2 flex-col gap-[9px]">
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                aria-label={item.title}
                aria-current={index === current ? "step" : undefined}
                onClick={() => setActive(index)}
                style={{ transition: `height 500ms ${SPRING}, background-color 300ms ease-out` }}
                className="h-2 w-2 rounded-full bg-(--input) aria-[current=step]:h-6 aria-[current=step]:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground motion-reduce:[transition:none]!"
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Show next"
            onClick={() => setActive((index) => (index + 1) % count)}
            className="flex size-8 items-center justify-center rounded-full text-(--input) transition-colors duration-150 hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground motion-reduce:transition-none"
          >
            <Chevron />
          </button>
        </div>
      </div>
    </section>
  )
}
