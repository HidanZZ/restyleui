"use client"

import { Reveal } from "@/registry/mckp/components/reveal"
import { Tabs } from "@/registry/mckp/components/tabs"
import type { FeatureTabsProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

type Tab = FeatureTabsProps["tabs"][number]

const body = "text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line)"
const h2 =
  "text-[length:var(--mckp-type-h2)] font-normal leading-(--mckp-type-h2-line) tracking-(--mckp-type-h2-tracking)"

function StageVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
  // The clone's editor video starts playing once a fifth of it is on screen.
  const { ref, playing, toggle } = useInViewVideo({ threshold: 0.2 })
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
        className="absolute right-4 top-4 z-[2] grid size-8 place-items-center rounded-kit bg-(--mckp-surface-glass) text-foreground backdrop-blur-[40px] backdrop-saturate-[1.4] transition-colors duration-200 hover:bg-(--mckp-surface-raised) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none max-md:right-3 max-md:top-3"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3 fill-current">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
    </>
  )
}

/** One tab panel: the editor-style stage with the tab's scene, its caption set over a black fade. */
function Stage({ tab }: { tab: Tab }) {
  return (
    <figure className="relative grid gap-4">
      <div className="relative isolate aspect-[16/10] overflow-hidden rounded-kit-lg bg-(--mckp-surface) max-md:aspect-[4/3] md:after:pointer-events-none md:after:absolute md:after:inset-x-0 md:after:-bottom-px md:after:z-[1] md:after:h-[36%] md:after:bg-[linear-gradient(transparent,color-mix(in_srgb,var(--mckp-page-black)_70%,transparent)_50%,var(--mckp-page-black)_90%)]">
        {tab.media.type === "video" ? (
          <StageVideo media={tab.media} />
        ) : (
          <img
            src={tab.media.src}
            alt={tab.media.alt}
            width={tab.media.width}
            height={tab.media.height}
            loading="lazy"
            className="block size-full object-cover"
          />
        )}
      </div>
      <figcaption className="z-[1] flex max-w-[400px] flex-col md:absolute md:bottom-(--mckp-feature-pad) md:left-(--mckp-feature-pad)">
        <span className={cn(body, "text-foreground")}>{tab.title}</span>
        <span className={cn(body, "text-(--mckp-ink-faint)")}>{tab.description}</span>
      </figcaption>
    </figure>
  )
}

/** First sentence in white, the rest in the kit's dark grey, like the clone's mode intros. */
function TwoTone({ text }: { text: string }) {
  const [lead, ...rest] = text.split(/(?<=[.!?])\s+/)
  return (
    <>
      <span className="text-foreground">{lead}</span>
      {rest.length > 0 && <span className="text-(--mckp-ink-dim)"> {rest.join(" ")}</span>}
    </>
  )
}

/**
 * Source: a mode section and its editor video. A mono step number, an 80px
 * display name at column 2 and a two-tone H2 intro at column 5, then a full
 * width stage. The clone's feature tabs (text buttons on a sliding #161616
 * fill) sit over the stage's top corner and swap the scene. While the stage
 * owns the middle of the viewport the section sinks from #101010 to black.
 */
export function FeatureTabs({ eyebrow, title, description, tabs, className }: FeatureTabsProps) {
  const reduced = useReducedMotion()
  const { ref: stageRef, visible: centred } = useReveal<HTMLDivElement>({
    once: false,
    threshold: 0,
    rootMargin: "-15% 0px -15% 0px",
  })
  const dark = centred && !reduced
  // A short name ("Studio.") sits beside the intro like the clone; a long one takes the full row above it.
  const wide = typeof title === "string" && title.length > 12

  return (
    <section data-stage={dark || undefined} className={cn("group/stage relative isolate text-foreground", className)}>
      {/* The darker stage fades in behind the section and feathers into its neighbours. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-(--mckp-page-black) opacity-0 [mask-image:linear-gradient(transparent,black_160px,black_calc(100%-160px),transparent)] transition-opacity duration-700 ease-kit-in-out group-data-stage/stage:opacity-100 motion-reduce:transition-none"
      />

      <div className="mx-auto grid max-w-kit grid-cols-9 grid-rows-[auto_1fr] px-gutter pt-section pb-(--mckp-section-y-sm) max-lg:grid-cols-1 max-lg:grid-rows-none">
        {eyebrow && (
          <Reveal className="col-[2/6] row-[1] max-lg:col-[1]">
            <span className="font-mono text-[length:var(--mckp-type-mono)] leading-(--mckp-type-mono-line) text-(--mckp-ink-mono)">
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal
          delay={80}
          className={cn(
            "row-[2] self-start max-lg:col-[1] max-lg:row-auto max-lg:mb-6",
            wide ? "col-[2/9] mb-6" : "col-[2/5]"
          )}
        >
          <h2 className="text-balance font-display text-[length:var(--mckp-type-display)] font-medium leading-(--mckp-type-display-line) tracking-(--mckp-type-display-tracking) text-foreground">
            {title}
          </h2>
        </Reveal>
        {description && (
          <Reveal
            delay={160}
            className={cn(
              "max-lg:col-[1] max-lg:row-auto max-lg:pt-0",
              wide ? "col-[5/9] row-[3]" : "col-[5/9] row-[1/3] pt-[38px]"
            )}
          >
            <p className={h2}>
              <TwoTone text={description} />
            </p>
          </Reveal>
        )}
      </div>

      <div ref={stageRef} className="mx-auto max-w-kit px-gutter pb-(--mckp-section-y-sm)">
        <Reveal>
          <Tabs
            items={tabs.map((tab) => ({ id: tab.id, label: tab.label, content: <Stage tab={tab} /> }))}
            className={cn(
              "relative gap-0",
              // The tab row floats over the stage's top corner, like the clone's live effects card.
              "[&_[data-slot=tabs-list]]:absolute [&_[data-slot=tabs-list]]:left-6 [&_[data-slot=tabs-list]]:top-6 [&_[data-slot=tabs-list]]:z-[3] [&_[data-slot=tabs-list]]:max-w-[calc(100%-48px)]",
              "max-md:[&_[data-slot=tabs-list]]:left-3 max-md:[&_[data-slot=tabs-list]]:top-3 max-md:[&_[data-slot=tabs-list]]:max-w-[calc(100%-24px)]",
              // The scenes are brighter than the clone's, so the row sits on the kit's glass track to stay legible.
              "[&_[data-slot=tabs-list]]:gap-1 [&_[data-slot=tabs-list]]:rounded-[12px] [&_[data-slot=tabs-list]]:bg-(--mckp-surface-glass) [&_[data-slot=tabs-list]]:p-1 [&_[data-slot=tabs-list]]:backdrop-blur-[40px] [&_[data-slot=tabs-list]]:backdrop-saturate-[1.4]"
            )}
          />
        </Reveal>
      </div>
    </section>
  )
}
