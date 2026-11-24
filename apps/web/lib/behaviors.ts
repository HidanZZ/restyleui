/**
 * The 8 behaviors shared by every kit. One page per behavior lives under
 * /docs/behaviors/<slug>.
 *
 * Recipes are copied from docs/BEHAVIORS.md, the single reference for kit
 * authors, so the website and the document cannot drift apart.
 *
 * The slug and title list lives in `behavior-nav.ts`, a lightweight module the
 * client sidebar can import without pulling in the recipes below.
 */
import { BEHAVIOR_TITLES, type BehaviorSlug } from "@/lib/behavior-nav"

export { BEHAVIOR_SLUGS, type BehaviorSlug } from "@/lib/behavior-nav"

export type BehaviorPart = {
  /** Hook name or ui-sdk export. */
  name: string
  /** Import path, exactly as the recipe imports it. */
  path: string
  /** One line about what it handles. */
  role: string
}

export type BehaviorInstall = {
  label: string
  command: string
}

export type BehaviorSignature = {
  title: string
  code: string
}

export type BehaviorRecipe = {
  title: string
  code: string
}

export type Behavior = {
  slug: BehaviorSlug
  title: string
  /** One line for the index and meta descriptions. */
  description: string
  /** Paragraph under the page title. */
  summary: string
  /** Paragraphs under "What it does". Inline code goes in backticks. */
  how: string[]
  parts: BehaviorPart[]
  install: BehaviorInstall[]
  signatures: BehaviorSignature[]
  recipes: BehaviorRecipe[]
  /** Bullets under "Notes". Inline code goes in backticks. */
  notes: string[]
  /** Show the `@layer ui-sdk` setup note in the install section. */
  cssLayer?: boolean
}

const NAV_RECIPE = `"use client"

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
import { useState } from "react"
import type { NavbarProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"
import { useScrollState } from "@/registry/restyle/hooks/use-scroll-state"

export function Navbar({ brand, brandHref = "/", items, actions, className }: NavbarProps) {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrolled, direction } = useScrollState({ threshold: 16 })
  const hidden = direction === "down" && !menuOpen

  return (
    <header
      ref={kitRef}
      data-scrolled={scrolled || undefined}
      data-hidden={hidden || undefined}
      className={cn(
        "sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur",
        "transition-[translate,border-color] duration-300 ease-kit motion-reduce:transition-none",
        "data-scrolled:border-border data-hidden:-translate-y-full",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-kit items-center gap-8 px-gutter">
        <a href={brandHref} className="font-display text-lg">{brand}</a>

        {/* Desktop: hover or click dropdowns. */}
        <NavigationMenu aria-label="Main" container={container} className="relative hidden md:block">
          <NavigationMenuList className="flex items-center gap-1">
            {items.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.label} value={item.label}>
                  <NavigationMenuTrigger className="group flex h-9 items-center gap-1 rounded-kit-sm px-3 text-sm hover:bg-accent data-open:bg-accent">
                    {item.label}
                    <svg aria-hidden viewBox="0 0 16 16" className="size-3 transition-transform group-data-open:rotate-180 motion-reduce:transition-none">
                      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </NavigationMenuTrigger>
                  {/* Inside the viewport: absolute at its corner, own width, padding here. */}
                  <NavigationMenuContent className="absolute start-0 top-0 w-80 p-2 transition-[opacity,translate] duration-200 ease-kit data-starting-style:opacity-0 data-ending-style:opacity-0 data-[motion=from-end]:data-starting-style:translate-x-6 data-[motion=from-start]:data-starting-style:-translate-x-6 motion-reduce:transition-none">
                    <ul className="grid gap-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavigationMenuLink href={child.href} className="block rounded-kit-sm p-2 hover:bg-accent">
                            <span className="block text-sm font-medium">{child.label}</span>
                            {child.description && <span className="block text-xs text-muted-foreground">{child.description}</span>}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink href={item.href} className="flex h-9 items-center rounded-kit-sm px-3 text-sm hover:bg-accent">
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
          {/* Optional underline that slides under the open trigger. */}
          <NavigationMenuIndicator className="absolute bottom-(--active-item-bottom) left-(--active-item-left) h-0.5 w-(--active-item-width) bg-foreground opacity-0 transition-[left,width,opacity] duration-200 data-visible:opacity-100 motion-reduce:transition-none" />
          {/* One popup that resizes to the open panel. */}
          <NavigationMenuViewport
            sideOffset={8}
            className="h-(--viewport-height) w-(--viewport-width) overflow-hidden rounded-kit-lg border border-border bg-popover text-popover-foreground shadow-lg transition-[width,height,opacity,translate] duration-200 ease-kit data-starting-style:-translate-y-1 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none"
          />
        </NavigationMenu>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {actions?.map((action) => <a key={action.label} href={action.href}>{action.label}</a> /* use the kit Button */)}
        </div>

        {/* Mobile: side drawer. Modal: scroll lock, inert page, Escape, focus return. */}
        <Drawer side="right" open={menuOpen} onOpenChange={setMenuOpen} container={container}>
          <DrawerTrigger className="ml-auto md:hidden">Menu</DrawerTrigger>
          <DrawerBackdrop className="fixed inset-0 bg-black/40" />
          <DrawerContent className="flex h-dvh w-[min(88vw,22rem)] flex-col gap-4 overflow-y-auto bg-background p-5">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-display">Menu</DrawerTitle>
              <DrawerClose aria-label="Close menu">✕</DrawerClose>
            </div>
            <nav aria-label="Mobile">
              <Accordion className="divide-y divide-border">
                {items.map((item) =>
                  item.children ? (
                    <AccordionItem key={item.label} value={item.label}>
                      <AccordionHeader>
                        <AccordionTrigger className="flex w-full items-center justify-between py-3 text-left">{item.label}</AccordionTrigger>
                      </AccordionHeader>
                      <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
                        <ul className="grid gap-1 pb-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <DrawerClose render={<a href={child.href} />} className="block rounded-kit-sm p-2">
                                {child.label}
                              </DrawerClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionPanel>
                    </AccordionItem>
                  ) : (
                    <DrawerClose key={item.label} render={<a href={item.href} />} className="block py-3">
                      {item.label}
                    </DrawerClose>
                  )
                )}
              </Accordion>
            </nav>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  )
}`

const REVEAL_RECIPE = `"use client"

import { Children } from "react"
import type { RevealProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"

const motion = "transition duration-700 ease-kit delay-(--reveal-delay) motion-reduce:transition-none"

export function Reveal({ children, delay = 0, stagger = false, className }: RevealProps) {
  const { ref, visible, delayStyle } = useReveal({ delay, stagger: 90 })

  if (!stagger) {
    return (
      <div
        ref={ref}
        data-visible={visible || undefined}
        style={delayStyle()}
        className={cn(motion, "translate-y-6 opacity-0 data-visible:translate-y-0 data-visible:opacity-100", className)}
      >
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} data-visible={visible || undefined} className={cn("group", className)}>
      {Children.toArray(children).map((child, i) => (
        <div
          key={i}
          style={delayStyle(i)}
          className={cn(motion, "translate-y-6 opacity-0 group-data-visible:translate-y-0 group-data-visible:opacity-100")}
        >
          {child}
        </div>
      ))}
    </div>
  )
}`

const VIDEO_IN_VIEW_RECIPE = `"use client"

import type { Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"

function MediaVideo({ media, className }: { media: Extract<Media, { type: "video" }>; className?: string }) {
  // Destructure: the React Compiler lint treats \`video.ref\` on an object as a ref read during render.
  const { ref, playing, toggle } = useInViewVideo()
  return (
    <div className={cn("relative", className)}>
      <video
        ref={ref}
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        loop
        muted
        playsInline
        preload="metadata"
        className="size-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-3 right-3 rounded-full bg-background/80 px-3 py-1 text-xs"
      >
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  )
}

export function MediaView({ media, className }: { media: Media; className?: string }) {
  if (media.type === "video") return <MediaVideo media={media} className={className} />
  return <img src={media.src} alt={media.alt} width={media.width} height={media.height} className={cn("object-cover", className)} />
}`

const VIDEO_SCRUB_RECIPE = `"use client"

import { useRef } from "react"
import { useScrollProgress } from "@/registry/restyle/hooks/use-scroll-progress"

export function ScrubVideo({ src, poster, alt }: { src: string; poster?: string; alt: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const ref = useScrollProgress<HTMLElement>({
    range: "contain",
    onProgress: (p) => {
      const v = video.current
      if (v?.duration) v.currentTime = p * v.duration
    },
  })
  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 grid h-svh place-items-center">
        <video ref={video} src={src} poster={poster} aria-label={alt} muted playsInline preload="auto" className="w-full" />
        {/* CSS can follow the same value: */}
        <div className="absolute bottom-0 left-0 h-1 w-[calc(var(--scroll-progress,0)*100%)] bg-primary" />
      </div>
    </section>
  )
}`

const VIDEO_PARALLAX_RECIPE = `const ref = useScrollProgress({ reducedMotionValue: 0.5 })

<div ref={ref} className="relative overflow-hidden">
  <img
    src={src}
    alt=""
    className="translate-y-[calc((var(--scroll-progress,0.5)_-_0.5)_*_-120px)] scale-110"
  />
</div>`

const CAROUSEL_RECIPE = `"use client"

import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel"
import type { CarouselProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const KIT_INTERVAL = 5000 // the kit's default autoplay interval

export function Carousel({ items, label, autoplay = false, loop = false, className }: CarouselProps) {
  return (
    <CarouselRoot
      aria-label={label}
      loop={loop}
      defaultPlaying={autoplay !== false}
      interval={typeof autoplay === "number" ? autoplay : KIT_INTERVAL}
      className={cn("grid gap-4", className)}
    >
      <CarouselViewport className="rounded-kit-lg [scrollbar-width:none]">
        {/* Gap on the content; take it out of each basis. */}
        <CarouselContent className="flex gap-4">
          {items.map((item, i) => (
            <CarouselItem key={i} className="min-w-0 basis-full md:basis-[calc((100%-1rem)/2)]">
              {item}
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div className="flex items-center justify-between gap-4">
        <CarouselIndicatorGroup className="flex gap-2">
          {items.map((_, i) => (
            <CarouselIndicator key={i} aria-label={\`Slide \${i + 1}\`} className="size-2 rounded-full bg-muted data-selected:bg-foreground" />
          ))}
        </CarouselIndicatorGroup>
        <div className="flex gap-2">
          {autoplay !== false && (
            <CarouselPlayToggle className="h-9 px-3">{(state) => (state.playing ? "Pause" : "Play")}</CarouselPlayToggle>
          )}
          <CarouselPrevious aria-label="Previous slide" className="size-9 data-disabled:opacity-40">‹</CarouselPrevious>
          <CarouselNext aria-label="Next slide" className="size-9 data-disabled:opacity-40">›</CarouselNext>
        </div>
      </div>
    </CarouselRoot>
  )
}`

const MARQUEE_RECIPE = `"use client"

import type { MarqueeProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"

export function Marquee({ children, speed = 40, direction = "left", pauseOnHover = true, className }: MarqueeProps) {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed, direction, pauseOnHover })
  return (
    <div
      ref={rootRef}
      className={cn(
        moving ? "overflow-hidden" : "overflow-x-auto",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div ref={trackRef} className="flex w-max">
        {Array.from({ length: copies }, (_, i) => (
          // The gap lives inside each copy (pr-*), so one copy width is one loop.
          <div key={i} aria-hidden={i > 0 || undefined} inert={i > 0} className="flex shrink-0 items-center gap-12 pr-12">
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}`

const TABS_RECIPE = `"use client"

import { Tabs as TabsRoot, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import type { TabsProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

export function Tabs({ items, defaultValue, className }: TabsProps) {
  return (
    <TabsRoot defaultValue={defaultValue ?? items[0]?.id} className={cn("grid gap-6", className)}>
      <TabsList aria-label="Sections" className="relative inline-flex w-fit rounded-full bg-muted p-1">
        {items.map((item) => (
          <TabsTab
            key={item.id}
            value={item.id}
            className="relative z-10 rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors data-selected:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator className="absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-full bg-background shadow-sm transition-[left,width] duration-300 ease-kit data-[activation-direction=none]:transition-none motion-reduce:transition-none" />
      </TabsList>
      {/* Panels share one grid cell so the old one can fade out over the new one. */}
      <div className="grid">
        {items.map((item) => (
          <TabsPanel
            key={item.id}
            value={item.id}
            className="[grid-area:1/1] transition-[opacity,translate] duration-300 ease-kit data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none"
          >
            {item.content}
          </TabsPanel>
        ))}
      </div>
    </TabsRoot>
  )
}`

const TILT_RECIPE = `"use client"

import type { CardProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useTilt } from "@/registry/restyle/hooks/use-tilt"

export function Card({ title, description, eyebrow, media, href, children, className }: CardProps) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 6 })
  const Root = href ? "a" : "div"
  return (
    <div className={cn("[perspective:1000px]", className)}>
      <div
        ref={tiltRef}
        className="relative h-full [transform:rotateX(var(--tilt-x))_rotateY(var(--tilt-y))] [transform-style:preserve-3d]"
      >
        <Root href={href} className="relative flex h-full flex-col gap-3 overflow-hidden rounded-kit-lg border border-border bg-card p-6 text-card-foreground">
          {media?.type === "image" && <img src={media.src} alt={media.alt} className="rounded-kit" />}
          {eyebrow && <span className="text-xs uppercase text-muted-foreground">{eyebrow}</span>}
          <h3 className="font-display text-xl">{title}</h3>
          {description && <p className="text-muted-foreground">{description}</p>}
          {children}
          {/* Pointer-follow glare. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--pointer-x)_var(--pointer-y),rgb(255_255_255/0.18),transparent_55%)] opacity-(--tilt-active)"
          />
        </Root>
      </div>
    </div>
  )
}`

const COUNT_UP_RECIPE = `"use client"

import type { CountUpProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useCountUp } from "@/registry/restyle/hooks/use-count-up"

export function CountUp({ value, from = 0, duration = 1600, format, prefix, suffix, className }: CountUpProps) {
  const { ref, text, final } = useCountUp({ value, from, duration, format })
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span aria-hidden>
        {prefix}
        {text}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {final}
        {suffix}
      </span>
    </span>
  )
}`

const DIALOG_RECIPE = `"use client"

import {
  Dialog as DialogRoot,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import type { DialogProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"

export function Dialog({ trigger, title, description, children, open, onOpenChange, className }: DialogProps) {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} container={container}>
      <DialogTrigger ref={kitRef} className="inline-flex h-10 items-center rounded-kit bg-primary px-4 text-primary-foreground">
        {trigger}
      </DialogTrigger>
      <DialogBackdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
      <DialogContent
        className={cn(
          // Centered: fixed, inset-0 plus m-auto and h-fit.
          "fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100%-2rem))] flex-col gap-4 overflow-y-auto",
          "rounded-kit-lg border border-border bg-popover p-6 text-popover-foreground shadow-xl",
          "transition-[opacity,scale] duration-200 ease-kit data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none",
          className
        )}
      >
        <DialogTitle className="font-display text-xl">{title}</DialogTitle>
        {description && <DialogDescription className="text-muted-foreground">{description}</DialogDescription>}
        {children}
        <DialogClose aria-label="Close" className="absolute right-4 top-4">✕</DialogClose>
      </DialogContent>
    </DialogRoot>
  )
}`

const OVERLAY_PATTERN = `const [kitRef, container] = useKitPortal<HTMLButtonElement>()

<Dialog container={container}>
  <DialogTrigger ref={kitRef}>Open</DialogTrigger>
  ...
</Dialog>`

export const BEHAVIORS: Behavior[] = [
  {
    slug: "nav",
    title: BEHAVIOR_TITLES.nav,
    description: "Desktop dropdowns, a mobile drawer with scroll lock, and a header that hides on scroll.",
    summary:
      "A header that works on every screen: hover and click dropdowns on desktop, a full-height drawer below the breakpoint, and a bar that reacts to scroll.",
    how: [
      "`NavigationMenu` gives hover and click dropdowns with the disclosure pattern. Tab and the arrow keys move through items, Escape closes, a link press closes, and focus returns to the trigger.",
      "Below the desktop breakpoint the same links move into a `Drawer` from the side. It is modal, so the page behind it is inert and scroll is locked. Escape, the backdrop and a swipe close it, and focus returns to the Menu button. Nested groups inside the drawer are an `Accordion`.",
      "`useScrollState` returns `scrolled` and `direction`. Use `scrolled` for a border or blur, and `direction` to hide the bar on the way down. Keep the bar shown while the drawer is open.",
    ],
    parts: [
      {
        name: "NavigationMenu",
        path: "@ui-sdk/react/navigation-menu",
        role: "Desktop dropdowns with one resizing viewport, keyboard support and focus return.",
      },
      {
        name: "Drawer",
        path: "@ui-sdk/react/drawer",
        role: "Mobile menu that locks scroll, traps focus and closes on Escape, backdrop or swipe.",
      },
      {
        name: "Accordion",
        path: "@ui-sdk/react/accordion",
        role: "Nested groups inside the drawer.",
      },
      {
        name: "useScrollState",
        path: "@/registry/restyle/hooks/use-scroll-state",
        role: "`scrolled` past a threshold, plus scroll `direction`.",
      },
      {
        name: "useKitPortal",
        path: "@/registry/restyle/hooks/use-kit-portal",
        role: "Container inside the closest `[data-kit]`, passed to the drawer.",
      },
    ],
    install: [
      { label: "UI parts", command: "npm install @ui-sdk/react" },
      { label: "Scroll state hook", command: "npx shadcn@latest add @restyleui/use-scroll-state" },
      { label: "Kit portal hook", command: "npx shadcn@latest add @restyleui/use-kit-portal" },
    ],
    signatures: [
      {
        title: "useScrollState",
        code: `useScrollState(options?: { threshold?: number; tolerance?: number }): {
  scrolled: boolean
  direction: "up" | "down"
}

// threshold: px from the top before scrolled is true. Default 8.
// tolerance: px of travel before the direction changes. Default 6.`,
      },
      {
        title: "useKitPortal",
        code: `useKitPortal<T extends Element = HTMLElement>(): [
  ref: (node: T | null) => void,
  container: HTMLElement | null,
]`,
      },
    ],
    recipes: [{ title: "Navbar component", code: NAV_RECIPE }],
    notes: [
      "`NavigationMenu` opens on hover after 50 ms by default. `openOnHover={false}` makes it click only. `delay` and `closeDelay` tune it.",
      "Leave the drawer's translate and the backdrop's opacity to ui-sdk. It animates them, and fades instead with reduced motion. Style size, surface and corners only. `side` can be `\"left\"`, `\"right\"`, `\"top\"` or `\"bottom\"`.",
      "For a full-width mega menu, anchor the viewport to the header with `<NavigationMenuViewport anchor={headerElement} align=\"start\" />`, or leave the viewport out and style each `NavigationMenuContent` as its own popup.",
      "Near the top of the page `useScrollState` always reports direction up, so a hiding navbar shows again.",
    ],
  },
  {
    slug: "reveal",
    title: BEHAVIOR_TITLES.reveal,
    description: "Content fades and lifts into place when it enters the viewport, with staggered delays.",
    summary:
      "Entrance animation for any element: a fade and a short lift when content scrolls into view, optionally one child after another.",
    how: [
      "`useReveal` watches one element with an IntersectionObserver and returns `visible` and a `ref`. With `once` on, the default, the element stays visible after its first entrance.",
      "The hidden state is in the server HTML, so keep it cheap: opacity and translate only. Add `data-visible` and style the end state with it. For a group, put `delayStyle(index)` on each child and use `delay-(--reveal-delay)` for the transition delay.",
    ],
    parts: [
      {
        name: "useReveal",
        path: "@/registry/restyle/hooks/use-reveal",
        role: "In-view flag plus stagger delays for entrances.",
      },
    ],
    install: [{ label: "Reveal hook", command: "npx shadcn@latest add @restyleui/use-reveal" }],
    signatures: [
      {
        title: "useReveal",
        code: `useReveal<T extends Element = HTMLDivElement>(options?: {
  once?: boolean        // default true
  threshold?: number    // default 0.15
  rootMargin?: string   // default "0px 0px -10% 0px"
  delay?: number        // ms before the first item, default 0
  stagger?: number      // ms between items, default 80
}): {
  ref: (node: T | null) => void
  visible: boolean
  delayStyle: (index?: number) => React.CSSProperties
}`,
      },
    ],
    recipes: [{ title: "Reveal component", code: REVEAL_RECIPE }],
    notes: [
      "With keyframes instead of a transition, use `[animation-delay:var(--reveal-delay)]` and start the animation under `data-visible:`.",
      "With `motion` instead of CSS: `animate={visible ? \"shown\" : \"hidden\"}` and `transition={{ delay: (delay + i * 90) / 1000 }}`.",
      "The hidden state is in the server HTML, so content above the fold appears right after hydration. Do not wrap the hero headline in a long delay.",
      "`use-reveal` lists `use-reduced-motion` as a registry dependency, so the shadcn CLI installs both.",
    ],
  },
  {
    slug: "video",
    title: BEHAVIOR_TITLES.video,
    description: "Video that plays only in view, plus scroll scrubbing and parallax from one progress value.",
    summary:
      "Three media behaviors from two hooks: a loop that plays only while it is on screen, a video that seeks with the scroll, and a layer that moves against the scroll.",
    how: [
      "`useInViewVideo` plays a muted loop only while the video is in view and the tab is visible. A user pause sticks. With reduced motion it does not autoplay; the poster shows, and the toggle still plays.",
      "`useScrollProgress` reports a 0 to 1 progress value without re-rendering. It writes `--scroll-progress` on the element and can also call `onProgress`, which is how a scroll-scrubbed video seeks.",
      "With `range: \"contain\"` on a tall section and a sticky child, 0 is the section top at the viewport top and 1 is its bottom at the viewport bottom. The default `range: \"cover\"` tracks the element through the viewport, for parallax.",
    ],
    parts: [
      {
        name: "useInViewVideo",
        path: "@/registry/restyle/hooks/use-in-view-video",
        role: "Plays a muted loop in view, pauses out of view, user toggle.",
      },
      {
        name: "useScrollProgress",
        path: "@/registry/restyle/hooks/use-scroll-progress",
        role: "0..1 progress through the viewport as a CSS variable and a callback.",
      },
    ],
    install: [
      { label: "In-view video hook", command: "npx shadcn@latest add @restyleui/use-in-view-video" },
      { label: "Scroll progress hook", command: "npx shadcn@latest add @restyleui/use-scroll-progress" },
    ],
    signatures: [
      {
        title: "useInViewVideo",
        code: `useInViewVideo(options?: { threshold?: number; rootMargin?: string }): {
  ref: (node: HTMLVideoElement | null) => void
  playing: boolean
  toggle: () => void
}

// threshold: share of the video in view before it plays. Default 0.25.`,
      },
      {
        title: "useScrollProgress",
        code: `useScrollProgress<T extends HTMLElement = HTMLDivElement>(options?: {
  range?: "cover" | "contain"
  cssVar?: string | false              // default "--scroll-progress"
  onProgress?: (progress: number) => void
  reducedMotionValue?: number | null   // default 1
}): (node: T | null) => void`,
      },
    ],
    recipes: [
      { title: "Video that plays in view", code: VIDEO_IN_VIEW_RECIPE },
      { title: "Scroll-scrubbed video", code: VIDEO_SCRUB_RECIPE },
      { title: "Parallax layer", code: VIDEO_PARALLAX_RECIPE },
    ],
    notes: [
      "Videos longer than 5 seconds need a visible pause control (WCAG 2.2.2), so render the toggle.",
      "Encode scrub videos with frequent keyframes, for example `ffmpeg -g 5`, so seeking is smooth.",
      "With reduced motion the hook stops tracking and reports `reducedMotionValue` once. The default `1` shows the last frame. Pass `null` for things that must keep tracking, like a reading progress bar, and `0.5` for parallax so the layer stays neutral.",
    ],
  },
  {
    slug: "carousel-marquee",
    title: BEHAVIOR_TITLES["carousel-marquee"],
    description: "Swipeable slides with autoplay, and an endless row that pauses on hover.",
    summary:
      "Two ways to move a row sideways: a carousel with snap, controls, dots and optional autoplay, and a marquee that loops forever at a set speed.",
    how: [
      "ui-sdk `Carousel` handles native scroll snap, swipe and mouse drag, Previous and Next, dots, `loop` and autoplay. Autoplay pauses on hover, on focus inside, while the tab is hidden and while off screen. A manual page stops it, and it never starts on its own with reduced motion.",
      "`useMarquee` measures one copy of the content, returns how many copies fill the row, and scrolls the track with the Web Animations API at `speed` px/s. It pauses on hover and focus, and while off screen. With reduced motion it stops and leaves one copy you can scroll by hand.",
    ],
    parts: [
      {
        name: "Carousel",
        path: "@ui-sdk/react/carousel",
        role: "Viewport, slides, Previous and Next, dots, play toggle and autoplay.",
      },
      {
        name: "useMarquee",
        path: "@/registry/restyle/hooks/use-marquee",
        role: "Copy count and an endless loop at a set speed.",
      },
    ],
    install: [
      { label: "UI parts", command: "npm install @ui-sdk/react" },
      { label: "Marquee hook", command: "npx shadcn@latest add @restyleui/use-marquee" },
    ],
    signatures: [
      {
        title: "useMarquee",
        code: `useMarquee(options?: {
  speed?: number                  // px per second, default 40
  direction?: "left" | "right"    // default "left"
  pauseOnHover?: boolean          // default true
}): {
  rootRef: (node: HTMLElement | null) => void
  trackRef: (node: HTMLElement | null) => void
  copies: number
  moving: boolean
}`,
      },
    ],
    recipes: [
      { title: "Carousel component", code: CAROUSEL_RECIPE },
      { title: "Marquee component", code: MARQUEE_RECIPE },
    ],
    notes: [
      "State attributes: `data-active` and `data-in-view` on slides, `data-selected` on indicators, `data-disabled` on Previous and Next at the ends, `data-playing` and `data-paused` on the root.",
      "`--carousel-progress` (0..1) on the root follows the scroll every frame, for a progress bar in CSS. `--carousel-interval` times an autoplay progress animation; pause it with `data-paused:`.",
      "`slidesPerPage=\"auto\"` pages by what fits, `align` sets snap alignment, and `dragFree` lets swipes coast.",
      "In a marquee, the gap lives inside each copy with `pr-*`, so one copy width is one loop. Do not put `gap` on the track or animate the track yourself; the hook owns its transform.",
    ],
  },
  {
    slug: "tabs",
    title: BEHAVIOR_TITLES.tabs,
    description: "Panels that switch with arrow keys and a pill that slides to the active tab.",
    summary:
      "Animated tabs with full keyboard support. The indicator is measured for you and moves with a transition between tabs.",
    how: [
      "ui-sdk `Tabs` handles roles, arrow keys, Home and End, and the panel state. `TabsIndicator` measures the selected tab and writes `--active-tab-left`, `--active-tab-top`, `--active-tab-width` and `--active-tab-height`.",
      "Put the indicator last inside a `relative` `TabsList` and transition those properties. Skip the transition while `data-activation-direction=\"none\"`, so the first placement does not animate.",
    ],
    parts: [
      {
        name: "Tabs",
        path: "@ui-sdk/react/tabs",
        role: "Root state, keyboard handling and the panels.",
      },
      {
        name: "TabsList, TabsTab, TabsPanel",
        path: "@ui-sdk/react/tabs",
        role: "The list, each trigger and each panel.",
      },
      {
        name: "TabsIndicator",
        path: "@ui-sdk/react/tabs",
        role: "Measures the selected tab into CSS variables for the moving pill.",
      },
    ],
    install: [{ label: "UI parts", command: "npm install @ui-sdk/react" }],
    signatures: [
      {
        title: "Parts",
        code: `<Tabs defaultValue="plan">
  <TabsList>
    <TabsTab value="plan">Plan</TabsTab>
    <TabsTab value="build">Build</TabsTab>
    <TabsIndicator /> {/* last, inside a relative TabsList */}
  </TabsList>
  <TabsPanel value="plan">...</TabsPanel>
  <TabsPanel value="build">...</TabsPanel>
</Tabs>`,
      },
    ],
    recipes: [{ title: "Tabs component", code: TABS_RECIPE }],
    notes: [
      "For an underline, use `bottom-0 h-0.5` with `left-(--active-tab-left) w-(--active-tab-width)` instead of a pill.",
      "Slide panels by direction with `data-[activation-direction=right]:data-starting-style:translate-x-4` and `data-[activation-direction=left]:data-starting-style:-translate-x-4`.",
      "For a vertical list, set `orientation=\"vertical\"` and transition `top,height`.",
      "`FeatureTabs` uses the same parts. Put the tab media inside the panels.",
    ],
  },
  {
    slug: "tilt",
    title: BEHAVIOR_TITLES.tilt,
    description: "A card that leans toward the pointer, with a glare that follows it.",
    summary:
      "Pointer tilt and follow with one hook. The hook writes CSS variables every frame, and your classes decide what moves.",
    how: [
      "`useTilt` leans the element toward the pointer and eases it back when the pointer leaves. It never re-renders: it writes four CSS variables on the element, and children inherit them.",
      "Mouse and pen only. Touch input, devices without hover and reduced motion leave the variables at rest, so the card simply sits still.",
    ],
    parts: [
      {
        name: "useTilt",
        path: "@/registry/restyle/hooks/use-tilt",
        role: "Tilt and pointer-follow CSS variables, written per frame.",
      },
    ],
    install: [{ label: "Tilt hook", command: "npx shadcn@latest add @restyleui/use-tilt" }],
    signatures: [
      {
        title: "useTilt",
        code: `useTilt<T extends HTMLElement = HTMLDivElement>(options?: {
  max?: number      // max rotation in deg, default 8
  ease?: number     // share of the distance covered per frame, 0..1, default 0.12
}): (node: T | null) => void`,
      },
    ],
    recipes: [{ title: "Tilt card", code: TILT_RECIPE }],
    notes: [
      "Options: `max` in degrees (default 8) and `ease`, the share of the distance covered per frame (default 0.12; lower is softer).",
      "For a spotlight without tilt, read only `--pointer-x`, `--pointer-y` and `--tilt-active`, and pass `max: 0`.",
      "Put `[perspective:1000px]` on the parent. Without perspective the rotation looks flat.",
    ],
  },
  {
    slug: "count-up",
    title: BEHAVIOR_TITLES["count-up"],
    description: "Numbers that count to their value once, when they scroll into view.",
    summary:
      "A number that animates from a start value to its real value when it enters the viewport. The real value is in the server HTML and in the accessible name.",
    how: [
      "`useCountUp` renders the final value on the server, on the first client render and with reduced motion. After hydration it counts once, eased, when the element enters the viewport.",
      "Formatting uses `Intl.NumberFormat` with locale `en-US` by default, so server and browser agree. Render `text` for sighted users with `aria-hidden`, and `final` in a visually hidden element so screen readers read the number once.",
    ],
    parts: [
      {
        name: "useCountUp",
        path: "@/registry/restyle/hooks/use-count-up",
        role: "Eased, formatted count from `from` to `value` on view.",
      },
    ],
    install: [{ label: "Count-up hook", command: "npx shadcn@latest add @restyleui/use-count-up" }],
    signatures: [
      {
        title: "useCountUp",
        code: `useCountUp<T extends Element = HTMLSpanElement>(options: {
  value: number
  from?: number                        // default 0
  duration?: number                    // ms, default 1600
  format?: Intl.NumberFormatOptions
  locale?: string                      // default "en-US"
  easing?: (t: number) => number       // default ease-out expo
}): { ref: (node: T | null) => void; text: string; final: string }`,
      },
    ],
    recipes: [{ title: "CountUp component", code: COUNT_UP_RECIPE }],
    notes: [
      "`tabular-nums` stops the width from jumping while the digits change.",
      "Pass `easing` for the kit's motion feel, for example `(t) => 1 - Math.pow(1 - t, 3)`.",
      "Without fraction digits in `format`, it shows as many decimals as `value` has.",
      "An odometer can use `text` as the target string and animate each digit column itself.",
    ],
  },
  {
    slug: "overlay",
    title: BEHAVIOR_TITLES.overlay,
    description: "A modal dialog with focus return, scroll lock, Escape, and kit tokens inside.",
    summary:
      "Modal overlays that keep the page inert, lock scroll, close on Escape and return focus to the trigger. The kit container keeps the tokens inside the popup.",
    how: [
      "ui-sdk `Dialog` is modal by default. The page is inert and does not scroll, Tab stays inside, Escape and a backdrop press close it, and focus returns to the trigger. Content and backdrop expose `data-starting-style` and `data-ending-style` for enter and exit transitions, and stay mounted until the exit finishes.",
      "Kit tokens are CSS variables on the element with `[data-kit]`. Popups render in the top layer, so they stay inside the kit, but a browser without a top layer falls back to a portal at `document.body`. `useKitPortal` returns the closest `[data-kit]` element. Pass it as `container` and the popup always keeps the tokens.",
    ],
    parts: [
      {
        name: "Dialog",
        path: "@ui-sdk/react/dialog",
        role: "Modal dialog with focus trap, scroll lock, Escape and focus return.",
      },
      {
        name: "Drawer",
        path: "@ui-sdk/react/drawer",
        role: "The same behavior as a side sheet, for specs, carts and mobile menus.",
      },
      {
        name: "useKitPortal",
        path: "@/registry/restyle/hooks/use-kit-portal",
        role: "Container inside the closest `[data-kit]`, passed to the root.",
      },
    ],
    install: [
      { label: "UI parts", command: "npm install @ui-sdk/react" },
      { label: "Kit portal hook", command: "npx shadcn@latest add @restyleui/use-kit-portal" },
    ],
    signatures: [
      {
        title: "useKitPortal",
        code: `useKitPortal<T extends Element = HTMLElement>(): [
  ref: (node: T | null) => void,
  container: HTMLElement | null,
]`,
      },
    ],
    recipes: [
      { title: "Dialog component", code: DIALOG_RECIPE },
      { title: "Portal pattern", code: OVERLAY_PATTERN },
    ],
    notes: [
      "`open` and `onOpenChange` pass straight through. An undefined `open` leaves it uncontrolled. ui-sdk calls `onOpenChange(open, details)`, which fits `(open) => void`.",
      "A side sheet is the same with `Drawer`, `DrawerBackdrop` and `DrawerContent` (`side=\"right\"`), and the same `container`.",
      "`DialogContent` `initialFocus` picks the first focused element (default: first focusable). `finalFocus` overrides the return target.",
      "To check the portal in a browser, open the dialog and run `document.querySelector('[data-slot=\"dialog-content\"]').closest(\"[data-kit]\")`. It returns the kit element. The demo shows this as a probe inside the dialog.",
    ],
    cssLayer: true,
  },
]

export function getBehavior(slug: string): Behavior | undefined {
  return BEHAVIORS.find((behavior) => behavior.slug === slug)
}
