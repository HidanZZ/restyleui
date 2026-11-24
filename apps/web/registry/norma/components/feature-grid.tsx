"use client"

import type { FeatureGridProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { Badge } from "@/registry/norma/components/badge"
import { Reveal } from "@/registry/norma/components/reveal"

const mediaClass =
  "absolute inset-0 size-full object-cover transition-transform duration-[600ms] ease-kit group-hover:scale-105 motion-reduce:transition-none"

function StepVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
  const { ref, playing, toggle } = useInViewVideo()
  return (
    <>
      <video ref={ref} src={media.src} poster={media.poster} aria-label={media.alt} loop muted playsInline preload="metadata" className={mediaClass} />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-4 bottom-4 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background/15 text-primary-foreground ring-1 ring-background/25 backdrop-blur-md outline-none transition-colors duration-200 hover:bg-background/25 focus-visible:ring-2 focus-visible:ring-background motion-reduce:transition-none"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          {playing ? <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" /> : <path d="M5 3.2v9.6L13 8z" />}
        </svg>
      </button>
    </>
  )
}

function columns(count: number) {
  if (count === 3) return "sm:grid-cols-3"
  if (count === 2 || count === 4) return "sm:grid-cols-2"
  return "sm:grid-cols-2 lg:grid-cols-3"
}

/**
 * Norma feature grid, after the "how it works" steps: a left-aligned heading
 * and lead, then tall 36px hairline cards. Each card opens with a round chip
 * (the icon, or the step number), a title and a short line; media fills the
 * rest under a hairline and scales slowly on hover. Cards rise 110ms apart.
 */
export function FeatureGrid({ eyebrow, title, description, features, className }: FeatureGridProps) {
  return (
    <section className={cn("bg-background py-(--norma-section-y-lg) font-body text-foreground", className)}>
      <div className="mx-auto w-full max-w-kit px-gutter">
        <Reveal>
          {eyebrow && <Badge className="mb-5">{eyebrow}</Badge>}
          <h2 className="max-w-[20ch] text-(length:--norma-text-h2) leading-(--norma-leading-heading) font-semibold tracking-(--norma-tracking-heading) text-balance">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-[46ch] text-(length:--norma-text-body-lg) leading-(--norma-leading-body) text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </Reveal>
        <ul className={cn("mt-12 grid grid-cols-1 gap-5 sm:mt-16", columns(features.length))}>
          {features.map((feature, index) => (
            <li key={feature.title}>
              <Reveal delay={110 * (index % 3)} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-(--norma-radius-xl) border border-border bg-card text-card-foreground transition-colors duration-300 ease-kit hover:border-foreground/20 motion-reduce:transition-none">
                  <div className="p-7">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 ease-kit group-hover:border-foreground/40 group-hover:text-foreground motion-reduce:transition-none",
                        feature.icon
                          ? "size-10 [&_svg]:size-5"
                          : "size-7 text-(length:--norma-text-eyebrow) font-semibold tabular-nums"
                      )}
                    >
                      {feature.icon ?? index + 1}
                    </span>
                    <h3 className="mt-4 text-(length:--norma-text-h3) leading-(--norma-leading-snug) font-semibold tracking-[-0.01em] text-balance">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-[1.45] text-pretty text-muted-foreground">{feature.description}</p>
                  </div>
                  {feature.media && (
                    <div className="relative min-h-[240px] w-full flex-1 overflow-hidden border-t border-border bg-secondary">
                      {feature.media.type === "video" ? (
                        <StepVideo media={feature.media} />
                      ) : (
                        <img src={feature.media.src} alt={feature.media.alt} loading="lazy" className={mediaClass} />
                      )}
                    </div>
                  )}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
