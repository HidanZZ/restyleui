"use client"

import type { CardProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"

const mediaClass =
  "size-full object-cover transition-transform duration-[600ms] ease-kit group-hover:scale-105 motion-reduce:transition-none"

function CardVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
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
        className={mediaClass}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-4 right-4 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background/15 text-primary-foreground ring-1 ring-background/25 backdrop-blur-md outline-none transition-colors duration-200 hover:bg-background/25 focus-visible:ring-2 focus-visible:ring-background motion-reduce:transition-none"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          {playing ? <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" /> : <path d="M5 3.2v9.6L13 8z" />}
        </svg>
      </button>
    </>
  )
}

/**
 * Norma card: white surface, 28px corners and one hairline. Media sits flush on
 * top; hover darkens the border and slowly scales the media. With `href` the
 * title link stretches over the whole card.
 */
export function Card({ title, description, eyebrow, media, href, children, className }: CardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-kit-lg border border-border bg-card font-body text-card-foreground",
        "transition-[border-color] duration-200 ease-kit hover:border-foreground/20 has-focus-visible:border-foreground/40 motion-reduce:transition-none",
        className
      )}
    >
      {media && (
        <div className="relative aspect-[4/3] overflow-hidden bg-(--norma-coal)">
          {media.type === "video" ? (
            <CardVideo media={media} />
          ) : (
            <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" className={mediaClass} />
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-7 sm:p-8">
        {eyebrow && <p className="mb-2 text-[0.8125rem] font-medium leading-[1.4] text-muted-foreground">{eyebrow}</p>}
        <h3 className="text-(length:--norma-text-h3) font-semibold leading-[1.3] tracking-[-0.01em] text-balance">
          {href ? (
            <a
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-kit-lg focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {description && (
          <p className="mt-3 text-[1rem] leading-[1.5] text-pretty text-muted-foreground">{description}</p>
        )}
        {children && (
          <div className="mt-4 text-[0.9375rem] leading-[1.5] text-pretty text-muted-foreground">{children}</div>
        )}
      </div>
    </article>
  )
}
