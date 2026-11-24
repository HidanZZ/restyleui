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
 * Norma dialog: an ink pill opens a white 28px panel over a blurred ink veil.
 * The veil fades in 200ms; the panel pops from 16px lower at 98.5% scale in
 * 320ms. On phones it rests near the bottom edge, like the source waitlist.
 */
export function Dialog({ trigger, title, description, children, open, onOpenChange, className }: DialogProps) {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} container={container}>
      <DialogTrigger
        ref={kitRef}
        className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 font-body text-[0.875rem] font-medium text-primary-foreground outline-none transition-[background-color,scale] duration-200 ease-kit hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] motion-reduce:transition-none"
      >
        {trigger}
      </DialogTrigger>
      <DialogBackdrop className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
      <DialogContent
        className={cn(
          "fixed inset-x-3 bottom-3 z-[100] mx-auto flex h-fit max-h-[calc(100dvh-1.5rem)] w-auto max-w-md flex-col overflow-y-auto sm:inset-0 sm:m-auto sm:max-h-[calc(100dvh-3rem)]",
          "rounded-kit-lg bg-popover p-8 font-body text-popover-foreground shadow-2xl outline-none sm:p-10",
          "transition-[opacity,translate,scale] duration-[320ms] ease-kit data-starting-style:translate-y-4 data-starting-style:scale-[0.985] data-starting-style:opacity-0 data-ending-style:translate-y-4 data-ending-style:scale-[0.985] data-ending-style:opacity-0 motion-reduce:transition-none",
          className
        )}
      >
        <DialogTitle className="pr-10 text-[1.625rem] font-semibold leading-[1.1] tracking-[-0.02em] text-balance">
          {title}
        </DialogTitle>
        {description && (
          <DialogDescription className="mt-3 text-[0.9375rem] leading-[1.5] text-pretty text-muted-foreground">
            {description}
          </DialogDescription>
        )}
        <div className="mt-6 text-[0.9375rem] leading-[1.5] text-muted-foreground [&_h3]:text-[1.0625rem] [&_h3]:font-semibold [&_h3]:leading-[1.3] [&_h3]:text-foreground [&_h3+p]:mt-2">
          {children}
        </div>
        <DialogClose
          aria-label="Close"
          className="absolute right-4 top-4 flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-popover text-muted-foreground outline-none transition-colors duration-200 hover:border-foreground/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </DialogClose>
      </DialogContent>
    </DialogRoot>
  )
}
