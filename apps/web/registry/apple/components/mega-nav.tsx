"use client"

import { Dialog, DialogBackdrop, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@ui-sdk/react/dialog"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { useCallback, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react"
import type { LinkItem } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"

export type MegaNavGroup = {
  title: string
  links: LinkItem[]
  /** Large links, like the first column of the source. Its title is hidden on phones. */
  featured?: boolean
}

export type MegaNavCategory = {
  label: string
  href: string
  groups: MegaNavGroup[]
}

export type MegaNavProps = {
  /** Brand mark. Defaults to a small round glyph. */
  brand?: ReactNode
  /** Accessible name of the brand link. */
  brandLabel?: string
  brandHref?: string
  categories?: MegaNavCategory[]
  searchPlaceholder?: string
  /** Where the search form submits, with the query as `q`. */
  searchAction?: string
  quickLinks?: LinkItem[]
  /** Shows a cart link after search when set. */
  cartHref?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Demo content
// ---------------------------------------------------------------------------

const links = (...labels: string[]): LinkItem[] => labels.map((label) => ({ label, href: "#" }))

const category = (label: string, featured: string[], shop: string[], more: string[]): MegaNavCategory => ({
  label,
  href: "#",
  groups: [
    { title: `Explore ${label}`, featured: true, links: links(...featured) },
    { title: `Shop ${label}`, links: links(...shop) },
    { title: `More from ${label}`, links: links(...more) },
  ],
})

const defaultCategories: MegaNavCategory[] = [
  {
    label: "Store",
    href: "#",
    groups: [
      { title: "Shop", featured: true, links: links("Shop the Latest", "Laptops", "Tablets", "Phones", "Wearables", "Audio", "Accessories") },
      { title: "Quick Links", links: links("Find a Store", "Order Status", "Trade In", "Financing", "Personal Setup") },
      { title: "Special Stores", links: links("Refurbished", "Education", "Business", "Government") },
    ],
  },
  category(
    "Laptops",
    ["Explore All Laptops", "Field 13", "Field 15", "Studio 16", "Compare", "Switch to Northwind"],
    ["Shop Laptops", "Laptop Accessories", "Trade In", "Financing"],
    ["Laptop Support", "Care Plans", "Creative Apps", "Better Together"]
  ),
  category(
    "Tablets",
    ["Explore All Tablets", "Slate", "Slate Mini", "Slate Studio", "Compare", "Pens and Keyboards"],
    ["Shop Tablets", "Tablet Accessories", "Trade In", "Financing"],
    ["Tablet Support", "Care Plans", "Tablets for School", "Reading Apps"]
  ),
  category(
    "Phones",
    ["Explore All Phones", "Pocket 9", "Pocket 9 Plus", "Pocket Mini", "Compare", "Switch to Northwind"],
    ["Shop Phones", "Phone Accessories", "Trade In", "Carrier Deals"],
    ["Phone Support", "Care Plans", "Privacy", "Better Together"]
  ),
  category(
    "Wearables",
    ["Explore All Wearables", "Pulse Band", "Pulse Ring", "Trail Watch", "Compare", "Bands"],
    ["Shop Wearables", "Wearable Accessories", "Trade In", "Financing"],
    ["Wearable Support", "Health Features", "Fitness Programs", "Family Setup"]
  ),
  category(
    "Audio",
    ["Explore All Audio", "Echo Buds", "Echo Buds Pro", "Echo Max", "Speakers", "Compare"],
    ["Shop Audio", "Audio Accessories", "Gift Cards"],
    ["Audio Support", "Care Plans", "Spatial Sound", "Music Service"]
  ),
  category(
    "Home",
    ["Explore Home", "Hub Display", "Room Speaker", "Light Kit", "Home App", "Compare"],
    ["Shop Home", "Home Accessories", "Installation"],
    ["Home Support", "Privacy at Home", "Energy Saving", "Works with Hub"]
  ),
  category(
    "Services",
    ["Explore Services", "Northwind One", "Stream", "Music", "Arcade", "Cloud Storage"],
    ["Shop Gift Cards", "Family Sharing", "Student Plans"],
    ["Services Support", "Billing", "Redeem a Code", "Account"]
  ),
  category(
    "Accessories",
    ["Shop All Accessories", "Laptops", "Tablets", "Phones", "Wearables", "Audio"],
    ["Shop Cases", "Chargers and Cables", "Keyboards", "Made for Northwind"],
    ["Accessory Support", "Recycling", "Returns"]
  ),
  {
    label: "Support",
    href: "#",
    groups: [
      { title: "Explore Support", featured: true, links: links("Laptops", "Tablets", "Phones", "Wearables", "Audio", "Services") },
      { title: "Get Help", links: links("Community", "Check Coverage", "Repair", "Contact Us") },
      { title: "Helpful Topics", links: links("Get Care", "Order Help", "Accessibility", "Safety") },
    ],
  },
]

const defaultQuickLinks = links("Find a Store", "Order Status", "Pulse Band", "Echo Buds", "Trade In")

// ---------------------------------------------------------------------------
// Icons (drawn for the kit)
// ---------------------------------------------------------------------------

function BrandMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none">
      <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2.6" fill="currentColor" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="6.75" cy="6.75" r="5.25" />
      <path d="m10.6 10.6 4.4 4.4" />
    </svg>
  )
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      <rect x="1" y="4.4" width="12" height="10.6" rx="1.8" />
      <path d="M4.4 4.4V3.8a2.6 2.6 0 0 1 5.2 0v.6" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 9 16" className="h-4 w-[9px] shrink-0 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M.6 8h7.6M5.3 5.1 8.2 8l-2.9 2.9" />
    </svg>
  )
}

function Chevron({ direction, className }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 9 16" className={cn("h-4 w-[9px] rtl:-scale-x-100", className)} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "M7.6 1.4 1.2 8l6.4 6.6" : "M1.4 1.4 7.8 8l-6.4 6.6"} />
    </svg>
  )
}

/** Two bread lines. Inside the open menu they cross into an X: they meet first, then turn. */
function MenuIcon({ morph }: { morph?: boolean }) {
  const line = cn(
    "origin-[9px_9px] [transform-box:view-box]",
    morph && [
      "[transition:translate_120ms_cubic-bezier(.42,0,1,1),rotate_120ms_cubic-bezier(0,0,.58,1)_120ms]",
      "group-data-ending-style/menu:[transition:rotate_120ms_cubic-bezier(.42,0,1,1),translate_120ms_cubic-bezier(0,0,.58,1)_120ms]",
      "motion-reduce:transition-none",
    ]
  )
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path
        d="M2 9h14"
        className={cn(
          line,
          morph
            ? "rotate-45 group-data-ending-style/menu:translate-y-[-4px] group-data-ending-style/menu:rotate-0 group-data-starting-style/menu:translate-y-[-4px] group-data-starting-style/menu:rotate-0"
            : "translate-y-[-4px]"
        )}
      />
      <path
        d="M2 9h14"
        className={cn(
          line,
          morph
            ? "-rotate-45 group-data-ending-style/menu:translate-y-[3px] group-data-ending-style/menu:rotate-0 group-data-starting-style/menu:translate-y-[3px] group-data-starting-style/menu:rotate-0"
            : "translate-y-[3px]"
        )}
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Stagger: the source numbers every heading and link straight through a panel
// and delays each by 20 ms, plus a per-column delay (80 ms after a featured
// column, 40 ms after a regular one).
// ---------------------------------------------------------------------------

type Delay = CSSProperties & { "--d": string }

function staggerGroups(groups: MegaNavGroup[]) {
  let item = 0
  let featuredSeen = 0
  return groups.map((group, g) => {
    const groupDelay = Math.min(featuredSeen * 80 + (g - featuredSeen) * 40, g * 80)
    if (group.featured) featuredSeen += 1
    const at = (): Delay => ({ "--d": `${groupDelay + item++ * 20 + 80}ms` })
    return { group, header: at(), links: group.links.map(() => at()) }
  })
}

/** Rises 4px (8px on phones) and fades in after its `--d`; leaves at once. */
const flyoutItem = (scope: "panel" | "menu") =>
  cn(
    "transition-[opacity,translate] duration-320 ease-kit delay-(--d) motion-reduce:transition-none",
    scope === "panel"
      ? "group-data-starting-style/panel:-translate-y-1 group-data-starting-style/panel:opacity-0 group-data-ending-style/panel:-translate-y-1 group-data-ending-style/panel:opacity-0 group-data-ending-style/panel:delay-0 group-data-ending-style/panel:duration-[160ms]"
      : "group-data-starting-style/menu:-translate-y-2 group-data-starting-style/menu:opacity-0 group-data-ending-style/menu:opacity-0 group-data-ending-style/menu:delay-0 group-data-ending-style/menu:duration-[160ms]"
  )

const panelHeader = "text-[12px] leading-[1.3333733333] tracking-[-.01em] text-muted-foreground"

function FlyoutColumns({ groups }: { groups: MegaNavGroup[] }) {
  return (
    <div className="mx-auto flex max-w-(--apple-nav-content-width) px-[22px] pt-10 pb-[84px]">
      {staggerGroups(groups).map(({ group, header, links }) => (
        <div
          key={group.title}
          className={cn("box-border -mb-1", group.featured ? "max-w-[50%] pe-[88px]" : "max-w-[25%] pe-[44px]")}
        >
          <h2 style={header} className={cn(panelHeader, "pb-1.5", flyoutItem("panel"))}>
            {group.title}
          </h2>
          <ul>
            {group.links.map((link, i) => (
              <li key={link.label} style={links[i]} className={flyoutItem("panel")}>
                <NavigationMenuLink
                  href={link.href}
                  className={cn(
                    "-mx-[11px] inline-block px-[11px] font-semibold text-foreground/90 outline-none transition-colors duration-240 ease-kit hover:text-foreground focus-visible:rounded-kit-sm focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none",
                    group.featured
                      ? "py-[5px] font-display text-[24px] leading-[1.1666666667] tracking-[.009em]"
                      : "py-1 text-[12px] leading-[1.3333733333] tracking-[-.01em]"
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function QuickLinks({ links, scope }: { links: LinkItem[]; scope: "panel" | "menu" }) {
  const compact = scope === "menu"
  return (
    <div className="mt-8">
      <h2
        style={{ "--d": "80ms" } as Delay}
        className={cn(
          compact ? "text-[17px] leading-[1.4705882353] tracking-[-.022em] text-muted-foreground" : panelHeader,
          "pb-2",
          flyoutItem(scope)
        )}
      >
        Quick Links
      </h2>
      <ul>
        {links.map((link, i) => {
          const className = cn(
            "flex items-center gap-[11px] rounded-kit-sm font-semibold text-foreground/90 outline-none transition-colors duration-240 ease-kit hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none",
            compact
              ? "py-[5px] text-[17px] leading-[1.4705882353] tracking-[-.022em]"
              : "-mx-2 px-2 py-1.5 text-[12px] leading-[1.3333733333] tracking-[-.01em]"
          )
          const content = (
            <>
              <ArrowIcon />
              {link.label}
            </>
          )
          return (
            <li key={link.label} style={{ "--d": `${(i + 1) * 20 + 80}ms` } as Delay} className={flyoutItem(scope)}>
              {compact ? (
                <DialogClose render={<a href={link.href} />} className={className}>
                  {content}
                </DialogClose>
              ) : (
                <NavigationMenuLink href={link.href} className={className}>
                  {content}
                </NavigationMenuLink>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function SearchField({
  placeholder,
  action,
  inputRef,
  large,
}: {
  placeholder: string
  action?: string
  inputRef?: Ref<HTMLInputElement>
  large?: boolean
}) {
  return (
    <form action={action} role="search" className="relative flex items-center">
      <SearchIcon
        className={cn(
          "pointer-events-none absolute start-0 text-muted-foreground",
          large ? "size-[22px]" : "size-[18px]"
        )}
      />
      <input
        ref={inputRef}
        type="search"
        name="q"
        aria-label={placeholder}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={cn(
          "w-full bg-transparent font-display font-semibold text-foreground outline-none placeholder:text-muted-foreground/80 [&::-webkit-search-cancel-button]:hidden",
          large ? "ps-9 text-[28px] leading-[1.1428571429] tracking-[.007em]" : "h-10 ps-[34px] text-[24px] leading-none tracking-[.009em]"
        )}
      />
    </form>
  )
}

// ---------------------------------------------------------------------------
// Mega nav
// ---------------------------------------------------------------------------

const barLink =
  "flex h-full items-center px-2 text-[12px] leading-none tracking-[-.01em] text-foreground/80 outline-none transition-colors duration-320 ease-kit hover:text-foreground data-open:text-foreground focus-visible:rounded-kit-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"

const iconButton =
  "flex h-full w-12 shrink-0 items-center justify-center text-foreground/80 outline-none transition-colors duration-320 ease-kit hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"

/**
 * Apple flyout mega nav: a translucent 44px bar whose categories open one
 * full-width panel on hover. The panel grows from under the bar, its columns
 * of links fade and rise in a 20 ms stagger, and the page behind blurs under
 * a curtain. Search is one more panel. Below 834px the bar keeps the brand,
 * search, cart and a burger; the burger opens a full-screen menu that unrolls
 * from the bar, with a category list that slides to each category's links
 * and back.
 *
 * ui-sdk `NavigationMenu` runs the desktop panels (hover intent, 460 ms close
 * delay, Escape, outside press, focus return); ui-sdk `Dialog` runs the phone
 * menu (scroll lock, inert page, Escape, focus return). Both render inside the
 * closest `[data-kit]` through `useKitPortal`.
 */
export function MegaNav({
  brand = <BrandMark />,
  brandLabel = "Northwind",
  brandHref = "/",
  categories = defaultCategories,
  searchPlaceholder = "Search",
  searchAction,
  quickLinks = defaultQuickLinks,
  cartHref = "#",
  className,
}: MegaNavProps) {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const [header, setHeader] = useState<HTMLElement | null>(null)
  const headerRef = useCallback(
    (node: HTMLElement | null) => {
      kitRef(node)
      setHeader(node)
    },
    [kitRef]
  )

  // Desktop: the open panel, or null.
  const [value, setValue] = useState<string | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)

  // Phone menu: open, and which view it shows.
  const [menuOpen, setMenuOpen] = useState(false)
  const [mode, setMode] = useState<"menu" | "search">("menu")
  const [panel, setPanel] = useState<string | null>(null)
  const openCategory = categories.find((c) => c.label === panel)

  const desktopOpen = value !== null

  return (
    <header
      ref={headerRef}
      data-open={desktopOpen || undefined}
      className={cn("group/nav sticky top-0 z-40 h-12 font-body min-[834px]:h-(--apple-nav-height)", className)}
    >
      {/* Curtain: blurs the page while a desktop panel is open. */}
      <div
        aria-hidden="true"
        className={cn(
          "invisible fixed inset-0 bg-accent/40 opacity-0 backdrop-blur-[20px]",
          "transition-[opacity,visibility] delay-80 duration-320 ease-kit motion-reduce:transition-none",
          "group-data-open/nav:visible group-data-open/nav:opacity-100"
        )}
      />

      {/* The bar. It turns solid while a panel is open so it reads as one surface with it. */}
      <div
        className={cn(
          "relative h-full bg-(--apple-nav-scrim) backdrop-blur-[20px] backdrop-saturate-[1.8]",
          "transition-[background-color] duration-240 ease-kit motion-reduce:transition-none",
          "group-data-open/nav:bg-popover group-data-open/nav:backdrop-filter-none"
        )}
      >
        {/* Desktop */}
        <NavigationMenu
          aria-label="Main"
          value={value}
          onValueChange={(next, details) => {
            setValue(next)
            if (next === "search" && details.reason === "trigger-press") {
              requestAnimationFrame(() => searchInput.current?.focus())
            }
          }}
          delay={80}
          closeDelay={460}
          container={container}
          className="mx-auto hidden h-full max-w-(--apple-nav-content-width) px-[22px] min-[834px]:block"
        >
          <NavigationMenuList className="-mx-2 flex h-full items-stretch justify-between">
            <NavigationMenuItem>
              <NavigationMenuLink href={brandHref} aria-label={brandLabel} className={barLink}>
                {brand}
              </NavigationMenuLink>
            </NavigationMenuItem>
            {categories.map((item) => (
              <NavigationMenuItem key={item.label} value={item.label}>
                <NavigationMenuTrigger className={cn(barLink, "cursor-default")}>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent className="group/panel absolute start-0 top-0 w-full">
                  <FlyoutColumns groups={item.groups} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem value="search">
              <NavigationMenuTrigger aria-label="Search" className={cn(barLink, "cursor-default")}>
                <SearchIcon className="size-[15px]" />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="group/panel absolute start-0 top-0 w-full">
                <div className="mx-auto max-w-(--apple-nav-content-width) px-[22px] pt-8 pb-20">
                  <div style={{ "--d": "80ms" } as Delay} className={cn("-mx-1.5", flyoutItem("panel"))}>
                    <SearchField placeholder={searchPlaceholder} action={searchAction} inputRef={searchInput} />
                  </div>
                  <QuickLinks links={quickLinks} scope="panel" />
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {cartHref && (
              <NavigationMenuItem>
                <NavigationMenuLink href={cartHref} aria-label="Cart" className={barLink}>
                  <CartIcon className="h-4 w-3.5" />
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
          {/* One full-width panel under the bar that grows to the open category. */}
          <NavigationMenuViewport
            anchor={header}
            side="bottom"
            align="start"
            sideOffset={0}
            collisionPadding={0}
            className={cn(
              "h-(--viewport-height) max-h-[calc(100dvh-88px)] w-(--anchor-width) overflow-hidden bg-popover text-popover-foreground",
              "transition-[height] duration-240 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none"
            )}
          />
        </NavigationMenu>

        {/* Phone */}
        <Dialog open={menuOpen} onOpenChange={setMenuOpen} container={container}>
          <div className="flex h-full items-center ps-2 min-[834px]:hidden">
            <a href={brandHref} aria-label={brandLabel} className={cn(iconButton, "w-auto px-2")}>
              {brand}
            </a>
            <div className="ms-auto flex h-full pe-1">
              <DialogTrigger aria-label="Search" onClick={() => setMode("search")} className={iconButton}>
                <SearchIcon className="size-[17px]" />
              </DialogTrigger>
              {cartHref && (
                <a href={cartHref} aria-label="Cart" className={iconButton}>
                  <CartIcon className="h-[17px] w-[15px]" />
                </a>
              )}
              <DialogTrigger
                aria-label="Menu"
                onClick={() => {
                  setMode("menu")
                  setPanel(null)
                }}
                className={iconButton}
              >
                <MenuIcon />
              </DialogTrigger>
            </div>
          </div>
          <DialogBackdrop className="fixed inset-0 bg-accent/40 backdrop-blur-[20px] transition-opacity duration-320 ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
          <DialogContent
            className={cn(
              "group/menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-popover font-body text-popover-foreground outline-none",
              // Unrolls down from the bar and rolls back up into it.
              "[clip-path:inset(0)] transition-[clip-path] duration-[420ms] ease-kit motion-reduce:transition-none",
              "data-starting-style:[clip-path:inset(0_0_calc(100%-48px)_0)] data-ending-style:[clip-path:inset(0_0_calc(100%-48px)_0)]"
            )}
          >
            <DialogTitle className="sr-only">{mode === "search" ? "Search" : "Menu"}</DialogTitle>
            <div className="sticky top-0 z-10 flex h-12 items-center justify-between bg-popover ps-2 pe-1">
              {mode === "menu" && openCategory ? (
                <button
                  type="button"
                  aria-label="Back to menu"
                  onClick={() => setPanel(null)}
                  className={cn(iconButton, "starting:opacity-0")}
                >
                  <Chevron direction="left" />
                </button>
              ) : (
                <span />
              )}
              <DialogClose aria-label="Close" className={iconButton}>
                <MenuIcon morph />
              </DialogClose>
            </div>

            {mode === "search" ? (
              <div className="px-12 pt-1 pb-20">
                <div style={{ "--d": "200ms" } as Delay} className={flyoutItem("menu")}>
                  <SearchField placeholder={searchPlaceholder} action={searchAction} large />
                </div>
                <QuickLinks links={quickLinks} scope="menu" />
              </div>
            ) : (
              <div className="grid">
                {/* Category list. Leaves to the start when a category opens. */}
                <nav
                  aria-label="Main"
                  data-hidden={openCategory ? "" : undefined}
                  className={cn(
                    "[grid-area:1/1] pb-[84px]",
                    "transition-[opacity,translate] delay-160 duration-240 ease-kit motion-reduce:transition-none",
                    "data-hidden:invisible data-hidden:-translate-x-2 data-hidden:opacity-0 data-hidden:transition-none rtl:data-hidden:translate-x-2"
                  )}
                >
                  <ul>
                    {categories.map((item, i) => (
                      <li
                        key={item.label}
                        style={{ "--d": `${200 + i * 20}ms` } as Delay}
                        className={cn(flyoutItem("menu"), "duration-240")}
                      >
                        <button
                          type="button"
                          onClick={() => setPanel(item.label)}
                          className={cn(
                            "group/cat flex w-full items-center justify-between px-12 py-[7px] text-start font-display text-[28px] leading-8 font-semibold tracking-[.007em] text-foreground/90 outline-none",
                            "transition-colors duration-320 ease-kit hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
                          )}
                        >
                          {item.label}
                          <Chevron
                            direction="right"
                            className="-me-8 text-muted-foreground opacity-0 transition-opacity duration-240 ease-kit group-hover/cat:opacity-100 group-focus-visible/cat:opacity-100"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* The open category, sliding in from the end. */}
                {openCategory && (
                  <div
                    key={openCategory.label}
                    className={cn(
                      "[grid-area:1/1] px-12 pt-1",
                      "transition-[opacity,translate] delay-160 duration-240 ease-kit starting:translate-x-2 starting:opacity-0 motion-reduce:transition-none rtl:starting:-translate-x-2"
                    )}
                  >
                    {openCategory.groups.map((group, g) => (
                      <section
                        key={group.title}
                        aria-label={group.title}
                        className={g === openCategory.groups.length - 1 ? "pb-[92px]" : "pb-[52px]"}
                      >
                        {!group.featured && (
                          <h2 className="pb-3.5 text-[17px] leading-[1.4705882353] tracking-[-.022em] text-muted-foreground">
                            {group.title}
                          </h2>
                        )}
                        <ul>
                          {group.links.map((link) => (
                            <li key={link.label}>
                              <DialogClose
                                render={<a href={link.href} />}
                                className={cn(
                                  "-mx-[11px] inline-block rounded-kit-sm px-[11px] font-semibold text-foreground/90 outline-none transition-colors duration-240 ease-kit hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none",
                                  group.featured
                                    ? "py-[7.5px] font-display text-[28px] leading-8 tracking-[.007em]"
                                    : "py-[5px] text-[17px] leading-[1.4705882353] tracking-[-.022em]"
                                )}
                              >
                                {link.label}
                              </DialogClose>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
