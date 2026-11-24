import { Accordion } from "@/registry/mckp/components/accordion"
import { Reveal } from "@/registry/mckp/components/reveal"
import type { FaqProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Source: the FAQ. The heading holds columns 2 to 4 and the hairline
 * question list columns 5 to 8; under 1024px they stack.
 */
export function Faq({ title, description, items, className }: FaqProps) {
  return (
    <section
      className={cn(
        "mx-auto grid max-w-kit grid-cols-9 items-start px-gutter pt-section pb-10 max-lg:grid-cols-1 max-lg:gap-8 max-md:pb-5",
        className
      )}
    >
      <Reveal className="col-[2/5] max-lg:col-[1]">
        <h2 className="font-display text-[length:var(--mckp-type-h2)] font-normal leading-(--mckp-type-h2-line) tracking-(--mckp-type-h2-tracking) text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-[30ch] text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-(--mckp-ink-dim)">
            {description}
          </p>
        )}
      </Reveal>
      <Reveal delay={100} className="col-[5/9] max-lg:col-[1]">
        <Accordion items={items.map((item, index) => ({ id: `faq-${index}`, title: item.question, content: item.answer }))} />
      </Reveal>
    </section>
  )
}
