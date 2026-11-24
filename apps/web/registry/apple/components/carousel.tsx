"use client"

import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel"
import type { CarouselProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

// The source's gallery timer: 4.16s per slide.
const KIT_INTERVAL = 4160

// The timed dot fills its 32px track over one interval.
const keyframes = "@keyframes apple-dotnav-fill{from{width:8px}to{width:calc(100% - 16px)}}"

const paddle = cn(
  "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-(--apple-separator)/64 text-foreground/56 backdrop-blur-[20px] backdrop-saturate-[1.8] min-[735px]:flex",
  "opacity-0 transition-[opacity,background-color,color] duration-[240ms] ease-kit group-hover/carousel:opacity-100 focus-visible:opacity-100 hover:bg-accent/70 hover:text-foreground/72",
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring data-disabled:pointer-events-none data-disabled:opacity-0 motion-reduce:transition-none"
)

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden="true" width="10" height="16" viewBox="0 0 10 16" className={cn("rtl:-scale-x-100", flip && "-scale-x-100 rtl:scale-x-100")}>
      <path d="M2.5 1.5L8.5 8l-6 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Apple gallery: wide, square-cornered slides centered with their neighbors
 * peeking in, paddles that appear on hover, and the source's dot nav. While
 * it plays, the current dot stretches into a 32px track that fills over the
 * interval, beside a round play and pause button.
 */
export function Carousel({ items, label, autoplay = false, loop = false, className }: CarouselProps) {
  const timed = autoplay !== false
  return (
    <CarouselRoot
      aria-label={label}
      loop={loop}
      align="center"
      defaultPlaying={timed}
      interval={typeof autoplay === "number" ? autoplay : KIT_INTERVAL}
      className={cn("group/carousel grid gap-4 font-body antialiased", className)}
    >
      {timed && (
        <style href="apple-carousel" precedence="default">
          {keyframes}
        </style>
      )}
      <div className="relative">
        <CarouselViewport className="[scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <CarouselContent className="flex gap-(--apple-gallery-tile-gap)">
            {items.map((item, i) => (
              <CarouselItem
                key={i}
                className={cn(
                  "min-w-0 basis-[88%] overflow-hidden bg-muted min-[735px]:basis-[80%] min-[1069px]:basis-[70%]",
                  "[&_img]:block [&_img]:aspect-[4/3] [&_img]:w-full [&_img]:object-cover min-[735px]:[&_img]:aspect-video min-[1069px]:[&_img]:aspect-[21/9]"
                )}
              >
                {item}
              </CarouselItem>
            ))}
          </CarouselContent>
        </CarouselViewport>
        <CarouselPrevious aria-label="Previous slide" className={cn(paddle, "start-4 min-[1069px]:start-8")}>
          <Chevron flip />
        </CarouselPrevious>
        <CarouselNext aria-label="Next slide" className={cn(paddle, "end-4 min-[1069px]:end-8")}>
          <Chevron />
        </CarouselNext>
      </div>

      <div className="relative flex min-h-9 items-center justify-center px-14">
        <CarouselIndicatorGroup className="flex items-center">
          {items.map((_, i) => (
            <CarouselIndicator
              key={i}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "group/dot relative h-6 w-6 cursor-pointer rounded-full transition-[width] duration-[250ms] ease-linear motion-reduce:transition-none",
                "before:absolute before:inset-x-2 before:top-1/2 before:-mt-1 before:h-2 before:rounded-full before:bg-foreground/42 before:transition-colors before:duration-[120ms] hover:before:bg-foreground/72",
                "data-selected:cursor-default data-selected:before:bg-foreground",
                "focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:outline-offset-[3px] focus-visible:before:outline-ring",
                timed && [
                  "group-data-playing/carousel:data-selected:w-12 group-data-playing/carousel:data-selected:before:bg-foreground/42",
                  "after:absolute after:start-2 after:top-1/2 after:-mt-1 after:h-2 after:w-2 after:rounded-full after:bg-foreground after:opacity-0",
                  "group-data-playing/carousel:data-selected:after:opacity-100 group-data-playing/carousel:data-selected:after:animate-[apple-dotnav-fill_var(--carousel-interval)_linear_both]",
                  "group-data-paused/carousel:after:[animation-play-state:paused] motion-reduce:after:animate-none",
                ]
              )}
            />
          ))}
        </CarouselIndicatorGroup>
        {timed && (
          <CarouselPlayToggle
            className={cn(
              "absolute end-0 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-(--apple-separator)/64 text-foreground/48 transition-[background-color,color,scale] duration-200 hover:bg-accent/70 hover:text-foreground/72 active:scale-95",
              "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring motion-reduce:transition-none"
            )}
          >
            {(state) => (
              <>
                <span className="sr-only">{state.playing ? "Pause" : "Play"}</span>
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  {state.playing ? <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" /> : <path d="M4.5 2.4v11.2L13.6 8z" />}
                </svg>
              </>
            )}
          </CarouselPlayToggle>
        )}
      </div>
    </CarouselRoot>
  )
}
