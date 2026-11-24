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
        className={cn(
          "absolute bottom-2.5 right-2.5 z-10 grid size-7 cursor-pointer place-items-center rounded-full bg-(--linear-bg-translucent) text-(--linear-text-secondary) backdrop-blur-[4px]",
          "shadow-[inset_0_0_0_1px_#ffffff08,0_0_0_1px_#0009] transition-colors duration-100 hover:bg-(--linear-bg-level-3) hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
        )}
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 fill-current">
          {playing ? <path d="M4.5 3h2v10h-2zM9.5 3h2v10h-2z" /> : <path d="M5 3.2v9.6a.5.5 0 0 0 .76.43l7.7-4.8a.5.5 0 0 0 0-.86l-7.7-4.8A.5.5 0 0 0 5 3.2Z" />}
        </svg>
      </button>
    </>
  )
}

/**
 * Source: the benefit and changelog cards. Quiet panel, mono figure label, product media,
 * medium title over tertiary copy. With `href` the title link stretches over the card.
 */
export function Card({ title, description, eyebrow, media, href, children, className }: CardProps) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-[8px] border border-(--linear-border-translucent) bg-card px-6 pb-7 pt-5 text-card-foreground",
        href &&
          "transition-[filter] duration-100 ease-kit hover:brightness-[1.25] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-(--linear-accent) motion-reduce:transition-none",
        className
      )}
    >
      {eyebrow && (
        <span className="font-mono text-xs uppercase leading-[1.4] text-(--linear-text-quaternary)">{eyebrow}</span>
      )}
      {media && (
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-[6px] border border-(--linear-border-translucent) bg-(--linear-bg-marketing)",
            eyebrow ? "mt-5" : "mt-1",
            "mb-7"
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
              decoding="async"
              className="size-full object-cover"
            />
          )}
        </div>
      )}
      <div className={cn("mt-auto flex flex-col gap-2", !media && eyebrow && "pt-16")}>
        <h3 className="text-[15px] font-[510] leading-[1.6] tracking-[-0.011em] text-(--linear-text-secondary)">
          {href ? (
            <a href={href} className="outline-none after:absolute after:inset-0 after:rounded-[8px] after:content-['']">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {description && (
          <p className="max-w-[368px] text-balance text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="mt-4 text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground [&_a]:text-(--linear-link)">
          {children}
        </div>
      )}
    </div>
  )
}
