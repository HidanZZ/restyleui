"use client"

import type { CardProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"
import { useTilt } from "@/registry/restyle/hooks/use-tilt"

// Staged card intro, run once when 40 percent of the card is visible: the media
// frame settles in, the skeleton shimmer fades, then each text line slides in.
const lineIntro =
  "translate-x-[-6px] opacity-0 transition-[opacity,translate] duration-[350ms,450ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-(--reveal-delay) group-data-visible/card:translate-x-0 group-data-visible/card:opacity-100 motion-reduce:transition-none"

const mono = "font-mono text-[length:var(--mckp-type-mono)] leading-(--mckp-type-mono-line) text-(--mckp-ink-mono)"
const body = "text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line)"

const shimmerKeyframes = "@keyframes mckp-shimmer{0%{background-position:100% 0}to{background-position:0 0}}"

function CardVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
        className="size-full object-cover"
      />
      <button
        type="button"
        onClick={(event) => {
          // The card may be a link: the toggle must not navigate.
          event.preventDefault()
          event.stopPropagation()
          toggle()
        }}
        aria-label={playing ? "Pause video" : "Play video"}
        className="pointer-events-auto absolute bottom-2 right-2 z-10 grid size-7 place-items-center rounded-kit bg-(--mckp-surface-glass) text-foreground backdrop-blur-[40px] backdrop-saturate-[1.4] transition-colors duration-200 hover:bg-(--mckp-surface-raised) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3 fill-current">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
    </>
  )
}

function CardMedia({ media }: { media: Media }) {
  // The card root tracks the pointer (useTilt); the frame leans with it. The frame
  // ignores pointer events so a press reaches the card's stretched link.
  return (
    <div className="pointer-events-none relative z-[2] [perspective:900px]">
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-kit bg-(--mckp-surface-deep) [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]",
          "translate-y-2 scale-[.96] opacity-0 transition-[opacity,scale,translate] duration-[450ms,700ms,700ms] ease-[cubic-bezier(.2,.9,.3,1.1)]",
          "group-data-visible/card:translate-y-0 group-data-visible/card:scale-100 group-data-visible/card:opacity-100 motion-reduce:transition-none"
        )}
      >
        {media.type === "video" ? (
          <CardVideo media={media} />
        ) : (
          <img
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading="lazy"
            className="size-full object-cover"
          />
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[inherit] bg-[linear-gradient(100deg,var(--mckp-surface-raised)_30%,var(--mckp-line-strong)_50%,var(--mckp-surface-raised)_70%)] bg-[length:300%_100%] animate-[mckp-shimmer_1.1s_linear_infinite] transition-opacity duration-[450ms] group-data-visible/card:opacity-0 group-data-visible/card:delay-[900ms] motion-reduce:hidden"
        />
      </div>
    </div>
  )
}

export function Card({ title, description, eyebrow, media, href, children, className }: CardProps) {
  const { ref: revealRef, visible, delayStyle } = useReveal<HTMLElement>({
    threshold: 0.4,
    rootMargin: "0px",
    delay: media ? 450 : 150,
    stagger: 80,
  })
  // Pointer parallax eased like the clone's 1 - 0.92^frames.
  const tiltRef = useTilt<HTMLElement>({ max: 3.5, ease: 0.08 })
  let line = 0

  const eyebrowNode = eyebrow ? (
    <span style={delayStyle(line++)} className={cn(lineIntro, mono, media && "mb-1")}>
      {eyebrow}
    </span>
  ) : null

  return (
    <article
      ref={(node) => {
        revealRef(node)
        tiltRef(node)
      }}
      data-visible={visible || undefined}
      className={cn(
        "group/card relative flex min-w-0 flex-col gap-6 overflow-hidden rounded-kit-lg bg-card p-(--mckp-card-pad) text-card-foreground",
        "transition-colors duration-200 ease-kit-in-out motion-reduce:transition-none",
        // A linked card raises its surface on hover and rings on keyboard focus.
        href && "hover:bg-(--mckp-surface-raised) has-[a[data-card-link]:focus-visible]:outline-2 has-[a[data-card-link]:focus-visible]:outline-offset-2 has-[a[data-card-link]:focus-visible]:outline-ring",
        !media && "justify-between md:min-h-[280px] lg:min-h-[383px]",
        className
      )}
    >
      <style href="mckp-shimmer" precedence="default">
        {shimmerKeyframes}
      </style>
      {media && <CardMedia media={media} />}
      {!media && eyebrowNode}
      <div className="flex flex-col">
        {media && eyebrowNode}
        {/* No transform on the heading itself: the stretched link's ::after must size to the card. */}
        <h3 className={cn(body, "font-normal text-card-foreground")}>
          {href ? (
            // Stretched link: the whole card is clickable while the video toggle stays its own control.
            <a href={href} data-card-link="" className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']">
              <span style={delayStyle(line++)} className={cn(lineIntro, "inline-block")}>
                {title}
              </span>
            </a>
          ) : (
            <span style={delayStyle(line++)} className={cn(lineIntro, "inline-block")}>
              {title}
            </span>
          )}
        </h3>
        {description && (
          <p style={delayStyle(line++)} className={cn(lineIntro, body, "max-w-[30ch] text-(--mckp-ink-dim)")}>
            {description}
          </p>
        )}
        {children && (
          <div
            style={delayStyle(line++)}
            className={cn(
              lineIntro,
              "relative z-[2] mt-4 text-[length:var(--mckp-type-small)] leading-(--mckp-type-small-line) text-muted-foreground"
            )}
          >
            {children}
          </div>
        )}
      </div>
    </article>
  )
}
