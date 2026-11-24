"use client"

import { Reveal } from "@/registry/apple/components/reveal"
import { Tabs } from "@/registry/apple/components/tabs"
import type { FeatureTabsProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"

const mediaClass = "block size-full object-cover"

function PanelVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
        className={mediaClass}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute end-4 bottom-4 flex size-9 cursor-pointer items-center justify-center rounded-full bg-(--apple-separator)/64 text-foreground/56 backdrop-blur-md transition-[background-color,color,scale] duration-200 hover:bg-accent/70 hover:text-foreground/64 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring active:scale-95 motion-reduce:transition-none"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          {playing ? <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" /> : <path d="M4.5 2.4v11.2L13.6 8z" />}
        </svg>
      </button>
    </>
  )
}

/**
 * Designed: a light gray tile with a centered headline, the kit's segmented
 * control, and one wide picture per tab that cross-fades with its caption.
 */
export function FeatureTabs({ eyebrow, title, description, tabs, className }: FeatureTabsProps) {
  return (
    <section
      className={cn(
        "w-full bg-muted px-gutter font-body text-foreground antialiased",
        "py-16 min-[735px]:py-20 min-[1069px]:py-24",
        className
      )}
    >
      <Reveal stagger className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        {eyebrow && (
          <p className="mb-2 text-(length:--apple-tile-callout-size-compact) leading-(--apple-tile-callout-line-height-compact) font-semibold tracking-(--apple-tile-callout-letter-spacing-compact) text-muted-foreground min-[1069px]:text-(length:--apple-tile-callout-size) min-[1069px]:leading-(--apple-tile-callout-line-height) min-[1069px]:tracking-(--apple-tile-callout-letter-spacing)">
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "max-w-[22ch] font-display font-semibold text-balance",
            "text-(length:--apple-tile-title-size-mobile) leading-(--apple-tile-title-line-height-mobile) tracking-(--apple-tile-title-letter-spacing-mobile)",
            "min-[735px]:text-(length:--apple-tile-title-size-tablet) min-[735px]:leading-(--apple-tile-title-line-height-tablet) min-[735px]:tracking-(--apple-tile-title-letter-spacing-tablet)",
            "min-[1069px]:text-(length:--apple-tile-title-size) min-[1069px]:leading-(--apple-tile-title-line-height) min-[1069px]:tracking-(--apple-tile-title-letter-spacing)"
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-[40ch] font-display text-(length:--apple-promo-subhead-size-compact) leading-(--apple-promo-subhead-line-height-compact) tracking-(--apple-promo-subhead-letter-spacing-compact) text-pretty text-muted-foreground min-[1069px]:mt-4 min-[1069px]:text-(length:--apple-promo-subhead-size) min-[1069px]:leading-(--apple-promo-subhead-line-height) min-[1069px]:tracking-(--apple-promo-subhead-letter-spacing)">
            {description}
          </p>
        )}
      </Reveal>

      <Reveal delay={200} className="mx-auto mt-10 max-w-[980px] min-[1069px]:mt-12">
        <Tabs
          items={tabs.map((tab) => ({
            id: tab.id,
            label: tab.label,
            content: (
              <div className="flex flex-col items-center">
                <h3>{tab.title}</h3>
                <p>{tab.description}</p>
                <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-kit-lg bg-background min-[1069px]:mt-10">
                  {tab.media.type === "video" ? (
                    <PanelVideo media={tab.media} />
                  ) : (
                    <img
                      src={tab.media.src}
                      alt={tab.media.alt}
                      width={tab.media.width}
                      height={tab.media.height}
                      loading="lazy"
                      className={mediaClass}
                    />
                  )}
                </div>
              </div>
            ),
          }))}
        />
      </Reveal>
    </section>
  )
}
