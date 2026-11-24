import type { TextLinkProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

export function TextLink({ children, href, arrow = false, className }: TextLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-kit-sm font-body text-sm leading-5 font-medium text-muted-foreground",
        "underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-kit motion-reduce:transition-none",
        "hover:text-foreground hover:decoration-current",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
    >
      {children}
      {arrow && (
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-4 shrink-0 transition-transform duration-200 ease-kit group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          <path
            d="M2.5 8h10.25M9 4.25 12.75 8 9 11.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  )
}
