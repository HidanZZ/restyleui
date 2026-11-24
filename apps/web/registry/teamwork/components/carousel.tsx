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

// The source's staged overview advances every seven seconds.
const KIT_INTERVAL = 7000

const roundButton =
  "grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-input transition-[background-color,color,opacity] duration-150 ease-kit hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:pointer-events-none data-disabled:opacity-30 motion-reduce:transition-none"

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn("size-4 fill-current", direction === "left" ? "rotate-90" : "-rotate-90")}>
      <path d="m14.53 6.03-6 6a.75.75 0 0 1-1.004.052l-.056-.052-6-6 1.06-1.06L8 10.44l5.47-5.47z" />
    </svg>
  )
}

export function Carousel({ items, label, autoplay = false, loop = false, className }: CarouselProps) {
  return (
    <CarouselRoot
      aria-label={label}
      loop={loop}
      defaultPlaying={autoplay !== false}
      interval={typeof autoplay === "number" ? autoplay : KIT_INTERVAL}
      className={cn("grid gap-6 font-body", className)}
    >
      <CarouselViewport className="overflow-hidden rounded-kit-lg [scrollbar-width:none]">
        <CarouselContent className="flex gap-4">
          {items.map((item, i) => (
            <CarouselItem
              key={i}
              className={cn(
                "relative min-w-0 basis-full overflow-hidden rounded-kit-lg border border-border bg-(--teamwork-surface-sunken)",
                "opacity-40 transition-opacity duration-400 ease-kit data-active:opacity-100 motion-reduce:transition-none",
                "[&_img]:aspect-[16/10] [&_img]:w-full [&_img]:object-cover [&_video]:aspect-[16/10] [&_video]:w-full [&_video]:object-cover"
              )}
            >
              {item}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>

      <div className="flex items-center justify-between gap-4">
        {/* One progress marker: the active dot stretches into a pill with a spring. */}
        <CarouselIndicatorGroup className="flex items-center gap-[9px]">
          {items.map((_, i) => (
            <CarouselIndicator
              key={i}
              page={i + 1}
              aria-label={`Slide ${i + 1}`}
              className="h-2 w-2 cursor-pointer rounded-full bg-input transition-[width,background-color] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:bg-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring data-selected:w-6 data-selected:bg-foreground motion-reduce:transition-none"
            />
          ))}
        </CarouselIndicatorGroup>
        <div className="flex items-center gap-2">
          {autoplay !== false && (
            <CarouselPlayToggle aria-label="Autoplay" className={roundButton}>
              {(state) => (
                <svg aria-hidden viewBox="0 0 16 16" className="size-4 fill-current">
                  {state.playing ? <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" /> : <path d="M5 3.25v9.5L12.5 8z" />}
                </svg>
              )}
            </CarouselPlayToggle>
          )}
          <CarouselPrevious aria-label="Previous slide" className={roundButton}>
            <Chevron direction="left" />
          </CarouselPrevious>
          <CarouselNext aria-label="Next slide" className={roundButton}>
            <Chevron direction="right" />
          </CarouselNext>
        </div>
      </div>
    </CarouselRoot>
  )
}
