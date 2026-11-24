import { Accordion } from "@/registry/apple/components/accordion"
import { Reveal } from "@/registry/apple/components/reveal"
import type { FaqProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Designed: a centered headline on white over the kit's hairline accordion,
 * held to a comfortable reading width with generous room around it.
 */
export function Faq({ title, description, items, className }: FaqProps) {
  return (
    <section
      className={cn(
        "w-full bg-background px-6 font-body text-foreground antialiased",
        "py-16 min-[735px]:py-20 min-[1069px]:py-24",
        className
      )}
    >
      <Reveal stagger className="mx-auto flex max-w-[980px] flex-col items-center text-center">
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

      <Reveal delay={150} className="mx-auto mt-10 max-w-[820px] min-[1069px]:mt-14">
        <Accordion items={items.map((item, index) => ({ id: `faq-${index}`, title: item.question, content: item.answer }))} />
      </Reveal>
    </section>
  )
}
