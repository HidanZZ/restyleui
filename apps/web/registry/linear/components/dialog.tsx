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

// Source: the tech-spec panel's spring-like ease-out.
const panelMotion = "duration-500 ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:transition-none"

/**
 * Source: the tech-spec dialog, centered. The trigger is the feature chip
 * ("Label +"); the panel has a 65px header with a hairline rule, a dim canvas
 * backdrop, and rises into place on the source's 500ms curve.
 */
export function Dialog({ trigger, title, description, children, open, onOpenChange, className }: DialogProps) {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} container={container}>
      <DialogTrigger
        ref={kitRef}
        className={cn(
          "group inline-flex h-7 cursor-pointer items-center rounded-[4px] text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground",
          "transition-[filter,transform] duration-[160ms] ease-kit hover:brightness-[1.4] active:scale-[.97]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--linear-accent) motion-reduce:transition-none"
        )}
      >
        {trigger}
        <span
          aria-hidden
          className="ml-1 text-lg leading-none text-(--linear-text-quaternary) transition-colors duration-[160ms] ease-kit group-hover:text-muted-foreground motion-reduce:transition-none"
        >
          +
        </span>
      </DialogTrigger>
      <DialogBackdrop
        className={cn(
          "fixed inset-0 z-50 bg-background opacity-80 transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0",
          panelMotion
        )}
      />
      <DialogContent
        className={cn(
          "fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-48px)] w-[calc(100%-32px)] max-w-[640px] flex-col overflow-hidden",
          "rounded-[8px] border border-(--linear-border-translucent) bg-(--linear-bg-panel) font-body text-popover-foreground shadow-[0_0_32px_#0006,0_0_0_1px_#000]",
          "transition-[opacity,translate,scale] data-starting-style:translate-y-6 data-starting-style:scale-[.98] data-starting-style:opacity-0",
          "data-ending-style:translate-y-6 data-ending-style:scale-[.98] data-ending-style:opacity-0",
          panelMotion,
          className
        )}
      >
        <header className="flex h-[65px] shrink-0 items-center justify-between gap-4 border-b border-(--linear-border-translucent) pl-6 pr-3 sm:pl-8">
          <DialogTitle className="truncate text-base font-normal leading-normal text-foreground">{title}</DialogTitle>
          <DialogClose
            aria-label="Close"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[8px] text-(--linear-text-quaternary) transition-colors duration-100 hover:text-(--linear-text-secondary) focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                fill="currentColor"
                d="M4.962 4.962a.937.937 0 0 1 1.326 0L10 8.674l3.712-3.712a.937.937 0 1 1 1.326 1.326L11.326 10l3.712 3.712a.937.937 0 0 1-1.326 1.326L10 11.326l-3.712 3.712a.937.937 0 0 1-1.326-1.326L8.674 10 4.962 6.288a.937.937 0 0 1 0-1.326"
              />
            </svg>
          </DialogClose>
        </header>
        <div
          className={cn(
            "min-h-0 overflow-y-auto px-6 pb-8 pt-8 sm:px-8",
            "text-[15px] leading-[1.6] tracking-[-0.011em] text-(--linear-text-secondary)",
            "[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-normal [&_h3]:leading-[1.6] [&_h3]:tracking-normal [&_h3]:text-foreground [&_h3:first-child]:mt-0",
            "[&_p+p]:mt-4 [&_a]:text-(--linear-link) [&_a:hover]:text-(--linear-link-hover)"
          )}
        >
          {description && <DialogDescription className="mb-6 text-muted-foreground">{description}</DialogDescription>}
          {children}
        </div>
      </DialogContent>
    </DialogRoot>
  )
}
