"use client"

import { Reveal } from "@/registry/mckp/components/reveal"
import type { FeatureGridProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"

type Feature = FeatureGridProps["features"][number]

const body = "text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line)"
const mono = "font-mono text-[length:var(--mckp-type-mono)] leading-(--mckp-type-mono-line)"
const h2 =
  "font-display text-[length:var(--mckp-type-h2)] font-normal leading-(--mckp-type-h2-line) tracking-(--mckp-type-h2-tracking) text-foreground"

// The scene slowly settles closer while the card is hovered.
const settle =
  "size-full object-cover transition-transform duration-[1.2s] ease-kit group-hover/feature:scale-[1.03] motion-reduce:transition-none"

function FeatureVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
  const { ref, playing, toggle } = useInViewVideo({ threshold: 0.2 })
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
        className={settle}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-4 top-4 z-[2] grid size-7 place-items-center rounded-kit bg-(--mckp-surface-glass) text-foreground backdrop-blur-[40px] backdrop-saturate-[1.4] transition-colors duration-200 hover:bg-(--mckp-surface-raised) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3 fill-current">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
    </>
  )
}

function FeatureText({ feature }: { feature: Feature }) {
  return (
    <div className="relative flex max-w-[400px] flex-col">
      <h3 className={cn(body, "font-normal text-card-foreground")}>{feature.title}</h3>
      <p className={cn(body, "text-(--mckp-ink-dim)")}>{feature.description}</p>
    </div>
  )
}

/** The clone's features grid card: a deep surface whose scene fills the card, text set over a black fade. */
function MediaCard({ feature }: { feature: Feature }) {
  return (
    <article className="group/feature relative isolate flex h-full min-h-[548px] flex-col gap-2.5 overflow-clip rounded-kit bg-(--mckp-surface-deep) p-(--mckp-feature-pad) max-md:min-h-[400px] max-md:p-(--mckp-card-pad)">
      {feature.media && (
        <div className="absolute inset-0 -z-10 overflow-hidden after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:z-[1] after:h-[36%] after:bg-[linear-gradient(transparent,color-mix(in_srgb,var(--mckp-page-black)_70%,transparent)_50%,var(--mckp-page-black)_90%)]">
          {feature.media.type === "video" ? (
            <FeatureVideo media={feature.media} />
          ) : (
            <img
              src={feature.media.src}
              alt={feature.media.alt}
              width={feature.media.width}
              height={feature.media.height}
              loading="lazy"
              className={settle}
            />
          )}
        </div>
      )}
      {feature.icon && <span className="relative text-foreground [&_svg]:size-6">{feature.icon}</span>}
      <div className="flex-1" />
      <FeatureText feature={feature} />
    </article>
  )
}

/** The clone's step card: a flat surface, a mono number or an icon at the top, the message at the bottom. */
function StepCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <article className="flex h-full min-h-[200px] min-w-0 flex-col justify-between gap-12 rounded-kit-lg bg-card p-(--mckp-card-pad) transition-colors duration-500 ease-kit-in-out hover:bg-(--mckp-surface-raised) max-md:min-h-0 max-md:gap-6 motion-reduce:transition-none">
      {feature.icon ? (
        <span className="text-(--mckp-ink-faint) [&_svg]:size-6">{feature.icon}</span>
      ) : (
        <span aria-hidden="true" className={cn(mono, "text-(--mckp-ink-dim)")}>
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <FeatureText feature={feature} />
    </article>
  )
}

/**
 * Source: the text block and the cards below it. The heading sits at column
 * 2, the support line at column 7; then a cut grid of cards. Features with
 * media use the clone's features grid instead: 2 columns, 548px rows, 4px
 * gaps, the scene filling each card. An odd last card spans the full row.
 */
export function FeatureGrid({ eyebrow, title, description, features, className }: FeatureGridProps) {
  const withMedia = features.some((feature) => feature.media)

  return (
    <section className={cn("mx-auto max-w-kit px-gutter pt-section pb-(--mckp-section-y-sm)", className)}>
      <header className="grid grid-cols-9 pb-(--mckp-section-y-sm) max-lg:grid-cols-1 max-lg:gap-6">
        <Reveal className="col-[2/6] max-lg:col-[1]">
          {eyebrow && <p className={cn(mono, "mb-3 text-(--mckp-ink-mono)")}>{eyebrow}</p>}
          <h2 className={h2}>{title}</h2>
        </Reveal>
        {description && (
          <Reveal delay={150} className="col-[7/9] max-lg:col-[1] max-lg:max-w-[400px]">
            <p className={cn(body, "text-(--mckp-ink-dim)")}>{description}</p>
          </Reveal>
        )}
      </header>

      <Reveal
        stagger
        className={cn(
          "grid",
          withMedia
            ? "grid-cols-2 gap-1 max-md:grid-cols-1 md:[&>:last-child:nth-child(odd)]:col-span-2"
            : "grid-cols-3 gap-(--mckp-tile-gap) max-md:grid-cols-1"
        )}
      >
        {features.map((feature, index) =>
          withMedia ? (
            <MediaCard key={feature.title} feature={feature} />
          ) : (
            <StepCard key={feature.title} feature={feature} index={index} />
          )
        )}
      </Reveal>
    </section>
  )
}
