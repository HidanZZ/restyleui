# Restyle UI behaviors

Every kit builds its interactive and moving pieces from the same 8 behaviors. This file is the only reference a kit component author needs: which hook or ui-sdk part to use, and a complete recipe for each common component that uses it.

Live demos of everything below: `/docs/behaviors` on the website.

## Rules

- Interaction-heavy parts come from `@ui-sdk/react` (one entry per component, for example `@ui-sdk/react/dialog`). They handle ARIA, focus, keyboard, Escape, outside press and scroll lock. Do not rebuild them.
- Motion and scroll come from our hooks in `@/registry/restyle/hooks/`. Each file starts with a doc comment with its full signature.
- Hooks and ui-sdk parts are unstyled. Style with the kit's token utilities (`bg-background`, `ease-kit`, `rounded-kit`, ...) and ui-sdk's `data-*` state attributes, which Tailwind reads as variants: `data-open:`, `data-selected:`, `data-starting-style:`, `data-ending-style:`, `data-[side=right]:`.
- Every file that uses a hook or a ui-sdk part starts with `"use client"`.
- Reduced motion: the hooks already show the end state (visible, final number, static marquee, no tilt, no autoplay). Still add `motion-reduce:transition-none` (or `motion-reduce:animate-none`) to every transition and animation you write.
- Never read `window` or `document` during render. The hooks are SSR-safe.

### The `@layer ui-sdk` line

ui-sdk injects a little CSS at runtime in a cascade layer named `ui-sdk` (for example, it resets the browser's popover padding, border, background and size on popup content, and hides closed parts). Your Tailwind classes must win over it. ui-sdk inserts its styles ahead of the page's stylesheets, so its layer comes first and has the lowest priority; this was checked on the dev page, where `p-6` and `bg-*` on `DialogContent` and `NavigationMenuViewport` apply. ui-sdk's docs still ask for the layer to be declared at the top of the global stylesheet, which makes the order explicit for every bundler:

```css
@layer ui-sdk;

@import "tailwindcss";
```

The installation docs should tell users to add this line.

### Hooks

| Hook | File | What it does |
|---|---|---|
| `useKitPortal` | `use-kit-portal.ts` | Container inside the closest `[data-kit]` for overlays |
| `useScrollState` | `use-scroll-state.ts` | `scrolled` past a threshold and scroll `direction` |
| `useReveal` | `use-reveal.ts` | In-view flag plus stagger delays for entrances |
| `useInViewVideo` | `use-in-view-video.ts` | Play muted video in view, pause out of view, user toggle |
| `useScrollProgress` | `use-scroll-progress.ts` | 0..1 progress through the viewport, as a CSS variable and a callback |
| `useMarquee` | `use-marquee.ts` | Copy count and endless WAAPI scroll at px/s |
| `useTilt` | `use-tilt.ts` | Tilt and pointer-follow CSS variables |
| `useCountUp` | `use-count-up.ts` | Eased, formatted count from `from` to `value` on view |
| `useReducedMotion` | `use-reduced-motion.ts` | Live `prefers-reduced-motion` flag (used by the hooks above) |

Import paths are always `@/registry/restyle/hooks/<file name without .ts>`.

### Behavior map

| # | Behavior | Build it with |
|---|---|---|
| 1 | Responsive nav | ui-sdk `NavigationMenu` (desktop dropdowns), `Drawer` (mobile menu, scroll lock, Escape, focus return), `Accordion` (nested items in the drawer), `useScrollState`, `useKitPortal` |
| 2 | Scroll reveal and staged entrance | `useReveal` |
| 3 | Video in view, scroll scrub, parallax | `useInViewVideo`, `useScrollProgress` |
| 4 | Carousel and marquee | ui-sdk `Carousel` (snap, prev/next, dots, swipe and drag, loop, autoplay that pauses on hover, focus, hidden tab and off screen), `useMarquee` |
| 5 | Animated tabs | ui-sdk `Tabs` with `TabsIndicator` (CSS variables `--active-tab-*`) |
| 6 | Pointer tilt and follow | `useTilt` |
| 7 | Count-up numbers | `useCountUp` |
| 8 | Overlay and dialog with focus return | ui-sdk `Dialog` (and `Drawer`), `useKitPortal` |

No extra hooks are needed for scroll lock (modal `Dialog` and `Drawer` lock scrolling), carousel autoplay (`Carousel` has `defaultPlaying` and `interval`) or the tab indicator (`TabsIndicator` measures for you).

## Overlays stay inside `[data-kit]`

Kit tokens are CSS variables on the element with `data-kit` (the user's `<html>`, or a preview frame on our website). An overlay outside that element loses every token.

ui-sdk popups (`Dialog`, `Drawer`, `Popover`, `NavigationMenu` panels) render in place and use the browser's top layer, so they are inside the kit already. But when a browser has no top layer, ui-sdk falls back to a portal at `document.body`. `useKitPortal` returns the closest `[data-kit]` element (or `<body>` when the kit is on `<html>`); pass it as `container` and the popup always lives inside the kit.

The pattern, the same in every overlay:

```tsx
const [kitRef, container] = useKitPortal<HTMLButtonElement>()

<Dialog container={container}>
  <DialogTrigger ref={kitRef}>Open</DialogTrigger>
  ...
</Dialog>
```

- Put `kitRef` on any element that is always rendered inside the component: the trigger, or the root (`<header ref={kitRef}>`).
- `container` is `null` on the server and on the first render; the popup then renders in place, which is still inside the kit.
- `NavigationMenu` takes `container` on the root. `Dialog` and `Drawer` take it on the root (or on the content part).
- Overlay surfaces use the popover tokens: `bg-popover text-popover-foreground`, and `rounded-kit-lg`, `border-border`.

## 1. Responsive nav

`NavigationMenu` gives hover and click dropdowns with the disclosure pattern (Tab, arrows, Escape, focus return, close on link press). The mobile menu is a `Drawer` from the side: modal, so the page is inert and scroll is locked; Escape, the backdrop and a swipe close it; focus returns to the Menu button. Nested items in the drawer are an `Accordion`. Links in the drawer are `DrawerClose` rendered as `<a>`, so a press navigates and closes.

`useScrollState` gives `scrolled` (show a border or blur) and `direction` (hide on scroll down). Keep the header shown while the drawer is open.

```tsx
"use client"

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
}
```

Notes:

- `NavigationMenu` opens on hover after 50 ms by default. `openOnHover={false}` makes it click only; `delay` and `closeDelay` tune it.
- Leave the drawer's `translate` and the backdrop's opacity to ui-sdk; it animates them (and fades instead with reduced motion). Style size, surface and corners only. `side` can be `"left"`, `"right"`, `"top"` (a menu that drops from the header) or `"bottom"`.
- For a full-width mega menu, anchor the viewport to the header: `<NavigationMenuViewport anchor={headerElement} align="start" />`, or leave the viewport out and style each `NavigationMenuContent` as its own popup.
- `useScrollState` options: `threshold` (px before `scrolled`, default 8), `tolerance` (px of travel before the direction flips, default 6).

## 2. Scroll reveal and staged entrance

`useReveal` observes the element and returns `visible` (once by default), and `delayStyle(index)` which sets `--reveal-delay` to `delay + index * stagger` ms. Style the hidden state with `opacity` and `translate` only, and the visible state with the `data-visible` attribute. `delay-(--reveal-delay)` applies the delay to the transition.

Contract component, `reveal.tsx`:

```tsx
"use client"

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
}
```

- Options: `once` (default true), `threshold` (0.15), `rootMargin` ("0px 0px -10% 0px"), `delay` (0), `stagger` (80 ms).
- With keyframes instead of a transition, use `[animation-delay:var(--reveal-delay)]` and start the animation under `data-visible:`.
- With `motion` instead of CSS: `animate={visible ? "shown" : "hidden"}` and `transition={{ delay: (delay + i * 90) / 1000 }}`.
- The hidden state is in the server HTML, so content above the fold appears right after hydration. Do not wrap the hero headline in a long delay.

## 3. Video in view, scroll scrub, parallax

### Video media (plays in view)

`useInViewVideo` plays a muted loop only while it is in view and the tab is visible. With reduced motion it does not autoplay; the poster shows and the toggle still plays it. A user pause sticks. Videos longer than 5 seconds need a visible pause control (WCAG 2.2.2), so render `toggle`.

Shared media renderer inside a kit component (Hero, Card, FeatureTabs), for the contract `Media` type:

```tsx
"use client"

import type { Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"

function MediaVideo({ media, className }: { media: Extract<Media, { type: "video" }>; className?: string }) {
  // Destructure: the React Compiler lint treats `video.ref` on an object as a ref read during render.
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
}
```

Options: `threshold` (share in view before it plays, default 0.25), `rootMargin`.

### Scroll-scrubbed video

`useScrollProgress` reports 0..1 progress. It never re-renders: it writes `--scroll-progress` on the element and calls `onProgress`. With `range: "contain"` on a tall section with a sticky child, 0 is when the section top reaches the viewport top and 1 when its bottom reaches the viewport bottom.

```tsx
"use client"

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
}
```

- Encode scrub videos with frequent keyframes (for example `ffmpeg -g 5`) so seeking is smooth.
- With reduced motion the hook stops tracking and reports `reducedMotionValue` once (default `1`, the last frame). Pass `reducedMotionValue: null` for things that must keep tracking, like a reading progress bar.

### Parallax

Default `range: "cover"`: 0 when the element enters at the bottom, 1 when it leaves at the top, 0.5 when centered. Map it in CSS; use underscores for spaces in arbitrary values.

```tsx
const ref = useScrollProgress({ reducedMotionValue: 0.5 })

<div ref={ref} className="relative overflow-hidden">
  <img
    src={src}
    alt=""
    className="translate-y-[calc((var(--scroll-progress,0.5)_-_0.5)_*_-120px)] scale-110"
  />
</div>
```

`reducedMotionValue: 0.5` keeps the layer at its neutral position for people who ask for less motion.

## 4. Carousel and marquee

### Carousel

ui-sdk `Carousel` covers native scroll snap, Previous and Next, indicators (dots), swipe and mouse drag, `loop`, and autoplay. Autoplay (`defaultPlaying`, `interval`) pauses on hover, while the tab is hidden, while off screen and while a finger is down; keyboard focus inside and any manual paging stop it; it never starts on its own with reduced motion. Slides out of view are `inert`.

Contract component, `carousel.tsx`:

```tsx
"use client"

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
            <CarouselIndicator key={i} aria-label={`Slide ${i + 1}`} className="size-2 rounded-full bg-muted data-selected:bg-foreground" />
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
}
```

- State attributes: `data-active` and `data-in-view` on slides, `data-selected` on indicators, `data-disabled` on Previous and Next at the ends, `data-playing` and `data-paused` on the root.
- `--carousel-progress` (0..1) on the root follows the scroll every frame, for a progress bar in CSS. `--carousel-interval` times an autoplay progress animation; pause it with `data-paused:`.
- `slidesPerPage="auto"` pages by what fits; `align` sets snap alignment; `dragFree` lets swipes coast.

### Marquee

`useMarquee` measures one copy of the content, returns how many copies fill the row, and runs an endless Web Animations API loop at `speed` px/s. It pauses on hover and focus (`pauseOnHover`) and while off screen. With reduced motion it stops (`moving: false`, `copies: 1`), so let the row scroll.

Contract component, `marquee.tsx`:

```tsx
"use client"

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
}
```

Do not put `gap` on the track or animate the track yourself; the hook owns its `transform`.

## 5. Animated tabs

ui-sdk `Tabs` handles roles, arrow keys, Home and End, and panels. `TabsIndicator` measures the selected tab into `--active-tab-left`, `--active-tab-top`, `--active-tab-width` and `--active-tab-height`. Put it last inside a `relative` `TabsList` and transition those properties. Skip the transition while `data-activation-direction="none"` so the first placement does not animate.

Contract component, `tabs.tsx`:

```tsx
"use client"

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
}
```

- Underline style: `bottom-0 h-0.5` with `left-(--active-tab-left) w-(--active-tab-width)` instead of a pill.
- Slide panels by direction with `data-[activation-direction=right]:data-starting-style:translate-x-4` and `data-[activation-direction=left]:data-starting-style:-translate-x-4`.
- `FeatureTabs` uses the same parts; put the tab media in the panels. For a vertical list, `orientation="vertical"` and transition `top,height`.

### Accordion (used by `Accordion` and `Faq`)

ui-sdk `Accordion`: single open item by default, `multiple` for several. The panel exposes `--accordion-panel-height`; transition `height` between it and 0.

```tsx
"use client"

import { Accordion as AccordionRoot, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@ui-sdk/react/accordion"
import type { AccordionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

export function Accordion({ items, multiple = false, defaultValue, className }: AccordionProps) {
  return (
    <AccordionRoot multiple={multiple} defaultValue={defaultValue} className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionHeader>
            <AccordionTrigger className="group flex w-full items-center justify-between py-5 text-left font-display text-lg">
              {item.title}
              <span aria-hidden className="transition-transform duration-300 ease-kit group-data-open:rotate-45 motion-reduce:transition-none">+</span>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-kit data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
            <div className="pb-5 text-muted-foreground">{item.content}</div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}
```

Put padding on an inner element, not on the panel, so the closed height is really 0. `hiddenUntilFound` on the root keeps closed answers searchable with the browser's find.

## 6. Pointer tilt and follow

`useTilt` writes CSS variables on the element every animation frame and eases them back when the pointer leaves. It never re-renders. Mouse and pen only; touch, devices without hover and reduced motion keep the rest values.

| Variable | Rest | While hovered |
|---|---|---|
| `--tilt-x` | `0deg` | rotateX, up to `max` deg |
| `--tilt-y` | `0deg` | rotateY, up to `max` deg |
| `--pointer-x`, `--pointer-y` | `50%` | pointer position inside the element |
| `--tilt-active` | `0` | `1`, eased (glare opacity) |

Tilt card, `card.tsx` (a kit that does not tilt just leaves the hook out):

```tsx
"use client"

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
}
```

Options: `max` (deg, default 8), `ease` (share of the distance per frame, default 0.12; lower is softer). For a spotlight without tilt, read only `--pointer-x`, `--pointer-y` and `--tilt-active`, and pass `max: 0`.

## 7. Count-up numbers

`useCountUp` renders the final value on the server, on the first client render and with reduced motion. After hydration it counts once, eased, when the element enters the viewport. Formatting uses `Intl.NumberFormat` with `locale` "en-US" by default, so server and client match. Without fraction digits in `format`, it shows as many decimals as `value` has.

Contract component, `count-up.tsx`:

```tsx
"use client"

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
}
```

- `tabular-nums` stops the width from jumping while digits change.
- Kit motion feel: pass `easing`, for example `(t) => 1 - Math.pow(1 - t, 3)`.
- An odometer (rolling digits) can use `text` as the target string and animate each digit column itself.

## 8. Overlay and dialog with focus return

ui-sdk `Dialog` is modal by default: the page is inert and does not scroll, Tab stays inside, Escape and a backdrop press close it, and focus returns to the trigger. Content and backdrop get `data-starting-style` and `data-ending-style` for enter and exit transitions and stay mounted until the exit finishes. Always pass the kit container.

Contract component, `dialog.tsx`:

```tsx
"use client"

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
}
```

- `open` and `onOpenChange` pass straight through: undefined `open` leaves it uncontrolled, and ui-sdk calls `onOpenChange(open, details)`, which fits the contract's `(open) => void`.
- A side sheet (spec drawer, cart) is the same with `Drawer`, `DrawerBackdrop`, `DrawerContent` (`side="right"`), and the same `container`.
- `DialogContent` `initialFocus` picks the first focused element (default: first focusable); `finalFocus` overrides the return target.
- To verify the portal in a browser: open the dialog and run `document.querySelector('[data-slot="dialog-content"]').closest("[data-kit]")`. It returns the kit element. The dev page shows this as a probe inside the dialog.
