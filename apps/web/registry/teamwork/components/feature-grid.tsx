"use client"

import type { FeatureGridProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { Reveal } from "@/registry/teamwork/components/reveal"

// One-pixel dotted rules, as on the source's grid cells.
const rule = "border-dotted border-[color-mix(in_srgb,var(--input)_60%,transparent)]"

function FeatureVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
        className="size-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-2 bottom-2 grid size-8 cursor-pointer place-items-center rounded-kit bg-background/80 text-foreground transition-colors duration-150 ease-kit hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 fill-current">
          {playing ? <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" /> : <path d="M5 3.25v9.5L12.5 8z" />}
        </svg>
      </button>
    </>
  )
}

// The source's "getting started" board: a dotted header cell, then a grid of dotted cells
// with a compact label, a medium display heading and reading copy.
export function FeatureGrid({ eyebrow, title, description, features, className }: FeatureGridProps) {
  return (
    <section className={cn("w-full bg-background py-section font-body text-foreground max-sm:py-20", className)}>
      <div className="mx-auto w-full max-w-kit px-gutter">
        <Reveal className={cn("flex flex-col items-center gap-4 border px-6 py-12 text-center sm:px-10 sm:py-16", rule)}>
          {eyebrow && (
            <p className="font-mono text-xs leading-5 font-medium tracking-[1px] text-(--teamwork-text-subtle) uppercase">{eyebrow}</p>
          )}
          <h2 className="max-w-[32ch] font-display text-[28px] leading-[1.4] font-normal tracking-[0.5px] text-balance text-foreground sm:text-(length:--teamwork-text-display) sm:leading-(--teamwork-leading-display)">
            {title}
          </h2>
          {description && (
            <p className="max-w-[600px] text-(length:--teamwork-text-body) leading-(--teamwork-leading-body) text-muted-foreground">
              {description}
            </p>
          )}
        </Reveal>

        <Reveal stagger className={cn("grid border-l sm:grid-cols-2 lg:grid-cols-3", rule)}>
          {features.map((feature, i) => (
            <article key={feature.title} className={cn("flex h-full flex-col gap-6 border-r border-b p-8 lg:p-10", rule)}>
              {feature.media && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-kit bg-(--teamwork-surface-sunken)">
                  {feature.media.type === "video" ? (
                    <FeatureVideo media={feature.media} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-agnostic
                    <img
                      src={feature.media.src}
                      alt={feature.media.alt}
                      width={feature.media.width}
                      height={feature.media.height}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  )}
                </div>
              )}
              <div className="flex items-center justify-between gap-4">
                {feature.icon ? (
                  <span aria-hidden className="grid size-10 place-items-center rounded-kit-sm bg-(--teamwork-surface-sunken) text-(--teamwork-blue) [&_svg]:size-5">
                    {feature.icon}
                  </span>
                ) : (
                  <span aria-hidden className="size-2 rounded-full bg-(--teamwork-blue)" />
                )}
                <span aria-hidden className="font-mono text-xs leading-5 tracking-[1px] text-(--teamwork-text-subtle)">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl leading-[30px] tracking-[0.5px] text-foreground sm:text-(length:--teamwork-text-title) sm:leading-(--teamwork-leading-title)">
                  {feature.title}
                </h3>
                <p className="text-(length:--teamwork-text-body) leading-(--teamwork-leading-body) text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
