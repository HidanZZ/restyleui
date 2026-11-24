import type { BadgeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

// Status lozenges from the source's graph labels ("On track", "To do").
const variants = {
  neutral: "border-[color-mix(in_srgb,var(--input)_50%,var(--background))] bg-secondary text-foreground",
  accent: "border-(--teamwork-blue-deep) bg-accent text-accent-foreground",
}

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-kit border px-3 py-1 font-body text-sm leading-5 font-medium whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
