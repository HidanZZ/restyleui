import { Footer } from "@/registry/mckp/components/footer"
import { Input } from "@/registry/mckp/components/input"
import { Reveal } from "@/registry/mckp/components/reveal"
import type { FooterSectionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Source: the site footer. An optional newsletter band sits above it on the
 * same 9 column grid: the line where the brand column starts, the field
 * where the link columns start.
 */
export function FooterSection({ newsletter, className, ...footer }: FooterSectionProps) {
  return (
    <div className={cn("bg-background text-foreground", className)}>
      {newsletter && (
        <section className="border-t border-(--mckp-line-soft)">
          <div className="mx-auto grid max-w-kit grid-cols-9 items-center gap-y-6 px-gutter py-[60px] max-lg:grid-cols-1">
            <Reveal className="col-[1/5] max-lg:col-[1] lg:pr-10">
              <h2 className="text-balance font-display text-[length:var(--mckp-type-h2)] font-normal leading-(--mckp-type-h2-line) tracking-(--mckp-type-h2-tracking) text-foreground">
                {newsletter.title}
              </h2>
            </Reveal>
            <Reveal delay={100} className="col-[5/10] max-lg:col-[1]">
              <Input {...newsletter.input} />
            </Reveal>
          </div>
        </section>
      )}
      <Footer {...footer} />
    </div>
  )
}
