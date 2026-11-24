import type { FaqProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Accordion } from "@/registry/linear/components/accordion"
import { Reveal } from "@/registry/linear/components/reveal"

/**
 * Designed on the source's feature-section split: the title and a short
 * tertiary note hold the left half (sticky on wide screens), and the hairline
 * question rows fill the right half.
 */
export function Faq({ title, description, items, className }: FaqProps) {
  return (
    <section className={cn("bg-background py-[calc(var(--kit-section-y)*2)] font-body text-foreground", className)}>
      <div className="mx-auto grid max-w-kit items-start gap-10 px-gutter lg:grid-cols-2 lg:gap-8">
        <Reveal className="px-(--linear-homepage-padding-inset) lg:sticky lg:top-[calc(var(--linear-header-height)+48px)] lg:pr-8">
          <h2
            className={cn(
              "max-w-[16ch] text-balance font-[510]",
              "text-[length:var(--linear-title-3-size)] leading-[1.33] tracking-[-0.012em]",
              "md:text-[length:var(--linear-title-5-size)] md:leading-[1.1] md:tracking-[-0.022em]",
              "xl:text-[length:var(--linear-title-6-size)] xl:leading-none"
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-[38ch] text-pretty text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground lg:mt-8">
              {description}
            </p>
          )}
        </Reveal>
        <Reveal delay={120} className="px-(--linear-homepage-padding-inset)">
          <Accordion items={items.map((item, i) => ({ id: `faq-${i}`, title: item.question, content: item.answer }))} />
        </Reveal>
      </div>
    </section>
  )
}
