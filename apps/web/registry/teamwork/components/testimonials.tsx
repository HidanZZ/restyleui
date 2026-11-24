import type { TestimonialsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Reveal } from "@/registry/teamwork/components/reveal"

const rule = "border-dotted border-[color-mix(in_srgb,var(--input)_60%,transparent)]"

// People are graph nodes: each quote hangs off a coloured node, and portraits sit on a tinted disc.
const TONES = [
  { dot: "bg-(--teamwork-lilac)", line: "group-hover:border-(--teamwork-lilac)" },
  { dot: "bg-(--teamwork-yellow)", line: "group-hover:border-(--teamwork-yellow)" },
  { dot: "bg-(--teamwork-green)", line: "group-hover:border-(--teamwork-green)" },
  { dot: "bg-(--teamwork-blue-strong)", line: "group-hover:border-(--teamwork-blue-strong)" },
]

export function Testimonials({ title, testimonials, className }: TestimonialsProps) {
  return (
    <section className={cn("w-full bg-background py-section font-body text-foreground max-sm:py-20", className)}>
      <div className="mx-auto flex w-full max-w-kit flex-col gap-12 px-gutter sm:gap-16">
        {title && (
          <Reveal>
            <h2 className="max-w-[22ch] font-display text-[28px] leading-[1.4] font-normal tracking-[0.5px] text-balance text-foreground sm:text-(length:--teamwork-text-display) sm:leading-(--teamwork-leading-display)">
              {title}
            </h2>
          </Reveal>
        )}

        <Reveal stagger className={cn("grid border-t border-l md:grid-cols-2 lg:grid-cols-3", rule)}>
          {testimonials.map((item, i) => {
            const tone = TONES[i % TONES.length]
            return (
              <figure key={item.name} className={cn("group flex h-full flex-col gap-8 border-r border-b p-8 lg:p-10", rule)}>
                <div aria-hidden className="flex items-center gap-2">
                  <span className={cn("size-2 shrink-0 rounded-full transition-transform duration-300 ease-kit group-hover:scale-150 motion-reduce:transition-none", tone.dot)} />
                  <span className={cn("h-0 flex-1 border-t border-dotted border-(--input)/50 transition-colors duration-300 ease-kit motion-reduce:transition-none", tone.line)} />
                </div>
                <blockquote className="flex-1 font-display text-xl leading-[30px] tracking-[0.5px] text-foreground/90">
                  <p>{item.quote}</p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  {item.avatar ? (
                    <span className={cn("size-10 shrink-0 overflow-hidden rounded-full", tone.dot)}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-agnostic */}
                      <img
                        src={item.avatar}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        className="size-full scale-110 object-cover mix-blend-luminosity contrast-125"
                      />
                    </span>
                  ) : (
                    <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm text-foreground">
                      {item.name.charAt(0)}
                    </span>
                  )}
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm leading-5 font-medium text-foreground">{item.name}</span>
                    {item.role && <span className="text-xs leading-5 text-(--teamwork-text-subtle)">{item.role}</span>}
                  </span>
                </figcaption>
              </figure>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
