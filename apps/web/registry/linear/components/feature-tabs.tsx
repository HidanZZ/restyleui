"use client"

import type { FeatureTabsProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { Reveal } from "@/registry/linear/components/reveal"
import { Tabs } from "@/registry/linear/components/tabs"

function TabVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
        className="block size-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className={cn(
          "absolute bottom-3 right-3 z-10 grid size-8 cursor-pointer place-items-center rounded-full bg-(--linear-bg-translucent) text-(--linear-text-secondary) backdrop-blur-[4px]",
          "shadow-[inset_0_0_0_1px_#ffffff08,0_0_0_1px_#0009] transition-colors duration-100 ease-kit hover:bg-(--linear-bg-level-3) hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
        )}
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 fill-current">
          {playing ? (
            <path d="M4.5 3h2v10h-2zM9.5 3h2v10h-2z" />
          ) : (
            <path d="M5 3.2v9.6a.5.5 0 0 0 .76.43l7.7-4.8a.5.5 0 0 0 0-.86l-7.7-4.8A.5.5 0 0 0 5 3.2Z" />
          )}
        </svg>
      </button>
    </>
  )
}

function TabMedia({ media }: { media: Media }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] border border-(--linear-border-translucent) bg-(--linear-bg-marketing)">
      {media.type === "video" ? (
        <TabVideo media={media} />
      ) : (
        <img
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading="lazy"
          decoding="async"
          className="block size-full object-cover"
        />
      )}
    </div>
  )
}

/**
 * Designed from the source's feature sections. A hairline keyline opens the
 * section; the two-line title sits on the left and the larger secondary
 * description on the right, both on the same baseline. The kit's workspace
 * tabs switch the product view below, with each tab's title and copy under
 * its media.
 */
export function FeatureTabs({ eyebrow, title, description, tabs, className }: FeatureTabsProps) {
  return (
    <section
      className={cn(
        // Keyline: a translucent hairline with a black one above it, edge to edge.
        "border-t border-(--linear-border-translucent-strong) bg-background font-body text-foreground shadow-[0_-1px_0_var(--linear-bg-marketing)]",
        "pb-[calc(var(--kit-section-y)*2)] pt-[calc(var(--kit-section-y)*1.5)] lg:pt-[calc(var(--kit-section-y)*2)]",
        className
      )}
    >
      <div className="mx-auto max-w-kit px-gutter">
        <Reveal className="grid items-end gap-6 px-(--linear-homepage-padding-inset) pb-12 md:pb-16 lg:grid-cols-2 lg:gap-0 lg:pb-24">
          <div className="lg:pr-8">
            {eyebrow && (
              <p className="mb-6 font-mono text-xs uppercase leading-[1.4] text-(--linear-text-quaternary) lg:mb-8">{eyebrow}</p>
            )}
            <h2
              className={cn(
                "max-w-[18ch] text-balance font-[510]",
                "text-[length:var(--linear-title-3-size)] leading-[1.33] tracking-[-0.012em]",
                "md:text-[length:var(--linear-title-5-size)] md:leading-[1.1] md:tracking-[-0.022em]",
                "xl:text-[length:var(--linear-title-6-size)] xl:leading-none"
              )}
            >
              {title}
            </h2>
          </div>
          {description && (
            <p
              className={cn(
                "max-w-[38ch] text-pretty text-muted-foreground md:text-(--linear-text-secondary)",
                "text-[15px] leading-[1.6] tracking-[-0.011em]",
                "md:text-[length:var(--linear-title-2-size)] md:leading-[1.33] md:tracking-[-0.012em]",
                "xl:text-[length:var(--linear-title-3-size)]"
              )}
            >
              {description}
            </p>
          )}
        </Reveal>

        <Reveal delay={120}>
          <Tabs
            items={tabs.map((tab) => ({
              id: tab.id,
              label: tab.label,
              content: (
                <div className="-m-4 grid gap-6 sm:-m-6 lg:gap-8">
                  <TabMedia media={tab.media} />
                  <div className="grid gap-2 px-2 pb-2 sm:px-4 lg:grid-cols-2 lg:gap-8">
                    <h3>{tab.title}</h3>
                    <p className="lg:mt-0!">{tab.description}</p>
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
