/**
 * Restyle UI contract.
 *
 * Every kit implements every common component and section below with exactly
 * these props. An app can switch kits by changing imports only. Kits differ in
 * markup, styling and motion, never in props.
 *
 * Installed into user projects as `@/lib/contract`.
 */
import type { ComponentType, ReactNode } from "react"

// ---------------------------------------------------------------------------
// Shared shapes
// ---------------------------------------------------------------------------

export type LinkItem = { label: string; href: string }

export type Action = {
  label: string
  href: string
  variant?: "primary" | "secondary"
}

export type Media =
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | { type: "video"; src: string; poster?: string; alt: string }

export type Logo = {
  name: string
  /** Image URL. When omitted, the kit renders `name` as a text wordmark. */
  src?: string
}

// ---------------------------------------------------------------------------
// Common components (15)
// ---------------------------------------------------------------------------

export type ButtonProps = {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  /** Renders an `<a>` when set, a `<button>` otherwise. */
  href?: string
  /** Trailing icon. */
  icon?: ReactNode
  type?: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export type TextLinkProps = {
  children: ReactNode
  href: string
  /** Shows the kit's trailing arrow treatment. */
  arrow?: boolean
  className?: string
}

export type BadgeProps = {
  children: ReactNode
  variant?: "neutral" | "accent"
  className?: string
}

export type CardProps = {
  title: string
  description?: string
  eyebrow?: string
  media?: Media
  /** Makes the whole card a link. */
  href?: string
  children?: ReactNode
  className?: string
}

export type LogoRowProps = {
  logos: Logo[]
  label?: string
  className?: string
}

export type NavItem = LinkItem & {
  /** When set, the item opens a dropdown (desktop) or a nested list (mobile drawer). */
  children?: (LinkItem & { description?: string })[]
}

export type NavbarProps = {
  brand: ReactNode
  /** Brand link target. Defaults to "/". */
  brandHref?: string
  items: NavItem[]
  actions?: Action[]
  className?: string
}

export type FooterProps = {
  brand: ReactNode
  description?: string
  columns: { title: string; links: LinkItem[] }[]
  social?: LinkItem[]
  legal?: string
  className?: string
}

export type TabsProps = {
  items: { id: string; label: string; content: ReactNode }[]
  defaultValue?: string
  className?: string
}

export type AccordionProps = {
  items: { id: string; title: string; content: ReactNode }[]
  /** Allows several open items. Default: one at a time. */
  multiple?: boolean
  defaultValue?: string[]
  className?: string
}

export type DialogProps = {
  /** Content of the trigger button, styled by the kit. */
  trigger: ReactNode
  title: string
  description?: string
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export type CarouselProps = {
  items: ReactNode[]
  /** Accessible name of the carousel region. */
  label: string
  /** `true` uses the kit's default interval; a number sets it in ms. */
  autoplay?: boolean | number
  loop?: boolean
  className?: string
}

export type MarqueeProps = {
  children: ReactNode
  /** Pixels per second. */
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  className?: string
}

export type RevealProps = {
  children: ReactNode
  /** Delay in ms before the entrance starts. */
  delay?: number
  /** Staggers direct children instead of revealing the block as one. */
  stagger?: boolean
  className?: string
}

export type CountUpProps = {
  value: number
  from?: number
  /** Duration in ms. */
  duration?: number
  format?: Intl.NumberFormatOptions
  prefix?: string
  suffix?: string
  className?: string
}

export type InputProps = {
  label: string
  buttonLabel: string
  placeholder?: string
  type?: "email" | "text"
  name?: string
  hint?: string
  successMessage?: string
  onSubmit?: (value: string) => void | Promise<void>
  className?: string
}

// ---------------------------------------------------------------------------
// Common sections (8)
// ---------------------------------------------------------------------------

export type HeroProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  actions?: Action[]
  media?: Media
  className?: string
}

export type LogoStripProps = {
  title?: string
  logos: Logo[]
  className?: string
}

export type FeatureGridProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  features: { title: string; description: string; icon?: ReactNode; media?: Media }[]
  className?: string
}

export type FeatureTabsProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  tabs: { id: string; label: string; title: string; description: string; media: Media }[]
  className?: string
}

export type TestimonialsProps = {
  title?: ReactNode
  testimonials: { quote: string; name: string; role?: string; avatar?: string }[]
  className?: string
}

export type FaqProps = {
  title: ReactNode
  description?: string
  items: { question: string; answer: ReactNode }[]
  className?: string
}

export type CtaProps = {
  title: ReactNode
  description?: string
  actions?: Action[]
  /** Shows a signup field instead of, or next to, the actions. */
  input?: InputProps
  className?: string
}

export type FooterSectionProps = FooterProps & {
  newsletter?: { title: string; input: InputProps }
}

// ---------------------------------------------------------------------------
// Kit module: what `registry/<kit>/index.ts` must export.
// ---------------------------------------------------------------------------

export type Kit = {
  Button: ComponentType<ButtonProps>
  TextLink: ComponentType<TextLinkProps>
  Badge: ComponentType<BadgeProps>
  Card: ComponentType<CardProps>
  LogoRow: ComponentType<LogoRowProps>
  Navbar: ComponentType<NavbarProps>
  Footer: ComponentType<FooterProps>
  Tabs: ComponentType<TabsProps>
  Accordion: ComponentType<AccordionProps>
  Dialog: ComponentType<DialogProps>
  Carousel: ComponentType<CarouselProps>
  Marquee: ComponentType<MarqueeProps>
  Reveal: ComponentType<RevealProps>
  CountUp: ComponentType<CountUpProps>
  Input: ComponentType<InputProps>
  Hero: ComponentType<HeroProps>
  LogoStrip: ComponentType<LogoStripProps>
  FeatureGrid: ComponentType<FeatureGridProps>
  FeatureTabs: ComponentType<FeatureTabsProps>
  Testimonials: ComponentType<TestimonialsProps>
  Faq: ComponentType<FaqProps>
  Cta: ComponentType<CtaProps>
  FooterSection: ComponentType<FooterSectionProps>
}
