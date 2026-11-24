import { LogoRow } from "@/registry/apple/components/logo-row"
import { Reveal } from "@/registry/apple/components/reveal"
import type { LogoStripProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Designed: a light gray tile with a centered display line over a quiet row
 * of wordmarks, set like the tiles of the homepage it lives on.
 */
export function LogoStrip({ title, logos, className }: LogoStripProps) {
  return (
    <section
      className={cn(
        "w-full bg-muted px-gutter text-center font-body text-foreground antialiased",
        "py-[calc(var(--apple-tile-padding-y-mobile)+8px)] min-[735px]:py-(--apple-tile-padding-y-tablet) min-[1069px]:py-[calc(var(--apple-tile-padding-y-tall)+8px)]",
        className
      )}
    >
      <Reveal className="mx-auto flex max-w-[980px] flex-col items-center gap-7 min-[1069px]:gap-9">
        {title && (
          <h2
            className={cn(
              "max-w-[28ch] font-display font-semibold text-balance",
              "text-(length:--apple-tile-subhead-size-mobile) leading-(--apple-tile-subhead-line-height-mobile) tracking-(--apple-tile-subhead-letter-spacing-mobile)",
              "min-[735px]:text-(length:--apple-tile-subhead-size-tablet) min-[735px]:leading-(--apple-tile-subhead-line-height-tablet) min-[735px]:tracking-(--apple-tile-subhead-letter-spacing-tablet)",
              "min-[1069px]:text-(length:--apple-tile-subhead-size) min-[1069px]:leading-(--apple-tile-subhead-line-height) min-[1069px]:tracking-(--apple-tile-subhead-letter-spacing)"
            )}
          >
            {title}
          </h2>
        )}
        <LogoRow logos={logos} />
      </Reveal>
    </section>
  )
}
