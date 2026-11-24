"use client"

import { Tabs as TabsRoot, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import type { TabsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Norma tabs: a wrap of pill chips. The active chip flips to solid ink at once;
 * the panel under the chips crossfades in 600ms.
 */
export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <TabsRoot defaultValue={defaultValue ?? items[0]?.id} className={cn("font-body text-foreground", className)}>
      <TabsList aria-label="Sections" className="flex flex-wrap gap-2">
        {items.map((item) => (
          <TabsTab
            key={item.id}
            value={item.id}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-[0.875rem] font-medium leading-[1.3] text-muted-foreground outline-none",
              "transition-colors duration-200 ease-kit hover:border-foreground/30 hover:text-foreground motion-reduce:transition-none",
              "focus-visible:ring-2 focus-visible:ring-ring",
              "data-selected:border-foreground data-selected:bg-foreground data-selected:text-background data-selected:transition-none",
              "data-disabled:cursor-not-allowed data-disabled:border-dashed data-disabled:border-foreground/20 data-disabled:bg-transparent data-disabled:text-(--norma-ink-3)"
            )}
          >
            {item.label}
          </TabsTab>
        ))}
      </TabsList>
      {/* Panels share one grid cell so the old one fades out over the new one. */}
      <div className="mt-10 grid">
        {items.map((item) => (
          <TabsPanel
            key={item.id}
            value={item.id}
            className={cn(
              "[grid-area:1/1] rounded-kit-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-opacity duration-[600ms] ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
              "[&_h3]:text-(length:--norma-text-h3) [&_h3]:font-semibold [&_h3]:leading-[1.3] [&_h3]:tracking-[-0.01em] [&_h3]:text-balance",
              "[&_p]:max-w-[44ch] [&_p]:text-[1.0625rem] [&_p]:leading-[1.5] [&_p]:text-pretty [&_p]:text-muted-foreground [&_h3+p]:mt-4"
            )}
          >
            {item.content}
          </TabsPanel>
        ))}
      </div>
    </TabsRoot>
  )
}
