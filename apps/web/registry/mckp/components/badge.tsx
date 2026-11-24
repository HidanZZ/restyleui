import type { BadgeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * mckp badges are an inline announcement line, not a pill: quiet grey text
 * that turns white on hover. The accent variant leads with an electric blue
 * marker, the only place the kit spends its accent.
 */
export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line)",
        "transition-colors duration-200 ease-kit-in-out hover:text-foreground motion-reduce:transition-none",
        variant === "accent" ? "text-foreground/80" : "text-muted-foreground",
        className
      )}
    >
      {variant === "accent" && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-[1px] bg-accent" />}
      {children}
    </span>
  )
}
