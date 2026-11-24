import type { FaqProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Accordion } from "@/registry/norma/components/accordion"
import { Reveal } from "@/registry/norma/components/reveal"

/**
 * Norma FAQ: a short left-aligned heading, then the questions in one 16px
 * hairline box with row dividers. One answer opens at a time. On a gray well
 * (as on the source homepage) the white rows stand out on their own; pass
 * `bg-transparent` to let the well show around them.
 */
export function Faq({ title, description, items, className }: FaqProps) {
  return (
    <section className={cn("bg-background py-section font-body text-foreground", className)}>
      <div className="mx-auto w-full max-w-kit px-gutter">
        <Reveal>
          <h2 className="max-w-[16ch] text-(length:--norma-text-h2) leading-(--norma-leading-heading) font-semibold tracking-(--norma-tracking-heading) text-balance">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-[46ch] text-(length:--norma-text-body-lg) leading-(--norma-leading-body) text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </Reveal>
        <Reveal delay={80} className="mt-12">
          <Accordion items={items.map((item, index) => ({ id: `faq-${index}`, title: item.question, content: item.answer }))} />
        </Reveal>
      </div>
    </section>
  )
}
