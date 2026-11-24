import { Button } from "@/registry/mckp/components/button"
import { Input } from "@/registry/mckp/components/input"
import { Reveal } from "@/registry/mckp/components/reveal"
import type { CtaProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Source: the closing CTA block. A centred H1, a short grey line capped at
 * 494px and the white button, each rising in after the one before, with
 * 160px of black above and below.
 */
export function Cta({ title, description, actions, input, className }: CtaProps) {
  return (
    <section
      className={cn(
        "mx-auto flex max-w-kit flex-col items-center justify-center gap-6 px-gutter py-(--mckp-section-y-lg) text-center",
        className
      )}
    >
      <Reveal>
        <h2 className="max-w-[12em] text-balance font-display text-[length:var(--mckp-type-h1)] font-medium leading-(--mckp-type-h1-line) tracking-(--mckp-type-h1-tracking) text-foreground">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={100}>
          <p className="max-w-[494px] text-pretty text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-muted-foreground">
            {description}
          </p>
        </Reveal>
      )}
      {input && (
        <Reveal delay={200} className="flex w-full justify-center text-left">
          <Input {...input} />
        </Reveal>
      )}
      {actions && actions.length > 0 && (
        <Reveal delay={input ? 300 : 200} className="flex flex-wrap items-center justify-center gap-3">
          {actions.map((action) => (
            <Button key={action.label} href={action.href} size="lg" variant={action.variant ?? "primary"}>
              {action.label}
            </Button>
          ))}
        </Reveal>
      )}
    </section>
  )
}
