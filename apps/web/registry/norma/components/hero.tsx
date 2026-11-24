"use client"

import type { Action, HeroProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { Badge } from "@/registry/norma/components/badge"
import { Button } from "@/registry/norma/components/button"
import { Reveal } from "@/registry/norma/components/reveal"

const fill = "pointer-events-none absolute inset-0 -z-10 size-full object-cover"

function HeroVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
  const { ref, playing, toggle } = useInViewVideo()
  return (
    <>
      <video ref={ref} src={media.src} poster={media.poster} aria-label={media.alt} loop muted playsInline preload="metadata" className={fill} />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-4 bottom-4 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-background/15 text-primary-foreground ring-1 ring-background/25 backdrop-blur-xl outline-none transition-colors duration-200 ease-kit hover:bg-background/25 focus-visible:ring-2 focus-visible:ring-background sm:right-6 sm:bottom-6 motion-reduce:transition-none"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          {playing ? <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" /> : <path d="M5 3.2v9.6L13 8z" />}
        </svg>
      </button>
    </>
  )
}

/** Over film the primary pill is paper; the quiet one is white glass. */
function HeroAction({ action }: { action: Action }) {
  const primary = (action.variant ?? "primary") === "primary"
  return (
    <Button
      href={action.href}
      size="sm"
      variant={primary ? "primary" : "secondary"}
      className={cn(
        "w-full sm:w-auto",
        primary
          ? "bg-background text-foreground hover:bg-background/90"
          : "border-primary-foreground/30 bg-background/10 text-primary-foreground backdrop-blur-md hover:border-primary-foreground/30 hover:bg-background/20"
      )}
    >
      {action.label}
    </Button>
  )
}

/**
 * Norma hero: a full-bleed 28px film shell inset from the viewport edge. Type
 * sits on a top-down ink veil: a glass eyebrow pill, a tight two-line headline
 * on the left, lead copy and pill actions on the right (1.15fr / 0.85fr). The
 * shell carries `data-norma-invert`, so the Norma navbar turns to white glass
 * over it. Copy blurs into focus, staged 80ms apart.
 */
export function Hero({ eyebrow, title, description, actions, media, className }: HeroProps) {
  return (
    <section className={cn("relative z-10 bg-background px-(--norma-gutter-outer) pt-(--norma-gutter-outer) font-body", className)}>
      <div
        data-norma-invert
        className="relative isolate mx-auto flex min-h-[84vh] max-w-(--norma-container-wide) flex-col overflow-hidden rounded-kit-lg bg-(--norma-coal) text-primary-foreground"
      >
        {media?.type === "video" && <HeroVideo media={media} />}
        {media?.type === "image" && (
          <img src={media.src} alt={media.alt} width={media.width} height={media.height} fetchPriority="high" className={fill} />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-foreground/55 via-foreground/25 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-kit px-gutter pt-28 pb-24 sm:pt-36">
          {eyebrow && (
            <Reveal className="hidden sm:flex">
              <Badge className="bg-background/15 text-primary-foreground/80 backdrop-blur-md">{eyebrow}</Badge>
            </Reveal>
          )}
          <div className={cn("grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start", eyebrow && "sm:mt-7")}>
            <Reveal delay={80}>
              <h1 className="text-(length:--norma-text-h1) leading-(--norma-leading-tight) font-semibold tracking-(--norma-tracking-display) text-balance">
                {title}
              </h1>
            </Reveal>
            {(description || (actions && actions.length > 0)) && (
              <Reveal delay={160}>
                {description && (
                  <p className="max-w-[44ch] text-(length:--norma-text-body-lg) leading-(--norma-leading-body) font-medium text-pretty text-primary-foreground/80">
                    {description}
                  </p>
                )}
                {actions && actions.length > 0 && (
                  <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", description && "mt-6")}>
                    {actions.map((action) => (
                      <HeroAction key={action.label} action={action} />
                    ))}
                  </div>
                )}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
