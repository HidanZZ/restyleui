import type { BadgeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Norma badge: a 13px pill. Neutral sits on the gray well; accent is an ink
 * pill with the status dot that pings every 2.2s, like the stock badge.
 */
export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  const accent = variant === "accent"
  return (
    <span
      className={cn(
        "inline-flex w-fit select-none items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 font-body text-[0.8125rem] font-medium leading-none",
        accent ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
        className
      )}
    >
      {accent && (
        <span aria-hidden="true" className="relative flex size-2 shrink-0 items-center justify-center">
          <span className="absolute size-2 animate-ping rounded-full bg-current opacity-50 [animation-duration:2.2s] [animation-timing-function:var(--kit-ease)] motion-reduce:animate-none" />
          <span className="relative size-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  )
}
