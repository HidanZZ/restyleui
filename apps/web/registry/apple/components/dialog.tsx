"use client"

import {
  Dialog as DialogRoot,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import type { DialogProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"

/**
 * Apple overlay: the page blurs under the nav's frosted curtain and a white
 * sheet fades in with a round gray close button. The trigger is the kit's
 * blue pill.
 */
export function Dialog({ trigger, title, description, children, open, onOpenChange, className }: DialogProps) {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} container={container}>
      <DialogTrigger
        ref={kitRef}
        className={cn(
          "inline-flex cursor-pointer items-center rounded-(--apple-button-radius) border border-transparent bg-primary px-[15px] py-[8px] font-body text-(length:--apple-button-size) leading-(--apple-button-line-height) tracking-(--apple-button-letter-spacing) whitespace-nowrap text-primary-foreground antialiased",
          "hover:bg-(--apple-blue-hover) active:bg-(--apple-blue-active) focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring"
        )}
      >
        {trigger}
      </DialogTrigger>
      <DialogBackdrop className="fixed inset-0 z-50 bg-accent/40 backdrop-blur-[20px] transition-opacity duration-[240ms] ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
      <DialogContent
        className={cn(
          "fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100%-1.5rem))] flex-col overflow-y-auto",
          "rounded-kit-lg bg-background px-6 pt-14 pb-10 font-body text-foreground antialiased shadow-[0_5px_30px] shadow-foreground/15 min-[735px]:px-14 min-[735px]:pt-16 min-[735px]:pb-14",
          "transition-[opacity,scale] duration-[240ms] ease-kit data-starting-style:scale-[.97] data-starting-style:opacity-0 data-ending-style:scale-[.97] data-ending-style:opacity-0 motion-reduce:transition-none",
          "focus-visible:outline-none",
          className
        )}
      >
        <DialogTitle className="font-display text-(length:--apple-promo-title-size-compact) leading-(--apple-promo-title-line-height-compact) font-semibold tracking-(--apple-promo-title-letter-spacing-compact) text-balance min-[735px]:text-(length:--apple-promo-title-size) min-[735px]:leading-(--apple-promo-title-line-height) min-[735px]:tracking-(--apple-promo-title-letter-spacing)">
          {title}
        </DialogTitle>
        {description && (
          <DialogDescription className="mt-2 font-display text-(length:--apple-promo-subhead-size-compact) leading-(--apple-promo-subhead-line-height-compact) tracking-(--apple-promo-subhead-letter-spacing-compact) text-muted-foreground min-[735px]:text-(length:--apple-promo-subhead-size) min-[735px]:leading-(--apple-promo-subhead-line-height) min-[735px]:tracking-(--apple-promo-subhead-letter-spacing)">
            {description}
          </DialogDescription>
        )}
        <div
          className={cn(
            "mt-8 text-(length:--apple-body-size) leading-(--apple-body-line-height) tracking-(--apple-body-letter-spacing)",
            "[&_h3]:font-display [&_h3]:text-(length:--apple-tile-callout-size) [&_h3]:leading-(--apple-tile-callout-line-height) [&_h3]:font-semibold [&_h3]:tracking-(--apple-tile-callout-letter-spacing)",
            "[&_p]:mt-1 [&_p]:text-muted-foreground"
          )}
        >
          {children}
        </div>
        <DialogClose
          aria-label="Close"
          className={cn(
            "absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full bg-accent text-muted-foreground",
            "transition-colors duration-100 hover:bg-border hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring motion-reduce:transition-none"
          )}
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
          </svg>
        </DialogClose>
      </DialogContent>
    </DialogRoot>
  )
}
