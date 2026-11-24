import type { CtaProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Button } from "@/registry/linear/components/button"
import { Input } from "@/registry/linear/components/input"
import { Reveal } from "@/registry/linear/components/reveal"

/**
 * Source: the homepage prefooter. A centered, balanced headline in the largest
 * title size with wide space around it, then large pill actions 12px apart.
 * An optional signup field sits under the actions.
 */
export function Cta({ title, description, actions, input, className }: CtaProps) {
  return (
    <section className={cn("bg-background font-body text-foreground", className)}>
      <Reveal
        stagger
        className="mx-auto flex max-w-kit flex-col items-center gap-10 px-gutter py-24 text-center md:py-32 lg:py-56 [&>*]:w-full"
      >
        <div className="flex flex-col items-center gap-5">
          <h2
            className={cn(
              "max-w-[16ch] text-balance font-[510]",
              "text-[38px] leading-[1.1] tracking-[-0.022em]",
              "md:text-[length:var(--linear-title-7-size)]",
              "lg:text-[length:var(--linear-title-9-size)] lg:leading-none"
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="max-w-(--linear-prose-max) text-pretty text-[length:var(--linear-text-large-size)] leading-[1.6] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {((actions && actions.length > 0) || input) && (
          <div className="flex flex-col items-center gap-8">
            {actions && actions.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {actions.map((action) => (
                  <Button key={action.label} href={action.href} variant={action.variant ?? "primary"} size="lg">
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            {input && <Input {...input} className={cn("text-left", input.className)} />}
          </div>
        )}
      </Reveal>
    </section>
  )
}
