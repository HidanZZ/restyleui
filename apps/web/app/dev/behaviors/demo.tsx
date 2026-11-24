"use client"

import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react"
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
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import type { NavItem } from "@/registry/restyle/lib/contract"
import { useCountUp } from "@/registry/restyle/hooks/use-count-up"
import { useInViewVideo } from "@/registry/restyle/hooks/use-in-view-video"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"
import { useMarquee } from "@/registry/restyle/hooks/use-marquee"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"
import { useScrollProgress } from "@/registry/restyle/hooks/use-scroll-progress"
import { useScrollState } from "@/registry/restyle/hooks/use-scroll-state"
import { useTilt } from "@/registry/restyle/hooks/use-tilt"
import { SAMPLE_VIDEO } from "./sample-video"

const NAV: NavItem[] = [
  {
    label: "Product",
    href: "#nav",
    children: [
      { label: "Overview", href: "#reveal", description: "A short tour of every part." },
      { label: "Media", href: "#video", description: "Video that plays in view or scrubs." },
      { label: "Motion", href: "#carousel", description: "Carousel and marquee." },
    ],
  },
  {
    label: "Resources",
    href: "#nav",
    children: [
      { label: "Tabs", href: "#tabs", description: "Animated active indicator." },
      { label: "Numbers", href: "#count", description: "Count-up on view." },
    ],
  },
  { label: "Dialog", href: "#dialog" },
]

const button =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-medium hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

function Section({ id, title, note, children }: { id: string; title: string; note: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-neutral-200 py-12">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-neutral-600">{note}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

// 1. Responsive nav -----------------------------------------------------------

function Chevron() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3 transition-transform group-data-open:rotate-180 motion-reduce:transition-none">
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function DemoNavbar() {
  const [kitRef, container] = useKitPortal<HTMLElement>()
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrolled, direction } = useScrollState({ threshold: 16 })
  const hidden = direction === "down" && !menuOpen

  return (
    <header
      ref={kitRef}
      data-scrolled={scrolled || undefined}
      data-hidden={hidden || undefined}
      className="sticky top-0 z-40 border-b border-transparent bg-white/90 backdrop-blur transition-[translate,border-color] duration-300 data-hidden:-translate-y-full data-scrolled:border-neutral-200 motion-reduce:transition-none"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <a href="#top" className="font-semibold">
          Behaviors
        </a>

        <NavigationMenu aria-label="Main" container={container} className="relative hidden md:block">
          <NavigationMenuList className="flex items-center gap-1">
            {NAV.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.label} value={item.label}>
                  <NavigationMenuTrigger className="group flex h-9 items-center gap-1 rounded-md px-3 text-sm hover:bg-neutral-100 data-open:bg-neutral-100">
                    {item.label}
                    <Chevron />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute start-0 top-0 w-80 p-2 transition-[opacity,translate] duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 data-[motion=from-end]:data-starting-style:translate-x-6 data-[motion=from-start]:data-starting-style:-translate-x-6 motion-reduce:transition-none">
                    <ul className="grid gap-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavigationMenuLink href={child.href} className="block rounded-md p-2 hover:bg-neutral-100">
                            <span className="block text-sm font-medium">{child.label}</span>
                            <span className="block text-xs text-neutral-500">{child.description}</span>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink href={item.href} className="flex h-9 items-center rounded-md px-3 text-sm hover:bg-neutral-100">
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
          <NavigationMenuIndicator className="absolute bottom-(--active-item-bottom) left-(--active-item-left) h-0.5 w-(--active-item-width) bg-neutral-900 opacity-0 transition-[left,width,opacity] duration-200 data-visible:opacity-100 motion-reduce:transition-none" />
          <NavigationMenuViewport
            sideOffset={8}
            className="h-(--viewport-height) w-(--viewport-width) overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg transition-[width,height,opacity,translate] duration-200 data-starting-style:-translate-y-1 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none"
          />
        </NavigationMenu>

        <Drawer side="right" open={menuOpen} onOpenChange={setMenuOpen} container={container}>
          <DrawerTrigger className={`${button} ml-auto md:hidden`}>Menu</DrawerTrigger>
          <DrawerBackdrop className="fixed inset-0 bg-black/40" />
          <DrawerContent className="flex h-dvh w-[min(88vw,22rem)] flex-col gap-4 overflow-y-auto bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-base font-semibold">Menu</DrawerTitle>
              <DrawerClose className={button} aria-label="Close menu">
                ✕
              </DrawerClose>
            </div>
            <nav aria-label="Mobile">
              <Accordion className="divide-y divide-neutral-200">
                {NAV.map((item) =>
                  item.children ? (
                    <AccordionItem key={item.label} value={item.label}>
                      <AccordionHeader>
                        <AccordionTrigger className="group flex w-full items-center justify-between py-3 text-left font-medium">
                          {item.label}
                          <Chevron />
                        </AccordionTrigger>
                      </AccordionHeader>
                      <AccordionPanel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
                        <ul className="grid gap-1 pb-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <DrawerClose render={<a href={child.href} />} className="block rounded-md p-2 text-sm hover:bg-neutral-100">
                                {child.label}
                              </DrawerClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionPanel>
                    </AccordionItem>
                  ) : (
                    <div key={item.label}>
                      <DrawerClose render={<a href={item.href} />} className="block py-3 font-medium">
                        {item.label}
                      </DrawerClose>
                    </div>
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

// 2. Reveal -------------------------------------------------------------------

function RevealDemo() {
  const { ref, visible, delayStyle } = useReveal<HTMLUListElement>({ stagger: 90 })
  return (
    <>
      <p className="mb-3 font-mono text-xs" data-testid="reveal-state">
        visible: {String(visible)}
      </p>
      <ul ref={ref} data-visible={visible || undefined} className="group grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li
            key={i}
            style={delayStyle(i)}
            className="flex h-28 translate-y-6 items-end rounded-xl bg-neutral-100 p-3 text-sm opacity-0 transition duration-700 ease-out delay-(--reveal-delay) group-data-visible:translate-y-0 group-data-visible:opacity-100 motion-reduce:transition-none"
          >
            Item {i + 1}
          </li>
        ))}
      </ul>
    </>
  )
}

// 3. Video in view, scroll scrub, parallax -------------------------------------

function InViewVideoDemo() {
  const { ref: videoRef, playing, toggle } = useInViewVideo()
  return (
    <div className="max-w-md">
      <video
        ref={videoRef}
        src={SAMPLE_VIDEO}
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Test pattern"
        className="aspect-video w-full rounded-xl bg-black"
      />
      <div className="mt-2 flex items-center gap-3">
        <button type="button" className={button} onClick={toggle}>
          {playing ? "Pause" : "Play"}
        </button>
        <span className="font-mono text-xs">playing: {String(playing)}</span>
      </div>
    </div>
  )
}

function ScrubDemo() {
  const video = useRef<HTMLVideoElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const ref = useScrollProgress<HTMLElement>({
    range: "contain",
    reducedMotionValue: null,
    onProgress: (p) => {
      const v = video.current
      if (v?.duration) v.currentTime = p * v.duration
      if (label.current) label.current.textContent = p.toFixed(2)
    },
  })
  return (
    <section ref={ref} className="relative h-[220vh] rounded-xl bg-neutral-50">
      <div className="sticky top-16 p-4">
        <p className="text-sm">
          Scroll through this tall block. progress: <span ref={label} className="font-mono">0.00</span>
        </p>
        <div className="mt-2 h-1.5 w-full rounded bg-neutral-200">
          <div className="h-full w-[calc(var(--scroll-progress,0)*100%)] rounded bg-blue-600" />
        </div>
        <video ref={video} src={SAMPLE_VIDEO} muted playsInline preload="auto" aria-label="Scrubbed test pattern" className="mt-3 aspect-video w-full max-w-md rounded-xl bg-black" />
      </div>
    </section>
  )
}

function ParallaxDemo() {
  const ref = useScrollProgress({ reducedMotionValue: 0.5 })
  return (
    <div ref={ref} className="relative h-56 overflow-hidden rounded-xl bg-neutral-900">
      <div className="absolute inset-x-8 top-1/2 -mt-10 h-20 translate-y-[calc((var(--scroll-progress,0.5)_-_0.5)_*_-160px)] rounded-lg bg-amber-400" />
      <p className="absolute bottom-3 left-4 text-xs text-white/70">Parallax: the bar moves against the scroll.</p>
    </div>
  )
}

// 4. Carousel and marquee ------------------------------------------------------

const SLIDES = ["Harbor", "Field", "Summit", "Valley", "Coast"]

function CarouselDemo() {
  return (
    <Carousel aria-label="Demo slides" loop defaultPlaying interval={3000} className="max-w-xl">
      <div className="flex items-center gap-2">
        <CarouselPrevious aria-label="Previous slide" className={button}>
          ‹
        </CarouselPrevious>
        <CarouselViewport className="min-w-0 flex-1 rounded-xl [scrollbar-width:none]">
          <CarouselContent className="flex gap-4">
            {SLIDES.map((name, i) => (
              <CarouselItem key={name} className="min-w-0 basis-full sm:basis-[calc((100%-1rem)/2)]">
                <div className="flex h-36 items-end rounded-xl p-3 text-sm font-medium text-white" style={{ background: `hsl(${i * 60 + 200} 60% 45%)` }}>
                  {name}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </CarouselViewport>
        <CarouselNext aria-label="Next slide" className={button}>
          ›
        </CarouselNext>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <CarouselIndicatorGroup className="flex gap-2">
          {SLIDES.map((name) => (
            <CarouselIndicator key={name} aria-label={`Show ${name}`} className="size-2.5 rounded-full bg-neutral-300 data-selected:bg-neutral-900" />
          ))}
        </CarouselIndicatorGroup>
        <CarouselPlayToggle className={button}>{(state) => (state.playing ? "Pause" : "Play")}</CarouselPlayToggle>
      </div>
    </Carousel>
  )
}

function MarqueeDemo({ direction }: { direction: "left" | "right" }) {
  const { rootRef, trackRef, copies, moving } = useMarquee({ speed: 60, direction })
  const words = ["Northwind", "Lumen", "Orbit", "Cascade", "Pillar", "Fable"]
  return (
    <div ref={rootRef} className={`rounded-xl border border-neutral-200 py-4 ${moving ? "overflow-hidden" : "overflow-x-auto"}`}>
      <div ref={trackRef} className="flex w-max">
        {Array.from({ length: copies }, (_, i) => (
          <div key={i} aria-hidden={i > 0 || undefined} inert={i > 0} className="flex shrink-0 items-center gap-12 pr-12">
            {words.map((word) => (
              <a key={word} href="#carousel" className="text-lg font-semibold text-neutral-700 hover:text-neutral-950">
                {word}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// 5. Tabs ---------------------------------------------------------------------

const TABS = [
  { id: "plan", label: "Plan", content: "Write down the goal and the first three steps." },
  { id: "build", label: "Build", content: "Ship the smallest useful version and watch it work." },
  { id: "review", label: "Review", content: "Compare the result with the goal, then adjust." },
]

function TabsDemo() {
  return (
    <Tabs defaultValue="plan">
      <TabsList aria-label="Workflow" className="relative inline-flex rounded-full bg-neutral-100 p-1">
        {TABS.map((tab) => (
          <TabsTab key={tab.id} value={tab.id} className="relative z-10 rounded-full px-4 py-1.5 text-sm text-neutral-500 transition-colors data-selected:text-neutral-950">
            {tab.label}
          </TabsTab>
        ))}
        <TabsIndicator className="absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-full bg-white shadow transition-[left,width] duration-300 ease-out data-[activation-direction=none]:transition-none motion-reduce:transition-none" />
      </TabsList>
      <div className="mt-4 grid">
        {TABS.map((tab) => (
          <TabsPanel
            key={tab.id}
            value={tab.id}
            className="[grid-area:1/1] rounded-xl border border-neutral-200 p-4 text-sm transition-[opacity,translate] duration-300 data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 motion-reduce:transition-none"
          >
            {tab.content}
          </TabsPanel>
        ))}
      </div>
    </Tabs>
  )
}

// 6. Tilt ---------------------------------------------------------------------

function TiltDemo() {
  const ref = useTilt({ max: 10 })
  return (
    <div className="w-72 [perspective:900px]">
      <div
        ref={ref}
        className="relative flex h-44 items-end overflow-hidden rounded-2xl bg-neutral-900 p-4 text-white [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--pointer-x,50%)_var(--pointer-y,50%),rgb(255_255_255/0.35),transparent_55%)] opacity-(--tilt-active,0)"
        />
        <span className="relative text-sm">Move the pointer over this card</span>
      </div>
    </div>
  )
}

// 7. Count-up -----------------------------------------------------------------

function Count({ value, format, prefix, suffix, label }: { value: number; format?: Intl.NumberFormatOptions; prefix?: string; suffix?: string; label: string }) {
  const { ref, text, final } = useCountUp({ value, format })
  return (
    <div>
      <span ref={ref} className="block text-4xl font-semibold tabular-nums">
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
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  )
}

// 8. Dialog inside data-kit ----------------------------------------------------

function KitProbe() {
  const [kit, setKit] = useState<string | null>(null)
  const probe = useCallback((node: HTMLElement | null) => {
    if (node) setKit(node.closest("[data-kit]")?.getAttribute("data-kit") ?? "none")
  }, [])
  return (
    <p ref={probe} className="rounded-md bg-white/70 p-2 font-mono text-xs" data-testid="kit-probe">
      closest [data-kit]: {kit ?? "…"}
    </p>
  )
}

// Same pass-through as the contract Dialog: `open` undefined keeps it uncontrolled.
function KitDialogDemo({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  return (
    <div
      data-kit="x"
      style={{ "--demo-accent": "#4f46e5", "--demo-surface": "#eef2ff" } as CSSProperties}
      className="rounded-xl border border-dashed border-neutral-300 p-4"
    >
      <p className="mb-3 font-mono text-xs">{'<div data-kit="x">'} sets --demo-accent and --demo-surface</p>
      <Dialog open={open} onOpenChange={onOpenChange} container={container}>
        <DialogTrigger ref={kitRef} className="inline-flex h-9 items-center rounded-lg bg-(--demo-accent) px-4 text-sm font-medium text-white">
          Open dialog
        </DialogTrigger>
        <DialogBackdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
        <DialogContent className="fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100%-2rem))] flex-col gap-4 overflow-y-auto rounded-2xl border-2 border-(--demo-accent) bg-(--demo-surface) p-6 shadow-xl transition-[opacity,scale] duration-200 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none">
          <DialogTitle className="text-lg font-semibold">Kit tokens apply here</DialogTitle>
          <DialogDescription className="text-sm text-neutral-600">
            The border and background come from variables set on the data-kit element. Escape, the backdrop and Close all
            return focus to the trigger.
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

// Page ------------------------------------------------------------------------

export function BehaviorsDemo() {
  return (
    <div id="top" className="min-h-screen bg-white text-neutral-900">
      <DemoNavbar />
      <main className="mx-auto max-w-5xl px-4 pb-[60vh]">
        <Section
          id="nav"
          title="1. Responsive nav"
          note="Hover or click Product and Resources (desktop). Below 768px, Menu opens a drawer with scroll lock, Escape and focus return. Scroll down to hide the header, up to show it."
        >
          <p className="text-sm text-neutral-600">The header above is the demo.</p>
        </Section>
        <Section id="reveal" title="2. Scroll reveal" note="Items fade up one after another when the grid enters the viewport.">
          <div className="mb-[40vh] text-sm text-neutral-400">Scroll down</div>
          <RevealDemo />
        </Section>
        <Section id="video" title="3. Video in view, scrub, parallax" note="The first video plays only while in view. The second follows the scroll position.">
          <div className="grid gap-8">
            <InViewVideoDemo />
            <ParallaxDemo />
            <ScrubDemo />
          </div>
        </Section>
        <Section id="carousel" title="4. Carousel and marquee" note="Autoplay pauses on hover and focus. The marquee pauses on hover.">
          <div className="grid gap-6">
            <CarouselDemo />
            <MarqueeDemo direction="left" />
            <MarqueeDemo direction="right" />
          </div>
        </Section>
        <Section id="tabs" title="5. Animated tabs" note="The pill slides to the selected tab. Arrow keys move between tabs.">
          <TabsDemo />
        </Section>
        <Section id="tilt" title="6. Pointer tilt and follow" note="Mouse only. Off for touch and reduced motion.">
          <TiltDemo />
        </Section>
        <Section id="count" title="7. Count-up" note="Counts once when in view. The server HTML has the final values.">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Count value={12500} label="Teams" suffix="+" />
            <Count value={98.6} suffix="%" label="Uptime" />
            <Count value={2400000} prefix="$" format={{ notation: "compact", maximumFractionDigits: 1 }} label="Saved" />
          </div>
        </Section>
        <Section id="dialog" title="8. Dialog inside data-kit" note="The dialog renders inside the data-kit element, so its variables apply. The probe reads the closest data-kit from inside the dialog.">
          <KitDialogDemo />
        </Section>
      </main>
    </div>
  )
}
