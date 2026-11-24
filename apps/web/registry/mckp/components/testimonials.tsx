import { Carousel } from "@/registry/mckp/components/carousel"
import { Reveal } from "@/registry/mckp/components/reveal"
import type { TestimonialsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

type Testimonial = TestimonialsProps["testimonials"][number]

const h2 =
  "font-display text-[length:var(--mckp-type-h2)] font-normal leading-(--mckp-type-h2-line) tracking-(--mckp-type-h2-tracking) text-foreground"

// Hover: a slow monochrome sheen drifts across the lit card.
const sheenKeyframes = "@keyframes mckp-sheen{0%,to{background-position:0% 0%}50%{background-position:100% 100%}}"

// Every hover move shares the clone's 0.5s out-expo curve.
const swap = "transition-[color,opacity,translate] duration-500 ease-kit-in-out motion-reduce:transition-none"

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/**
 * One quote in the clone's "plays nicely" card: author on top, the quote at
 * the bottom in quiet grey. On hover the card lights up white, the small
 * quote lifts away and the same words return at a large, tight size.
 */
function QuoteCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, role, avatar } = testimonial
  return (
    <figure className="group/quote relative isolate flex h-full min-h-[400px] flex-col justify-between gap-12 overflow-clip rounded-kit bg-card p-(--mckp-feature-pad) max-lg:min-h-[360px] max-md:min-h-[240px] max-md:p-(--mckp-card-pad)">
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--foreground)_0%,var(--mckp-ink-soft)_35%,var(--foreground)_65%,var(--mckp-ink-soft)_100%)] bg-[length:200%_200%] opacity-0 transition-opacity duration-500 ease-kit-in-out group-hover/quote:animate-[mckp-sheen_5s_ease-in-out_infinite] group-hover/quote:opacity-100 motion-reduce:transition-none motion-reduce:group-hover/quote:animate-none"
      />

      <figcaption className="flex items-center gap-4">
        {avatar ? (
          <img src={avatar} alt="" width={40} height={40} loading="lazy" className="size-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-(--mckp-surface-raised) font-mono text-[length:var(--mckp-type-mono)] text-muted-foreground"
          >
            {initials(name)}
          </span>
        )}
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className={cn(swap, "text-[length:var(--mckp-type-body)] font-medium leading-(--mckp-type-body-line) text-foreground group-hover/quote:text-primary-foreground")}>
            {name}
          </span>
          {role && (
            <span
              className={cn(
                swap,
                "text-[length:var(--mckp-type-small)] leading-[19px] tracking-[-0.14px] text-(--mckp-ink-faint) group-hover/quote:text-primary-foreground/60"
              )}
            >
              {role}
            </span>
          )}
        </span>
      </figcaption>

      <div className="relative">
        <blockquote
          className={cn(
            "absolute inset-x-0 bottom-0 text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-foreground/40",
            "transition-[opacity,translate] duration-[350ms] ease-kit-in-out group-hover/quote:-translate-y-3 group-hover/quote:opacity-0 motion-reduce:transition-none"
          )}
        >
          <p>{quote}</p>
        </blockquote>
        {/* Same words at display size; it also reserves the card's text height. */}
        <p
          aria-hidden="true"
          className={cn(
            "translate-y-4 text-[32px] leading-[37px] tracking-[-1.92px] text-primary-foreground opacity-0 max-lg:text-2xl max-lg:leading-7 max-lg:tracking-[-1.2px] max-md:text-[22px] max-md:leading-[26px] max-md:tracking-[-0.8px]",
            "transition-[opacity,translate] duration-500 ease-kit-in-out group-hover/quote:translate-y-0 group-hover/quote:opacity-100 group-hover/quote:delay-[80ms] motion-reduce:transition-none"
          )}
        >
          {quote}
        </p>
      </div>
    </figure>
  )
}

/**
 * Designed after the clone's "plays nicely" grid: a two-line H2 at column 2,
 * then flat cards cut by 2px gaps. Three quotes or fewer sit in one row;
 * more slide in the kit carousel, three to a view.
 */
export function Testimonials({ title, testimonials, className }: TestimonialsProps) {
  const cards = testimonials.map((testimonial) => <QuoteCard key={testimonial.name} testimonial={testimonial} />)

  return (
    <section className={cn("mx-auto max-w-kit px-gutter pt-(--mckp-section-y-lg) pb-(--mckp-section-y-sm)", className)}>
      <style href="mckp-sheen" precedence="default">
        {sheenKeyframes}
      </style>
      {title && (
        <div className="mb-20 grid grid-cols-9 max-lg:mb-10 max-lg:grid-cols-1">
          <Reveal className="col-[2/6] max-lg:col-[1]">
            <h2 className={h2}>{title}</h2>
          </Reveal>
        </div>
      )}
      {testimonials.length > 3 ? (
        <Reveal>
          <Carousel items={cards} label="Testimonials" />
        </Reveal>
      ) : (
        <Reveal stagger className="grid grid-cols-3 gap-(--mckp-tile-gap) max-md:grid-cols-1">
          {cards}
        </Reveal>
      )}
    </section>
  )
}
