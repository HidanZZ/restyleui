"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import type { Logo, LogoRowProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"

const SWAP_EVERY = 2000
const FADE_OUT = 420

/** Slots that fit the row's width, like the source breakpoints (3, 4, 5, 7). */
function slotsFor(width: number) {
  return width < 440 ? 3 : width < 640 ? 4 : width < 840 ? 5 : 7
}

function LogoMark({ logo }: { logo: Logo }) {
  if (logo.src) {
    return (
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        className="h-6 w-auto max-w-full object-contain opacity-80 brightness-0"
      />
    )
  }
  return (
    <span className="text-center text-[0.9375rem] font-semibold leading-[1.1] tracking-[-0.025em] text-balance text-foreground/70 sm:text-[1rem]">
      {logo.name}
    </span>
  )
}

/**
 * Norma logo row: one line of muted marks in equal slots. When more logos exist
 * than slots, one slot swaps every 2s: fade out 420ms, swap, fade in 500ms.
 * It stops once every logo fits.
 */
export function LogoRow({ logos, label, className }: LogoRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [slots, setSlots] = useState(7)
  const [shown, setShown] = useState<number[]>(() => logos.map((_, i) => i))
  const [fading, setFading] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const total = logos.length
  const count = Math.min(slots, total)
  // Visible logo per slot: the swapped order, cut to the slots, topped up with unseen logos.
  const kept = shown.filter((i) => i < total).slice(0, count)
  const visible = [...kept, ...logos.map((_, i) => i).filter((i) => !kept.includes(i))].slice(0, count)
  const readVisible = useEffectEvent(() => visible)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const observer = new ResizeObserver(([entry]) => setSlots(slotsFor(entry.contentRect.width)))
    observer.observe(row)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (total <= count) return
    let swapTimer = 0
    const interval = window.setInterval(() => {
      const current = readVisible()
      const unused = Array.from({ length: total }, (_, i) => i).filter((i) => !current.includes(i))
      if (!unused.length) return
      const slot = Math.floor(Math.random() * current.length)
      const next = unused[Math.floor(Math.random() * unused.length)]
      const swap = () => {
        setShown(current.map((value, i) => (i === slot ? next : value)))
        setFading(null)
      }
      if (reduced) {
        swap()
        return
      }
      setFading(slot)
      swapTimer = window.setTimeout(swap, FADE_OUT)
    }, SWAP_EVERY)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(swapTimer)
    }
  }, [total, count, reduced])

  return (
    <div className={cn("font-body", className)}>
      {label && (
        <p className="mb-8 text-center text-[0.8125rem] font-medium leading-[1.4] text-muted-foreground sm:mb-10">{label}</p>
      )}
      <div
        ref={rowRef}
        aria-hidden={total > count || undefined}
        className="flex w-full flex-nowrap items-center gap-x-4"
      >
        {visible.map((logoIndex, slot) => (
          <div
            key={slot}
            className={cn(
              "flex min-h-10 min-w-0 flex-1 basis-0 items-center justify-center transition-opacity ease-kit motion-reduce:transition-none",
              fading === slot ? "opacity-0 duration-[420ms]" : "opacity-100 duration-500"
            )}
          >
            <LogoMark logo={logos[logoIndex]} />
          </div>
        ))}
      </div>
      {total > count && (
        <ul className="sr-only">
          {logos.map((logo) => (
            <li key={logo.name}>{logo.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
