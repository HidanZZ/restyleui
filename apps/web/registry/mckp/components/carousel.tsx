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

const KIT_INTERVAL = 6000

const control =
  "grid size-9 place-items-center rounded-[10px] bg-foreground/[0.06] text-foreground transition-[background-color,opacity] duration-200 ease-kit-in-out hover:bg-foreground/10 data-disabled:pointer-events-none data-disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"

/**
 * A strip of 4:3 tiles cut by 2px gaps, like the clone's library wall. White
 * dot controls sit at the bottom left; arrows show from tablet width up.
 */
export function Carousel({ items, label, autoplay = false, loop = false, className }: CarouselProps) {
  return (
    <CarouselRoot
      aria-label={label}
      loop={loop}
      defaultPlaying={autoplay !== false}
      interval={typeof autoplay === "number" ? autoplay : KIT_INTERVAL}
      className={cn("grid gap-5", className)}
    >
      <CarouselViewport className="rounded-kit-lg [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <CarouselContent className="flex gap-0.5">
          {items.map((item, i) => (
            <CarouselItem
              key={i}
              className={cn(
                "min-w-0 basis-[86%] overflow-hidden rounded-kit-lg bg-card md:basis-[calc((100%-2px)/2)] lg:basis-[calc((100%-4px)/3)]",
                "[&>img]:aspect-[4/3] [&>img]:w-full [&>img]:object-cover [&>video]:aspect-[4/3] [&>video]:w-full [&>video]:object-cover",
                "[&>img]:opacity-60 [&>img]:transition-opacity [&>img]:duration-700 [&>img]:ease-kit data-in-view:[&>img]:opacity-100 motion-reduce:[&>img]:transition-none"
              )}
            >
              {item}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>

      <div className="flex items-center justify-between gap-4">
        <CarouselIndicatorGroup className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <CarouselIndicator
              key={i}
              aria-label={`Slide ${i + 1}`}
              className="h-1.5 w-1.5 rounded-full bg-foreground/25 transition-[width,background-color] duration-500 ease-kit hover:bg-foreground/50 data-selected:w-5 data-selected:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
            />
          ))}
        </CarouselIndicatorGroup>
        <div className="flex items-center gap-1.5">
          {autoplay !== false && (
            <CarouselPlayToggle className={control}>
              {(state) => (
                <>
                  <span className="sr-only">{state.playing ? "Pause autoplay" : "Start autoplay"}</span>
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3 fill-current">
                    {state.playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
                  </svg>
                </>
              )}
            </CarouselPlayToggle>
          )}
          <CarouselPrevious aria-label="Previous slide" className={cn(control, "max-md:hidden")}>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
              <path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </CarouselPrevious>
          <CarouselNext aria-label="Next slide" className={cn(control, "max-md:hidden")}>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
              <path d="M6 3.5L10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </CarouselNext>
        </div>
      </div>
    </CarouselRoot>
  )
}
