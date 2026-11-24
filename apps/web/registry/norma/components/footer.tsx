import type { CSSProperties } from "react"
import type { FooterProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Norma footer: wordmark and tagline on the left, link columns on the right
 * (1.3fr / 2.4fr), then a hairline and a quiet 13px legal row.
 */
export function Footer({ brand, description, columns, social, legal, className }: FooterProps) {
  return (
    <footer className={cn("bg-background py-16 font-body text-foreground sm:py-20", className)}>
      <div className="mx-auto w-full max-w-kit px-gutter">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2.4fr] lg:gap-16">
          <div className="max-w-sm">
            <div className="text-[1.375rem] font-semibold leading-none tracking-[-0.02em]">{brand}</div>
            {description && (
              <p className="mt-4 text-[0.9375rem] leading-[1.5] text-pretty text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            style={{ "--norma-footer-cols": Math.min(columns.length, 4) } as CSSProperties}
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[repeat(var(--norma-footer-cols),minmax(0,1fr))]"
          >
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="text-[0.8125rem] font-semibold text-foreground">{column.title}</p>
                <ul className="mt-3.5 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="rounded-sm text-[0.875rem] text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        {(legal || (social && social.length > 0)) && (
          <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-[0.8125rem] text-(--norma-ink-3)">
            {legal && <span>© {legal}</span>}
            {social && social.length > 0 && (
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {social.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="rounded-sm outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </footer>
  )
}
