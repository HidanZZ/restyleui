"use client"

import type { FeatureTabsProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { Badge } from "@/registry/norma/components/badge"
import { Reveal } from "@/registry/norma/components/reveal"
import { Tabs } from "@/registry/norma/components/tabs"

function TabVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
  const { ref, playing, toggle } = useInViewVideo()
  return (
    <>
      <video ref={ref} src={media.src} poster={media.poster} aria-label={media.alt} loop muted playsInline preload="metadata" className="size-full object-cover" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-5 bottom-5 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background/15 text-primary-foreground ring-1 ring-background/25 backdrop-blur-md outline-none transition-colors duration-200 hover:bg-background/25 focus-visible:ring-2 focus-visible:ring-background motion-reduce:transition-none"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          {playing ? <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" /> : <path d="M5 3.2v9.6L13 8z" />}
        </svg>
      </button>
    </>
  )
}

/**
 * Norma feature tabs: a full-bleed gray well. Heading and pill chips sit on the
 * left, the active feature's title and copy rest at the bottom of that column,
 * and its media floats on the right in a 44px device-like shell with the only
 * shadow on the page. The active chip flips to ink at once; copy and media
 * crossfade together in 600ms (they live in the same tab panel).
 */
export function FeatureTabs({ eyebrow, title, description, tabs, className }: FeatureTabsProps) {
  return (
    <section className={cn("bg-background px-(--norma-gutter-outer) font-body text-foreground", className)}>
      <div className="mx-auto max-w-(--norma-container-wide) rounded-kit-lg bg-secondary pt-12 pb-[4.75rem] sm:pt-20 sm:pb-28">
        {/* The media rail is absolute on desktop, so this box reserves its width and height. */}
        <div className="relative mx-auto flex w-full max-w-kit flex-col px-gutter lg:min-h-[450px] lg:pr-[calc(360px+4rem+var(--kit-gutter))]">
          <Reveal>
            {eyebrow && <Badge className="mb-5 bg-background">{eyebrow}</Badge>}
            <h2 className="max-w-[20ch] text-(length:--norma-text-h2) leading-(--norma-leading-heading) font-semibold tracking-(--norma-tracking-heading) text-balance">
              {title}
            </h2>
            {description && (
              <p className="mt-4 max-w-[46ch] text-(length:--norma-text-body-lg) leading-(--norma-leading-body) text-pretty text-muted-foreground">
                {description}
              </p>
            )}
          </Reveal>
          {/* No Reveal here: its transform would become the containing block of the absolute media. */}
          <Tabs
            className="mt-8 flex flex-1 flex-col lg:[&>div:last-child]:mt-auto lg:[&>div:last-child]:pt-12"
            items={tabs.map((tab) => ({
              id: tab.id,
              label: tab.label,
              content: (
                <div>
                  <h3>{tab.title}</h3>
                  <p>{tab.description}</p>
                  <div className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-(--norma-radius-phone) border border-foreground/10 bg-foreground/10 shadow-(--norma-shadow-float) lg:absolute lg:top-0 lg:right-(--kit-gutter) lg:mt-0 lg:w-[360px]">
                    {tab.media.type === "video" ? (
                      <TabVideo media={tab.media} />
                    ) : (
                      <img src={tab.media.src} alt={tab.media.alt} loading="lazy" className="size-full object-cover" />
                    )}
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  )
}
