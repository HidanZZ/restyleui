"use client"

import { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { Drawer, DrawerBackdrop, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@ui-sdk/react/drawer"
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"
import type { NavbarProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"
import { Button } from "@/registry/teamwork/components/button"

const navLink =
  "flex h-9 items-center rounded-kit px-3 text-sm leading-5 font-medium text-muted-foreground transition-[background-color,color] duration-150 ease-kit hover:bg-foreground/7 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"

const menuItem =
  "flex min-h-10 w-full items-center px-4 py-2 text-left text-sm leading-5 text-popover-foreground transition-colors duration-150 ease-kit hover:bg-foreground/7 active:bg-border focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"

const menuHeading = "px-4 pt-3.5 pb-1.5 text-xs leading-4 font-bold text-muted-foreground"

function Chevron({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 11 6" fill="none" className={cn("h-1.5 w-[11px] shrink-0", className)}>
      <path d="M9.2 1.2 5.2 4.8l-4-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Invented graph mark: three linked nodes.
function GraphMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" className={cn("shrink-0", className)}>
      <path d="M4 4.5 12 3.5M4 4.5 8 12.5M12 3.5 8 12.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="4" cy="4.5" r="2" fill="var(--background)" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="3.5" r="2" fill="var(--background)" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="12.5" r="2" fill="var(--background)" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

export function Navbar({ brand, brandHref = "/", items, actions, className }: NavbarProps) {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header ref={kitRef} className={cn("sticky top-0 z-40 w-full bg-background font-body", className)}>
      <div className="mx-auto flex h-[88px] max-w-[calc(var(--kit-container)+4rem)] items-center justify-between gap-4 px-8 max-[480px]:px-4">
        <div className="flex min-w-0 items-center gap-8 max-[480px]:gap-2">
          <a
            href={brandHref}
            className="flex items-center gap-2 rounded-kit-sm font-display text-xl leading-5 text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <GraphMark className="size-4 max-[840px]:size-8" />
            <span className="whitespace-nowrap max-[840px]:sr-only">{brand}</span>
          </a>

          {/* Desktop: hover or click dropdowns under the trigger. */}
          <NavigationMenu aria-label="Main" container={container} className="relative -mb-1 hidden min-[936px]:block">
            <NavigationMenuList className="flex items-center gap-2">
              {items.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.label} value={item.label}>
                    <NavigationMenuTrigger
                      className={cn(navLink, "group cursor-pointer gap-2 data-open:text-foreground")}
                    >
                      {item.label}
                      <Chevron className="transition-transform duration-250 ease-in-out group-data-open:rotate-180 motion-reduce:transition-none" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute start-0 top-0 w-max max-w-80 min-w-48 pb-1.5 transition-opacity duration-150 ease-kit data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none">
                      <p className={menuHeading}>{item.label}</p>
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavigationMenuLink href={child.href} className={cn(menuItem, "flex-col items-start justify-center")}>
                              <span className="block">{child.label}</span>
                              {child.description && (
                                <span className="block text-xs leading-4 text-(--teamwork-text-subtle)">
                                  {child.description}
                                </span>
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
            {/* The source's 2px underline under the active item, inset by the item padding. */}
            <NavigationMenuIndicator className="absolute bottom-(--active-item-bottom) left-[calc(var(--active-item-left)+12px)] h-0.5 w-[calc(var(--active-item-width)-24px)] bg-foreground opacity-0 transition-[left,width,opacity] duration-200 ease-kit data-visible:opacity-100 motion-reduce:transition-none" />
            <NavigationMenuViewport
              sideOffset={8}
              className="h-(--viewport-height) w-(--viewport-width) overflow-hidden rounded-[8px] bg-popover text-popover-foreground shadow-(--teamwork-shadow-overlay) transition-[width,height,opacity] duration-150 ease-kit data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
            />
          </NavigationMenu>
        </div>

        <div className="flex shrink-0 items-center gap-4 max-[480px]:gap-2">
          {actions?.map((action) => (
            <Button
              key={action.label}
              href={action.href}
              // The source header pairs a quiet text control with one outlined control.
              variant={action.variant === "primary" ? "secondary" : "ghost"}
              className={action.variant === "primary" ? undefined : "-me-2 max-[480px]:me-0"}
            >
              {action.label}
            </Button>
          ))}

          {/* Mobile: a menu card that drops from the header. Modal: Escape, outside press, focus return. */}
          <Drawer side="top" open={menuOpen} onOpenChange={setMenuOpen} container={container}>
            <DrawerTrigger
              aria-label="Open navigation menu"
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-kit text-muted-foreground transition-colors duration-150 ease-kit hover:bg-foreground/7 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none min-[936px]:hidden"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 fill-current">
                <path d="M1 2h14v1.5H1zM1 7.25h14v1.5H1zM1 12.5h14V14H1z" />
              </svg>
            </DrawerTrigger>
            <DrawerBackdrop className="fixed inset-0 bg-background/40" />
            <DrawerContent className="mt-[72px] mr-4 ml-auto flex max-h-[calc(100dvh-88px)] w-[min(20rem,calc(100vw-2rem))] flex-col overflow-y-auto rounded-[8px] bg-popover pb-1.5 font-body text-popover-foreground shadow-(--teamwork-shadow-overlay)">
              <div className="flex items-center justify-between pe-2">
                <DrawerTitle className={menuHeading}>Menu</DrawerTitle>
                <DrawerClose
                  aria-label="Close menu"
                  className="mt-2 grid size-8 cursor-pointer place-items-center rounded-kit text-muted-foreground hover:bg-foreground/7 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <svg aria-hidden viewBox="0 0 16 16" className="size-4">
                    <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </DrawerClose>
              </div>
              <nav aria-label="Mobile">
                <Accordion>
                  {items.map((item) =>
                    item.children ? (
                      <AccordionItem key={item.label} value={item.label}>
                        <AccordionHeader>
                          <AccordionTrigger className={cn(menuItem, "group cursor-pointer justify-between")}>
                            {item.label}
                            <Chevron className="text-muted-foreground transition-transform duration-250 ease-in-out group-data-open:rotate-180 motion-reduce:transition-none" />
                          </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-kit data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
                          <ul className="ms-4 border-s border-border">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <DrawerClose render={<a href={child.href} />} className={menuItem}>
                                  {child.label}
                                </DrawerClose>
                              </li>
                            ))}
                          </ul>
                        </AccordionPanel>
                      </AccordionItem>
                    ) : (
                      <DrawerClose key={item.label} render={<a href={item.href} />} className={menuItem}>
                        {item.label}
                      </DrawerClose>
                    )
                  )}
                </Accordion>
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}
