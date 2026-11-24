import type { CSSProperties } from "react"
import type { FooterProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const link =
  "rounded-kit-sm text-xs leading-9 text-muted-foreground transition-colors duration-150 ease-kit hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"

export function Footer({ brand, description, columns, social, legal, className }: FooterProps) {
  // Wide screens: brand column, a spacer, then one column per link group (the source's six-column grid).
  const grid = {
    "--footer-xl": `repeat(${columns.length + 2}, minmax(0, 1fr))`,
    "--footer-lg": `repeat(${columns.length + 1}, minmax(0, 1fr))`,
  } as CSSProperties

  return (
    <footer
      className={cn(
        "w-full border-t border-dashed border-[color-mix(in_srgb,var(--input)_45%,transparent)] bg-(--teamwork-surface-sunken) font-body text-muted-foreground",
        className
      )}
    >
      <div
        style={grid}
        className="mx-auto grid max-w-[calc(var(--kit-container)+6rem)] grid-cols-1 gap-8 px-8 py-10 min-[480px]:gap-12 min-[480px]:py-16 md:grid-cols-2 md:px-12 md:py-section lg:grid-cols-(--footer-lg) xl:grid-cols-(--footer-xl)"
      >
        <div className="flex flex-col justify-between gap-6 max-lg:contents xl:col-span-2">
          <div className="flex flex-col gap-4 max-lg:col-span-full xl:max-w-80">
            <p className="font-display text-xl leading-5 font-medium text-foreground">{brand}</p>
            {description && <p className="text-xs leading-5">{description}</p>}
          </div>
          {(legal || social?.length) && (
            <div className="flex flex-col gap-6 max-lg:order-1">
              {legal && <p className="text-xs leading-9">© {legal}</p>}
              {social && social.length > 0 && (
                <ul className="flex flex-col items-start">
                  {social.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className={link}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-6">
            <h2 className="text-xs leading-5 font-semibold text-muted-foreground">{column.title}</h2>
            <ul className="flex flex-col items-start">
              {column.links.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  )
}
