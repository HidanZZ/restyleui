"use client"

import type { CSSProperties, ReactNode } from "react"
import type { FeatureGridProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { Reveal } from "@/registry/linear/components/reveal"

function FeatureVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
          "absolute bottom-2.5 right-2.5 z-10 grid size-7 cursor-pointer place-items-center rounded-full bg-(--linear-bg-translucent) text-(--linear-text-secondary) backdrop-blur-[4px]",
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

// Source: the "purpose" figure lift, a slow spring-like ease.
const lift = "transition-[transform,border-color,color] duration-700 ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:transition-none"

/**
 * An isometric stack of hairline plates, after the source's wireframe figures.
 * The icon sits on the top plate, which lifts while the cell is hovered.
 */
function Plates({ icon }: { icon?: ReactNode }) {
  return (
    <div aria-hidden className="grid size-full place-items-center [perspective:1400px]">
      <div className="relative size-32 [transform-style:preserve-3d] [transform:rotateX(56deg)_rotateZ(-45deg)] sm:size-36 lg:size-40">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{ "--z": i } as CSSProperties}
            className="absolute inset-0 rounded-[18%] border border-(--linear-border-secondary) bg-background [transform:translateZ(calc(var(--z)*7px))]"
          />
        ))}
        <span
          className={cn(
            "absolute inset-0 grid place-items-center rounded-[18%] border border-(--linear-border-tertiary) bg-(--linear-bg-level-1) text-muted-foreground",
            "[transform:translateZ(36px)] group-hover/feature:[transform:translateZ(52px)] group-hover/feature:border-(--linear-text-quaternary) group-hover/feature:text-(--linear-text-secondary)",
            "[&_svg]:size-16 lg:[&_svg]:size-[72px]",
            lift
          )}
        >
          {icon}
        </span>
      </div>
    </div>
  )
}

function Illustration({ media, icon }: { media?: Media; icon?: ReactNode }) {
  if (!media) return <Plates icon={icon} />
  return (
    <div className="grid size-full place-items-center py-6">
      <div className="relative aspect-[4/3] w-full max-w-[360px] overflow-hidden rounded-[8px] border border-(--linear-border-translucent) bg-(--linear-bg-marketing)">
        {media.type === "video" ? (
          <FeatureVideo media={media} />
        ) : (
          <img
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading="lazy"
            decoding="async"
            className="block size-full object-cover"
          />
        )}
      </div>
    </div>
  )
}

/**
 * Source: the intro statement and the benefits grid. A large medium statement
 * whose first sentence is bright and the rest tertiary, then figure cells split
 * by hairlines, each with a mono "Fig" label, a wireframe figure, and a short
 * title over balanced copy. Below 1024px the cells become quiet panels.
 */
export function FeatureGrid({ eyebrow, title, description, features, className }: FeatureGridProps) {
  return (
    <section className={cn("bg-background py-section font-body text-foreground", className)}>
      <div className="mx-auto max-w-kit px-gutter">
        <Reveal className="px-(--linear-homepage-padding-inset)">
          {eyebrow && (
            <p className="mb-12 font-mono text-xs uppercase leading-[1.4] text-(--linear-text-quaternary) md:mb-16">{eyebrow}</p>
          )}
          <h2
            className={cn(
              "max-w-[1250px] font-[510] text-muted-foreground",
              "text-[length:var(--linear-title-3-size)] leading-[1.33] tracking-[-0.012em]",
              "sm:text-[length:var(--linear-title-4-size)] sm:leading-[1.125] sm:tracking-[-0.022em]",
              "lg:text-[length:var(--linear-title-5-size)] lg:leading-[1.1]",
              "xl:text-[length:var(--linear-title-6-size)] xl:leading-none"
            )}
          >
            <strong className="font-[510] text-foreground">{title}</strong>
            {description && <> {description}</>}
          </h2>
        </Reveal>

        <Reveal
          stagger
          className={cn(
            "mt-16 grid gap-2 md:mt-24 md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2 lg:grid-cols-3 lg:gap-x-0 lg:gap-y-16 lg:px-(--linear-homepage-padding-inset)",
            "lg:[&>*:last-child:nth-child(odd)]:col-span-1 lg:[&>*]:border-r lg:[&>*]:border-(--linear-border-translucent-strong) lg:[&>*:nth-child(3n)]:border-r-0 lg:[&>*:last-child]:border-r-0"
          )}
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                "group/feature relative flex h-[340px] flex-col justify-end rounded-[8px] border border-(--linear-border-translucent) bg-card px-6 pb-7 sm:h-[400px]",
                "lg:h-[468px] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-(--linear-homepage-padding-inset) lg:pb-0",
                i % 3 === 0 && "lg:pl-0",
                (i % 3 === 2 || i === features.length - 1) && "lg:pr-0"
              )}
            >
              <span
                className={cn(
                  "absolute left-6 top-5 font-mono text-xs uppercase leading-[1.4] text-muted-foreground opacity-40",
                  "lg:left-(--linear-homepage-padding-inset) lg:top-0",
                  i % 3 === 0 && "lg:left-0"
                )}
              >
                Fig 0.{i + 1}
              </span>
              <div className="grid min-h-0 flex-1 place-items-center overflow-hidden">
                <Illustration media={feature.media} icon={feature.icon} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[15px] font-[510] leading-[1.6] tracking-[-0.011em] text-(--linear-text-secondary)">{feature.title}</h3>
                <p className="max-w-[368px] text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground lg:text-balance">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
