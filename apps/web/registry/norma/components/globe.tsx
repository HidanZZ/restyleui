"use client"

import { useCallback, useRef, type PointerEvent } from "react"
import type { Action } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Reveal } from "@/registry/norma/components/reveal"

export type GlobeLocation = { lat: number; lon: number }

export type GlobeProps = {
  /** Centered headline over the globe. */
  title?: string
  /** Pill under the headline. */
  action?: Action
  /**
   * "tilt": the globe leans toward the pointer and the beam points at it; touch
   * screens drift on slow waves. "drift": the globe turns on its own.
   */
  mode?: "tilt" | "drift"
  /** Press and drag to spin the globe, with inertia. In "tilt" mode it settles back home. */
  draggable?: boolean
  /** Locator point. Defaults to a spot under the headline that suits the frame's shape. */
  location?: GlobeLocation
  className?: string
}

type Point = { x: number; y: number }

type GlobeState = {
  yaw: number
  pitch: number
  tYaw: number
  tPitch: number
  heading: number
  tHeading: number
  spinYaw: number
  spinPitch: number
  vYaw: number
  vPitch: number
  dragging: boolean
  last: (Point & { t: number }) | null
  dot: Point | null
  orientation: boolean
  lastT: number
}

type OrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number | null }
type OrientationConstructor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }

const DEG = Math.PI / 180
const HOME_PITCH = 30
const HOME_HEADING = 141
const DRAG_SPEED = 0.22

// Grid lines as flat [lat, lon, lat, lon, ...] runs: meridians every 10deg, parallels every 10deg.
function gridLine(fixed: number, from: number, to: number, meridian: boolean) {
  const line: number[] = []
  for (let v = from; v <= to; v += 2) line.push(meridian ? v : fixed, meridian ? fixed : v)
  return Float32Array.from(line)
}
const GRID: Float32Array[] = []
for (let lon = 0; lon < 360; lon += 10) GRID.push(gridLine(lon, -90, 90, true))
for (let lat = -80; lat <= 80; lat += 10) GRID.push(gridLine(lat, 0, 360, false))

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function wrapAngle(current: number, target: number, step: number) {
  return ((((current + ((((((target - current) % 360) + 540) % 360) - 180) * step)) % 360) + 360) % 360)
}

/** Orthographic projection of a lat/lon point for the given yaw and pitch, written into `out`. */
function project(lat: number, lon: number, yaw: number, cosTilt: number, sinTilt: number, out: number[]) {
  const phi = lat * DEG
  const theta = (lon - yaw) * DEG
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)
  const cosTheta = Math.cos(theta)
  out[0] = cosPhi * Math.sin(theta)
  out[1] = cosTilt * sinPhi - sinTilt * cosPhi * cosTheta
  out[2] = sinTilt * sinPhi + cosTilt * cosPhi * cosTheta
}

/** Where the segment from a visible point to a hidden one crosses the rim. */
function rim(ox: number, oy: number, oz: number, hx: number, hy: number, hz: number, out: number[]) {
  const t = oz / (oz - hz)
  const x = ox + (hx - ox) * t
  const y = oy + (hy - oy) * t
  const len = Math.hypot(x, y) || 1
  out[0] = x / len
  out[1] = y / len
}

const cur = [0, 0, 0]
const edge = [0, 0]

function strokeLine(
  ctx: CanvasRenderingContext2D,
  line: Float32Array,
  yaw: number,
  cosTilt: number,
  sinTilt: number,
  cx: number,
  cy: number,
  r: number
) {
  ctx.beginPath()
  let open = false
  let px = 0
  let py = 0
  let pz = -1
  for (let i = 0; i < line.length; i += 2) {
    project(line[i], line[i + 1], yaw, cosTilt, sinTilt, cur)
    const [x, y, z] = cur
    if (z >= 0) {
      if (!open) {
        if (i > 0 && pz < 0) {
          rim(x, y, z, px, py, pz, edge)
          ctx.moveTo(cx + edge[0] * r, cy - edge[1] * r)
          ctx.lineTo(cx + x * r, cy - y * r)
        } else {
          ctx.moveTo(cx + x * r, cy - y * r)
        }
        open = true
      } else {
        ctx.lineTo(cx + x * r, cy - y * r)
      }
    } else if (open) {
      rim(px, py, pz, x, y, z, edge)
      ctx.lineTo(cx + edge[0] * r, cy - edge[1] * r)
      open = false
    }
    px = x
    py = y
    pz = z
  }
  ctx.stroke()
}

/** Frame geometry from the source: a huge horizon on wide frames, a hanging globe on tall ones. */
function layout(width: number, height: number, location?: GlobeLocation) {
  if (width / height < 0.9) {
    return { cx: width / 2, cy: 0.2 * height, r: 0.72 * height, dotD: Math.min(0.14 * width, 60), dot: location ?? { lat: 32, lon: -5 } }
  }
  const r = 1.45 * height
  return { cx: width / 2, cy: 0.9 * height - r, r, dotD: Math.min(0.05 * width, 76), dot: location ?? { lat: -4.5, lon: -12.3 } }
}

/** Any CSS color to [r, g, b], read back through the canvas. */
function toRgb(ctx: CanvasRenderingContext2D, color: string): [number, number, number] {
  ctx.fillStyle = "#000"
  ctx.fillStyle = color
  const value = String(ctx.fillStyle)
  if (value.startsWith("#")) {
    const n = parseInt(value.slice(1, 7), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const [r = 0, g = 0, b = 0] = value.match(/[\d.]+/g)?.map(Number) ?? []
  return [r, g, b]
}

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

export function Globe({
  title = "You spent the evening somewhere you never went.",
  action = { label: "Find your focus", href: "#" },
  mode = "tilt",
  draggable = true,
  location,
  className,
}: GlobeProps) {
  const stateRef = useRef<GlobeState>({
    yaw: 0,
    pitch: HOME_PITCH,
    tYaw: 0,
    tPitch: 0,
    heading: HOME_HEADING,
    tHeading: HOME_HEADING,
    spinYaw: 0,
    spinPitch: 0,
    vYaw: 0,
    vPitch: 0,
    dragging: false,
    last: null,
    dot: null,
    orientation: false,
    lastT: 0,
  })
  const lat = location?.lat
  const lon = location?.lon

  // Canvas setup and the animation loop live for as long as the canvas is mounted.
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      const frameEl = canvas?.parentElement
      const ctx = canvas?.getContext("2d")
      if (!canvas || !frameEl || !ctx) return
      const state = stateRef.current
      const dot = lat !== undefined && lon !== undefined ? { lat, lon } : undefined
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)")

      const tokens = getComputedStyle(frameEl)
      const token = (name: string) => tokens.getPropertyValue(name).trim()
      const sphere = token("--norma-globe")
      const grid = token("--norma-globe-grid")
      const ring = token("--norma-faint")
      const beam = toRgb(ctx, token("--norma-blue"))
      const beamRgba = (alpha: number) => `rgb(${beam[0]} ${beam[1]} ${beam[2]} / ${alpha})`

      let width = 0
      let height = 0
      let dpr = 1
      const resize = () => {
        width = frameEl.clientWidth
        height = frameEl.clientHeight
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(frameEl)

      const draw = (now: number) => {
        const step = (state.lastT ? Math.min(48, now - state.lastT) : 16.7) / 16.7
        state.lastT = now
        const reduced = motion.matches

        if (mode === "tilt") {
          if (fine.matches || state.orientation || reduced) {
            state.yaw += (state.tYaw - state.yaw) * 0.08 * step
            state.pitch += (HOME_PITCH + state.tPitch - state.pitch) * 0.08 * step
            state.heading = wrapAngle(state.heading, state.tHeading, 0.1 * step)
          } else {
            // Touch without orientation: slow idle drift.
            state.tYaw = 3 * Math.sin(now / 4200)
            state.tPitch = 1.5 * Math.sin(now / 6100 + 1)
            state.yaw += (state.tYaw - state.yaw) * 0.04 * step
            state.pitch += (HOME_PITCH + state.tPitch - state.pitch) * 0.04 * step
          }
        } else {
          if (!reduced && !state.dragging) state.yaw += 0.05 * step
          state.pitch += (HOME_PITCH - state.pitch) * 0.1 * step
          state.heading = wrapAngle(state.heading, HOME_HEADING, 0.1 * step)
        }

        if (!state.dragging) {
          if (!reduced && Math.abs(state.vYaw) + Math.abs(state.vPitch) > 0.02) {
            state.spinYaw += state.vYaw * step
            state.spinPitch += state.vPitch * step
            state.vYaw *= Math.pow(0.92, step)
            state.vPitch *= Math.pow(0.92, step)
          } else {
            state.vYaw = state.vPitch = 0
            if (mode === "tilt" && !reduced) {
              // Settle back so the locator sits under the headline again.
              const home = Math.round(state.spinYaw / 360) * 360
              state.spinYaw += (home - state.spinYaw) * 0.04 * step
              state.spinPitch += (0 - state.spinPitch) * 0.04 * step
            }
          }
        }

        const yaw = state.yaw + state.spinYaw
        const pitch = clamp(state.pitch + state.spinPitch, -85, 85)
        const cosTilt = Math.cos(pitch * DEG)
        const sinTilt = Math.sin(pitch * DEG)
        const { cx, cy, r, dotD, dot: spot } = layout(width, height, dot)

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, width, height)

        ctx.fillStyle = sphere
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, 2 * Math.PI)
        ctx.fill()

        ctx.strokeStyle = grid
        ctx.lineWidth = dpr > 1.5 ? 0.75 : 1
        ctx.lineJoin = "round"
        for (const line of GRID) strokeLine(ctx, line, yaw, cosTilt, sinTilt, cx, cy, r)
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, 2 * Math.PI)
        ctx.stroke()

        project(spot.lat, spot.lon, yaw, cosTilt, sinTilt, cur)
        if (cur[2] > 0) {
          const dotX = cx + cur[0] * r
          const dotY = cy - cur[1] * r
          state.dot = { x: dotX, y: dotY }

          // Beam: a soft cone of 28 nested sectors, clipped to the sphere.
          const heading = state.heading * DEG
          const reach = 2.5 * dotD
          const half = 17 * DEG
          const falloff = (v: number) => (v < 0.55 ? 1 : Math.cos((((v - 0.55) / 0.45) * Math.PI) / 2) ** 2)
          const gradient = ctx.createRadialGradient(dotX, dotY, 0.2 * dotD, dotX, dotY, reach)
          gradient.addColorStop(0, beamRgba(1))
          gradient.addColorStop(0.45, beamRgba(0.6))
          gradient.addColorStop(1, beamRgba(0))
          ctx.save()
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, 2 * Math.PI)
          ctx.clip()
          ctx.fillStyle = gradient
          for (let s = 0; s < 28; s++) {
            const outer = 1 - s / 28
            ctx.globalAlpha = 0.6 * (falloff(1 - (s + 1) / 28) - falloff(outer))
            ctx.beginPath()
            ctx.moveTo(dotX, dotY)
            ctx.arc(dotX, dotY, reach, heading - half * outer, heading + half * outer)
            ctx.closePath()
            ctx.fill()
          }
          ctx.restore()

          // Locator: a pale ring with a soft drop shadow, blue core.
          ctx.save()
          ctx.shadowColor = "rgb(0 0 0 / 0.5)"
          ctx.shadowBlur = 0.28 * dotD
          ctx.shadowOffsetY = 0.06 * dotD
          ctx.globalAlpha = 0.97
          ctx.fillStyle = ring
          ctx.beginPath()
          ctx.arc(dotX, dotY, dotD / 2, 0, 2 * Math.PI)
          ctx.fill()
          ctx.restore()
          ctx.fillStyle = beamRgba(1)
          ctx.beginPath()
          ctx.arc(dotX, dotY, 0.29 * dotD, 0, 2 * Math.PI)
          ctx.fill()
        } else {
          state.dot = null
        }

        frame = requestAnimationFrame(draw)
      }

      // Only animate while the frame is on screen.
      let frame = 0
      const visibility = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(frame)
        frame = 0
        state.lastT = 0
        if (entry.isIntersecting) frame = requestAnimationFrame(draw)
      })
      visibility.observe(frameEl)

      // Pointer follow (tilt mode, mouse and pen).
      let pointer: Point | null = null
      const follow = () => {
        if (mode !== "tilt" || state.orientation || !pointer) return
        const rect = frameEl.getBoundingClientRect()
        const inside = pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom
        if (!inside) {
          state.tYaw = 0
          state.tPitch = 0
          state.tHeading = HOME_HEADING
          return
        }
        state.tYaw = ((pointer.x - rect.left) / rect.width - 0.5) * 30
        state.tPitch = -((pointer.y - rect.top) / rect.height - 0.5) * 18
        if (state.dot) {
          state.tHeading = Math.atan2(pointer.y - rect.top - state.dot.y, pointer.x - rect.left - state.dot.x) / DEG
        }
      }
      const onPointerMove = (event: globalThis.PointerEvent) => {
        if (event.pointerType === "touch") return
        pointer = { x: event.clientX, y: event.clientY }
        follow()
      }

      // Device tilt on touch screens that allow it without a permission prompt.
      const onOrientation = (event: DeviceOrientationEvent) => {
        if (event.beta == null && event.gamma == null) return
        state.orientation = true
        state.tYaw = 0.7 * clamp(event.gamma ?? 0, -35, 35)
        state.tPitch = 0.5 * clamp((event.beta ?? 50) - 50, -35, 35)
        const compass =
          (event as OrientationEvent).webkitCompassHeading ?? (event.absolute && event.alpha != null ? 360 - event.alpha : null)
        if (compass != null) state.tHeading = compass - 90
      }
      const useOrientation =
        mode === "tilt" &&
        !fine.matches &&
        typeof window.DeviceOrientationEvent === "function" &&
        typeof (DeviceOrientationEvent as OrientationConstructor).requestPermission !== "function"

      if (mode === "tilt") {
        window.addEventListener("pointermove", onPointerMove, { passive: true })
        window.addEventListener("scroll", follow, { passive: true })
      }
      if (useOrientation) window.addEventListener("deviceorientation", onOrientation)

      return () => {
        cancelAnimationFrame(frame)
        visibility.disconnect()
        resizeObserver.disconnect()
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("scroll", follow)
        window.removeEventListener("deviceorientation", onOrientation)
        state.orientation = false
        state.lastT = 0
      }
    },
    [mode, lat, lon]
  )

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggable || event.button !== 0) return
    if ((event.target as Element).closest("a, button, input, textarea, select")) return
    if (event.pointerType !== "touch") event.preventDefault()
    const state = stateRef.current
    state.dragging = true
    state.vYaw = state.vPitch = 0
    state.last = { x: event.clientX, y: event.clientY, t: performance.now() }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = stateRef.current
    if (!state.dragging || !state.last) return
    // The surface follows the pointer.
    const dYaw = -DRAG_SPEED * (event.clientX - state.last.x)
    const dPitch = DRAG_SPEED * (event.clientY - state.last.y)
    const now = performance.now()
    const frames = Math.max(4, now - state.last.t) / 16.7
    state.spinYaw += dYaw
    state.spinPitch = clamp(state.pitch + state.spinPitch + dPitch, -85, 85) - state.pitch
    state.vYaw = clamp(dYaw / frames, -2.5, 2.5)
    state.vPitch = clamp(dPitch / frames, -2.5, 2.5)
    state.last = { x: event.clientX, y: event.clientY, t: now }
  }

  const endDrag = () => {
    const state = stateRef.current
    state.dragging = false
    state.last = null
  }

  return (
    <section className={cn("bg-background px-(--norma-gutter-outer) py-section", className)}>
      <Reveal>
        <div
          data-norma-invert
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          className={cn(
            "relative mx-auto flex min-h-[70vh] max-w-(--norma-container-wide) flex-col justify-center overflow-hidden rounded-kit-lg bg-black sm:min-h-[78vh]",
            draggable && "cursor-grab touch-pan-y select-none active:cursor-grabbing"
          )}
        >
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block" />
          <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-kit flex-col items-center px-gutter py-24 text-center">
            <h2 className="max-w-[16ch] font-display text-(length:--norma-text-h2) leading-[1.05] font-semibold tracking-(--norma-tracking-heading) text-balance text-background">
              {title}
            </h2>
            {action && (
              <a
                href={action.href}
                className="group pointer-events-auto mt-8 inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-background px-7 text-base font-semibold text-foreground transition-[background-color,scale] duration-200 ease-kit hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background active:scale-[0.99] motion-reduce:transition-none"
              >
                {action.label}
                <ArrowIcon />
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
