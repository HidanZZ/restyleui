import type { TextLinkProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

export function TextLink({ children, href, arrow = false, className }: TextLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-baseline gap-[0.3em] rounded-kit-sm text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-muted-foreground",
        "transition-colors duration-200 ease-kit-in-out hover:text-foreground motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className
      )}
    >
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </a>
  )
}
