"use client"

import { Tabs as TabsRoot, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import type { TabsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Apple segmented control: a gray pill track with a white thumb that slides
 * to the selected tab, centered over a panel that cross-fades.
 */
export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <TabsRoot defaultValue={defaultValue ?? items[0]?.id} className={cn("grid justify-items-center gap-8 font-body antialiased", className)}>
      <TabsList aria-label="Sections" className="relative inline-flex max-w-full overflow-x-auto rounded-(--apple-button-radius) bg-accent p-[3px] [scrollbar-width:none]">
        {items.map((item) => (
          <TabsTab
            key={item.id}
            value={item.id}
            className={cn(
              "relative z-10 cursor-pointer rounded-(--apple-button-radius) px-5 py-[7px] text-(length:--apple-button-size) leading-(--apple-button-line-height) tracking-(--apple-button-letter-spacing) whitespace-nowrap text-foreground/56",
              "transition-colors duration-[240ms] ease-kit hover:text-foreground data-selected:text-foreground motion-reduce:transition-none",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
            )}
          >
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator className="absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-(--apple-button-radius) bg-background shadow-sm shadow-foreground/10 transition-[left,width] duration-[320ms] ease-kit data-[activation-direction=none]:transition-none motion-reduce:transition-none" />
      </TabsList>
      <div className="grid w-full">
        {items.map((item) => (
          <TabsPanel
            key={item.id}
            value={item.id}
            className={cn(
              "[grid-area:1/1] text-center transition-opacity duration-[400ms] ease-kit-in-out data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
              "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
              "[&_h3]:font-display [&_h3]:text-(length:--apple-promo-title-size-compact) [&_h3]:leading-(--apple-promo-title-line-height-compact) [&_h3]:font-semibold [&_h3]:tracking-(--apple-promo-title-letter-spacing-compact)",
              "[&_p]:mx-auto [&_p]:mt-2 [&_p]:max-w-[40ch] [&_p]:text-(length:--apple-body-size) [&_p]:leading-(--apple-body-line-height) [&_p]:tracking-(--apple-body-letter-spacing) [&_p]:text-muted-foreground"
            )}
          >
            {item.content}
          </TabsPanel>
        ))}
      </div>
    </TabsRoot>
  )
}
