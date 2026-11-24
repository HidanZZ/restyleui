import type { FooterSectionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Footer } from "@/registry/norma/components/footer"
import { Input } from "@/registry/norma/components/input"

/**
 * Norma footer section: the kit Footer with the waitlist field tucked under
 * the wordmark and tagline, as on the source. Footer has no slot below its
 * description, so this section composes the whole brand column (wordmark,
 * tagline, signup) and passes it as `brand`; the inner wrapper resets the
 * wordmark type for everything under it.
 */
export function FooterSection({ newsletter, brand, description, ...footer }: FooterSectionProps) {
  if (!newsletter) return <Footer brand={brand} description={description} {...footer} />

  return (
    <Footer
      {...footer}
      brand={
        <>
          {brand}
          <div className="text-base leading-normal font-normal tracking-normal">
            {description && (
              <p className="mt-4 text-[0.9375rem] leading-[1.5] text-pretty text-muted-foreground">{description}</p>
            )}
            <p className="mt-7 text-(length:--norma-text-eyebrow) font-semibold text-foreground">{newsletter.title}</p>
            {/* The footer column is an auto grid track; a zero-basis field keeps it from growing past narrow screens. */}
            <Input {...newsletter.input} className={cn("mt-3 [&_input]:w-0", newsletter.input.className)} />
          </div>
        </>
      }
    />
  )
}
