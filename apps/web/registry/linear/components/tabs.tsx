"use client"

import { Tabs as TabsRoot, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import type { TabsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Source: the hero workspace sidebar. Compact 28px items in medium 13px type,
 * a faint white wash marks the selected one and slides between items, and the
 * panel sits in the app's inner view frame.
 */
export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <TabsRoot defaultValue={defaultValue ?? items[0]?.id} className={cn("grid gap-3", className)}>
      <TabsList
        aria-label="Sections"
        className="relative flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-[12px] border border-(--linear-border-translucent-strong) bg-(--linear-bg-level-1) p-1 [scrollbar-width:none]"
      >
        {items.map((item) => (
          <TabsTab
            key={item.id}
            value={item.id}
            className={cn(
              "relative z-10 flex h-7 shrink-0 cursor-pointer items-center rounded-[8px] px-2.5 text-[13px] font-[510] text-muted-foreground",
              "transition-[color,background-color] duration-100 ease-kit hover:bg-white/[0.02] hover:text-(--linear-text-secondary) data-selected:text-(--linear-text-secondary) data-selected:hover:bg-transparent",
              "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring motion-reduce:transition-none"
            )}
          >
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator className="absolute left-(--active-tab-left) top-(--active-tab-top) h-(--active-tab-height) w-(--active-tab-width) rounded-[8px] bg-white/[0.04] transition-[left,width] duration-[250ms] ease-kit data-[activation-direction=none]:transition-none motion-reduce:transition-none" />
      </TabsList>
      <div className="grid overflow-hidden rounded-[12px] border border-(--linear-border-translucent-strong) bg-(--linear-bg-level-1) p-2">
        <div className="grid overflow-hidden rounded-[8px] border border-(--linear-border-translucent) bg-white/[0.01] shadow-[0_0_0_2px_#0003]">
          {items.map((item) => (
            <TabsPanel
              key={item.id}
              value={item.id}
              className={cn(
                "p-6 [grid-area:1/1] sm:p-8",
                "transition-[opacity,translate] duration-[250ms] ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0",
                "data-[activation-direction=right]:data-starting-style:translate-x-3 data-[activation-direction=left]:data-starting-style:-translate-x-3 motion-reduce:transition-none",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                "[&_h3]:text-[length:var(--linear-title-2-size)] [&_h3]:font-[510] [&_h3]:leading-[1.33] [&_h3]:tracking-[-0.012em] [&_h3]:text-foreground",
                "[&_p]:mt-2 [&_p]:max-w-(--linear-prose-max) [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:tracking-[-0.011em] [&_p]:text-muted-foreground"
              )}
            >
              {item.content}
            </TabsPanel>
          ))}
        </div>
      </div>
    </TabsRoot>
  )
}
