"use client"

import { Tabs as TabsRoot, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import type { TabsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

// Styled after the source's overview selector: display headings that dim when inactive,
// a fine divider, and one spring-eased progress marker under the active heading.
export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <TabsRoot defaultValue={defaultValue ?? items[0]?.id} className={cn("flex flex-col gap-8 font-body", className)}>
      <TabsList
        aria-label="Sections"
        className="relative flex gap-6 overflow-x-auto border-b border-(--teamwork-grid) [scrollbar-width:none] sm:gap-10"
      >
        {items.map((item) => (
          <TabsTab
            key={item.id}
            value={item.id}
            className="shrink-0 cursor-pointer rounded-kit-sm pb-4 font-display text-xl leading-[30px] tracking-[0.5px] whitespace-nowrap text-muted-foreground/60 transition-colors duration-300 ease-out hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-selected:text-foreground motion-reduce:transition-none sm:text-2xl sm:leading-9"
          >
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator className="absolute bottom-0 left-(--active-tab-left) h-0.5 w-(--active-tab-width) rounded-full bg-foreground transition-[left,width] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] data-[activation-direction=none]:transition-none motion-reduce:transition-none" />
      </TabsList>
      {/* Panels share one cell: the old copy fades out while the new one fades in. */}
      <div className="grid">
        {items.map((item) => (
          <TabsPanel
            key={item.id}
            value={item.id}
            className={cn(
              "[grid-area:1/1] text-base leading-7 text-muted-foreground transition-[opacity,translate] duration-300 ease-kit data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 motion-reduce:transition-none",
              "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
              "[&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:leading-9 [&_h3]:tracking-[0.5px] [&_h3]:text-foreground"
            )}
          >
            {item.content}
          </TabsPanel>
        ))}
      </div>
    </TabsRoot>
  )
}
