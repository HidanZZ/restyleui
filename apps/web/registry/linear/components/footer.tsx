import type { FooterProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const link =
  "rounded-[4px] transition-colors duration-100 ease-kit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"

/**
 * Source: the site footer. A six-column grid under a hairline: the brand mark
 * first, then columns of 13px links (medium primary titles, tertiary links
 * that brighten on hover), and a quiet quaternary row of extra links below.
 */
export function Footer({ brand, description, columns, social, legal, className }: FooterProps) {
  return (
    <footer className={cn("relative border-t border-border bg-background font-body", className)}>
      <div
        className={cn(
          "mx-auto grid max-w-kit grid-cols-2 place-items-start gap-x-4 gap-y-12 px-gutter pb-6 pt-14 text-[13px] leading-normal tracking-[-0.01em]",
          "md:grid-cols-4 lg:grid-cols-6 lg:gap-y-0 lg:pb-14"
        )}
      >
        <div className="col-span-full flex flex-col gap-3 px-(--linear-homepage-padding-inset) lg:col-span-1 lg:pr-6">
          <a
            href="/"
            className={cn(link, "text-[15px] font-[590] leading-none tracking-[-0.02em] text-foreground hover:text-muted-foreground")}
          >
            {brand}
          </a>
          {description && <p className="max-w-60 text-muted-foreground">{description}</p>}
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="w-full px-(--linear-homepage-padding-inset)">
            <h3 className="mb-4 font-[510] text-foreground md:mb-6">{column.title}</h3>
            <ul className="flex flex-col gap-0.5">
              {column.links.map((item) => (
                <li key={item.href + item.label}>
                  <a href={item.href} className={cn(link, "inline-flex min-h-7 items-center text-muted-foreground hover:text-foreground")}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {(social?.length || legal) && (
          <div className="col-span-full flex w-full flex-col gap-4 px-(--linear-homepage-padding-inset) sm:flex-row sm:items-center sm:justify-between lg:col-start-2 lg:mt-20">
            {social && social.length > 0 && (
              <ul className="flex flex-wrap gap-5">
                {social.map((item) => (
                  <li key={item.href + item.label}>
                    <a href={item.href} className={cn(link, "text-(--linear-text-quaternary) hover:text-muted-foreground")}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {legal && <p className="text-(--linear-text-quaternary)">{legal}</p>}
          </div>
        )}
      </div>
    </footer>
  )
}
