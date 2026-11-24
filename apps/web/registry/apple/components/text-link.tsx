import type { TextLinkProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Apple inline link: link blue, underline on hover, and a static chevron set
 * `--apple-link-chevron-gap` after the text. Inherits the surrounding type size.
 */
export function TextLink({ children, href, arrow = false, className }: TextLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "group/link font-body text-(--apple-link) no-underline hover:underline focus-visible:rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
        className
      )}
    >
      {children}
      {arrow && (
        <svg
          aria-hidden="true"
          viewBox="0 0 7 12"
          className="ms-(--apple-link-chevron-gap) inline-block h-[.7em] w-auto align-[-.02em] rtl:-scale-x-100"
        >
          <path d="M1 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </a>
  )
}
