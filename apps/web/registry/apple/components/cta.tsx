import { Button } from "@/registry/apple/components/button"
import { Input } from "@/registry/apple/components/input"
import { Reveal } from "@/registry/apple/components/reveal"
import type { CtaProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Apple closing tile: the source's light hero tile without the picture.
 * A centered headline and subhead, the elevated pill pair, and an optional
 * signup field, with the tall tile padding doubled for room.
 */
export function Cta({ title, description, actions, input, className }: CtaProps) {
  return (
    <section
      className={cn(
        "w-full bg-muted px-6 text-center font-body text-foreground antialiased",
        "py-[calc(var(--apple-tile-padding-y-mobile)*1.6)] min-[735px]:py-[calc(var(--apple-tile-padding-y-tablet)*1.6)] min-[1069px]:py-[calc(var(--apple-tile-padding-y-tall)*1.75)]",
        className
      )}
    >
      <Reveal stagger className="mx-auto max-w-[980px]">
        <h2
          className={cn(
            "mx-auto max-w-[20ch] font-display font-semibold text-balance",
            "text-(length:--apple-tile-title-size-mobile) leading-(--apple-tile-title-line-height-mobile) tracking-(--apple-tile-title-letter-spacing-mobile)",
            "min-[735px]:text-(length:--apple-tile-title-size-tablet) min-[735px]:leading-(--apple-tile-title-line-height-tablet) min-[735px]:tracking-(--apple-tile-title-letter-spacing-tablet)",
            "min-[1069px]:text-(length:--apple-tile-title-size) min-[1069px]:leading-(--apple-tile-title-line-height) min-[1069px]:tracking-(--apple-tile-title-letter-spacing)"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mx-auto mt-1 max-w-[36ch] font-display text-pretty min-[1069px]:mt-[6px]",
              "text-(length:--apple-tile-subhead-size-mobile) leading-(--apple-tile-subhead-line-height-mobile) tracking-(--apple-tile-subhead-letter-spacing-mobile)",
              "min-[735px]:text-(length:--apple-tile-subhead-size-tablet) min-[735px]:leading-(--apple-tile-subhead-line-height-tablet) min-[735px]:tracking-(--apple-tile-subhead-letter-spacing-tablet)",
              "min-[1069px]:text-(length:--apple-tile-subhead-size) min-[1069px]:leading-(--apple-tile-subhead-line-height) min-[1069px]:tracking-(--apple-tile-subhead-letter-spacing)"
            )}
          >
            {description}
          </p>
        )}
        {actions && actions.length > 0 && (
          <div className="mt-[11px] flex flex-wrap justify-center gap-[14px] min-[735px]:mt-4 min-[735px]:gap-[17px] min-[1069px]:mt-[17px]">
            {actions.map((action, index) => (
              <Button
                key={action.label}
                href={action.href}
                variant={action.variant ?? (index === 0 ? "primary" : "secondary")}
                size="lg"
                className="max-[734px]:px-[15px] max-[734px]:py-[8px] max-[734px]:text-(length:--apple-button-size) max-[734px]:leading-(--apple-button-line-height) max-[734px]:tracking-(--apple-button-letter-spacing)"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
        {input && <Input {...input} className={cn("mx-auto mt-8 text-start min-[1069px]:mt-10", input.className)} />}
      </Reveal>
    </section>
  )
}
