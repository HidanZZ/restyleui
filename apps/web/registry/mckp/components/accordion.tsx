"use client"

import {
  Accordion as AccordionRoot,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion"
import type { AccordionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * The clone's FAQ rows: hairline separators, 20px rows and a 12px plus made of
 * two 1.5px bars. Opening rotates the vertical bar flat.
 */
export function Accordion({ items, multiple = false, defaultValue, className }: AccordionProps) {
  return (
    <AccordionRoot
      multiple={multiple}
      defaultValue={defaultValue}
      hiddenUntilFound
      className={cn("border-b border-border", className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-t border-border">
          <AccordionHeader>
            <AccordionTrigger className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-foreground transition-opacity duration-200 hover:opacity-75 focus-visible:rounded-kit-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none">
              {item.title}
              <span
                aria-hidden="true"
                className="relative size-3 shrink-0 before:absolute before:left-0 before:top-1/2 before:-mt-[0.75px] before:h-[1.5px] before:w-full before:bg-muted-foreground after:absolute after:left-0 after:top-1/2 after:-mt-[0.75px] after:h-[1.5px] after:w-full after:rotate-90 after:bg-muted-foreground after:transition-transform after:duration-300 after:ease-kit group-data-open:after:rotate-0 motion-reduce:after:transition-none"
              />
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-500 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
            <div className="max-w-[560px] pb-6 text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-muted-foreground">
              {item.content}
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}
