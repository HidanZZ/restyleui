"use client"

import type { CardProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"

const mediaClass = "block aspect-[16/10] w-full object-cover object-bottom"

function TileVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
      {/* The source's inline media control: a 36px translucent gray circle. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute top-4 right-4 z-[4] flex size-9 cursor-pointer items-center justify-center rounded-full bg-(--apple-separator)/64 text-foreground/56 backdrop-blur-md transition-[background-color,color,scale] duration-200 hover:bg-accent/70 hover:text-foreground/64 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring active:scale-95 motion-reduce:transition-none"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          {playing ? <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" /> : <path d="M4.5 2.4v11.2L13.6 8z" />}
        </svg>
      </button>
    </>
  )
}

/**
 * Apple promo tile: a flat light-gray block with centered headline, subhead,
 * a short detail and a blue pill, over full-bleed media aligned to the bottom.
 * With `href` the pill is the link and its hit area covers the whole tile.
 * No hover lift, no image zoom, square corners.
 */
export function Card({ title, description, eyebrow, media, href, children, className }: CardProps) {
  return (
    <article
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-(--apple-tile-radius) bg-card text-center font-body text-card-foreground antialiased",
        "pt-(--apple-tile-padding-y-mobile) min-[735px]:pt-[44px] min-[1069px]:pt-[53px]",
        className
      )}
    >
      <div className="flex flex-col items-center px-6 pb-(--apple-tile-padding-y-mobile) min-[735px]:pb-[44px] min-[1069px]:pb-[53px]">
        {eyebrow && (
          <p className="mb-1 text-(length:--apple-promo-callout-size) leading-(--apple-promo-callout-line-height) font-semibold tracking-(--apple-promo-callout-letter-spacing) text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h3 className="font-display text-(length:--apple-promo-title-size-compact) leading-(--apple-promo-title-line-height-compact) font-semibold tracking-(--apple-promo-title-letter-spacing-compact) text-balance min-[1069px]:text-(length:--apple-promo-title-size) min-[1069px]:leading-(--apple-promo-title-line-height) min-[1069px]:tracking-(--apple-promo-title-letter-spacing)">
          {title}
        </h3>
        {description && (
          <p className="mt-1 max-w-[34ch] font-display text-(length:--apple-promo-subhead-size-compact) leading-(--apple-promo-subhead-line-height-compact) tracking-(--apple-promo-subhead-letter-spacing-compact) text-pretty min-[1069px]:mt-[3px] min-[1069px]:text-(length:--apple-promo-subhead-size) min-[1069px]:leading-(--apple-promo-subhead-line-height) min-[1069px]:tracking-(--apple-promo-subhead-letter-spacing)">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-2 max-w-[40ch] text-(length:--apple-promo-callout-size) leading-(--apple-promo-callout-line-height) tracking-(--apple-promo-callout-letter-spacing) text-muted-foreground">
            {children}
          </div>
        )}
        {href && (
          <a
            href={href}
            className={cn(
              "mt-[11px] inline-flex items-center rounded-(--apple-button-radius) bg-primary px-[15px] py-[8px] text-(length:--apple-button-size) leading-(--apple-button-line-height) tracking-(--apple-button-letter-spacing) whitespace-nowrap text-primary-foreground no-underline min-[735px]:mt-3",
              "hover:bg-(--apple-blue-hover) active:bg-(--apple-blue-active) focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring",
              // The whole tile is the link's hit area, like the source's tile-link.
              "after:absolute after:inset-0 after:z-[3] after:content-['']"
            )}
          >
            Learn more<span className="sr-only">: {title}</span>
          </a>
        )}
      </div>
      {media && (
        <div className="relative mt-auto w-full">
          {media.type === "video" ? (
            <TileVideo media={media} />
          ) : (
            <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" className={mediaClass} />
          )}
        </div>
      )}
    </article>
  )
}
