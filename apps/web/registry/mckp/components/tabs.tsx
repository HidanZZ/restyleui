"use client"

import { Tabs as TabsRoot, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import type { TabsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * The clone's feature tabs: a row of text buttons with an 8px radius. The
 * active tab sits on a #161616 fill that slides between tabs; hover gets a
 * faint white wash. No underline.
 */
export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <TabsRoot defaultValue={defaultValue ?? items[0]?.id} className={cn("grid gap-6", className)}>
      <TabsList aria-label="Sections" className="relative flex w-fit max-w-full items-center gap-2 overflow-x-auto [scrollbar-width:none]">
        {items.map((item) => (
          <TabsTab
            key={item.id}
            value={item.id}
            className="relative z-10 flex shrink-0 items-center justify-center whitespace-nowrap rounded-kit px-3 py-1.5 text-[length:var(--mckp-type-nav)] font-semibold leading-(--mckp-type-nav-line) text-foreground/60 transition-[color,background-color] duration-200 ease-kit-in-out hover:bg-foreground/[0.06] hover:text-foreground data-selected:text-foreground data-selected:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
          >
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator className="absolute left-(--active-tab-left) top-(--active-tab-top) h-(--active-tab-height) w-(--active-tab-width) rounded-kit bg-(--mckp-surface) transition-[left,width] duration-500 ease-kit data-[activation-direction=none]:transition-none motion-reduce:transition-none" />
      </TabsList>
      {/* Panels share one cell so the old one fades out over the new one. */}
      <div className="grid">
        {items.map((item) => (
          <TabsPanel
            key={item.id}
            value={item.id}
            className={cn(
              "[grid-area:1/1] text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-muted-foreground",
              "[&_h3]:font-normal [&_h3]:text-foreground [&_h4]:text-foreground",
              "transition-[opacity,translate] duration-500 ease-kit data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
              "rounded-kit-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            )}
          >
            {item.content}
          </TabsPanel>
        ))}
      </div>
    </TabsRoot>
  )
}
