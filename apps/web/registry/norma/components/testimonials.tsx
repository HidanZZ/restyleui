import type { TestimonialsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Reveal } from "@/registry/norma/components/reveal"

/**
 * Norma testimonials, after the reviews block: a gray well with a short
 * two-line heading, then one floating white panel that splits the quotes into
 * hairline-divided columns (three per row on desktop, stacked on phones).
 * Quotes enter with the blur reveal, staggered.
 */
export function Testimonials({ title, testimonials, className }: TestimonialsProps) {
  return (
    <section className={cn("bg-background pt-section pb-(--norma-section-y-lg) font-body text-foreground", className)}>
      <div className="mx-auto w-full max-w-kit px-gutter">
        <div className="rounded-kit-lg bg-secondary p-3 sm:p-4 lg:px-14 lg:pb-12">
          {title && (
            <Reveal className="px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10 lg:px-2 lg:pt-12 lg:pb-14">
              <h2 className="max-w-[13ch] text-(length:--norma-text-h2) leading-[1.05] font-semibold tracking-[-0.02em] text-balance">
                {title}
              </h2>
            </Reveal>
          )}
          <Reveal
            stagger
            className="grid grid-cols-1 overflow-hidden rounded-[1.5rem] border border-border bg-card text-card-foreground shadow-(--norma-shadow-float) lg:grid-cols-3"
          >
            {testimonials.map((item, index) => (
              <figure
                key={`${item.name}-${index}`}
                className={cn(
                  "flex h-full flex-col p-7 sm:p-8 lg:min-h-[180px]",
                  index > 0 && "border-t border-border",
                  index < 3 && "lg:border-t-0",
                  index % 3 !== 0 && "lg:border-l"
                )}
              >
                <blockquote className="flex-1 text-(length:--norma-text-body-lg) leading-[1.4] text-pretty">
                  <p>&ldquo;{item.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-(length:--norma-text-eyebrow) leading-[1.4]">
                  {item.avatar && (
                    <img src={item.avatar} alt="" width={36} height={36} loading="lazy" className="size-9 shrink-0 rounded-full bg-secondary object-cover" />
                  )}
                  <span className="min-w-0">
                    <span className="block font-medium text-foreground">{item.name}</span>
                    {item.role && <span className="block text-(--norma-ink-3)">{item.role}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
