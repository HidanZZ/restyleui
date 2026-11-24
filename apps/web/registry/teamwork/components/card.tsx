"use client"

import type { CardProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"

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
        className="size-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-2 bottom-2 z-20 grid size-8 cursor-pointer place-items-center rounded-kit bg-background/80 text-foreground transition-colors duration-150 ease-kit hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-4">
          {playing ? (
            <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" fill="currentColor" />
          ) : (
            <path d="M5 3.25v9.5L12.5 8z" fill="currentColor" />
          )}
        </svg>
      </button>
    </>
  )
}

export function Card({ title, description, eyebrow, media, href, children, className }: CardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-kit border border-transparent bg-card px-5 py-4 text-card-foreground",
        "transition-[background-color,border-color] duration-150 ease-kit motion-reduce:transition-none",
        href && "hover:border-primary hover:bg-accent has-[a:focus-visible]:border-primary has-[a:focus-visible]:bg-accent",
        className
      )}
    >
      {media && (
        <div className="relative aspect-video overflow-hidden rounded-kit-sm bg-(--teamwork-surface-sunken)">
          {media.type === "video" ? (
            <CardVideo media={media} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-agnostic
            <img
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              loading="lazy"
              className="size-full object-cover"
            />
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <p className="font-mono text-xs leading-5 font-medium tracking-[1px] text-(--teamwork-text-subtle) uppercase">
            {eyebrow}
          </p>
        )}
        <h3
          className={cn(
            "font-display text-xl leading-[30px] tracking-[0.5px] text-foreground",
            href && "transition-colors duration-150 ease-kit group-hover:text-primary motion-reduce:transition-none"
          )}
        >
          {href ? (
            // The link stretches over the card; the video toggle sits above it.
            <a
              href={href}
              className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-kit after:content-['']"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {description && <p className="text-base leading-7 text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="text-sm leading-5 text-(--teamwork-text-subtle)">{children}</div>}
    </article>
  )
}
