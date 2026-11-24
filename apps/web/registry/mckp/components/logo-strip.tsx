import { LogoRow } from "@/registry/mckp/components/logo-row"
import { Reveal } from "@/registry/mckp/components/reveal"
import type { LogoStripProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Designed after the clone's modes row: a quiet grey line and a single row of
 * white wordmarks, both indented to column 2 of the 9 column grid, with the
 * compact 80px rhythm of a navigation band rather than a full section.
 */
export function LogoStrip({ title, logos, className }: LogoStripProps) {
  return (
    <section className={cn("mx-auto max-w-kit px-gutter py-(--mckp-section-y-sm)", className)}>
      <Reveal>
        <LogoRow logos={logos} label={title} />
      </Reveal>
    </section>
  )
}
