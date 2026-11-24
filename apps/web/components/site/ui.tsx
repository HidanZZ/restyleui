/**
 * Small website chrome primitives. Chrome is neutral: color on the site comes only from kits.
 */
import type { PieceSource } from "@/lib/catalog"
import { cn } from "@/registry/restyle/lib/utils"

export const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60"

export const iconButton = cn(
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground",
  focusRing,
)

const buttonBase = cn(
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
  focusRing,
)

export const buttonPrimary = cn(buttonBase, "bg-foreground text-background hover:bg-foreground/85")

export const buttonSecondary = cn(buttonBase, "border border-border bg-background text-foreground hover:bg-muted")

export const SOURCE_LABEL: Record<PieceSource, string> = {
  source: "From source",
  designed: "Designed in style",
}

/** "From source" or "Designed in style" chip. */
export function SourceLabel({ source, className }: { source: PieceSource; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs font-medium whitespace-nowrap text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          source === "source" ? "bg-foreground" : "border border-muted-foreground",
        )}
      />
      {SOURCE_LABEL[source]}
    </span>
  )
}
