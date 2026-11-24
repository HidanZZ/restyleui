"use client"

import { Button } from "@/registry/apple/components/button"
import { Reveal } from "@/registry/apple/components/reveal"
import type { HeroProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"

const mediaClass = "absolute inset-0 size-full object-cover object-bottom"

function HeroVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
      {/* The source's inline media control: a 36px translucent circle in the corner. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute end-4 bottom-4 z-[4] flex size-9 cursor-pointer items-center justify-center rounded-full bg-(--apple-separator)/64 text-foreground/56 backdrop-blur-md transition-[background-color,color,scale] duration-200 hover:bg-accent/70 hover:text-foreground/64 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring active:scale-95 motion-reduce:transition-none min-[1069px]:end-6 min-[1069px]:bottom-6"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          {playing ? <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" /> : <path d="M4.5 2.4v11.2L13.6 8z" />}
        </svg>
      </button>
    </>
  )
}

/**
 * Apple hero tile: a full-bleed black tile with a centered headline, subhead
 * and up to two pill actions over a wide product band aligned to the bottom.
 *
 * The surface reads `--apple-hero-bg`, `--apple-hero-fg`, `--apple-hero-muted`
 * and `--apple-hero-link` with the dark tile as fallback. Set them through
 * `className` for the light tile, for example
 * `[--apple-hero-bg:var(--apple-tile-light)] [--apple-hero-fg:var(--apple-text)]
 * [--apple-hero-muted:var(--apple-secondary-text)] [--apple-hero-link:var(--apple-link)]`.
 */
export function Hero({ eyebrow, title, description, actions, media, className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex w-full flex-col items-center overflow-hidden text-center font-body antialiased",
        "bg-[color:var(--apple-hero-bg,var(--apple-tile-dark))] text-[color:var(--apple-hero-fg,var(--apple-tile-dark-text))]",
        "pt-(--apple-tile-padding-y-mobile) min-[735px]:pt-(--apple-tile-padding-y-tablet) min-[1069px]:pt-(--apple-tile-padding-y-tall)",
        !media && "pb-[43px] min-[735px]:pb-[61px] min-[1069px]:pb-[63px]",
        className
      )}
    >
      <Reveal stagger className="relative z-[2] flex flex-col items-center px-6">
        {eyebrow && (
          <p
            className={cn(
              "mb-1 font-semibold text-[color:var(--apple-hero-muted,var(--apple-tertiary-text))]",
              "text-(length:--apple-tile-callout-size-compact) leading-(--apple-tile-callout-line-height-compact) tracking-(--apple-tile-callout-letter-spacing-compact)",
              "min-[1069px]:text-(length:--apple-tile-callout-size) min-[1069px]:leading-(--apple-tile-callout-line-height) min-[1069px]:tracking-(--apple-tile-callout-letter-spacing)"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "mx-auto max-w-[20ch] font-display font-semibold text-balance",
            "text-(length:--apple-tile-title-size-mobile) leading-(--apple-tile-title-line-height-mobile) tracking-(--apple-tile-title-letter-spacing-mobile)",
            "min-[735px]:text-(length:--apple-tile-title-size-tablet) min-[735px]:leading-(--apple-tile-title-line-height-tablet) min-[735px]:tracking-(--apple-tile-title-letter-spacing-tablet)",
            "min-[1069px]:text-(length:--apple-tile-title-size) min-[1069px]:leading-(--apple-tile-title-line-height) min-[1069px]:tracking-(--apple-tile-title-letter-spacing)"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mx-auto mt-1 max-w-[36ch] font-display text-pretty min-[1069px]:mt-[6px]",
              "text-(length:--apple-tile-subhead-size-mobile) leading-(--apple-tile-subhead-line-height-mobile) tracking-(--apple-tile-subhead-letter-spacing-mobile)",
              "min-[735px]:text-(length:--apple-tile-subhead-size-tablet) min-[735px]:leading-(--apple-tile-subhead-line-height-tablet) min-[735px]:tracking-(--apple-tile-subhead-letter-spacing-tablet)",
              "min-[1069px]:text-(length:--apple-tile-subhead-size) min-[1069px]:leading-(--apple-tile-subhead-line-height) min-[1069px]:tracking-(--apple-tile-subhead-letter-spacing)"
            )}
          >
            {description}
          </p>
        )}
        {actions && actions.length > 0 && (
          // The outline action reads `--apple-link`; on the dark tile it lifts to a lighter blue.
          <div className="mt-[11px] flex flex-wrap justify-center gap-[14px] [--apple-link:var(--apple-hero-link,color-mix(in_srgb,var(--primary)_75%,var(--background)))] min-[735px]:mt-4 min-[735px]:gap-[17px] min-[1069px]:mt-[17px]">
            {actions.map((action, index) => (
              <Button
                key={action.label}
                href={action.href}
                variant={action.variant ?? (index === 0 ? "primary" : "secondary")}
                size="lg"
                // Hero actions are elevated from 735px up and default-sized on phones, like the source.
                className="max-[734px]:px-[15px] max-[734px]:py-[8px] max-[734px]:text-(length:--apple-button-size) max-[734px]:leading-(--apple-button-line-height) max-[734px]:tracking-(--apple-button-letter-spacing)"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </Reveal>

      {media && (
        <div className="relative mt-6 aspect-[4/3] w-full min-[735px]:mt-8 min-[735px]:aspect-video min-[1069px]:mt-4 min-[1069px]:aspect-[11/5]">
          {media.type === "video" ? (
            <HeroVideo media={media} />
          ) : (
            <img src={media.src} alt={media.alt} width={media.width} height={media.height} className={mediaClass} />
          )}
        </div>
      )}
    </section>
  )
}
