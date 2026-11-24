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
 * Norma accordion: one 16px-rounded hairline box with 1px row dividers. Rows
 * warm to the gray well on hover, the plus turns 45deg and the answer opens
 * over 300ms on the signature curve.
 */
export function Accordion({ items, multiple = false, defaultValue, className }: AccordionProps) {
  return (
    <AccordionRoot
      multiple={multiple}
      defaultValue={defaultValue}
      hiddenUntilFound
      className={cn(
        "divide-y divide-border overflow-hidden rounded-kit border border-border font-body text-foreground",
        className
      )}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="group/item bg-background transition-colors duration-200 hover:bg-secondary motion-reduce:transition-none"
        >
          <AccordionHeader>
            <AccordionTrigger className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left text-[1.0625rem] font-medium leading-[1.4] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-8">
              <span>{item.title}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="shrink-0 text-(--norma-ink-3) transition-transform duration-300 ease-kit group-data-open/item:rotate-45 motion-reduce:transition-none"
              >
                <path d="M8 3v10M3 8h10" />
              </svg>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
            <div className="px-6 pb-6 text-[1rem] leading-[1.55] text-pretty text-muted-foreground opacity-0 transition-opacity duration-300 ease-kit group-data-open/item:opacity-100 sm:max-w-[70ch] sm:px-8 motion-reduce:transition-none">
              {item.content}
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}
