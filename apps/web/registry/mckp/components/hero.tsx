"use client"

import type { CSSProperties } from "react"
import { Badge } from "@/registry/mckp/components/badge"
import { Button } from "@/registry/mckp/components/button"
import type { HeroProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { useScrollProgress } from "@/registry/restyle/hooks/use-scroll-progress"

// Hero items rise 40px into place one after another; the scene fades in last.
const keyframes =
  "@keyframes mckp-hero-in{0%{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}@keyframes mckp-scene-in{0%{opacity:0}to{opacity:1}}"
const appear = "animate-[mckp-hero-in_.9s_cubic-bezier(.16,1,.3,1)_backwards] [animation-delay:var(--d,0s)] motion-reduce:animate-none"
const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties

const body = "text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line)"

// The scene drifts a little slower than the page while it scrolls past.
const drift = "translate-y-[calc((var(--scroll-progress,0.5)_-_0.5)_*_-80px)] scale-[1.06]"

function SceneVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
        className={cn("block size-full object-cover", drift)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-6 right-gutter z-[2] grid size-8 place-items-center rounded-kit bg-(--mckp-surface-glass) text-foreground backdrop-blur-[40px] backdrop-saturate-[1.4] transition-colors duration-200 hover:bg-(--mckp-surface-raised) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3 fill-current">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
    </>
  )
}

function Scene({ media }: { media: Media }) {
  const ref = useScrollProgress<HTMLDivElement>({ reducedMotionValue: 0.5 })
  return (
    <div
      ref={ref}
      style={at(0.6)}
      className={cn(
        "relative mx-auto aspect-[16/9] max-h-[808px] w-full max-w-[1920px] overflow-clip max-md:aspect-[4/3]",
        "animate-[mckp-scene-in_1.2s_cubic-bezier(.16,1,.3,1)_backwards] [animation-delay:var(--d,0s)] motion-reduce:animate-none"
      )}
    >
      {media.type === "video" ? (
        <SceneVideo media={media} />
      ) : (
        <img
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          fetchPriority="high"
          className={cn("block size-full object-cover", drift)}
        />
      )}
      {/* The scene dissolves into the page at both ends. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-[240px] max-h-[25%] bg-[linear-gradient(var(--background)_8%,transparent)] max-md:h-[120px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-[300px] max-h-[40%] bg-[linear-gradient(transparent,var(--background)_90%)] max-md:h-[160px]"
      />
    </div>
  )
}

/**
 * Source: the hero stage. A centred stack (announcement line, tight two-line
 * headline, quiet description, white button) rises into place item by item,
 * then the lit device scene fades in underneath and dissolves into the page.
 */
export function Hero({ eyebrow, title, description, actions, media, className }: HeroProps) {
  return (
    <section className={cn("relative overflow-clip bg-background text-foreground", className)}>
      <style href="mckp-hero" precedence="default">
        {keyframes}
      </style>
      <div className="relative z-[1] mx-auto flex min-h-(--mckp-hero-min-height) max-w-kit flex-col items-center justify-center gap-6 px-gutter py-[60px] text-center max-md:gap-5 max-md:py-6">
        {eyebrow && (
          <div style={at(0.15)} className={appear}>
            <Badge>{eyebrow}</Badge>
          </div>
        )}
        <h1
          style={at(0.25)}
          className={cn(
            appear,
            "max-w-[12em] text-balance font-display text-[length:var(--mckp-type-h1)] font-medium leading-(--mckp-type-h1-line) tracking-(--mckp-type-h1-tracking) text-foreground"
          )}
        >
          {title}
        </h1>
        {description && (
          <p style={at(0.4)} className={cn(appear, body, "max-w-[494px] text-pretty text-muted-foreground")}>
            {description}
          </p>
        )}
        {actions && actions.length > 0 && (
          <div style={at(0.5)} className={cn(appear, "flex flex-wrap items-center justify-center gap-3")}>
            {actions.map((action) => (
              <Button key={action.label} href={action.href} size="lg" variant={action.variant ?? "primary"}>
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {media && (
        <div className="-mt-16 max-md:mt-0">
          <Scene media={media} />
        </div>
      )}
    </section>
  )
}
