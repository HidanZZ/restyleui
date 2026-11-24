"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { Drawer, DrawerBackdrop, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@ui-sdk/react/drawer"
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"
import type { Action, NavbarProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"

/** The bar starts 28px below the top and closes the gap 1:1 with scroll, no tween. */
const TOP_OFFSET = 28
/** The mobile sheet hangs 8px under the 64px bar. */
const SHEET_OFFSET = 64 + 8

const ease = "transition-colors duration-200 ease-kit motion-reduce:transition-none"
const focus = "outline-none focus-visible:ring-2 focus-visible:ring-ring"

/** Pill surface: white glass over film, frosted paper with a hairline elsewhere. */
function pill(light: boolean) {
  return cn(
    "flex items-center rounded-full border backdrop-blur-md",
    ease,
    light ? "border-transparent bg-background/15 backdrop-blur-xl" : "border-border bg-background/80"
  )
}

function navLink(light: boolean) {
  return cn(
    "flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[0.875rem] font-medium",
    ease,
    focus,
    light
      ? "text-primary-foreground/85 [text-shadow:0_1px_3px_color-mix(in_srgb,var(--foreground)_35%,transparent)] hover:bg-background/15 hover:text-primary-foreground data-open:bg-background/15 data-open:text-primary-foreground"
      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-open:bg-foreground/5 data-open:text-foreground"
  )
}

function solidAction(light: boolean) {
  return light
    ? "bg-background text-foreground hover:bg-background/90"
    : "bg-foreground text-background hover:bg-foreground/85"
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0 transition-transform duration-300 ease-kit motion-reduce:transition-none", className)}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}

function DesktopActions({ actions, light }: { actions: Action[]; light: boolean }) {
  const [first, second] = actions
  // The source tucks the quiet pill under the order pill: one attached group.
  const attached =
    actions.length === 2 && first.variant === "secondary" && (second.variant ?? "primary") === "primary"

  if (attached) {
    return (
      <div className="hidden items-center sm:flex">
        <a
          href={first.href}
          className={cn(
            pill(light),
            "h-10 rounded-e-none ps-4 pe-10 text-[0.875rem] font-medium",
            focus,
            light
              ? "text-primary-foreground/80 hover:text-primary-foreground"
              : "text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          )}
        >
          {first.label}
        </a>
        <a
          href={second.href}
          className={cn(
            "relative z-[1] -ms-7 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-4 text-[0.875rem] font-medium",
            ease,
            focus,
            solidAction(light)
          )}
        >
          {second.label}
        </a>
      </div>
    )
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      {actions.map((action) =>
        action.variant === "secondary" ? (
          <a
            key={action.label}
            href={action.href}
            className={cn(
              pill(light),
              "h-10 px-4 text-[0.875rem] font-medium",
              focus,
              light ? "text-primary-foreground hover:bg-background/25" : "text-foreground hover:border-foreground/30"
            )}
          >
            {action.label}
          </a>
        ) : (
          <a
            key={action.label}
            href={action.href}
            className={cn(
              "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-4 text-[0.875rem] font-medium",
              ease,
              focus,
              solidAction(light)
            )}
          >
            {action.label}
          </a>
        )
      )}
    </div>
  )
}

/**
 * Norma navbar: a fixed bar of three floating pills (wordmark, links, actions)
 * that starts 28px down and settles at the top as the page scrolls. While it
 * floats over an element marked `data-norma-invert` (a dark hero), it turns to
 * white glass with white type. Items with children open a dropdown; on phones
 * a 40px menu pill drops a frosted sheet under the bar.
 */
export function Navbar({ brand, brandHref = "/", items, actions, className }: NavbarProps) {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const headerRef = useRef<HTMLElement | null>(null)
  const [light, setLight] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sheetTop, setSheetTop] = useState(TOP_OFFSET + SHEET_OFFSET)
  const primary = actions?.find((action) => (action.variant ?? "primary") === "primary")

  const setHeader = useCallback(
    (node: HTMLElement | null) => {
      headerRef.current = node
      kitRef(node)
    },
    [kitRef]
  )

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const scope = header.closest("[data-kit]") ?? document
    let frame = 0

    const update = () => {
      frame = 0
      header.style.top = `${Math.max(0, TOP_OFFSET - window.scrollY)}px`
      const bar = header.getBoundingClientRect()
      const probe = bar.top + bar.height / 2
      // Like the source, flip back to paper a little before the film leaves the bar.
      const leave = Math.max(probe, window.innerHeight * 0.16)
      const over = Array.from(scope.querySelectorAll("[data-norma-invert]")).some((el) => {
        const rect = el.getBoundingClientRect()
        return rect.top <= probe && rect.bottom >= leave
      })
      setLight(over)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <header
      ref={setHeader}
      data-light={light || undefined}
      className={cn("fixed inset-x-0 top-7 z-50 font-body", className)}
    >
      <div className="mx-auto flex h-16 w-full max-w-kit items-center justify-between px-gutter sm:grid sm:grid-cols-[1fr_auto_1fr]">
        <a
          href={brandHref}
          className={cn(
            pill(light),
            "h-10 justify-self-start px-4 text-[1.0625rem] font-semibold leading-none tracking-[-0.02em]",
            focus,
            light ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {brand}
        </a>

        <NavigationMenu aria-label="Main" container={container} className="relative hidden justify-self-center sm:block">
          <NavigationMenuList className={cn(pill(light), "h-10 gap-0.5 p-1")}>
            {items.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.label} value={item.label}>
                  <NavigationMenuTrigger className={cn("group", navLink(light))}>
                    {item.label}
                    <Chevron className="group-data-open:rotate-180" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute start-0 top-0 w-80 p-1.5 transition-[opacity,translate] duration-200 ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0 data-[motion=from-end]:data-starting-style:translate-x-4 data-[motion=from-start]:data-starting-style:-translate-x-4 motion-reduce:transition-none">
                    <ul className="grid gap-0.5">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavigationMenuLink
                            href={child.href}
                            className={cn(
                              "block rounded-[calc(var(--kit-radius)-0.375rem)] px-3 py-2.5 hover:bg-secondary focus-visible:bg-secondary",
                              ease,
                              "outline-none"
                            )}
                          >
                            <span className="block text-[0.875rem] font-medium leading-[1.3] text-foreground">{child.label}</span>
                            {child.description && (
                              <span className="mt-0.5 block text-[0.8125rem] leading-[1.4] text-muted-foreground">
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
                  <NavigationMenuLink href={item.href} className={navLink(light)}>
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
          <NavigationMenuViewport
            sideOffset={10}
            className="h-(--viewport-height) w-(--viewport-width) overflow-hidden rounded-kit border border-border bg-popover text-popover-foreground shadow-lg transition-[width,height,opacity,translate] duration-200 ease-kit data-starting-style:-translate-y-1 data-starting-style:opacity-0 data-ending-style:-translate-y-1 data-ending-style:opacity-0 motion-reduce:transition-none"
          />
        </NavigationMenu>

        <div className="flex items-center gap-2 justify-self-end">
          <Drawer
            side="top"
            open={menuOpen}
            onOpenChange={(open) => {
              if (open) setSheetTop(Math.max(0, TOP_OFFSET - window.scrollY) + SHEET_OFFSET)
              setMenuOpen(open)
            }}
            container={container}
          >
            <DrawerTrigger
              aria-label={menuOpen ? "Close menu" : "Menu"}
              className={cn(
                pill(light),
                "size-10 shrink-0 cursor-pointer justify-center sm:hidden",
                focus,
                light ? "text-primary-foreground" : "text-foreground"
              )}
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d={menuOpen ? "m4 4 8 8M12 4l-8 8" : "M2.5 5h11M2.5 11h11"} />
              </svg>
            </DrawerTrigger>
            <DrawerBackdrop className="fixed inset-0 bg-transparent" />
            <DrawerContent
              style={{ marginTop: sheetTop }}
              className="mx-auto w-[calc(100%-2*var(--kit-gutter))] max-w-kit font-body text-foreground sm:hidden"
            >
              <DrawerTitle className="sr-only">Menu</DrawerTitle>
              <nav
                aria-label="Mobile"
                className="flex flex-col gap-1 rounded-kit border border-border bg-background/90 p-2 shadow-(--norma-shadow-float) backdrop-blur-md"
              >
                <Accordion className="flex flex-col gap-1">
                  {items.map((item) =>
                    item.children ? (
                      <AccordionItem key={item.label} value={item.label} className="group/item">
                        <AccordionHeader>
                          <AccordionTrigger
                            className={cn(
                              "flex w-full cursor-pointer items-center justify-between rounded-kit-sm px-3 py-2.5 text-left text-[0.9375rem] font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-open:text-foreground",
                              ease,
                              focus
                            )}
                          >
                            {item.label}
                            <Chevron className="group-data-open/item:rotate-180" />
                          </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
                          <ul className="grid gap-0.5 pb-1 ps-3">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <DrawerClose
                                  render={<a href={child.href} />}
                                  className={cn(
                                    "block rounded-kit-sm px-3 py-2 text-[0.875rem] text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                                    ease,
                                    focus
                                  )}
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
                        className={cn(
                          "block rounded-kit-sm px-3 py-2.5 text-[0.9375rem] font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                          ease,
                          focus
                        )}
                      >
                        {item.label}
                      </DrawerClose>
                    )
                  )}
                </Accordion>
                {actions && actions.length > 0 && (
                  <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-border px-1 pt-3 pb-1">
                    {actions.map((action) => (
                      <DrawerClose
                        key={action.label}
                        render={<a href={action.href} />}
                        className={cn(
                          "inline-flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 text-[0.875rem] font-medium",
                          ease,
                          focus,
                          action.variant === "secondary"
                            ? "border border-border bg-background text-foreground hover:border-foreground/30"
                            : "bg-foreground text-background hover:bg-foreground/85"
                        )}
                      >
                        {action.label}
                      </DrawerClose>
                    ))}
                  </div>
                )}
              </nav>
            </DrawerContent>
          </Drawer>

          {primary && (
            <a
              href={primary.href}
              className={cn(
                "h-10 items-center justify-center whitespace-nowrap rounded-full px-4 text-[0.875rem] font-medium sm:hidden",
                ease,
                focus,
                light ? "hidden" : "inline-flex",
                solidAction(light)
              )}
            >
              {primary.label}
            </a>
          )}

          {actions && actions.length > 0 && <DesktopActions actions={actions} light={light} />}
        </div>
      </div>
    </header>
  )
}
