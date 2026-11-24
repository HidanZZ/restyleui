"use client"

import type { HeroProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { Badge } from "@/registry/linear/components/badge"
import { Button } from "@/registry/linear/components/button"
import { Reveal } from "@/registry/linear/components/reveal"

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

/**
 * Source: the homepage hero. A left-aligned medium headline that resolves from
 * a blur, a quiet description row with the actions at its far end, then the
 * product frame (12px outer shell, 8px inner view) over a full-bleed backdrop
 * that fades from the canvas into a soft light at the bottom edge.
 */
export function Hero({ eyebrow, title, description, actions, media, className }: HeroProps) {
  return (
    <section className={cn("overflow-x-clip bg-background pt-[68px] font-body text-foreground md:pt-[52px] xl:pt-32", className)}>
      <div className="mx-auto w-full max-w-kit px-gutter">
        <div className="px-(--linear-homepage-padding-inset)">
          {eyebrow && (
            <Reveal className="mb-5 xl:mb-6">
              <Badge variant="accent">{eyebrow}</Badge>
            </Reveal>
          )}
          <Reveal delay={50}>
            <h1 className="max-w-[16em] text-balance text-[38px] font-[510] leading-[1.05] tracking-[-0.022em] md:text-[56px] xl:text-[64px] xl:leading-none">
              {title}
            </h1>
          </Reveal>
          {(description || (actions && actions.length > 0)) && (
            <Reveal
              delay={300}
              className="mt-5 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between xl:mt-8"
            >
              {description && (
                <p className="max-w-[336px] text-pretty text-[15px] leading-6 tracking-[-0.011em] text-muted-foreground md:max-w-[438px] xl:max-w-[560px]">
                  {description}
                </p>
              )}
              {actions && actions.length > 0 && (
                <div className="flex shrink-0 flex-wrap items-center gap-3 md:ml-auto">
                  {actions.map((action) => (
                    <Button key={action.label} href={action.href} variant={action.variant ?? "primary"}>
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </Reveal>
          )}
        </div>
      </div>

      {media && (
        <Reveal delay={300} className="relative mt-9 w-full md:mt-[70px]">
          <div className="relative mx-auto w-full pb-[30px] md:max-lg:pb-7 lg:max-[1599px]:pb-12 min-[1600px]:pb-28">
            {/* Backdrop: canvas fading into a soft light at the bottom edge. */}
            <div
              aria-hidden
              className="absolute inset-0 mx-auto w-full max-w-[1896px] overflow-hidden bg-[radial-gradient(52.53%_57.5%_at_50%_100%,transparent_0%,color-mix(in_srgb,var(--background)_50%,transparent)_100%),linear-gradient(180deg,var(--background)_10%,var(--linear-text-secondary)_100%)] md:inset-x-3 md:w-auto md:rounded-kit-sm"
            >
              <span className="absolute inset-0 bg-(--linear-bg-marketing)/50 mask-t-from-60% md:bg-(--linear-bg-marketing)/40" />
            </div>

            <div className="relative mx-auto w-full max-w-[1440px] px-[18px] md:max-lg:px-7 lg:max-[1439px]:px-8 min-[1440px]:px-[60px]">
              <div className="relative overflow-hidden rounded-[12px] bg-(--linear-bg-level-0) p-1.5 md:p-2">
                <div aria-hidden className="absolute inset-0 rounded-[inherit] border border-(--linear-border-translucent-strong) bg-(--linear-bg-level-1)" />
                <div className="relative aspect-[16/10] overflow-hidden rounded-kit border border-(--linear-border-translucent) bg-(--linear-bg-marketing) shadow-[0_0_0_2px_color-mix(in_srgb,var(--linear-bg-marketing)_20%,transparent)]">
                  {media.type === "video" ? (
                    <HeroVideo media={media} />
                  ) : (
                    <img
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      fetchPriority="high"
                      decoding="async"
                      className="block size-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  )
}
