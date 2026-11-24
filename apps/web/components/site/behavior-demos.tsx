"use client"

/**
 * Live demos for the 8 behavior pages. Styled with the website chrome tokens,
 * not with a kit, so they look the same on every page.
 *
 * The recipes live in lib/behaviors.ts. These demos are smaller and are meant
 * to be tried, not copied.
 */
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
} from "@ui-sdk/react/carousel"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import { useCallback, useRef, useState, type CSSProperties } from "react"

import type { BehaviorSlug } from "@/lib/behavior-nav"
import type { NavItem } from "@/registry/restyle/lib/contract"
import { useCountUp } from "@/registry/restyle/hooks/use-count-up"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"
import { useScrollProgress } from "@/registry/restyle/hooks/use-scroll-progress"
import { useScrollState } from "@/registry/restyle/hooks/use-scroll-state"
import { useTilt } from "@/registry/restyle/hooks/use-tilt"
import { cn } from "@/registry/restyle/lib/utils"

const VIDEO_SRC = "/kits/norma/reveal.mp4"
const VIDEO_POSTER = "/kits/norma/reveal-poster.webp"

const button =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const control =
  "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:pointer-events-none data-disabled:opacity-40"

// 1. Responsive nav -----------------------------------------------------------

const NAV: NavItem[] = [
  {
    label: "Product",
    href: "#nav-demo",
    children: [
      { label: "Overview", href: "#nav-demo", description: "Tabs, tilt and count-up in one place." },
      { label: "Media", href: "#nav-demo", description: "Video that plays in view or scrubs." },
      { label: "Motion", href: "#nav-demo", description: "Reveal, carousel and marquee." },
    ],
  },
  {
    label: "Resources",
    href: "#nav-demo",
    children: [
      { label: "Behavior docs", href: "/docs/behaviors", description: "All 8 shared behaviors." },
      { label: "Components", href: "/docs/components/tabs", description: "The same ideas as components." },
    ],
  },
  { label: "Dialog", href: "#nav-demo" },
]

function NavDemo() {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrolled } = useScrollState({ threshold: 16 })

  return (
    <div id="nav-demo" className="flex flex-col gap-3">
      <div
        ref={kitRef}
        data-scrolled={scrolled || undefined}
        className="rounded-xl border border-border bg-background p-3 transition-colors data-scrolled:bg-muted/30"
      >
        <div className="flex items-center gap-4">
          <a href="#nav-demo" className="text-sm font-semibold">
            Restyle
          </a>

          <NavigationMenu aria-label="Main" container={container} className="relative hidden md:block">
            <NavigationMenuList className="flex items-center gap-1">
              {NAV.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.label} value={item.label}>
                    <NavigationMenuTrigger className="group flex h-8 items-center gap-1 rounded-md px-3 text-sm hover:bg-muted data-open:bg-muted">
                      {item.label}
                      <svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        className="size-3 transition-transform group-data-open:rotate-180 motion-reduce:transition-none"
                      >
                        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute start-0 top-0 w-72 p-2 transition-[opacity,translate] duration-200 data-[motion=from-end]:data-starting-style:translate-x-6 data-[motion=from-start]:data-starting-style:-translate-x-6 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none">
                      <ul className="grid gap-1">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavigationMenuLink href={child.href} className="block rounded-md p-2 hover:bg-muted">
                              <span className="block text-sm font-medium">{child.label}</span>
                              <span className="block text-xs text-muted-foreground">{child.description}</span>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink
                      href={item.href}
                      className="flex h-8 items-center rounded-md px-3 text-sm hover:bg-muted"
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
            <NavigationMenuViewport
              sideOffset={8}
              className="h-(--viewport-height) w-(--viewport-width) overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg transition-[width,height,opacity,translate] duration-200 data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:opacity-0 motion-reduce:transition-none"
            />
          </NavigationMenu>

          <Drawer side="right" open={menuOpen} onOpenChange={setMenuOpen} container={container}>
            <DrawerTrigger className={cn(button, "ml-auto")}>Menu</DrawerTrigger>
            <DrawerBackdrop className="fixed inset-0 bg-black/40" />
            <DrawerContent className="flex h-dvh w-[min(88vw,20rem)] flex-col gap-4 overflow-y-auto bg-background p-5">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-base font-semibold">Menu</DrawerTitle>
                <DrawerClose aria-label="Close menu" className={button}>
                  ✕
                </DrawerClose>
              </div>
              <nav aria-label="Mobile">
                <Accordion className="divide-y divide-border">
                  {NAV.map((item) =>
                    item.children ? (
                      <AccordionItem key={item.label} value={item.label}>
                        <AccordionHeader>
                          <AccordionTrigger className="flex w-full items-center justify-between py-3 text-left text-sm font-medium">
                            {item.label}
                          </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
                          <ul className="grid gap-1 pb-3">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <DrawerClose
                                  render={<a href={child.href} />}
                                  className="block rounded-md p-2 text-sm hover:bg-muted"
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
                        className="block py-3 text-sm font-medium"
                      >
                        {item.label}
                      </DrawerClose>
                    ),
                  )}
                </Accordion>
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        On a wide screen, hover or click Product and Resources. Menu opens the drawer on any screen. The bar gains a
        tint once the page scrolls past 16px. Scroll down and back up: a real header uses the direction to hide and
        show itself.
      </p>
    </div>
  )
}

// 2. Scroll reveal ------------------------------------------------------------

function RevealGrid() {
  const { ref, visible, delayStyle } = useReveal<HTMLUListElement>({ stagger: 90 })

  return (
    <ul ref={ref} data-visible={visible || undefined} className="group grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <li
          key={index}
          style={delayStyle(index)}
          className="flex h-24 translate-y-6 items-end rounded-xl border border-border bg-muted/40 p-3 text-sm opacity-0 transition duration-700 ease-kit delay-(--reveal-delay) group-data-visible:translate-y-0 group-data-visible:opacity-100 motion-reduce:transition-none"
        >
          Card {index + 1}
        </li>
      ))}
    </ul>
  )
}

function RevealDemo() {
  const [round, setRound] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Scroll the cards into view, or replay the entrance.</p>
        <button type="button" className={button} onClick={() => setRound((value) => value + 1)}>
          Replay
        </button>
      </div>
      <RevealGrid key={round} />
    </div>
  )
}

// 3. Video in view, parallax, scrub -------------------------------------------

function VideoInViewDemo() {
  const { ref, playing, toggle } = useInViewVideo()

  return (
    <div className="max-w-md">
      <div className="overflow-hidden rounded-xl border border-border bg-black">
        <video
          ref={ref}
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="Test pattern video"
          className="aspect-video w-full object-cover"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button type="button" className={button} onClick={toggle}>
          {playing ? "Pause" : "Play"}
        </button>
        <span className="font-mono text-xs text-muted-foreground">playing: {String(playing)}</span>
      </div>
    </div>
  )
}

function ParallaxDemo() {
  const ref = useScrollProgress({ reducedMotionValue: 0.5 })

  return (
    <div ref={ref} className="relative h-44 overflow-hidden rounded-xl border border-border bg-foreground">
      <div className="absolute inset-x-8 top-1/2 -mt-8 h-16 translate-y-[calc((var(--scroll-progress,0.5)_-_0.5)_*_-140px)] rounded-lg bg-background/90" />
      <p className="absolute bottom-3 left-4 text-xs text-background/70">Parallax: the bar moves against the scroll.</p>
    </div>
  )
}

function ScrubDemo() {
  const video = useRef<HTMLVideoElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const ref = useScrollProgress<HTMLElement>({
    range: "contain",
    reducedMotionValue: null,
    onProgress: (progress) => {
      const element = video.current
      if (element?.duration) element.currentTime = progress * element.duration
      if (label.current) label.current.textContent = progress.toFixed(2)
    },
  })

  return (
    <section ref={ref} className="relative h-[180vh] rounded-xl border border-border bg-muted/20">
      <div className="sticky top-14 p-4">
        <p className="text-sm">
          Scroll through this block. Progress:{" "}
          <span ref={label} className="font-mono text-xs">
            0.00
          </span>
        </p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-border">
          <div className="h-full w-[calc(var(--scroll-progress,0)*100%)] rounded-full bg-foreground" />
        </div>
        <video
          ref={video}
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          muted
          playsInline
          preload="auto"
          aria-label="Scroll-scrubbed test pattern"
          className="mt-3 aspect-video w-full max-w-md rounded-xl border border-border bg-black"
        />
      </div>
    </section>
  )
}

function VideoDemo() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <h3 className="text-sm font-medium">Plays only in view</h3>
        <VideoInViewDemo />
      </div>
      <div className="grid gap-3">
        <h3 className="text-sm font-medium">Parallax with the same progress value</h3>
        <ParallaxDemo />
      </div>
      <div className="grid gap-3">
        <h3 className="text-sm font-medium">Scroll-scrubbed video</h3>
        <ScrubDemo />
      </div>
    </div>
  )
}

// 4. Carousel and marquee -----------------------------------------------------

const SLIDES = [
  { name: "Harbor", note: "Native scroll snap, swipe and drag." },
  { name: "Field", note: "Previous and Next at the ends." },
  { name: "Summit", note: "Dots follow the selected slide." },
  { name: "Valley", note: "Autoplay pauses on hover and focus." },
  { name: "Coast", note: "Loop back to the first slide." },
]

function CarouselDemo() {
  return (
    <Carousel aria-label="Demo slides" loop defaultPlaying interval={4000} className="max-w-xl">
      <CarouselViewport className="rounded-xl [scrollbar-width:none]">
        <CarouselContent className="flex gap-4">
          {SLIDES.map((slide, index) => (
            <CarouselItem key={slide.name} className="min-w-0 basis-full sm:basis-[calc((100%-1rem)/2)]">
              <div className="flex h-36 flex-col justify-end gap-1 rounded-xl border border-border bg-muted/50 p-4">
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                <span className="text-lg font-semibold">{slide.name}</span>
                <span className="text-xs text-muted-foreground">{slide.note}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div className="mt-3 flex items-center justify-between gap-4">
        <CarouselIndicatorGroup className="flex gap-2">
          {SLIDES.map((slide) => (
            <CarouselIndicator
              key={slide.name}
              aria-label={`Show ${slide.name}`}
              className="size-2.5 rounded-full bg-border data-selected:bg-foreground"
            />
          ))}
        </CarouselIndicatorGroup>
        <div className="flex items-center gap-2">
          <CarouselPlayToggle className={button}>
            {(state) => (state.playing ? "Pause" : "Play")}
          </CarouselPlayToggle>
          <CarouselPrevious aria-label="Previous slide" className={control}>
            ‹
          </CarouselPrevious>
          <CarouselNext aria-label="Next slide" className={control}>
            ›
          </CarouselNext>
        </div>
      </div>
    </Carousel>
  )
}

function MarqueeDemo() {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed: 60, direction: "left" })
  const words = ["Restyle UI", "Norma", "Linear", "Apple", "Teamwork", "mckp"]

  return (
    <div
      ref={rootRef}
      className={cn(
        "rounded-xl border border-border py-4",
        moving ? "overflow-hidden" : "overflow-x-auto",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
      )}
    >
      <div ref={trackRef} className="flex w-max">
        {Array.from({ length: copies }, (_, copy) => (
          <div
            key={copy}
            aria-hidden={copy > 0 || undefined}
            inert={copy > 0}
            className="flex shrink-0 items-center gap-10 pr-10"
          >
            {words.map((word) => (
              <span key={word} className="flex items-center gap-10 text-base font-semibold text-muted-foreground">
                {word}
                <span aria-hidden className="size-1 rounded-full bg-border" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function CarouselMarqueeDemo() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <h3 className="text-sm font-medium">Carousel with autoplay</h3>
        <CarouselDemo />
      </div>
      <div className="grid gap-3">
        <h3 className="text-sm font-medium">Marquee that pauses on hover</h3>
        <MarqueeDemo />
      </div>
    </div>
  )
}

// 5. Animated tabs ------------------------------------------------------------

const TABS = [
  {
    id: "plan",
    label: "Plan",
    content: (
      <>
        <p className="text-sm font-medium">Write the goal first.</p>
        <p className="mt-1 text-sm text-muted-foreground">List the first three steps, then pick the smallest one.</p>
      </>
    ),
  },
  {
    id: "build",
    label: "Build",
    content: (
      <>
        <p className="text-sm font-medium">Ship the smallest useful version.</p>
        <p className="mt-1 text-sm text-muted-foreground">Watch it work before you add another feature.</p>
      </>
    ),
  },
  {
    id: "review",
    label: "Review",
    content: (
      <>
        <p className="text-sm font-medium">Compare the result with the goal.</p>
        <p className="mt-1 text-sm text-muted-foreground">Keep what worked, change one thing, then go again.</p>
      </>
    ),
  },
]

function TabsDemo() {
  return (
    <Tabs defaultValue="plan" className="grid gap-4">
      <TabsList aria-label="Workflow" className="relative inline-flex w-fit rounded-full border border-border bg-muted p-1">
        {TABS.map((tab) => (
          <TabsTab
            key={tab.id}
            value={tab.id}
            className="relative z-10 rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors data-selected:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {tab.label}
          </TabsTab>
        ))}
        <TabsIndicator className="absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-full bg-background shadow-sm transition-[left,width] duration-300 ease-kit data-[activation-direction=none]:transition-none motion-reduce:transition-none" />
      </TabsList>
      <div className="grid">
        {TABS.map((tab) => (
          <TabsPanel
            key={tab.id}
            value={tab.id}
            className="[grid-area:1/1] rounded-xl border border-border bg-card p-4 transition-[opacity,translate] duration-300 ease-kit data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 motion-reduce:transition-none"
          >
            {tab.content}
          </TabsPanel>
        ))}
      </div>
    </Tabs>
  )
}

// 6. Pointer tilt -------------------------------------------------------------

function TiltDemo() {
  const ref = useTilt({ max: 10 })

  return (
    <div className="w-full max-w-xs [perspective:900px]">
      <div
        ref={ref}
        className="relative flex h-48 flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-5 text-card-foreground [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--pointer-x,50%)_var(--pointer-y,50%),rgb(255_255_255/0.35),transparent_55%)] opacity-(--tilt-active,0)"
        />
        <span className="relative font-mono text-xs text-muted-foreground">--tilt-x / --tilt-y</span>
        <span className="relative mt-1 text-lg font-semibold">Move the pointer here</span>
        <span className="relative mt-1 text-sm text-muted-foreground">
          The glare follows the pointer. Touch and reduced motion keep the card flat.
        </span>
      </div>
    </div>
  )
}

// 7. Count-up -----------------------------------------------------------------

function Count({
  value,
  label,
  prefix,
  suffix,
  format,
}: {
  value: number
  label: string
  prefix?: string
  suffix?: string
  format?: Intl.NumberFormatOptions
}) {
  const { ref, text, final } = useCountUp({ value, format })

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <span ref={ref} className="block text-3xl font-semibold tabular-nums">
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
      <span className="mt-1 block text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function CountDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Count value={12500} suffix="+" label="Teams on the free plan" />
      <Count value={98.6} suffix="%" label="Uptime over 12 months" />
      <Count value={2400000} prefix="$" format={{ notation: "compact", maximumFractionDigits: 1 }} label="Saved by customers" />
    </div>
  )
}

// 8. Overlay and dialog -------------------------------------------------------

function KitProbe() {
  const [kit, setKit] = useState<string | null>(null)
  const probe = useCallback((node: HTMLElement | null) => {
    if (node) setKit(node.closest("[data-kit]")?.getAttribute("data-kit") ?? "none")
  }, [])

  return (
    <p ref={probe} className="rounded-md bg-white/70 p-2 font-mono text-xs text-neutral-700">
      closest [data-kit]: {kit ?? "…"}
    </p>
  )
}

function OverlayDemo() {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  const [open, setOpen] = useState(false)

  return (
    <div
      data-kit="demo"
      style={
        {
          "--demo-accent": "#4f46e5",
          "--demo-surface": "#eef2ff",
          "--demo-ink": "#1e1b4b",
        } as CSSProperties
      }
      className="rounded-xl border border-dashed border-border p-4"
    >
      <p className="mb-3 font-mono text-xs text-muted-foreground">
        {'<div data-kit="demo">'} sets --demo-accent and --demo-surface
      </p>
      <Dialog open={open} onOpenChange={setOpen} container={container}>
        <DialogTrigger
          ref={kitRef}
          className="inline-flex h-9 items-center rounded-lg bg-(--demo-accent) px-4 text-sm font-medium text-white"
        >
          Open dialog
        </DialogTrigger>
        <DialogBackdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <DialogContent className="fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100%-2rem))] flex-col gap-4 overflow-y-auto rounded-2xl border-2 border-(--demo-accent) bg-(--demo-surface) p-6 text-(--demo-ink) shadow-xl transition-[opacity,scale] duration-200 ease-kit data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
          <DialogTitle className="text-lg font-semibold">Kit tokens apply here</DialogTitle>
          <DialogDescription className="text-sm opacity-70">
            The border and background come from variables set on the data-kit element. Escape, the backdrop and Close
            all return focus to the trigger.
          </DialogDescription>
          <KitProbe />
          <div className="flex justify-end">
            <DialogClose className={button}>Close</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Page switch -----------------------------------------------------------------

export function BehaviorDemo({ slug }: { slug: BehaviorSlug }) {
  switch (slug) {
    case "nav":
      return <NavDemo />
    case "reveal":
      return <RevealDemo />
    case "video":
      return <VideoDemo />
    case "carousel-marquee":
      return <CarouselMarqueeDemo />
    case "tabs":
      return <TabsDemo />
    case "tilt":
      return <TiltDemo />
    case "count-up":
      return <CountDemo />
    case "overlay":
      return <OverlayDemo />
  }
}
