"use client"

import { useCallback, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@ui-sdk/react/dialog"
import type { NavbarProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"
import { Button } from "@/registry/linear/components/button"

// Source: 32px pill anchors in 13px tertiary type with a white glass wash on hover and while open.
const anchor = cn(
  "relative flex h-8 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-3 text-[13px] text-muted-foreground",
  "transition-[color,background-color] duration-100 ease-kit hover:bg-white/[0.08] hover:text-foreground data-open:bg-white/[0.08] data-open:text-foreground",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
)

/**
 * Source: the site header. A sticky, blurred 72px bar (64px on phones) with a
 * hairline base. Desktop items open one shared glass popup under the bar's
 * right edge on hover; it resizes between panels while their columns slide by.
 * Phones get a full-height menu under the bar that fades in, and the two-line
 * menu icon turns into a cross.
 */
export function Navbar({ brand, brandHref = "/", items, actions, className }: NavbarProps) {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const [header, setHeader] = useState<HTMLElement | null>(null)
  const [bar, setBar] = useState<HTMLDivElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const headerRef = useCallback(
    (node: HTMLElement | null) => {
      kitRef(node)
      setHeader(node)
    },
    [kitRef]
  )

  const linkItems = items.filter((item) => !item.children?.length)
  const groups = items.filter((item) => item.children?.length)

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 select-none border-b border-(--linear-header-border) bg-(--linear-header-bg) font-body text-foreground backdrop-blur-[20px]",
        className
      )}
    >
      <div className="mx-auto max-w-kit px-[calc(var(--linear-homepage-padding-inset)+var(--linear-homepage-outer-padding)-1px)]">
        <div ref={setBar} className="flex h-(--linear-header-height) w-full items-center gap-4 md:gap-2">
          <a
            href={brandHref}
            className="-ml-2 flex h-8 min-w-0 flex-1 items-center rounded-[6px] px-2 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="truncate text-lg font-[590] leading-none tracking-[-0.03em] text-foreground">{brand}</span>
          </a>

          <div className="flex shrink-0 items-center md:w-full md:max-w-[620px]">
            <NavigationMenu aria-label="Main" container={container} closeDelay={140} className="hidden md:block">
              <NavigationMenuList className="flex items-center">
                {items.map((item) =>
                  item.children?.length ? (
                    <NavigationMenuItem key={item.label} value={item.label}>
                      <NavigationMenuTrigger className={anchor}>{item.label}</NavigationMenuTrigger>
                      <NavigationMenuContent
                        className={cn(
                          "absolute start-0 top-0 w-max pb-2.5 pl-2 pr-2.5 pt-2",
                          "transition-[opacity,translate] duration-[180ms] ease-kit-in-out data-starting-style:opacity-0 data-ending-style:opacity-0",
                          "data-[motion=from-end]:data-starting-style:translate-x-12 data-[motion=from-start]:data-starting-style:-translate-x-12",
                          "data-[motion=to-end]:data-ending-style:translate-x-12 data-[motion=to-start]:data-ending-style:-translate-x-12 motion-reduce:transition-none"
                        )}
                      >
                        <div className="rounded-[6px] bg-(--linear-bg-translucent) shadow-[inset_0_0_0_1px_var(--linear-border-translucent)]">
                          <div className="grid grid-flow-col gap-x-6 p-3 [grid-auto-columns:256px] [mask-image:linear-gradient(90deg,transparent_0,black_12px,black_calc(100%-12px),transparent_100%)]">
                            {Array.from({ length: Math.ceil(item.children.length / 2) }, (_, column) => (
                              <ul
                                key={column}
                                className="relative flex flex-col gap-px [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:inset-y-0 [&:not(:last-child)]:after:-right-3 [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:bg-(--linear-border-translucent)"
                              >
                                {item.children!.slice(column * 2, column * 2 + 2).map((child) => (
                                  <li key={child.href + child.label}>
                                    <NavigationMenuLink
                                      href={child.href}
                                      className={cn(
                                        "flex flex-col gap-1 rounded-[6px] pl-4 pr-6 transition-colors duration-[120ms] ease-kit hover:bg-white/[0.04] hover:duration-0",
                                        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
                                        child.description ? "py-3.5" : "py-2.5"
                                      )}
                                    >
                                      <span className="text-[13px] font-[510] leading-none tracking-[-0.01em] text-(--linear-text-secondary)">
                                        {child.label}
                                      </span>
                                      {child.description && (
                                        <span className="text-base leading-normal text-foreground/80">{child.description}</span>
                                      )}
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink href={item.href} className={anchor}>
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
              <NavigationMenuViewport
                anchor={bar}
                side="bottom"
                align="end"
                sideOffset={-8}
                className={cn(
                  "h-(--viewport-height) w-(--viewport-width) max-w-[calc(100vw-48px)] origin-top overflow-hidden rounded-[14px] border border-(--linear-border-translucent-strong)",
                  "bg-background/90 font-body text-foreground shadow-[0_8px_32px_var(--background)] backdrop-blur-[32px]",
                  "transition-[width,height,opacity,scale] duration-[220ms] ease-kit data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 motion-reduce:transition-none"
                )}
              />
            </NavigationMenu>

            <div aria-hidden className="hidden flex-1 md:block" />
            <div aria-hidden className="mx-2 hidden h-4 w-px bg-border md:block" />
            <div aria-hidden className="hidden flex-1 md:block" />

            {actions && actions.length > 0 && (
              <ul className="flex items-center justify-end gap-2">
                {actions.map((action) => (
                  <li key={action.label} className="flex">
                    {action.variant === "primary" ? (
                      <Button href={action.href} size="sm">
                        {action.label}
                      </Button>
                    ) : (
                      <a href={action.href} className={anchor}>
                        {action.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <Dialog
              open={menuOpen}
              onOpenChange={setMenuOpen}
              container={container}
              persistentElements={() => (header ? [header] : [])}
            >
              <DialogTrigger
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="group -mr-3.5 ml-1 grid size-10 shrink-0 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-ring md:hidden"
              >
                <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="fill-current">
                  <rect
                    x="1"
                    y="7.5"
                    width="14"
                    height="1"
                    rx="0.5"
                    className="origin-center -translate-y-[3.5px] transition-[translate,rotate] duration-[160ms] ease-kit group-data-open:translate-y-0 group-data-open:rotate-45 motion-reduce:transition-none"
                  />
                  <rect
                    x="1"
                    y="7.5"
                    width="14"
                    height="1"
                    rx="0.5"
                    className="origin-center translate-y-[3.5px] transition-[translate,rotate] duration-[160ms] ease-kit group-data-open:translate-y-0 group-data-open:-rotate-45 motion-reduce:transition-none"
                  />
                </svg>
              </DialogTrigger>
              <DialogContent
                className={cn(
                  "fixed inset-x-0 bottom-0 top-[calc(var(--linear-header-height)+1px)] z-50 m-0 flex h-auto max-h-none w-auto max-w-none flex-col overflow-y-auto",
                  "bg-(--linear-header-bg) px-6 py-8 font-body text-foreground outline-none backdrop-blur-[20px]",
                  "transition-opacity duration-[180ms] ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none md:hidden"
                )}
              >
                <DialogTitle className="sr-only">Site navigation</DialogTitle>
                <DialogClose className="sr-only">Close menu</DialogClose>
                <nav aria-label="Mobile" className="flex flex-col gap-8">
                  {groups.map((group) => (
                    <div key={group.label}>
                      <span className="text-base text-foreground">{group.label}</span>
                      <ul className="mt-5 flex flex-col gap-3">
                        {group.children!.map((child) => (
                          <li key={child.href + child.label}>
                            <DialogClose
                              render={<a href={child.href} />}
                              className="text-base text-foreground transition-colors duration-100 hover:text-muted-foreground active:text-muted-foreground motion-reduce:transition-none"
                            >
                              {child.label}
                            </DialogClose>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {linkItems.length > 0 && (
                    <ul className="flex flex-col gap-3">
                      {linkItems.map((item) => (
                        <li key={item.href + item.label}>
                          <DialogClose
                            render={<a href={item.href} />}
                            className="text-base text-foreground transition-colors duration-100 hover:text-muted-foreground active:text-muted-foreground motion-reduce:transition-none"
                          >
                            {item.label}
                          </DialogClose>
                        </li>
                      ))}
                    </ul>
                  )}
                </nav>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  )
}
