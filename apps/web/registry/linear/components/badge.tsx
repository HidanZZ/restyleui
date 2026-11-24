import type { BadgeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * A feature chip label (15px, tertiary) led by the changelog's status dot:
 * a 6px dot inside a faint 20px halo. Accent swaps the dot to indigo and lifts the label.
 */
export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  const accent = variant === "accent"
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 whitespace-nowrap text-[15px] leading-[1.6] tracking-[-0.011em]",
        accent ? "font-[510] text-(--linear-text-secondary)" : "text-muted-foreground",
        className
      )}
    >
      <span aria-hidden className="relative grid size-5 shrink-0 place-items-center">
        <span
          className={cn(
            "absolute inset-0 rounded-full",
            accent ? "bg-(--linear-accent) opacity-20" : "bg-(--linear-text-quaternary) opacity-20"
          )}
        />
        <span className={cn("size-1.5 rounded-full", accent ? "bg-(--linear-accent)" : "bg-(--linear-text-quaternary)")} />
      </span>
      {children}
    </span>
  )
}
