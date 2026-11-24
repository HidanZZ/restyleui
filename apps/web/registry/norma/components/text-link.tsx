import type { TextLinkProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/** Norma text link: 15px semibold ink, underline on hover, arrow slides 4px right. */
export function TextLink({ children, href, arrow = false, className }: TextLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-sm font-body text-[0.9375rem] font-semibold text-foreground",
        "underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {children}
      {arrow && (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-300 ease-kit group-hover:translate-x-1 motion-reduce:transition-none rtl:rotate-180"
        >
          <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
        </svg>
      )}
    </a>
  )
}
