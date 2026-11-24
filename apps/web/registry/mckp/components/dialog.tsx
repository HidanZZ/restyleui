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
 * A glass panel in the style of the clone's buy bar: 16px radius, blurred
 * #1c1c1cb8 surface and a deep shadow over a dark, unblurred overlay. It
 * rises and fades in rather than snapping.
 */
export function Dialog({ trigger, title, description, children, open, onOpenChange, className }: DialogProps) {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} container={container}>
      <DialogTrigger
        ref={kitRef}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-kit bg-primary px-5 py-[9px] text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-primary-foreground transition-colors duration-200 ease-kit-in-out hover:bg-primary/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        {trigger}
      </DialogTrigger>
      <DialogBackdrop className="fixed inset-0 z-50 bg-(--mckp-page-black)/70 transition-opacity duration-500 ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
      <DialogContent
        className={cn(
          "fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[min(30rem,calc(100%-2rem))] flex-col gap-2 overflow-y-auto rounded-[16px] p-6 text-popover-foreground",
          "bg-(--mckp-surface-glass) backdrop-blur-[40px] backdrop-saturate-[1.4] shadow-[0_24px_60px_color-mix(in_srgb,var(--mckp-page-black)_50%,transparent)]",
          "transition-[opacity,translate,scale] duration-[350ms,700ms,700ms] ease-[cubic-bezier(.2,.9,.25,1)] data-starting-style:translate-y-6 data-starting-style:scale-[.94] data-starting-style:opacity-0 data-ending-style:translate-y-3 data-ending-style:scale-[.97] data-ending-style:opacity-0 data-ending-style:duration-300 motion-reduce:transition-none",
          className
        )}
      >
        <DialogTitle className="pr-10 text-xl font-medium leading-7 tracking-[-0.4px] text-foreground">{title}</DialogTitle>
        {description && (
          <DialogDescription className="text-[length:var(--mckp-type-small)] leading-(--mckp-type-small-line) text-(--mckp-ink-faint)">
            {description}
          </DialogDescription>
        )}
        <div className="mt-4 text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-muted-foreground [&_h3]:font-normal [&_h3]:text-foreground">
          {children}
        </div>
        <DialogClose
          aria-label="Close"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-[10px] bg-foreground/[0.06] text-foreground transition-colors duration-200 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </DialogClose>
      </DialogContent>
    </DialogRoot>
  )
}
