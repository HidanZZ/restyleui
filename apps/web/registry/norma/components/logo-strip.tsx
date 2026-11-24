import type { LogoStripProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { LogoRow } from "@/registry/norma/components/logo-row"
import { Reveal } from "@/registry/norma/components/reveal"

/**
 * Norma logo strip: a full-bleed gray well with a centered two-line sentence
 * and one row of muted wordmarks that swap one slot every 2s. Under a Norma
 * hero, tuck it like the source: `-mt-7 sm:-mt-8` on the section, plus
 * `[&>div]:rounded-t-none [&>div]:pt-[4.75rem] sm:[&>div]:pt-24` for the well.
 */
export function LogoStrip({ title, logos, className }: LogoStripProps) {
  return (
    <section className={cn("bg-background px-(--norma-gutter-outer) font-body text-foreground", className)}>
      <div className="mx-auto max-w-(--norma-container-wide) rounded-kit-lg bg-secondary px-gutter py-12 text-center sm:py-16">
        {title && (
          <Reveal>
            <h2 className="mx-auto max-w-[34ch] text-[1.375rem] leading-[1.2] font-semibold tracking-[-0.01em] text-balance sm:text-[1.75rem]">
              {title}
            </h2>
          </Reveal>
        )}
        <Reveal delay={80} className={cn("mx-auto w-full max-w-[calc(var(--kit-container)-2*var(--kit-gutter))]", title && "mt-12 sm:mt-14")}>
          <LogoRow logos={logos} />
        </Reveal>
      </div>
    </section>
  )
}
