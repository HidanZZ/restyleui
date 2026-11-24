"use client"

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"
import { Drawer, DrawerBackdrop, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@ui-sdk/react/drawer"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { useState, type CSSProperties, type ReactNode } from "react"
import { Button } from "@/registry/mckp/components/button"
import type { NavbarProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"
import { useScrollState } from "@/registry/restyle/hooks/use-scroll-state"

// Header items drop in from 20px above; the bottom hairline fades in after them.
const keyframes =
  "@keyframes mckp-header-in{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:none}}@keyframes mckp-border-in{0%{border-color:transparent}to{border-color:var(--border)}}"
const appear =
  "animate-[mckp-header-in_.8s_cubic-bezier(.16,1,.3,1)_both] [animation-delay:var(--d,0s)] motion-reduce:animate-none"

const navLink =
  "flex items-center gap-1 whitespace-nowrap rounded-kit px-3 py-1.5 text-[length:var(--mckp-type-nav)] font-semibold leading-(--mckp-type-nav-line) text-foreground transition-colors duration-200 ease-kit-in-out hover:bg-(--mckp-surface) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none max-[480px]:px-2"

const glass =
  "bg-(--mckp-surface-glass) backdrop-blur-[40px] backdrop-saturate-[1.4] shadow-[0_24px_60px_color-mix(in_srgb,var(--mckp-page-black)_50%,transparent)]"

const plusIcon =
  "relative size-3 shrink-0 before:absolute before:left-0 before:top-1/2 before:-mt-[0.75px] before:h-[1.5px] before:w-full before:bg-muted-foreground after:absolute after:left-0 after:top-1/2 after:-mt-[0.75px] after:h-[1.5px] after:w-full after:rotate-90 after:bg-muted-foreground after:transition-transform after:duration-300 after:ease-kit group-data-open:after:rotate-0 motion-reduce:after:transition-none"

function Brand({ brand }: { brand: ReactNode }) {
  if (typeof brand !== "string") return <>{brand}</>
  return (
    <>
      <span
        aria-hidden="true"
        className="grid size-7 shrink-0 place-items-center rounded-kit-sm bg-foreground text-[13px] font-semibold text-background"
      >
        {brand.charAt(0)}
      </span>
      <span className="text-[length:var(--mckp-type-nav)] font-semibold leading-(--mckp-type-nav-line)">{brand}</span>
    </>
  )
}

export function Navbar({ brand, brandHref = "/", items, actions, className }: NavbarProps) {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const [menuOpen, setMenuOpen] = useState(false)
  const { direction } = useScrollState({ threshold: 16 })
  const hidden = direction === "down" && !menuOpen
  const primary = actions?.find((action) => action.variant !== "secondary")

  return (
    <header
      ref={kitRef}
      data-hidden={hidden || undefined}
      className={cn(
        "sticky top-0 z-40 border-b border-transparent bg-background",
        "animate-[mckp-border-in_.6s_cubic-bezier(.16,1,.3,1)_.5s_forwards] motion-reduce:animate-none motion-reduce:border-border",
        "transition-[translate] duration-500 ease-kit data-hidden:-translate-y-full motion-reduce:transition-none",
        className
      )}
    >
      <style href="mckp-navbar" precedence="default">
        {keyframes}
      </style>
      <div className="flex items-center justify-between gap-3 py-3 pl-5 pr-3">
        <div className={cn("flex min-w-0 flex-1 items-center gap-3", appear)}>
          <a
            href={brandHref}
            className="flex shrink-0 items-center gap-2.5 rounded-kit-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Brand brand={brand} />
          </a>

          <NavigationMenu aria-label="Main" container={container} className="relative hidden md:block">
            <NavigationMenuList className="flex items-center gap-2">
              {items.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.label} value={item.label}>
                    <NavigationMenuTrigger className={cn("group", navLink, "data-open:bg-(--mckp-surface)")}>
                      {item.label}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="size-3 text-muted-foreground transition-transform duration-300 ease-kit group-data-open:rotate-180 motion-reduce:transition-none"
                      >
                        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute start-0 top-0 w-80 p-1.5 transition-[opacity,translate] duration-300 ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0 data-[motion=from-end]:data-starting-style:translate-x-6 data-[motion=from-start]:data-starting-style:-translate-x-6 motion-reduce:transition-none">
                      <ul className="grid gap-0.5">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavigationMenuLink
                              href={child.href}
                              className="block rounded-[10px] px-3 py-2.5 transition-colors duration-200 hover:bg-foreground/[0.06] focus-visible:bg-foreground/[0.06] focus-visible:outline-none motion-reduce:transition-none"
                            >
                              <span className="block text-[length:var(--mckp-type-nav)] font-semibold leading-(--mckp-type-nav-line) text-foreground">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="block text-xs leading-4 text-(--mckp-ink-faint)">{child.description}</span>
                              )}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink href={item.href} className={navLink}>
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
            <NavigationMenuViewport
              sideOffset={10}
              className={cn(
                glass,
                "h-(--viewport-height) w-(--viewport-width) overflow-hidden rounded-[16px] text-popover-foreground",
                "transition-[width,height,opacity,translate,scale] duration-300 ease-kit data-starting-style:-translate-y-1.5 data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none"
              )}
            />
          </NavigationMenu>
        </div>

        <div className={cn("flex shrink-0 items-center gap-2", appear)} style={{ "--d": "0.1s" } as CSSProperties}>
          {actions?.map((action) => (
            <Button
              key={action.label}
              href={action.href}
              size="sm"
              variant={action.variant === "secondary" ? "ghost" : "primary"}
              className={cn("max-md:hidden", action === primary && "max-md:inline-flex")}
            >
              {action.label}
            </Button>
          ))}

          <Drawer side="right" open={menuOpen} onOpenChange={setMenuOpen} container={container}>
            <DrawerTrigger className={cn(navLink, "md:hidden")} aria-label="Open menu">
              Menu
            </DrawerTrigger>
            <DrawerBackdrop className="fixed inset-0 bg-(--mckp-page-black)/70" />
            <DrawerContent className="flex h-dvh w-[min(88vw,22rem)] flex-col gap-6 overflow-y-auto border-l border-border bg-background p-6 text-foreground">
              <div className="flex items-center justify-between">
                <DrawerTitle className="flex items-center gap-2.5">
                  <Brand brand={brand} />
                </DrawerTitle>
                <DrawerClose
                  aria-label="Close menu"
                  className="grid size-8 place-items-center rounded-kit bg-foreground/[0.06] transition-colors duration-200 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </DrawerClose>
              </div>
              <nav aria-label="Mobile">
                <Accordion className="border-b border-border">
                  {items.map((item) =>
                    item.children ? (
                      <AccordionItem key={item.label} value={item.label} className="border-t border-border">
                        <AccordionHeader>
                          <AccordionTrigger className="group flex w-full items-center justify-between gap-6 py-4 text-left text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                            {item.label}
                            <span aria-hidden="true" className={plusIcon} />
                          </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
                          <ul className="grid gap-1 pb-4">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <DrawerClose
                                  render={<a href={child.href} />}
                                  className="block rounded-kit px-3 py-2 text-[length:var(--mckp-type-small)] leading-(--mckp-type-small-line) text-muted-foreground transition-colors duration-200 hover:bg-(--mckp-surface) hover:text-foreground motion-reduce:transition-none"
                                >
                                  {child.label}
                                </DrawerClose>
                              </li>
                            ))}
                          </ul>
                        </AccordionPanel>
                      </AccordionItem>
                    ) : (
                      <DrawerClose
                        key={item.label}
                        render={<a href={item.href} />}
                        className="block border-t border-border py-4 text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) transition-opacity duration-200 hover:opacity-75 motion-reduce:transition-none"
                      >
                        {item.label}
                      </DrawerClose>
                    )
                  )}
                </Accordion>
              </nav>
              {actions && actions.length > 0 && (
                <div className="mt-auto grid gap-2">
                  {actions.map((action) => (
                    <Button
                      key={action.label}
                      href={action.href}
                      size="lg"
                      variant={action.variant === "secondary" ? "secondary" : "primary"}
                      className="w-full"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}
