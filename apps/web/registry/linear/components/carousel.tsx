"use client"

import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel"
import type { CarouselProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const KIT_INTERVAL = 5000

const control = cn(
  "grid size-8 cursor-pointer place-items-center rounded-full bg-(--linear-bg-translucent) text-foreground backdrop-blur-[4px]",
  "shadow-[inset_0_0_0_1px_#ffffff08,inset_0_1px_#ffffff0a,0_0_0_1px_#0009,0_4px_4px_#0000001a]",
  "transition-[background-color,opacity,transform] duration-[160ms] ease-kit hover:bg-(--linear-bg-level-3) active:scale-[.97]",
  "data-disabled:cursor-default data-disabled:opacity-40 data-disabled:hover:bg-(--linear-bg-translucent) data-disabled:active:scale-100",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
)

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn("size-4", flip && "-scale-x-100")}>
      <path d="M9.75 4.5 6.25 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Source: the customers carousel. Fixed-width cards 8px apart that snap to the
 * start edge, a 6px radius, and media filling each card. Linear shows no
 * controls on touch; glass round buttons and a hairline progress track page it
 * with a pointer or keyboard.
 */
export function Carousel({ items, label, autoplay = false, loop = false, className }: CarouselProps) {
  return (
    <CarouselRoot
      aria-label={label}
      loop={loop}
      align="start"
      defaultPlaying={autoplay !== false}
      interval={typeof autoplay === "number" ? autoplay : KIT_INTERVAL}
      className={cn("grid gap-6", className)}
    >
      <CarouselViewport className="overscroll-x-contain [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <CarouselContent className="flex gap-2">
          {items.map((item, i) => (
            <CarouselItem
              key={i}
              className={cn(
                "relative aspect-[4/3] w-[min(320px,85%)] shrink-0 overflow-hidden rounded-[6px] border border-(--linear-border-translucent) bg-card md:w-[440px]",
                "transition-[filter] duration-[160ms] ease-kit hover:brightness-[1.03] motion-reduce:transition-none",
                "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover"
              )}
            >
              {item}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div className="flex items-center justify-between gap-6">
        <div aria-hidden className="relative h-px max-w-40 flex-1 overflow-hidden bg-(--linear-border-translucent-strong)">
          <div className="absolute inset-y-0 left-0 w-full origin-left scale-x-[var(--carousel-progress,0)] bg-(--linear-text-tertiary) transition-transform duration-100 motion-reduce:transition-none" />
        </div>
        <div className="flex items-center gap-2">
          {autoplay !== false && (
            <CarouselPlayToggle className={control}>
              {(state) => (
                <>
                  <span className="sr-only">{state.playing ? "Pause slides" : "Play slides"}</span>
                  <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 fill-current">
                    {state.playing ? (
                      <path d="M4.5 3h2v10h-2zM9.5 3h2v10h-2z" />
                    ) : (
                      <path d="M5 3.2v9.6a.5.5 0 0 0 .76.43l7.7-4.8a.5.5 0 0 0 0-.86l-7.7-4.8A.5.5 0 0 0 5 3.2Z" />
                    )}
                  </svg>
                </>
              )}
            </CarouselPlayToggle>
          )}
          <CarouselPrevious aria-label="Previous slide" className={control}>
            <Chevron />
          </CarouselPrevious>
          <CarouselNext aria-label="Next slide" className={control}>
            <Chevron flip />
          </CarouselNext>
        </div>
      </div>
    </CarouselRoot>
  )
}
