import { Footer } from "@/registry/apple/components/footer"
import { Input } from "@/registry/apple/components/input"
import type { FooterSectionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Apple global footer with an optional signup row on the same light gray,
 * held to the footer's 980px column above its fine print and directory.
 */
export function FooterSection({ newsletter, className, ...footer }: FooterSectionProps) {
  return (
    <div className={cn("w-full bg-muted font-body text-foreground antialiased", className)}>
      {newsletter && (
        <div className="mx-auto max-w-[980px] px-4 min-[834px]:px-[22px]">
          <div className="flex flex-col gap-5 border-b border-foreground/16 pt-10 pb-7 min-[834px]:flex-row min-[834px]:items-start min-[834px]:justify-between min-[834px]:gap-10 min-[834px]:pt-12 min-[834px]:pb-8">
            <h2 className="max-w-[22ch] pt-0 font-display text-(length:--apple-promo-subhead-size-compact) leading-(--apple-promo-subhead-line-height-compact) font-semibold tracking-(--apple-promo-subhead-letter-spacing-compact) text-balance min-[834px]:pt-3 min-[1069px]:text-(length:--apple-promo-subhead-size) min-[1069px]:leading-(--apple-promo-subhead-line-height) min-[1069px]:tracking-(--apple-promo-subhead-letter-spacing)">
              {newsletter.title}
            </h2>
            <Input {...newsletter.input} className={cn("min-[834px]:max-w-[30rem]", newsletter.input.className)} />
          </div>
        </div>
      )}
      <Footer {...footer} />
    </div>
  )
}
