import type { TextLinkProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/** Source: the "Learn more →" link. Dims at rest on pointer devices, brightens on hover. */
export function TextLink({ children, href, arrow = false, className }: TextLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-baseline rounded-[4px] text-[15px] leading-[1.6] tracking-[-0.011em] no-underline",
        "transition-[filter] duration-200 ease-[cubic-bezier(.165,.84,.44,1)] hover:brightness-[1.3] hover:duration-100 active:brightness-[1.6]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--linear-accent) motion-reduce:transition-none",
        className
      )}
    >
      <span className="text-(--linear-text-secondary) [@media(any-hover:hover)]:text-muted-foreground">{children}</span>
      {arrow && (
        <span aria-hidden className="ml-1.5 text-muted-foreground [@media(any-hover:hover)]:text-(--linear-text-quaternary)">
          →
        </span>
      )}
    </a>
  )
}
