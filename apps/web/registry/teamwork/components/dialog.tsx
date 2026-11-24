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

// The source's sign-up modal: an overlay surface 60px from the top that rises in over 350ms,
// full screen below 480px.
const rise = "duration-350 ease-[cubic-bezier(0.15,1,0.3,1)] motion-reduce:transition-none"

export function Dialog({ trigger, title, description, children, open, onOpenChange, className }: DialogProps) {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} container={container}>
      <DialogTrigger
        ref={kitRef}
        className="inline-flex h-[35px] cursor-pointer items-center gap-1.5 rounded-kit border border-[color-mix(in_srgb,var(--input)_58%,var(--background))] bg-background px-[10.5px] font-body text-sm leading-5 font-medium whitespace-nowrap text-muted-foreground transition-[background-color,color] duration-150 ease-kit hover:bg-foreground/7 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      >
        {trigger}
      </DialogTrigger>
      <DialogBackdrop className={cn("fixed inset-0 z-50 bg-background/60 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0", rise)} />
      <DialogContent
        className={cn(
          "fixed inset-x-0 top-0 z-50 mx-auto flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-popover px-4 pt-16 pb-8 text-center font-body text-popover-foreground",
          "min-[480px]:top-[60px] min-[480px]:h-fit min-[480px]:max-h-[calc(100dvh-120px)] min-[480px]:w-[400px] min-[480px]:rounded-kit-lg min-[480px]:px-10 min-[480px]:py-8 min-[480px]:shadow-(--teamwork-shadow-overlay)",
          "transition-[opacity,translate] data-ending-style:translate-y-5 data-ending-style:opacity-0 data-starting-style:translate-y-5 data-starting-style:opacity-0",
          rise,
          className
        )}
      >
        <div className="flex flex-col gap-2">
          <DialogTitle className="font-display text-xl leading-6 text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-base leading-6 text-foreground">{description}</DialogDescription>
          )}
        </div>
        <div aria-hidden className="flex items-center gap-4 text-xs leading-4 text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <svg viewBox="0 0 16 16" className="size-4 text-(--teamwork-blue)">
            <path d="M3 4h10M3 4l5 8m5-8-5 8" fill="none" stroke="currentColor" strokeWidth="1.25" />
            <circle cx="3" cy="4" r="1.75" fill="var(--teamwork-yellow)" />
            <circle cx="13" cy="4" r="1.75" fill="var(--teamwork-green)" />
            <circle cx="8" cy="12" r="1.75" fill="var(--teamwork-lilac)" />
          </svg>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex flex-col gap-1 [&_h3]:font-display [&_h3]:text-xl [&_h3]:leading-[30px] [&_h3]:tracking-[0.5px] [&_h3]:text-foreground [&_p]:text-sm [&_p]:leading-5 [&_p]:text-muted-foreground">
          {children}
        </div>
        <DialogClose
          aria-label="Close"
          className="absolute top-4 right-4 grid size-8 cursor-pointer place-items-center rounded-kit text-muted-foreground transition-colors duration-150 ease-kit hover:bg-foreground/7 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"
        >
          <svg aria-hidden viewBox="0 0 16 16" className="size-4">
            <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </DialogClose>
      </DialogContent>
    </DialogRoot>
  )
}
