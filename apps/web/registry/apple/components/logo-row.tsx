import type { LogoRowProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Designed: a quiet, centered row of wordmarks in the tertiary gray, set in
 * the display face like the source's product names. Image logos turn gray.
 */
export function LogoRow({ logos, label, className }: LogoRowProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6 text-center font-body antialiased", className)}>
      {label && (
        <p className="text-(length:--apple-promo-callout-size) leading-(--apple-promo-callout-line-height) tracking-(--apple-promo-callout-letter-spacing) text-muted-foreground">
          {label}
        </p>
      )}
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 min-[735px]:gap-x-14">
        {logos.map((logo) => (
          <li key={logo.name} className="flex items-center">
            {logo.src ? (
              <img src={logo.src} alt={logo.name} className="h-7 w-auto opacity-60 grayscale" />
            ) : (
              <span className="font-display text-[19px] leading-none font-semibold tracking-[.012em] whitespace-nowrap text-(--apple-tertiary-text) min-[735px]:text-[21px] min-[735px]:tracking-[.011em]">
                {logo.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
