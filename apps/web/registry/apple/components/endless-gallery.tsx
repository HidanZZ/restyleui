"use client"

import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselPlayToggle,
  CarouselViewport,
} from "@ui-sdk/react/carousel"
import type { LinkItem } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

export type EndlessGallerySlide = {
  /** Wide artwork, cropped to fill the tile (16:9 on desktop, portrait on phones). */
  src: string
  alt: string
  /** Short bold label before the caption, like a genre. */
  genre?: string
  caption: string
  /** The whole tile links here; the label shows as a light pill. */
  cta: LinkItem
}

export type EndlessGalleryProps = {
  title?: string
  /** Accessible name of the gallery. Defaults to `title`. */
  label?: string
  slides?: EndlessGallerySlide[]
  /** Starts rotating on its own (never with reduced motion). */
  autoplay?: boolean
  /** Milliseconds each slide shows while rotating. */
  interval?: number
  className?: string
}

const slide = (file: string, alt: string, genre: string, caption: string, label: string): EndlessGallerySlide => ({
  src: `/kits/apple/gallery-${file}.webp`,
  alt,
  genre,
  caption,
  cta: { label, href: "#" },
})

const defaultSlides: EndlessGallerySlide[] = [
  slide("far-shore", "A lighthouse on a rocky coast at sunset", "Drama", "A lighthouse keeper faces the storm of a lifetime.", "Watch now"),
  slide("orbit-station", "Two people at the window of a space station above a red planet", "Sci-Fi", "Two engineers, one window, a whole new world below.", "Stream now"),
  slide("citrus-kitchen", "A chef plating a citrus dessert", "Cooking", "Bright plates and patient hands, one season at a time.", "Watch now"),
  slide("cloud-train", "A small train crossing a bridge above pink clouds", "Family", "All aboard the sky railway for a trip above the clouds.", "Play now"),
  slide("alpine-fox", "A fox in a mountain meadow at dawn", "Nature", "Follow a young fox through its first mountain summer.", "Watch now"),
  slide("city-volley", "A volleyball player spiking the ball in an arena", "Sports", "Every rally, live and on demand, all season long.", "Stream now"),
]

/** The source shows each slide for 4.16 s after its 1 s slide-in. */
const KIT_INTERVAL = 5160

const FILL_KEYFRAMES = "@keyframes apple-gallery-fill{to{width:calc(100% - 16px)}}"

/*
 * Tile size per breakpoint, from the source: 1250x668 above 1440px, 930x523 on
 * desktop, 688x367 on tablet and a 275x496 portrait tile on phones. Widths are
 * capped so the neighbors still peek in a narrow frame; the ratio keeps the
 * height in step.
 */
const tileSize =
  "[--tile-w:min(275px,100%_-_96px)] [--tile-ratio:275/496] " +
  "min-[735px]:[--tile-w:min(688px,100%_-_96px)] min-[735px]:[--tile-ratio:688/367] " +
  "min-[1069px]:[--tile-w:930px] min-[1069px]:[--tile-ratio:930/523] " +
  "min-[1441px]:[--tile-w:1250px] min-[1441px]:[--tile-ratio:1250/668]"

function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="currentColor">
      {playing ? (
        <path d="M9.3 7.7h1.1c.5 0 .75.25.75.74v7.12c0 .49-.25.74-.75.74H9.3c-.5 0-.75-.25-.75-.74V8.44c0-.49.25-.74.75-.74Zm4.3 0h1.1c.5 0 .75.25.75.74v7.12c0 .49-.25.74-.75.74h-1.1c-.5 0-.75-.25-.75-.74V8.44c0-.49.25-.74.75-.74Z" />
      ) : (
        <path d="M10.2 15.7c.2 0 .37-.06.6-.2l4.7-2.72c.37-.21.58-.44.58-.79s-.21-.57-.58-.78l-4.7-2.72c-.23-.14-.4-.2-.6-.2-.4 0-.75.3-.75.83v5.75c0 .53.35.83.75.83Z" />
      )}
    </svg>
  )
}

function GallerySlide({ slide }: { slide: EndlessGallerySlide }) {
  return (
    <a
      href={slide.cta.href}
      aria-label={`${slide.cta.label}: ${slide.genre ? `${slide.genre}, ` : ""}${slide.caption}`}
      className="group/link relative grid size-full overflow-hidden bg-(--apple-tile-dark) outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      <img
        src={slide.src}
        alt=""
        draggable={false}
        className="absolute inset-0 size-full object-cover select-none"
      />
      {/* Scrim under the caption: a soft corner glow on wide tiles, a bottom fade on phones. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          "bg-[linear-gradient(transparent_50%,color-mix(in_srgb,var(--apple-tile-dark)_70%,transparent)),linear-gradient(color-mix(in_srgb,var(--apple-tile-dark)_40%,transparent),transparent_200px)]",
          "min-[735px]:bg-[radial-gradient(100%_33%_at_left_bottom,color-mix(in_srgb,var(--apple-tile-dark)_50%,transparent),transparent)]"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative flex w-full items-center self-end",
          "flex-col-reverse px-[15px] pb-[30px] text-center",
          "min-[735px]:flex-row min-[735px]:px-[43px] min-[735px]:pb-[34px] min-[735px]:text-start",
          "min-[1069px]:px-12 min-[1069px]:pb-10 min-[1441px]:px-[70px] min-[1441px]:pb-[58px]",
          // Neighbors keep their caption dimmed; the current slide's comes up.
          "opacity-[.36] transition-opacity duration-(--apple-gallery-caption-duration) ease-in-out group-data-active/item:opacity-100 motion-reduce:transition-none"
        )}
      >
        <span
          className={cn(
            "mt-[13px] inline-flex shrink-0 rounded-(--apple-button-radius) border border-transparent bg-(--apple-tile-light) font-body text-(--apple-tile-dark) transition-colors duration-100 group-hover/link:bg-background min-[735px]:mt-0",
            "px-[15px] py-2 text-(length:--apple-button-size) leading-(--apple-button-line-height) tracking-(--apple-button-letter-spacing)",
            "min-[1069px]:px-[21px] min-[1069px]:py-[11px] min-[1069px]:text-(length:--apple-button-size-large) min-[1069px]:leading-(--apple-button-line-height-large) min-[1069px]:tracking-(--apple-button-letter-spacing-large)"
          )}
        >
          {slide.cta.label}
        </span>
        <span
          className={cn(
            "font-display text-(--apple-tile-dark-text) [text-shadow:0_0_5px_color-mix(in_srgb,var(--apple-tile-dark)_60%,transparent)]",
            "text-(length:--apple-gallery-caption-size-compact) leading-(--apple-gallery-caption-line-height-compact) tracking-(--apple-gallery-caption-letter-spacing-compact)",
            "min-[735px]:ps-[18px] min-[1069px]:text-(length:--apple-gallery-caption-size) min-[1069px]:leading-(--apple-gallery-caption-line-height) min-[1069px]:tracking-(--apple-gallery-caption-letter-spacing)"
          )}
        >
          {slide.genre && (
            <span className="block font-bold min-[735px]:inline min-[735px]:after:px-[.25em] min-[735px]:after:content-['•']">
              {slide.genre}
            </span>
          )}
          {slide.caption}
        </span>
      </span>
    </a>
  )
}

/**
 * Apple endless gallery: wide slides centered with their neighbors peeking in,
 * wrapping round without an end. It rotates on a timer that the current dot
 * fills as a progress pill; swipe, drag, the arrow keys or a dot page it, and
 * the round button at the end of the dots stops and starts it.
 *
 * ui-sdk `Carousel` owns the runtime (seamless loop, snap, swipe and drag,
 * autoplay that pauses on hover, focus, hidden tab and off screen, reduced
 * motion); this file is only markup and styling.
 */
export function EndlessGallery({
  title = "New every night.",
  label,
  slides = defaultSlides,
  autoplay = true,
  interval = KIT_INTERVAL,
  className,
}: EndlessGalleryProps) {
  return (
    <section
      className={cn(
        "overflow-hidden bg-secondary pt-9 font-body text-foreground min-[1069px]:pt-[53px]",
        tileSize,
        className
      )}
    >
      <h2
        className={cn(
          "mb-[17px] px-gutter text-center font-display font-semibold text-foreground min-[1069px]:mb-[26px]",
          "text-(length:--apple-gallery-title-size-compact) leading-(--apple-gallery-title-line-height-compact) tracking-(--apple-gallery-title-letter-spacing-compact)",
          "min-[1069px]:text-(length:--apple-gallery-title-size) min-[1069px]:leading-(--apple-gallery-title-line-height) min-[1069px]:tracking-(--apple-gallery-title-letter-spacing)"
        )}
      >
        {title}
      </h2>

      <Carousel
        aria-label={label ?? title}
        loop
        align="center"
        defaultPlaying={autoplay}
        interval={interval}
        className="group/gallery"
      >
        <style href="apple-gallery-fill" precedence="default">
          {FILL_KEYFRAMES}
        </style>
        <CarouselViewport className="outline-none [scrollbar-width:none] data-dragging:cursor-grabbing [&::-webkit-scrollbar]:hidden">
          <CarouselContent className="flex gap-(--apple-gallery-tile-gap)">
            {slides.map((item) => (
              <CarouselItem
                key={item.src}
                className="group/item aspect-(--tile-ratio) min-w-0 basis-(--tile-w)"
              >
                <GallerySlide slide={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </CarouselViewport>

        <div className="relative my-2.5 flex h-6 items-center justify-center min-[735px]:my-3">
          <CarouselIndicatorGroup aria-label="Choose a slide" className="flex items-center px-4">
            {slides.map((item, i) => (
              <CarouselIndicator
                key={item.src}
                aria-label={`Slide ${i + 1}: ${item.genre ?? item.cta.label}`}
                className={cn(
                  "group/dot relative block h-6 w-6 cursor-pointer outline-none",
                  "transition-[width] duration-250 ease-linear data-selected:w-12 data-selected:cursor-default motion-reduce:transition-none"
                )}
              >
                {/* The dot, which widens into the progress track when selected. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-2 rounded-full bg-foreground/48 transition-colors duration-[120ms] ease-linear",
                    "group-hover/dot:bg-foreground/72 group-data-selected/dot:bg-foreground/48",
                    "group-focus-visible/dot:outline-2 group-focus-visible/dot:outline-offset-[3px] group-focus-visible/dot:outline-ring"
                  )}
                />
                {/* The fill, timed by the rotation interval and frozen while paused or stopped. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-2 start-2 hidden w-2 rounded-full bg-foreground group-data-selected/dot:block",
                    "animate-[apple-gallery-fill_var(--carousel-interval)_linear_both] [animation-delay:250ms] [animation-play-state:paused]",
                    "group-[[data-playing]:not([data-paused])]/gallery:[animation-play-state:running]",
                    "motion-reduce:animate-none"
                  )}
                />
              </CarouselIndicator>
            ))}
          </CarouselIndicatorGroup>
          <CarouselPlayToggle
            className={cn(
              "absolute end-2.5 top-0 flex size-6 cursor-pointer items-center justify-center rounded-full min-[735px]:end-3",
              "bg-border/64 text-foreground/56 transition-colors duration-100 ease-linear hover:bg-border/80 hover:text-foreground/64 active:bg-border",
              "outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring motion-reduce:transition-none"
            )}
          >
            {(state) => (
              <>
                <span className="sr-only">{state.playing ? `Pause ${label ?? "gallery"}` : `Play ${label ?? "gallery"}`}</span>
                <PlayIcon playing={state.playing} />
              </>
            )}
          </CarouselPlayToggle>
        </div>
      </Carousel>
    </section>
  )
}
