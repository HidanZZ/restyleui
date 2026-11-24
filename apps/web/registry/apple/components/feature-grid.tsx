import { Card } from "@/registry/apple/components/card"
import { Reveal } from "@/registry/apple/components/reveal"
import type { FeatureGridProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Apple promo grid: a centered headline on white over a grid of flat gray
 * tiles with 12px gaps. Features with media become the source's two-up promo
 * tiles (one column without outer gutter on phones); icon features become
 * compact three-up tiles.
 */
export function FeatureGrid({ eyebrow, title, description, features, className }: FeatureGridProps) {
  const withMedia = features.some((feature) => feature.media)

  return (
    <section className={cn("w-full bg-background font-body text-foreground antialiased", className)}>
      <Reveal
        stagger
        className="mx-auto flex max-w-[980px] flex-col items-center px-6 pt-16 pb-8 text-center min-[735px]:pt-20 min-[735px]:pb-10 min-[1069px]:pt-24 min-[1069px]:pb-12"
      >
        {eyebrow && (
          <p className="mb-2 text-(length:--apple-tile-callout-size-compact) leading-(--apple-tile-callout-line-height-compact) font-semibold tracking-(--apple-tile-callout-letter-spacing-compact) text-muted-foreground min-[1069px]:text-(length:--apple-tile-callout-size) min-[1069px]:leading-(--apple-tile-callout-line-height) min-[1069px]:tracking-(--apple-tile-callout-letter-spacing)">
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "max-w-[22ch] font-display font-semibold text-balance",
            "text-(length:--apple-tile-title-size-mobile) leading-(--apple-tile-title-line-height-mobile) tracking-(--apple-tile-title-letter-spacing-mobile)",
            "min-[735px]:text-(length:--apple-tile-title-size-tablet) min-[735px]:leading-(--apple-tile-title-line-height-tablet) min-[735px]:tracking-(--apple-tile-title-letter-spacing-tablet)",
            "min-[1069px]:text-(length:--apple-tile-title-size) min-[1069px]:leading-(--apple-tile-title-line-height) min-[1069px]:tracking-(--apple-tile-title-letter-spacing)"
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-[40ch] font-display text-(length:--apple-promo-subhead-size-compact) leading-(--apple-promo-subhead-line-height-compact) tracking-(--apple-promo-subhead-letter-spacing-compact) text-pretty text-muted-foreground min-[1069px]:mt-4 min-[1069px]:text-(length:--apple-promo-subhead-size) min-[1069px]:leading-(--apple-promo-subhead-line-height) min-[1069px]:tracking-(--apple-promo-subhead-letter-spacing)">
            {description}
          </p>
        )}
      </Reveal>

      {withMedia ? (
        <Reveal stagger className="grid grid-cols-1 gap-(--apple-section-gap) min-[735px]:grid-cols-2 min-[735px]:px-(--apple-promo-gutter)">
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} description={feature.description} media={feature.media} className="h-full" />
          ))}
        </Reveal>
      ) : (
        <Reveal
          stagger
          className="grid grid-cols-1 gap-(--apple-section-gap) min-[735px]:grid-cols-2 min-[735px]:px-(--apple-promo-gutter) min-[1069px]:grid-cols-3"
        >
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex h-full flex-col items-center bg-card px-8 py-(--apple-tile-padding-y-mobile) text-center text-card-foreground min-[735px]:py-[44px] min-[1069px]:py-[53px]"
            >
              {feature.icon && (
                <span aria-hidden="true" className="mb-5 flex text-foreground [&_svg]:size-10">
                  {feature.icon}
                </span>
              )}
              <h3 className="font-display text-(length:--apple-promo-subhead-size-compact) leading-(--apple-promo-subhead-line-height-compact) font-semibold tracking-(--apple-promo-subhead-letter-spacing-compact) text-balance min-[1069px]:text-(length:--apple-promo-subhead-size) min-[1069px]:leading-(--apple-promo-subhead-line-height) min-[1069px]:tracking-(--apple-promo-subhead-letter-spacing)">
                {feature.title}
              </h3>
              <p className="mt-2 max-w-[30ch] text-(length:--apple-body-size) leading-(--apple-body-line-height) tracking-(--apple-body-letter-spacing) text-pretty text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </Reveal>
      )}
    </section>
  )
}
