import type { FaqProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Accordion } from "@/registry/teamwork/components/accordion"
import { Reveal } from "@/registry/teamwork/components/reveal"

// Laid out like the source's overview: a quiet text column beside the selector rows,
// with the graph hub drawn small on a dotted tile.
export function Faq({ title, description, items, className }: FaqProps) {
  return (
    <section className={cn("w-full bg-background py-section font-body text-foreground max-sm:py-20", className)}>
      <div className="mx-auto grid w-full max-w-kit gap-12 px-gutter lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal className="flex flex-col items-start gap-4">
          <h2 className="max-w-[18ch] font-display text-[28px] leading-[1.4] font-normal tracking-[0.5px] text-balance text-foreground sm:text-(length:--teamwork-text-display) sm:leading-(--teamwork-leading-display)">
            {title}
          </h2>
          {description && (
            <p className="max-w-[420px] text-(length:--teamwork-text-body) leading-(--teamwork-leading-body) text-muted-foreground">
              {description}
            </p>
          )}
          <svg
            aria-hidden
            viewBox="0 0 120 120"
            fill="none"
            className="mt-8 hidden size-30 border border-dotted border-[color-mix(in_srgb,var(--input)_50%,transparent)] bg-(--teamwork-surface-sunken) lg:block"
          >
            <path d="M30 0v120M60 0v120M90 0v120M0 30h120M0 60h120M0 90h120" className="stroke-(--teamwork-line)" strokeDasharray="1 2" />
            <path d="M44 44l32 32M44 76l16-16" className="stroke-(--teamwork-text-subtle)" strokeWidth="2" />
            <circle cx="44" cy="44" r="7" strokeWidth="4" className="stroke-(--teamwork-blue-strong)" />
            <circle cx="76" cy="44" r="7" strokeWidth="4" className="stroke-(--teamwork-green)" />
            <circle cx="44" cy="76" r="7" strokeWidth="4" className="stroke-(--teamwork-lilac)" />
            <circle cx="76" cy="76" r="7" strokeWidth="4" className="stroke-(--teamwork-yellow)" />
          </svg>
        </Reveal>

        <Reveal delay={120}>
          <Accordion
            defaultValue={items.length > 0 ? ["faq-0"] : undefined}
            items={items.map((item, i) => ({ id: `faq-${i}`, title: item.question, content: item.answer }))}
            className="border-y border-(--teamwork-grid) py-6"
          />
        </Reveal>
      </div>
    </section>
  )
}
