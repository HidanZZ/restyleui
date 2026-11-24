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

/** The source gallery advances every 4.2s. */
const KIT_INTERVAL = 4200

const PROGRESS_KEYFRAMES = "@keyframes norma-carousel-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}"

const glassButton =
  "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-primary-foreground/85 outline-none transition-colors duration-200 hover:bg-background/15 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-background/70 motion-reduce:transition-none"

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
      <path d={dir === "prev" ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} />
    </svg>
  )
}

/**
 * Norma gallery: one slide at a time in a 28px coal shell, swiped or dragged,
 * with a glass pill of dots at the bottom. The current dot stretches and fills
 * over the autoplay interval; hovering pauses the fill with the rotation.
 * Autoplay is on by default, as in the source.
 */
export function Carousel({ items, label, autoplay = true, loop = false, className }: CarouselProps) {
  const rotates = autoplay !== false
  return (
    <CarouselRoot
      aria-label={label}
      loop={loop}
      defaultPlaying={rotates}
      interval={typeof autoplay === "number" ? autoplay : KIT_INTERVAL}
      className={cn("group/carousel relative font-body", className)}
    >
      <style href="norma-carousel-progress" precedence="default">
        {PROGRESS_KEYFRAMES}
      </style>
      <CarouselViewport className="overflow-hidden rounded-kit-lg bg-(--norma-coal) outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-scrollbar]:hidden">
        <CarouselContent className="flex">
          {items.map((item, i) => (
            <CarouselItem
              key={i}
              className={cn(
                "relative aspect-[4/5] min-w-0 basis-full overflow-hidden sm:aspect-[16/10]",
                "[&>img]:size-full [&>img]:select-none [&>img]:object-cover [&>video]:size-full [&>video]:object-cover",
                "[&>img]:scale-[1.04] [&>img]:transition-transform [&>img]:duration-700 [&>img]:ease-kit data-active:[&>img]:scale-100 motion-reduce:[&>img]:transition-none"
              )}
            >
              {item}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center sm:bottom-5">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-foreground/20 p-1 backdrop-blur-md">
          <CarouselPrevious aria-label="Previous slide" className={cn(glassButton, "data-disabled:opacity-40")}>
            <Chevron dir="prev" />
          </CarouselPrevious>
          <CarouselIndicatorGroup className="flex items-center gap-1.5 px-1">
            {items.map((_, i) => (
              <CarouselIndicator
                key={i}
                aria-label={`Slide ${i + 1} of ${items.length}`}
                className={cn(
                  "group/dot relative h-1.5 w-1.5 cursor-pointer overflow-hidden rounded-full bg-background/45 outline-none",
                  "transition-[width,background-color] duration-300 ease-kit hover:bg-background/80 motion-reduce:transition-none",
                  "focus-visible:ring-2 focus-visible:ring-background/80 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
                  "data-selected:w-6 data-selected:bg-background/40"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 hidden origin-left rounded-full bg-background group-data-selected/dot:block rtl:origin-right",
                    "group-data-playing/carousel:animate-[norma-carousel-progress_var(--carousel-interval)_linear_both]",
                    "group-data-paused/carousel:[animation-play-state:paused] motion-reduce:animate-none"
                  )}
                />
              </CarouselIndicator>
            ))}
          </CarouselIndicatorGroup>
          <CarouselNext aria-label="Next slide" className={cn(glassButton, "data-disabled:opacity-40")}>
            <Chevron dir="next" />
          </CarouselNext>
          {rotates && (
            <CarouselPlayToggle className={glassButton}>
              {(state) => (
                <>
                  <span className="sr-only">{state.playing ? "Pause autoplay" : "Start autoplay"}</span>
                  <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                    {state.playing ? <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" /> : <path d="M5 3.2v9.6L13 8z" />}
                  </svg>
                </>
              )}
            </CarouselPlayToggle>
          )}
        </div>
      </div>
    </CarouselRoot>
  )
}
