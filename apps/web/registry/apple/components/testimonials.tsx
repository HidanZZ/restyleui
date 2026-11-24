import { Reveal } from "@/registry/apple/components/reveal"
import type { TestimonialsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Designed: a centered headline on white over flat gray quote tiles with
 * 12px gaps. Each quote is set in the display face, with a round portrait
 * and a compact byline, like the captions of the homepage tiles.
 */
export function Testimonials({ title, testimonials, className }: TestimonialsProps) {
  return (
    <section className={cn("w-full bg-background font-body text-foreground antialiased", className)}>
      {title && (
        <Reveal className="mx-auto max-w-[980px] px-6 pt-16 pb-8 text-center min-[735px]:pt-20 min-[735px]:pb-10 min-[1069px]:pt-24 min-[1069px]:pb-12">
          <h2
            className={cn(
              "mx-auto max-w-[22ch] font-display font-semibold text-balance",
              "text-(length:--apple-tile-title-size-mobile) leading-(--apple-tile-title-line-height-mobile) tracking-(--apple-tile-title-letter-spacing-mobile)",
              "min-[735px]:text-(length:--apple-tile-title-size-tablet) min-[735px]:leading-(--apple-tile-title-line-height-tablet) min-[735px]:tracking-(--apple-tile-title-letter-spacing-tablet)",
              "min-[1069px]:text-(length:--apple-tile-title-size) min-[1069px]:leading-(--apple-tile-title-line-height) min-[1069px]:tracking-(--apple-tile-title-letter-spacing)"
            )}
          >
            {title}
          </h2>
        </Reveal>
      )}

      <Reveal
        stagger
        className={cn(
          "grid grid-cols-1 gap-(--apple-section-gap) min-[735px]:px-(--apple-promo-gutter)",
          testimonials.length % 3 === 0 || testimonials.length > 4 ? "min-[1069px]:grid-cols-3" : testimonials.length > 1 && "min-[1069px]:grid-cols-2"
        )}
      >
        {testimonials.map((item) => (
          <figure
            key={item.name + item.quote}
            className="flex h-full flex-col items-center justify-between gap-8 bg-card px-8 py-(--apple-tile-padding-y-mobile) text-center text-card-foreground min-[735px]:px-12 min-[735px]:py-[44px] min-[1069px]:px-10 min-[1069px]:py-[53px]"
          >
            <blockquote className="max-w-[30ch] font-display text-(length:--apple-promo-subhead-size-compact) leading-(--apple-promo-subhead-line-height-compact) font-semibold tracking-(--apple-promo-subhead-letter-spacing-compact) text-balance min-[1069px]:text-(length:--apple-promo-subhead-size) min-[1069px]:leading-(--apple-promo-subhead-line-height) min-[1069px]:tracking-(--apple-promo-subhead-letter-spacing)">
              <p>&ldquo;{item.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="flex flex-col items-center gap-3">
              {item.avatar && (
                <img src={item.avatar} alt="" width={56} height={56} loading="lazy" className="size-14 rounded-full object-cover" />
              )}
              <span className="flex flex-col text-(length:--apple-promo-callout-size) leading-(--apple-promo-callout-line-height) tracking-(--apple-promo-callout-letter-spacing)">
                <span className="font-semibold text-foreground">{item.name}</span>
                {item.role && <span className="text-muted-foreground">{item.role}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  )
}
