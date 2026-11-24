import type { FooterSectionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Footer } from "@/registry/linear/components/footer"
import { Input } from "@/registry/linear/components/input"

/**
 * Source: the site footer. An optional newsletter row opens it under a
 * hairline, split like the feature headers (title left, field right); the
 * footer's own six-column link grid follows under a second hairline.
 */
export function FooterSection({ newsletter, className, ...footer }: FooterSectionProps) {
  return (
    <div className={cn("bg-background font-body text-foreground", className)}>
      {newsletter && (
        <div className="border-t border-border">
          <div className="mx-auto grid max-w-kit items-end gap-6 px-gutter py-14 lg:grid-cols-2 lg:gap-8">
            <h2
              className={cn(
                "max-w-[20ch] px-(--linear-homepage-padding-inset) text-balance font-[510]",
                "text-[length:var(--linear-title-2-size)] leading-[1.33] tracking-[-0.012em]",
                "md:text-[length:var(--linear-title-3-size)]"
              )}
            >
              {newsletter.title}
            </h2>
            <div className="px-(--linear-homepage-padding-inset)">
              <Input {...newsletter.input} />
            </div>
          </div>
        </div>
      )}
      <Footer {...footer} />
    </div>
  )
}
