"use client"

import type { ReactNode } from "react"
import type { FooterProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

const reveal =
  "translate-y-[50px] opacity-0 transition-[opacity,translate] duration-900 ease-kit delay-(--reveal-delay) group-data-visible/footer:translate-y-0 group-data-visible/footer:opacity-100 motion-reduce:transition-none"

const small = "text-[length:var(--mckp-type-small)] leading-(--mckp-type-small-line)"

function BrandMark({ brand }: { brand: ReactNode }) {
  if (typeof brand !== "string") return <>{brand}</>
  return (
    <>
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-kit bg-foreground text-[15px] font-semibold text-background"
      >
        {brand.charAt(0)}
      </span>
      <span className="text-[length:var(--mckp-type-nav)] font-semibold leading-(--mckp-type-nav-line)">{brand}</span>
    </>
  )
}

export function Footer({ brand, description, columns, social, legal, className }: FooterProps) {
  const { ref, visible, delayStyle } = useReveal<HTMLDivElement>({ threshold: 0.12, rootMargin: "0px 0px -40px 0px", stagger: 100 })
  const navs = social?.length ? [...columns, { title: "Social", links: social }] : columns
  // Up to three columns use the clone's wide 2-2-1 spans; more share the right half evenly.
  const wide = navs.length <= 3

  return (
    <footer className={cn("border-t border-(--mckp-line-soft) bg-background text-foreground", className)}>
      <div
        ref={ref}
        data-visible={visible || undefined}
        className="group/footer mx-auto grid max-w-kit grid-cols-3 gap-x-4 gap-y-10 px-gutter py-[60px] md:grid-cols-4 lg:grid-cols-9 lg:gap-x-0"
      >
        <div
          style={delayStyle(0)}
          className={cn(
            reveal,
            "col-span-full flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-4 lg:col-span-4 lg:flex-col lg:items-start lg:justify-between lg:gap-10 lg:pr-10"
          )}
        >
          <a
            href="/"
            className="flex items-center gap-2.5 rounded-kit transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
          >
            <BrandMark brand={brand} />
          </a>
          <div className={cn(small, "grid gap-1 text-(--mckp-ink-faint)")}>
            {description && <p className="max-w-[34ch]">{description}</p>}
            {legal && (
              <p>
                © {legal}
              </p>
            )}
          </div>
        </div>

        {navs.map((column, index) => (
          <nav
            key={column.title}
            aria-label={column.title}
            style={delayStyle(index + 1)}
            className={cn(
              reveal,
              "flex flex-col gap-2.5",
              wide ? (index === navs.length - 1 ? "lg:col-span-1" : "lg:col-span-2") : "lg:col-span-1"
            )}
          >
            <p className={cn(small, "text-(--mckp-ink-faint)")}>{column.title}</p>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={cn(
                      small,
                      "whitespace-nowrap rounded-kit-sm text-foreground transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  )
}
