"use client"

import { useCallback, useEffect, useState, type CSSProperties } from "react"
import type { Action } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Button } from "@/registry/teamwork/components/button"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"
import { useTilt } from "@/registry/restyle/hooks/use-tilt"

export type ConnectorTile = { src: string; alt: string }

export type ConnectorMarqueeProps = {
  title?: string
  description?: string
  tiles?: ConnectorTile[]
  action?: Action
  /** Drift speed in px per second. */
  speed?: number
  className?: string
}

const NAMES = [
  "anchor", "beacon", "bridge", "circuit", "compass", "kite", "lattice", "node",
  "orbit", "prism", "pulse", "ripple", "signal", "spark", "thread", "weave",
]

const DEFAULT_TILES: ConnectorTile[] = NAMES.map((name) => ({
  src: `/kits/teamwork/connector-${name}.svg`,
  alt: name[0].toUpperCase() + name.slice(1),
}))

// Authored resting angles, repeated along the rail.
const ANGLES = [2.4, -3.1, 1.1, -4.6, 3.8, -1.7, 5.2, -2.5, 0.8, -5.4, 3.3, -0.6, 4.5, -3.9, 1.9, -2.2]

const TILE = 120
// Smoothstep falloff for the pointer lift.
const falloff = (value: number) => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

export function ConnectorMarquee({
  title = "Every tool you add makes the graph sharper",
  description = "Bring the apps your teams already use into one connected picture, from shared docs to tickets, chat and calendars.",
  tiles = DEFAULT_TILES,
  action = { label: "Browse connectors", href: "#" },
  speed = 60,
  className,
}: ConnectorMarqueeProps) {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed, pauseOnHover: false })
  // useTilt only supplies the damped pointer (--pointer-x/y) and hover weight (--tilt-active); no 3D tilt.
  const tiltRef = useTilt<HTMLDivElement>({ max: 0, ease: 0.18 })
  const reduced = useReducedMotion()
  const [area, setArea] = useState<HTMLDivElement | null>(null)
  const [track, setTrack] = useState<HTMLDivElement | null>(null)

  const areaRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef(node)
      tiltRef(node)
      setArea(node)
    },
    [rootRef, tiltRef]
  )
  const trackNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      trackRef(node)
      setTrack(node)
    },
    [trackRef]
  )

  // Pointer proximity: tiles near the pointer grow up to 1.6x from their base, in the plane.
  useEffect(() => {
    if (!area || !track || reduced || !window.matchMedia("(hover: hover)").matches) return
    let tiles: { element: HTMLElement; center: number; scale: number }[] = []
    let hovering = false
    let frame = 0

    const tick = () => {
      const style = area.style
      const weight = parseFloat(style.getPropertyValue("--tilt-active")) || 0
      const box = area.getBoundingClientRect()
      const row = track.getBoundingClientRect()
      const x = box.left + ((parseFloat(style.getPropertyValue("--pointer-x")) || 50) / 100) * box.width
      const y = box.top + ((parseFloat(style.getPropertyValue("--pointer-y")) || 50) / 100) * box.height
      const vertical = falloff(1 - Math.abs(y - (row.top + row.bottom) / 2) / 200)
      let settling = false
      for (const tile of tiles) {
        const target = 1 + 0.6 * weight * vertical * falloff(1 - Math.abs(row.left + tile.center - x) / 300)
        tile.scale += (target - tile.scale) * 0.18
        settling ||= Math.abs(tile.scale - 1) > 0.001
      }
      for (const tile of tiles) tile.element.style.setProperty("--tile-scale", tile.scale.toFixed(4))
      frame = hovering || settling || weight > 0.001 ? requestAnimationFrame(tick) : 0
    }

    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      hovering = true
      tiles = [...track.querySelectorAll<HTMLElement>("[data-tile]")].map((element) => ({
        element,
        center: element.offsetLeft + element.offsetWidth / 2,
        scale: parseFloat(element.style.getPropertyValue("--tile-scale")) || 1,
      }))
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const leave = () => {
      hovering = false
    }

    area.addEventListener("pointerenter", enter)
    area.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      area.removeEventListener("pointerenter", enter)
      area.removeEventListener("pointerleave", leave)
      for (const tile of tiles) tile.element.style.removeProperty("--tile-scale")
    }
  }, [area, track, reduced, copies])

  return (
    <section className={cn("flex w-full flex-col items-center gap-6 bg-background py-section text-foreground max-sm:py-20", className)}>
      <div className="mx-auto flex w-full max-w-kit flex-col items-center gap-6 px-gutter text-center">
        <h2 className="font-display text-(length:--teamwork-text-display) leading-(--teamwork-leading-display) font-normal tracking-[0.5px] text-balance">
          {title}
        </h2>
        {description && (
          <p className="max-w-[600px] text-(length:--teamwork-text-body) leading-(--teamwork-leading-body) text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div
        ref={areaRef}
        className={cn(
          "relative z-10 w-full pt-[72px] pb-10",
          moving ? "overflow-x-clip" : "overflow-x-auto [scrollbar-width:none]",
          "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-20 before:w-[min(18vw,240px)] before:bg-linear-to-r before:from-background before:to-transparent",
          "after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-20 after:w-[min(18vw,240px)] after:bg-linear-to-l after:from-background after:to-transparent"
        )}
      >
        <div ref={trackNodeRef} className="relative flex w-max px-5">
          {Array.from({ length: copies }, (_, copy) => (
            <ul
              key={copy}
              aria-label={copy === 0 ? "Connectors" : undefined}
              aria-hidden={copy > 0 || undefined}
              inert={copy > 0}
              className="flex shrink-0"
            >
              {tiles.map((tile, i) => (
                <li
                  key={tile.src + i}
                  data-tile
                  style={{ "--tile-angle": `${ANGLES[i % ANGLES.length]}deg`, width: TILE, height: TILE } as CSSProperties}
                  className="-ml-5 flex shrink-0 origin-bottom items-center justify-center will-change-transform [transform:rotate(var(--tile-angle))_scale(var(--tile-scale,1))]"
                >
                  <img
                    src={tile.src}
                    alt={tile.alt}
                    width={TILE}
                    height={TILE}
                    draggable={false}
                    className="size-full rounded-[30px] border border-background/15 select-none"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {action && (
        <Button
          href={action.href}
          variant={action.variant ?? "secondary"}
          className="border-[1.5px]"
          icon={
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3.5 12.5l9-9M5.5 3.5h7v7" />
            </svg>
          }
        >
          {action.label}
        </Button>
      )}
    </section>
  )
}
