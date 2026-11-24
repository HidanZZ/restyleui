"use client"

import type { FeatureTabsProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { Reveal } from "@/registry/teamwork/components/reveal"
import { Tabs } from "@/registry/teamwork/components/tabs"

const dashed = "border-dashed border-[color-mix(in_srgb,var(--input)_55%,transparent)]"

function TabMedia({ media }: { media: Media }) {
  const { ref, playing, toggle } = useInViewVideo()
  if (media.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-agnostic
      <img
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading="lazy"
        className="aspect-[16/10] w-full rounded-kit object-cover"
      />
    )
  }
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
        className="aspect-[16/10] w-full rounded-kit object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-5 bottom-5 grid size-8 cursor-pointer place-items-center rounded-kit bg-background/80 text-foreground transition-colors duration-150 ease-kit hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 fill-current">
          {playing ? <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" /> : <path d="M5 3.25v9.5L12.5 8z" />}
        </svg>
      </button>
    </>
  )
}

// The source's sample-prompt section: dashed rules above and below, a centred heading,
// a selector, and the answer drawn inside a dashed graph panel.
export function FeatureTabs({ eyebrow, title, description, tabs, className }: FeatureTabsProps) {
  return (
    <section className={cn("w-full border-y bg-background py-section font-body text-foreground max-sm:py-20", dashed, className)}>
      <div className="mx-auto flex w-full max-w-kit flex-col gap-12 px-gutter sm:gap-16">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          {eyebrow && (
            <p className="font-mono text-xs leading-5 font-medium tracking-[1px] text-(--teamwork-text-subtle) uppercase">{eyebrow}</p>
          )}
          <h2 className="max-w-[32ch] font-display text-[28px] leading-[1.4] font-normal tracking-[0.5px] text-balance text-foreground sm:text-(length:--teamwork-text-display) sm:leading-(--teamwork-leading-display)">
            {title}
          </h2>
          {description && (
            <p className="max-w-[600px] text-(length:--teamwork-text-body) leading-(--teamwork-leading-body) text-(--teamwork-text-subtle)">
              {description}
            </p>
          )}
        </Reveal>

        <Reveal delay={150}>
          <Tabs
            className="gap-10 sm:[&_[role=tablist]]:justify-center"
            items={tabs.map((tab) => ({
              id: tab.id,
              label: tab.label,
              content: (
                <div className={cn("grid items-center gap-8 rounded-kit-sm border p-4 sm:p-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14 lg:p-12", dashed)}>
                  <div className="flex flex-col gap-1 lg:ps-2">
                    <h3>{tab.title}</h3>
                    <p className="text-muted-foreground">{tab.description}</p>
                  </div>
                  <div className="relative rounded-kit-lg border border-border bg-(--teamwork-surface-sunken) p-2 shadow-(--teamwork-shadow-overlay) sm:p-3">
                    <TabMedia media={tab.media} />
                  </div>
                </div>
              ),
            }))}
          />
        </Reveal>
      </div>
    </section>
  )
}
