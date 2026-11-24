import type { LogoStripProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { LogoRow } from "@/registry/linear/components/logo-row"
import { Reveal } from "@/registry/linear/components/reveal"

/**
 * Source: the customer logos under the hero. Wordmarks spread across the
 * content width (a marquee below 1024px) with the title as a mono caps caption.
 */
export function LogoStrip({ title, logos, className }: LogoStripProps) {
  return (
    <section className={cn("bg-background py-section font-body text-foreground", className)}>
      <div className="mx-auto max-w-kit px-gutter">
        <Reveal className="px-(--linear-homepage-padding-inset)">
          <LogoRow logos={logos} label={title} />
        </Reveal>
      </div>
    </section>
  )
}
