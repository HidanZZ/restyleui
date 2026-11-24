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
 * Designed: hairline rows like the source's spec tables. Questions in medium
 * 17px, a quaternary plus that turns into a cross, answers in tertiary body copy.
 */
export function Accordion({ items, multiple = false, defaultValue, className }: AccordionProps) {
  return (
    <AccordionRoot
      multiple={multiple}
      defaultValue={defaultValue}
      hiddenUntilFound
      className={cn("border-t border-(--linear-border-translucent-strong)", className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-(--linear-border-translucent-strong)">
          <AccordionHeader>
            <AccordionTrigger
              className={cn(
                "group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left",
                "text-[length:var(--linear-title-1-size)] font-[510] leading-[1.4] tracking-[-0.012em] text-(--linear-text-secondary)",
                "transition-colors duration-100 ease-kit hover:text-foreground data-open:text-foreground",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
              )}
            >
              {item.title}
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="size-4 shrink-0 text-(--linear-text-quaternary) transition-[rotate,color] duration-[250ms] ease-kit-in-out group-hover:text-muted-foreground group-data-open:rotate-45 group-data-open:text-muted-foreground motion-reduce:transition-none"
              >
                <path d="M8 2.75v10.5M2.75 8h10.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height,opacity] duration-[250ms] ease-kit-in-out data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0 motion-reduce:transition-none">
            <div className="max-w-(--linear-prose-max) pb-6 pr-10 text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground">
              {item.content}
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}
