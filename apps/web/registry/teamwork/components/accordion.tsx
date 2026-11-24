"use client"

import { Accordion as AccordionRoot, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"
import type { AccordionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

// The source's overview copy accordion: display headings (bright when open, dim otherwise),
// fine dividers, copy that grows over 350ms and fades in over 250ms.
export function Accordion({ items, multiple = false, defaultValue, className }: AccordionProps) {
  return (
    <AccordionRoot
      multiple={multiple}
      defaultValue={defaultValue}
      hiddenUntilFound
      className={cn("flex flex-col divide-y divide-(--teamwork-grid) font-body", className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="py-3 first:pt-0 last:pb-0">
          <AccordionHeader>
            <AccordionTrigger className="group flex min-h-10 w-full cursor-pointer items-center justify-between gap-4 rounded-kit-sm text-left font-display text-xl leading-[30px] tracking-[0.5px] text-muted-foreground/60 transition-colors duration-300 ease-out hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-open:text-foreground motion-reduce:transition-none sm:text-2xl sm:leading-9">
              {item.title}
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="size-4 shrink-0 fill-current transition-transform duration-300 ease-kit group-data-open:rotate-180 motion-reduce:transition-none"
              >
                <path d="m14.53 6.03-6 6a.75.75 0 0 1-1.004.052l-.056-.052-6-6 1.06-1.06L8 10.44l5.47-5.47z" />
              </svg>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="group/panel h-(--accordion-panel-height) overflow-hidden transition-[height] duration-350 ease-kit data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
            <div className="pt-3 pb-2 text-base leading-7 text-(--teamwork-text-subtle) transition-opacity duration-250 ease-out group-data-ending-style/panel:opacity-0 group-data-starting-style/panel:opacity-0 motion-reduce:transition-none">
              {item.content}
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}
