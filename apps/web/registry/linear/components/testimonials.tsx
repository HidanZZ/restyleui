import type { TestimonialsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Carousel } from "@/registry/linear/components/carousel"
import { Reveal } from "@/registry/linear/components/reveal"

type Testimonial = TestimonialsProps["testimonials"][number]

// Quiet tonal variety, after the source's customer cards: a pale indigo wash,
// the brand indigo, and a raised graphite panel.
const tones = [
  "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--linear-link)_30%,var(--foreground))_0%,var(--foreground)_100%)] text-background",
  "bg-primary text-primary-foreground",
  "bg-(--linear-bg-level-3) text-foreground",
]

function QuoteCard({ testimonial, index, large = false }: { testimonial: Testimonial; index: number; large?: boolean }) {
  return (
    <figure
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[8px]",
        large ? "h-[480px] px-8 py-6" : "p-5 md:px-7 md:py-6",
        tones[index % tones.length]
      )}
    >
      <blockquote
        className={cn(
          "max-w-[28ch] -indent-[0.4em] text-balance",
          large
            ? "text-[length:var(--linear-title-2-size)] leading-[1.33] tracking-[-0.012em] xl:text-[length:var(--linear-title-4-size)] xl:leading-[1.125] xl:tracking-[-0.022em]"
            : "text-[length:var(--linear-title-1-size)] leading-[1.4] tracking-[-0.012em] md:text-[length:var(--linear-title-2-size)] md:leading-[1.33]"
        )}
      >
        <p>
          “{testimonial.quote}”
        </p>
      </blockquote>
      <figcaption className="mt-auto flex items-center pt-6">
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
            className="mr-4 size-8 shrink-0 rounded-full object-cover"
          />
        )}
        <span
          className={cn(
            "flex min-w-0 flex-col text-[14px] leading-[1.5] tracking-[-0.013em]",
            testimonial.avatar && "border-l border-current/10 pl-4"
          )}
        >
          <span className="font-[510]">{testimonial.name}</span>
          {testimonial.role && <span className="opacity-60">{testimonial.role}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

/**
 * Source: the customers section. Tall tonal quote cards 8px apart inside a
 * hairline frame that fades out to the right and bottom; a carousel of
 * compact cards below 1024px. Quotes hang their opening mark.
 */
export function Testimonials({ title, testimonials, className }: TestimonialsProps) {
  const row = testimonials.length <= 3

  const carousel = (
    <Carousel
      label="Customer quotes"
      items={testimonials.map((testimonial, i) => (
        <QuoteCard key={testimonial.name + i} testimonial={testimonial} index={i} />
      ))}
    />
  )

  return (
    <section className={cn("bg-background py-section font-body text-foreground", className)}>
      <div className="mx-auto max-w-kit px-gutter">
        {title && (
          <Reveal className="px-(--linear-homepage-padding-inset)">
            <h2
              className={cn(
                "max-w-[20ch] text-balance font-[510]",
                "text-[length:var(--linear-title-3-size)] leading-[1.33] tracking-[-0.012em]",
                "md:text-[length:var(--linear-title-5-size)] md:leading-[1.1] md:tracking-[-0.022em]",
                "xl:text-[length:var(--linear-title-6-size)] xl:leading-none"
              )}
            >
              {title}
            </h2>
          </Reveal>
        )}

        <Reveal delay={120} className={title ? "mt-12 md:mt-[72px]" : undefined}>
          {row ? (
            <>
              <div
                className={cn(
                  "relative hidden gap-2 px-3 pt-3 lg:flex",
                  "before:pointer-events-none before:absolute before:-inset-px before:rounded-[20px] before:border before:border-border",
                  "before:[mask-image:linear-gradient(to_bottom,black,transparent),linear-gradient(to_right,black,transparent_50%)] before:[mask-composite:intersect]"
                )}
              >
                {testimonials.map((testimonial, i) => (
                  <div key={testimonial.name + i} className={cn("min-w-0", i === 0 ? "flex-[1.5]" : "flex-1")}>
                    <QuoteCard testimonial={testimonial} index={i} large />
                  </div>
                ))}
              </div>
              <div className="lg:hidden">{carousel}</div>
            </>
          ) : (
            carousel
          )}
        </Reveal>
      </div>
    </section>
  )
}
