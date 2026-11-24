"use client"

import { useEffect, useEffectEvent, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react"
import { cn } from "@/registry/restyle/lib/utils"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"
import { Reveal } from "@/registry/norma/components/reveal"

export type ScreenTimeCalculatorProps = {
  /** Calculator title. */
  title?: string
  ageLabel?: string
  hoursLabel?: string
  defaultAge?: number
  defaultHours?: number
  /** Years the "still ahead" figure counts up to. */
  lifespan?: number
  yearsUnit?: string
  yearsCaption?: string
  shareCaption?: string
  /** "media": glass panel on a dark photo shell with a headline. "paper": the bare panel on white. */
  variant?: "media" | "paper"
  /** Headline of the media shell. */
  heading?: string
  /** Background photo of the media shell (decorative). */
  image?: string
  className?: string
}

type DragFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  min: number
  max: number
  /** Pixels of vertical drag per step. */
  sensitivity: number
  glass: boolean
}

/** Number field: drag up or down to change it, click to type, arrow keys to step. */
function DragField({ label, value, onChange, suffix, min, max, sensitivity, glass }: DragFieldProps) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const drag = useRef<{ y: number; start: number; moved: boolean } | null>(null)
  const set = (next: number) => onChange(String(Math.min(max, Math.max(min, next))))

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Touch scrolls the page; a tap focuses the input for typing.
    if (event.pointerType === "touch" || event.button !== 0) return
    event.preventDefault()
    drag.current = { y: event.clientY, start: Number(value) || 0, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state) return
    const delta = state.y - event.clientY
    if (Math.abs(delta) > 2) state.moved = true
    set(state.start + Math.round(delta / sensitivity))
  }

  const onPointerUp = () => {
    const state = drag.current
    drag.current = null
    if (state && !state.moved) input.current?.select()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    set((Number(value) || 0) + (event.key === "ArrowUp" ? 1 : -1) * (event.shiftKey ? 10 : 1))
  }

  return (
    <div>
      <label htmlFor={id} className={cn("block text-(length:--norma-text-eyebrow) font-medium", glass ? "text-background" : "text-foreground")}>
        {label}
      </label>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
        className={cn(
          "mt-1.5 flex cursor-ns-resize items-center gap-1 rounded-full border px-5 transition-colors duration-200 ease-kit select-none motion-reduce:transition-none",
          glass
            ? "border-background/25 bg-background/5 focus-within:border-background/70"
            : "border-border bg-background focus-within:border-foreground"
        )}
      >
        <input
          ref={input}
          id={id}
          type="text"
          inputMode="numeric"
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={Number(value) || 0}
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full min-w-0 cursor-ns-resize bg-transparent py-2.5 text-(length:--norma-text-body-lg) font-semibold tabular-nums outline-none",
            glass ? "text-background" : "text-foreground"
          )}
        />
        {suffix && (
          <span aria-hidden className={cn("text-sm font-medium", glass ? "text-background/50" : "text-(--norma-ink-3)")}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * The shown number: counts up from 0 once `started`, then eases to every new
 * value (ease-out cubic, 600 ms). Before it starts, and with reduced motion,
 * it is the real value.
 */
function useEasedNumber(value: number, started: boolean, reduced: boolean) {
  const [shown, setShown] = useState<number | null>(null)
  const readShown = useEffectEvent(() => shown)

  useEffect(() => {
    if (reduced || !started) return
    const from = readShown() ?? 0
    if (from === value) return
    const began = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - began) / 600)
      setShown(from + (value - from) * (1 - (1 - t) ** 3))
      if (t < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [value, started, reduced])

  return reduced ? value : (shown ?? value)
}

/** `suffix` keeps the number's color (25%); `unit` is muted (14.0 years). */
type StatProps = { value: number; decimals: number; suffix?: string; unit?: string; caption: string; bar?: number; started: boolean; glass: boolean }

function Stat({ value, decimals, suffix, unit, caption, bar, started, glass }: StatProps) {
  const reduced = useReducedMotion()
  const shown = useEasedNumber(value, started, reduced)
  return (
    <div>
      <p
        aria-hidden
        className={cn(
          "text-[clamp(1.625rem,1.1rem+1.7cqi,2.125rem)] leading-none font-semibold tracking-(--norma-tracking-display) tabular-nums",
          glass ? "text-background" : "text-foreground"
        )}
      >
        {shown.toFixed(decimals)}
        {suffix}
        {unit && <span className={glass ? "text-background/50" : "text-(--norma-ink-3)"}>{unit}</span>}
      </p>
      <p className={cn("mt-1.5 text-(length:--norma-text-eyebrow) leading-snug", glass ? "text-background/65" : "text-muted-foreground")}>
        <span className="sr-only">
          {value.toFixed(decimals)}
          {suffix}
          {unit}{" "}
        </span>
        {caption}
      </p>
      {bar !== undefined && (
        <div aria-hidden className={cn("mt-2.5 h-1.5 w-full overflow-hidden rounded-full", glass ? "bg-background/20" : "bg-border")}>
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-300 ease-kit motion-reduce:transition-none",
              glass ? "bg-background" : "bg-foreground"
            )}
            style={{ width: `${Math.min(100, bar)}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function ScreenTimeCalculator({
  title = "Count your screen time in years.",
  ageLabel = "Your age",
  hoursLabel = "Daily screen time",
  defaultAge = 24,
  defaultHours = 6,
  lifespan = 80,
  yearsUnit = " years",
  yearsCaption = "still ahead, spent on a screen",
  shareCaption = "of your whole life",
  variant = "media",
  heading = "Screens are built to keep you looking.",
  image = "/kits/norma/hero.webp",
  className,
}: ScreenTimeCalculatorProps) {
  const [age, setAge] = useState(String(defaultAge))
  const [screen, setScreen] = useState(String(defaultHours))
  const { ref: resultsRef, visible: resultsVisible } = useReveal({ threshold: 0.35, rootMargin: "0px" })
  const glass = variant === "media"

  const years = Math.min(100, Math.max(1, Number(age) || 0))
  const hours = Math.min(24, Math.max(0, Number(screen) || 0))
  const share = (hours / 24) * 100
  const ahead = (hours * Math.max(0, lifespan - years)) / 24

  const panel = (
    <div
      className={cn(
        "@container overflow-hidden rounded-kit border",
        glass ? "border-(--norma-line-inverse) bg-background/10 backdrop-blur-md" : "border-border bg-background",
        !glass && className
      )}
    >
      <div className="grid grid-cols-1 @3xl:grid-cols-2">
        <div className={cn("border-b p-6 @lg:p-7 @3xl:border-r @3xl:border-b-0", glass ? "border-(--norma-line-inverse)" : "border-border")}>
          <h3
            className={cn(
              "max-w-[22ch] font-display text-(length:--norma-text-h3) leading-(--norma-leading-snug) font-semibold text-balance",
              glass ? "text-background" : "text-foreground"
            )}
          >
            {title}
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <DragField label={ageLabel} value={age} onChange={setAge} min={1} max={100} sensitivity={5} glass={glass} />
            <DragField label={hoursLabel} value={screen} onChange={setScreen} suffix="h" min={0} max={24} sensitivity={8} glass={glass} />
          </div>
        </div>
        <div ref={resultsRef} aria-live="polite" className="grid grid-cols-1 items-start gap-5 p-6 @[18rem]:grid-cols-2 @lg:p-7">
          <Stat value={Math.round(ahead * 10) / 10} decimals={1} unit={yearsUnit} caption={yearsCaption} started={resultsVisible} glass={glass} />
          <Stat value={Math.round(share)} decimals={0} suffix="%" caption={shareCaption} bar={share} started={resultsVisible} glass={glass} />
        </div>
      </div>
    </div>
  )

  if (!glass) return panel

  return <MediaShell heading={heading} image={image} className={className}>{panel}</MediaShell>
}

function MediaShell({ heading, image, className, children }: { heading: string; image: string; className?: string; children: ReactNode }) {
  return (
    <section className={cn("@container bg-background px-(--norma-gutter-outer) py-section", className)}>
      <Reveal>
        <div
          data-norma-invert
          className="relative mx-auto flex min-h-[72vh] max-w-(--norma-container-wide) flex-col justify-between overflow-hidden rounded-kit-lg bg-(--norma-coal)"
        >
          <img src={image} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-linear-to-r from-black/55 via-black/25 to-black/15" />
          <div className="relative z-10 mx-auto w-full max-w-kit px-gutter pt-10 @xl:pt-14">
            <h2 className="max-w-[18ch] font-display text-(length:--norma-text-h2) leading-(--norma-leading-heading) font-semibold tracking-(--norma-tracking-heading) text-balance text-background">
              {heading}
            </h2>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-kit px-gutter pt-10 pb-8 @xl:pb-10">{children}</div>
        </div>
      </Reveal>
    </section>
  )
}
