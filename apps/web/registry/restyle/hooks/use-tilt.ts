"use client"

/**
 * useTilt: 3D tilt and pointer follow for cards. Writes CSS variables on the
 * element; your classes decide what moves.
 *
 * Variables (set on the element, inherited by children):
 *   --tilt-x       rotateX in deg (top edge leans away when the pointer is near it)
 *   --tilt-y       rotateY in deg
 *   --pointer-x    pointer x inside the element, 0% to 100% (50% at rest)
 *   --pointer-y    pointer y inside the element, 0% to 100% (50% at rest)
 *   --tilt-active  0 at rest, 1 while hovered, eased (use it for glare opacity)
 *
 * The values ease toward the pointer each animation frame and ease back to
 * rest when the pointer leaves. Mouse and pen only: touch input, devices
 * without hover, and reduced motion leave the variables at rest. It never
 * re-renders.
 *
 * Signature:
 *   useTilt<T extends HTMLElement = HTMLDivElement>(options?: {
 *     max?: number      // max rotation in deg, default 8
 *     ease?: number     // share of the distance covered per frame, 0..1, default 0.12
 *   }): (node: T | null) => void
 *
 * Usage:
 *   const ref = useTilt({ max: 10 })
 *   <div className="[perspective:800px]">
 *     <div
 *       ref={ref}
 *       className="relative [transform:rotateX(var(--tilt-x))_rotateY(var(--tilt-y))] [transform-style:preserve-3d]"
 *     >
 *       <div
 *         aria-hidden
 *         className="pointer-events-none absolute inset-0 opacity-(--tilt-active)
 *           bg-[radial-gradient(circle_at_var(--pointer-x)_var(--pointer-y),rgb(255_255_255/0.25),transparent_60%)]"
 *       />
 *     </div>
 *   </div>
 */
import { useEffect, useState } from "react"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

type TiltValues = { x: number; y: number; px: number; py: number; active: number }

const REST: TiltValues = { x: 0, y: 0, px: 50, py: 50, active: 0 }

function write(el: HTMLElement, v: TiltValues) {
  el.style.setProperty("--tilt-x", `${v.x.toFixed(3)}deg`)
  el.style.setProperty("--tilt-y", `${v.y.toFixed(3)}deg`)
  el.style.setProperty("--pointer-x", `${v.px.toFixed(2)}%`)
  el.style.setProperty("--pointer-y", `${v.py.toFixed(2)}%`)
  el.style.setProperty("--tilt-active", v.active.toFixed(3))
}

export function useTilt<T extends HTMLElement = HTMLDivElement>({
  max = 8,
  ease = 0.12,
}: { max?: number; ease?: number } = {}) {
  const [node, setNode] = useState<T | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!node) return
    write(node, REST)
    if (reduced || !window.matchMedia("(hover: hover)").matches) return

    const current = { ...REST }
    const target = { ...REST }
    let frame = 0

    const step = () => {
      let moving = false
      for (const key of Object.keys(current) as (keyof TiltValues)[]) {
        const delta = target[key] - current[key]
        if (Math.abs(delta) > 0.01) {
          current[key] += delta * ease
          moving = true
        } else {
          current[key] = target[key]
        }
      }
      write(node, current)
      frame = moving ? requestAnimationFrame(step) : 0
    }
    const start = () => {
      if (!frame) frame = requestAnimationFrame(step)
    }

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      const rect = node.getBoundingClientRect()
      const nx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
      const ny = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
      target.x = (0.5 - ny) * 2 * max
      target.y = (nx - 0.5) * 2 * max
      target.px = nx * 100
      target.py = ny * 100
      target.active = 1
      start()
    }
    const leave = () => {
      Object.assign(target, REST)
      start()
    }

    node.addEventListener("pointermove", move)
    node.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      node.removeEventListener("pointermove", move)
      node.removeEventListener("pointerleave", leave)
      write(node, REST)
    }
  }, [node, max, ease, reduced])

  return setNode as (node: T | null) => void
}
