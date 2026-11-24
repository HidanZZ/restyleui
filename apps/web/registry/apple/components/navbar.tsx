"use client"

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@ui-sdk/react/drawer"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { useCallback, useState, type CSSProperties } from "react"
import { Button } from "@/registry/apple/components/button"
import type { NavbarProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"

// The source measures ~460ms between the pointer leaving the nav and the flyout closing.
const FLYOUT_CLOSE_DELAY = 460

const focusRing = "focus-visible:outline-2 focus-visible:-outline-offset-[7px] focus-visible:outline-ring"

// 12px nav links in 80% ink that turn full ink on hover, as in the source's global nav.
const barLink = cn(
  "flex h-11 cursor-pointer items-center px-2 text-[12px] leading-none tracking-[-.01em] whitespace-nowrap text-foreground/80 no-underline",
  "transition-colors duration-[320ms] ease-kit hover:text-foreground data-open:text-foreground motion-reduce:transition-none",
  focusRing
)

// Panel links fade and drop 4px into place, 20ms apart, after an 80ms lead.
const flyoutItem =
  "transition-[opacity,translate] duration-[320ms] ease-kit delay-(--d) group-data-starting-style/panel:-translate-y-1 group-data-starting-style/panel:opacity-0 group-data-ending-style/panel:opacity-0 group-data-ending-style/panel:delay-0 group-data-ending-style/panel:duration-[160ms] motion-reduce:transition-none"

// Drawer rows fade and drop in the same way as the drawer opens.
const drawerItem =
  "transition-[opacity,translate] duration-[320ms] ease-kit delay-(--d) group-data-starting-style/drawer:-translate-y-2 group-data-starting-style/drawer:opacity-0 motion-reduce:transition-none"

const drawerLink = cn(
  "flex w-full cursor-pointer items-center justify-between py-[7px] text-left font-display text-[28px] leading-[1.1428571429] font-semibold tracking-[.007em] text-foreground/80 no-underline",
  "transition-colors duration-[320ms] ease-kit hover:text-foreground motion-reduce:transition-none",
  focusRing
)

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

function Bread({ open }: { open?: boolean }) {
  // The source's two 18px "bread" lines; the close button draws them as an X.
  const line = "origin-center [transform-box:fill-box] transition-[rotate,translate] duration-[240ms] ease-kit motion-reduce:transition-none"
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      {open ? (
        <>
          <line x1="2" y1="9" x2="16" y2="9" className={cn(line, "rotate-45 group-data-starting-style/drawer:-translate-y-1 group-data-starting-style/drawer:rotate-0")} />
          <line x1="2" y1="9" x2="16" y2="9" className={cn(line, "-rotate-45 group-data-starting-style/drawer:translate-y-[3px] group-data-starting-style/drawer:rotate-0")} />
        </>
      ) : (
        <>
          <line x1="2" y1="5" x2="16" y2="5" />
          <line x1="2" y1="12" x2="16" y2="12" />
        </>
      )}
    </svg>
  )
}

/**
 * Apple global nav bar: a thin translucent bar with 12px links. Items with
 * children open a full-width panel that grows out of the bar while the page
 * behind blurs. Below 834px the bar is 48px with a two-line menu button that
 * opens a full-screen menu of large links.
 */
export function Navbar({ brand, brandHref = "/", items, actions, className }: NavbarProps) {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const [header, setHeader] = useState<HTMLElement | null>(null)
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const headerRef = useCallback(
    (node: HTMLElement | null) => {
      kitRef(node)
      setHeader(node)
    },
    [kitRef]
  )

  return (
    <header
      ref={headerRef}
      data-flyout={flyoutOpen || undefined}
      className={cn("group/nav sticky top-0 z-40 font-body text-foreground antialiased", className)}
    >
      {/* Bar surface on its own layer: a backdrop filter on the header would trap the fixed curtain below. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(--apple-nav-scrim) backdrop-blur-[20px] backdrop-saturate-[1.8] transition-[background-color] duration-[240ms] ease-kit group-data-flyout/nav:bg-popover group-data-flyout/nav:backdrop-blur-none motion-reduce:transition-none"
      />
      {/* The source's curtain: the page blurs under an open panel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 -z-10 bg-accent/40 opacity-0 backdrop-blur-[20px] transition-[opacity,visibility] duration-[240ms] ease-kit group-data-flyout/nav:visible group-data-flyout/nav:opacity-100 motion-reduce:transition-none"
      />

      <div className="relative mx-auto flex h-12 max-w-kit items-center ps-4 pe-1 min-[834px]:h-11 min-[834px]:px-[22px]">
        <a
          href={brandHref}
          className={cn(
            "flex h-full shrink-0 items-center font-display text-[19px] leading-none font-semibold tracking-[.012em] text-foreground/80 no-underline transition-colors duration-[320ms] ease-kit hover:text-foreground min-[834px]:-ms-2 min-[834px]:px-2 min-[834px]:font-body min-[834px]:text-[17px] min-[834px]:tracking-[-.022em] motion-reduce:transition-none",
            focusRing
          )}
        >
          {brand}
        </a>

        <NavigationMenu
          aria-label="Main"
          container={container}
          closeDelay={FLYOUT_CLOSE_DELAY}
          onValueChange={(value) => setFlyoutOpen(value != null)}
          className="hidden flex-1 justify-center min-[834px]:flex"
        >
          <NavigationMenuList className="flex items-center gap-x-[clamp(4px,1.6vw,20px)]">
            {items.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.label} value={item.label}>
                  <NavigationMenuTrigger className={barLink}>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent className="group/panel absolute inset-x-0 top-0 transition-opacity duration-[120ms] ease-kit data-[motion]:data-starting-style:opacity-0 data-[motion]:data-ending-style:opacity-0 motion-reduce:transition-none">
                    <div className="mx-auto max-w-kit px-[22px] pt-10 pb-[84px]">
                      <p className={cn("mb-[14px] text-[12px] leading-[1.3333733333] tracking-[-.01em] text-muted-foreground", flyoutItem)} style={delay(100)}>
                        {item.label}
                      </p>
                      <ul className="grid max-w-[50%] gap-[6px] min-[1069px]:max-w-[40%]">
                        {item.children.map((child, index) => (
                          <li key={child.label} className={flyoutItem} style={delay(120 + index * 20)}>
                            <NavigationMenuLink
                              href={child.href}
                              className={cn(
                                "group/link block py-[5px] text-foreground/80 no-underline transition-colors duration-[320ms] ease-kit hover:text-foreground motion-reduce:transition-none",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              )}
                            >
                              <span className="block font-display text-[24px] leading-[1.1666666667] font-semibold tracking-[.009em]">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="mt-1 block text-[12px] leading-[1.3333733333] tracking-[-.01em] text-muted-foreground">
                                  {child.description}
                                </span>
                              )}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink href={item.href} className={barLink}>
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
          {/* One full-width panel under the bar; it grows to the open item's height. */}
          <NavigationMenuViewport
            anchor={header}
            align="start"
            sideOffset={0}
            className="h-(--viewport-height) w-(--anchor-width) overflow-hidden bg-popover text-popover-foreground transition-[height] duration-[240ms] ease-kit data-starting-style:h-0 data-ending-style:h-0 data-ending-style:delay-[120ms] motion-reduce:transition-none"
          />
        </NavigationMenu>

        {actions && actions.length > 0 && (
          <div className="hidden shrink-0 items-center gap-2 min-[834px]:flex">
            {actions.map((action) =>
              action.variant === "secondary" ? (
                <a key={action.label} href={action.href} className={barLink}>
                  {action.label}
                </a>
              ) : (
                <Button key={action.label} href={action.href} size="sm">
                  {action.label}
                </Button>
              )
            )}
          </div>
        )}

        <Drawer side="top" open={menuOpen} onOpenChange={setMenuOpen} container={container}>
          <DrawerTrigger
            aria-label="Menu"
            className={cn("ms-auto flex size-12 cursor-pointer items-center justify-center text-foreground/80 transition-colors duration-[320ms] ease-kit hover:text-foreground min-[834px]:hidden motion-reduce:transition-none", focusRing)}
          >
            <Bread />
          </DrawerTrigger>
          <DrawerContent className="group/drawer h-dvh w-full overflow-y-auto bg-popover font-body text-popover-foreground antialiased">
            <DrawerTitle className="sr-only">Menu</DrawerTitle>
            <div className="flex h-12 justify-end pe-1">
              <DrawerClose
                aria-label="Close menu"
                className={cn("flex size-12 cursor-pointer items-center justify-center text-foreground/80 transition-colors duration-[320ms] ease-kit hover:text-foreground motion-reduce:transition-none", focusRing)}
              >
                <Bread open />
              </DrawerClose>
            </div>
            <nav aria-label="Main" className="px-12 pt-2 pb-16">
              <Accordion>
                {items.map((item, index) =>
                  item.children ? (
                    <AccordionItem key={item.label} value={item.label} className={drawerItem} style={delay(80 + index * 20)}>
                      <AccordionHeader>
                        <AccordionTrigger className={cn("group/trigger", drawerLink, "data-open:text-foreground")}>
                          {item.label}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 11 6"
                            className="h-[8px] w-[15px] shrink-0 text-muted-foreground transition-transform duration-[320ms] ease-kit group-data-open/trigger:-scale-y-100 motion-reduce:transition-none"
                          >
                            <polyline points="10.075 0.675 5.5 5.323 0.925 0.675" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </AccordionTrigger>
                      </AccordionHeader>
                      <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-[320ms] ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
                        <ul className="grid pt-1 pb-4">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <DrawerClose
                                render={<a href={child.href} />}
                                className={cn(
                                  "block py-[6px] text-[17px] leading-[1.2353641176] font-semibold tracking-[-.022em] text-foreground/80 no-underline transition-colors duration-[320ms] ease-kit hover:text-foreground motion-reduce:transition-none",
                                  focusRing
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
                    <div key={item.label} className={drawerItem} style={delay(80 + index * 20)}>
                      <DrawerClose render={<a href={item.href} />} className={drawerLink}>
                        {item.label}
                      </DrawerClose>
                    </div>
                  )
                )}
              </Accordion>
              {actions && actions.length > 0 && (
                <div className={cn("mt-8 flex flex-wrap gap-3", drawerItem)} style={delay(80 + items.length * 20)}>
                  {actions.map((action) => (
                    <Button key={action.label} href={action.href} variant={action.variant ?? "primary"}>
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </nav>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  )
}
