"use client"

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"
import type { FooterProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

// The source's footer ink: 56% text, 72% links, 88% titles, 16% rules.
const link = "text-foreground/72 no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
const rule = "border-foreground/16"

/**
 * Apple global footer: 12px type on light gray. A fine-print note, the brand
 * as a breadcrumb, a directory of columns, then copyright and pipe-separated
 * links. Below 834px the directory becomes an accordion with chevrons.
 */
export function Footer({ brand, description, columns, social, legal, className }: FooterProps) {
  return (
    <footer
      className={cn(
        "bg-muted font-body text-[12px] leading-[1.3333733333] tracking-[-.01em] text-foreground/56 antialiased",
        className
      )}
    >
      <div className="mx-auto max-w-[980px] px-4 min-[834px]:px-[22px]">
        {description && <p className={cn("border-b pt-[17px] pb-[11px]", rule)}>{description}</p>}

        <div className={cn("flex items-center py-[14px] min-[834px]:border-b-0", rule, "border-b")}>
          <span className="font-semibold text-foreground/88">{brand}</span>
        </div>

        {/* Desktop directory: every column open, 25% each. */}
        <nav aria-label="Directory" className="hidden flex-wrap pt-5 pb-7 min-[834px]:flex">
          {columns.map((column) => (
            <div key={column.title} className="basis-1/4 pe-5 pb-6">
              <h3 className="mb-[.8em] font-semibold text-foreground/88">{column.title}</h3>
              <ul className="grid gap-[.8em]">
                {column.links.map((item) => (
                  <li key={item.label + item.href}>
                    <a href={item.href} className={link}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Compact directory: one accordion section per column. */}
        <nav aria-label="Directory" className="pb-6 min-[834px]:hidden">
          <Accordion multiple>
            {columns.map((column) => (
              <AccordionItem key={column.title} value={column.title} className={cn("border-b", rule)}>
                <AccordionHeader>
                  <AccordionTrigger className="group flex w-full cursor-pointer items-center justify-between py-[10px] text-left text-foreground/88 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring data-open:text-foreground motion-reduce:transition-none">
                    {column.title}
                    <svg
                      aria-hidden="true"
                      width="11"
                      height="6"
                      viewBox="0 0 11 6"
                      className="shrink-0 transition-transform duration-[320ms] ease-kit group-data-open:-scale-y-100 motion-reduce:transition-none"
                    >
                      <polyline points="10.075 0.675 5.5 5.323 0.925 0.675" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
                  <ul className="pt-[5px] pb-4">
                    {column.links.map((item) => (
                      <li key={item.label + item.href}>
                        <a href={item.href} className={cn(link, "block px-[14px] py-[6px]")}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>

        {(legal || (social && social.length > 0)) && (
          <div className={cn("flex flex-col gap-2 border-t pt-[17px] pb-[11px] min-[834px]:flex-row min-[834px]:items-baseline min-[834px]:gap-[30px]", rule)}>
            {legal && <p>Copyright © {legal}</p>}
            {social && social.length > 0 && (
              <ul className="flex flex-wrap">
                {social.map((item, index) => (
                  <li key={item.label + item.href} className="flex items-center">
                    {index > 0 && <span aria-hidden="true" className="mx-[9px] h-[10px] w-px bg-foreground/48" />}
                    <a href={item.href} className={cn(link, "whitespace-nowrap")}>
                      {item.label}
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
