"use client"

import { useRef, type KeyboardEvent } from "react"

import { CheckIcon, ChevronIcon } from "@/components/site/icons"
import { useActiveKit } from "@/components/site/kit-context"
import { KitSwatch } from "@/components/site/kit-swatch"
import { focusRing } from "@/components/site/ui"
import { KIT_SLUGS, type KitSlug } from "@/lib/catalog"
import { isKitRegistered, kitMeta } from "@/lib/kits"
import { cn } from "@/registry/restyle/lib/utils"

/** Floating bottom-right button that picks the kit used by every preview and install command. */
export function KitSwitcher() {
  const { kit, setKit } = useActiveKit()
  const popover = useRef<HTMLDivElement>(null)

  function choose(slug: KitSlug) {
    setKit(slug)
    const url = new URL(window.location.href)
    if (url.searchParams.has("kit")) {
      url.searchParams.delete("kit")
      window.history.replaceState(window.history.state, "", url)
    }
    popover.current?.hidePopover()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
    event.preventDefault()
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]"))
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    const next = (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <>
      <button
        type="button"
        popoverTarget="kit-switcher"
        aria-label={kit ? `Active kit: ${kitMeta[kit].name}. Change kit` : "Change kit"}
        className={cn(
          "fixed right-4 bottom-4 z-50 flex h-11 items-center gap-2.5 rounded-xl border border-border bg-background py-1 pr-3 pl-2 text-sm font-medium text-foreground shadow-[0_6px_24px_-6px_rgb(0_0_0/0.18),0_1px_2px_rgb(0_0_0/0.06)] transition-colors duration-150 hover:bg-muted md:right-6 md:bottom-6 dark:shadow-[0_8px_28px_-6px_rgb(0_0_0/0.7)]",
          focusRing,
        )}
      >
        {kit ? (
          <>
            <KitSwatch kit={kit} />
            <span>{kitMeta[kit].name}</span>
          </>
        ) : (
          // Before hydration the head script has already marked the active kit on <html>.
          KIT_SLUGS.map((slug) => (
            <span
              key={slug}
              className={cn(
                "hidden items-center gap-2.5",
                {
                  norma: "[html[data-active-kit=norma]_&]:flex",
                  linear: "[html[data-active-kit=linear]_&]:flex",
                  apple: "[html[data-active-kit=apple]_&]:flex",
                  teamwork: "[html[data-active-kit=teamwork]_&]:flex",
                  mckp: "[html[data-active-kit=mckp]_&]:flex",
                }[slug],
              )}
            >
              <KitSwatch kit={slug} />
              <span>{kitMeta[slug].name}</span>
            </span>
          ))
        )}
        <ChevronIcon className="size-4 rotate-180 text-muted-foreground" />
      </button>

      <div
        ref={popover}
        id="kit-switcher"
        popover="auto"
        className="fixed inset-auto right-4 bottom-[4.25rem] m-0 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-border bg-popover p-1.5 text-popover-foreground opacity-0 shadow-[0_16px_48px_-12px_rgb(0_0_0/0.22),0_2px_6px_rgb(0_0_0/0.06)] transition-[opacity,translate,overlay,display] transition-discrete duration-150 ease-out open:translate-y-0 open:opacity-100 starting:open:translate-y-1 starting:open:opacity-0 motion-reduce:transition-none md:right-6 md:bottom-[4.75rem] dark:shadow-[0_16px_48px_-12px_rgb(0_0_0/0.8)]"
      >
        <p className="px-2.5 pt-1.5 pb-2 text-xs text-muted-foreground">
          Previews and install commands use this kit.
        </p>
        <div role="menu" aria-label="Kits" onKeyDown={onKeyDown} className="flex flex-col gap-0.5">
          {KIT_SLUGS.map((slug) => {
            const meta = kitMeta[slug]
            const active = slug === kit
            return (
              <button
                key={slug}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(slug)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-muted",
                  active && "bg-muted",
                  focusRing,
                )}
              >
                <KitSwatch kit={slug} className="size-8 text-xs" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium">{meta.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {meta.mode === "dark" ? "Dark" : "Light"}
                    {isKitRegistered(slug) ? "" : " · Being built"}
                  </span>
                </span>
                {active && <CheckIcon className="size-4 text-foreground" />}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
