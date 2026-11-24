"use client"

import { Accordion as AccordionRoot, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"
import type { AccordionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * The source's footer accordion at reading size: hairline rows, left-aligned
 * titles and an 11px chevron that flips when the row opens. The answer
 * slides open over 300ms.
 */
export function Accordion({ items, multiple = false, defaultValue, className }: AccordionProps) {
  return (
    <AccordionRoot
      multiple={multiple}
      defaultValue={defaultValue}
      hiddenUntilFound
      className={cn("border-t border-border font-body antialiased", className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-border">
          <AccordionHeader>
            <AccordionTrigger
              className={cn(
                "group flex w-full cursor-pointer items-center justify-between gap-6 py-[18px] text-left",
                "font-display text-(length:--apple-tile-callout-size) leading-(--apple-tile-callout-line-height) font-semibold tracking-(--apple-tile-callout-letter-spacing) text-foreground/88",
                "transition-colors duration-[240ms] ease-kit hover:text-foreground data-open:text-foreground motion-reduce:transition-none",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              )}
            >
              {item.title}
              <svg
                aria-hidden="true"
                viewBox="0 0 11 6"
                className="h-[8px] w-[15px] shrink-0 text-muted-foreground transition-transform duration-[320ms] ease-kit group-hover:text-foreground group-data-open:-scale-y-100 motion-reduce:transition-none"
              >
                <polyline points="10.075 0.675 5.5 5.323 0.925 0.675" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
            <div className="max-w-[60ch] pb-6 text-(length:--apple-body-size) leading-(--apple-body-line-height) tracking-(--apple-body-letter-spacing) text-muted-foreground">
              {item.content}
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}
