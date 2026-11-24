import type { BadgeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const variants = {
  neutral: "bg-accent text-foreground",
  accent: "bg-primary text-primary-foreground",
}

/** Small pill label or count, in the nav's 12px text style. */
export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-(--apple-button-radius) px-2 py-[3px] font-body text-[12px] leading-[1.3333733333] font-semibold tracking-[-.01em] whitespace-nowrap antialiased",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
