import type { CtaProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Button } from "@/registry/norma/components/button"
import { Input } from "@/registry/norma/components/input"
import { Reveal } from "@/registry/norma/components/reveal"

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

/**
 * Norma closing block: one large centered statement on the gray well, a line
 * of copy, then the order pill (48px, ink, arrow) with an optional quiet
 * second pill, and an optional signup field. Staged blur reveal.
 */
export function Cta({ title, description, actions, input, className }: CtaProps) {
  return (
    <section className={cn("bg-background py-section font-body text-foreground", className)}>
      <div className="mx-auto w-full max-w-kit px-gutter">
        <Reveal stagger className="rounded-kit-lg bg-secondary px-6 py-16 text-center sm:px-12 sm:py-24">
          <h2 className="mx-auto max-w-[18ch] text-(length:--norma-text-h2) leading-[1.05] font-semibold tracking-(--norma-tracking-heading) text-balance">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-5 max-w-[44ch] text-(length:--norma-text-body-lg) leading-(--norma-leading-body) text-pretty text-muted-foreground">
              {description}
            </p>
          )}
          {actions && actions.length > 0 && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {actions.map((action) => {
                const primary = (action.variant ?? "primary") === "primary"
                return (
                  <Button
                    key={action.label}
                    href={action.href}
                    size="lg"
                    variant={primary ? "primary" : "secondary"}
                    icon={primary ? <ArrowIcon /> : undefined}
                  >
                    {action.label}
                  </Button>
                )
              })}
            </div>
          )}
          {input && <Input {...input} className={cn("mx-auto text-left", actions?.length ? "mt-8" : "mt-10", input.className)} />}
        </Reveal>
      </div>
    </section>
  )
}
