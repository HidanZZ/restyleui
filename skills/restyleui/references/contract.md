# Restyle UI contract

The installed `@/lib/contract` is the source of truth. Every kit implements all 15 components and 8 sections with exactly these props, so page code keeps working when you switch kits. Do not add or rename contract props on a common piece.

Installing any common piece installs the contract at `@/lib/contract`. You can also add the types without installing a piece:

```bash
npx shadcn@latest add @restyleui/restyle-contract
```

Imports:

```tsx
import type { ButtonProps, HeroProps } from "@/lib/contract"
```

## Shared shapes

```ts
import type { ComponentType, ReactNode } from "react"

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

export type NavItem = LinkItem & {
  children?: (LinkItem & { description?: string })[]
}
```

## Components (15)

### Button (`button.tsx`, export `Button`)

```ts
type ButtonProps = {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  href?: string        // renders an <a> when set, a <button> otherwise
  icon?: ReactNode
  type?: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
  className?: string
}
```

### TextLink (`text-link.tsx`, export `TextLink`)

```ts
type TextLinkProps = {
  children: ReactNode
  href: string
  arrow?: boolean      // shows the kit's trailing arrow treatment
  className?: string
}
```

### Badge (`badge.tsx`, export `Badge`)

```ts
type BadgeProps = {
  children: ReactNode
  variant?: "neutral" | "accent"
  className?: string
}
```

### Card (`card.tsx`, export `Card`)

```ts
type CardProps = {
  title: string
  description?: string
  eyebrow?: string
  media?: Media
  href?: string        // makes the whole card a link
  children?: ReactNode
  className?: string
}
```

### LogoRow (`logo-row.tsx`, export `LogoRow`)

```ts
type LogoRowProps = {
  logos: Logo[]
  label?: string
  className?: string
}
```

### Navbar (`navbar.tsx`, export `Navbar`)

```ts
type NavbarProps = {
  brand: ReactNode
  brandHref?: string   // default "/"
  items: NavItem[]
  actions?: Action[]
  className?: string
}
```

### Footer (`footer.tsx`, export `Footer`)

```ts
type FooterProps = {
  brand: ReactNode
  description?: string
  columns: { title: string; links: LinkItem[] }[]
  social?: LinkItem[]
  legal?: string
  className?: string
}
```

### Tabs (`tabs.tsx`, export `Tabs`)

```ts
type TabsProps = {
  items: { id: string; label: string; content: ReactNode }[]
  defaultValue?: string
  className?: string
}
```

### Accordion (`accordion.tsx`, export `Accordion`)

```ts
type AccordionProps = {
  items: { id: string; title: string; content: ReactNode }[]
  multiple?: boolean   // default: one open at a time
  defaultValue?: string[]
  className?: string
}
```

### Dialog (`dialog.tsx`, export `Dialog`)

```ts
type DialogProps = {
  trigger: ReactNode  // content of the trigger button, styled by the kit
  title: string
  description?: string
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}
```

### Carousel (`carousel.tsx`, export `Carousel`)

```ts
type CarouselProps = {
  items: ReactNode[]
  label: string        // accessible name of the carousel region
  autoplay?: boolean | number
  loop?: boolean
  className?: string
}
```

### Marquee (`marquee.tsx`, export `Marquee`)

```ts
type MarqueeProps = {
  children: ReactNode
  speed?: number       // pixels per second
  direction?: "left" | "right"
  pauseOnHover?: boolean
  className?: string
}
```

### Reveal (`reveal.tsx`, export `Reveal`)

```ts
type RevealProps = {
  children: ReactNode
  delay?: number       // ms before the entrance starts
  stagger?: boolean    // staggers direct children instead of the block
  className?: string
}
```

### CountUp (`count-up.tsx`, export `CountUp`)

```ts
type CountUpProps = {
  value: number
  from?: number
  duration?: number    // ms
  format?: Intl.NumberFormatOptions
  prefix?: string
  suffix?: string
  className?: string
}
```

### Input (`input.tsx`, export `Input`)

```ts
type InputProps = {
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
```

## Sections (8)

### Hero (`hero.tsx`, export `Hero`)

```ts
type HeroProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  actions?: Action[]
  media?: Media
  className?: string
}
```

### LogoStrip (`logo-strip.tsx`, export `LogoStrip`)

```ts
type LogoStripProps = {
  title?: string
  logos: Logo[]
  className?: string
}
```

### FeatureGrid (`feature-grid.tsx`, export `FeatureGrid`)

```ts
type FeatureGridProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  features: {
    title: string
    description: string
    icon?: ReactNode
    media?: Media
  }[]
  className?: string
}
```

### FeatureTabs (`feature-tabs.tsx`, export `FeatureTabs`)

```ts
type FeatureTabsProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  tabs: {
    id: string
    label: string
    title: string
    description: string
    media: Media
  }[]
  className?: string
}
```

### Testimonials (`testimonials.tsx`, export `Testimonials`)

```ts
type TestimonialsProps = {
  title?: ReactNode
  testimonials: {
    quote: string
    name: string
    role?: string
    avatar?: string
  }[]
  className?: string
}
```

### Faq (`faq.tsx`, export `Faq`)

```ts
type FaqProps = {
  title: ReactNode
  description?: string
  items: { question: string; answer: ReactNode }[]
  className?: string
}
```

### Cta (`cta.tsx`, export `Cta`)

```ts
type CtaProps = {
  title: ReactNode
  description?: string
  actions?: Action[]
  input?: InputProps   // shows a signup field instead of, or next to, the actions
  className?: string
}
```

### FooterSection (`footer-section.tsx`, export `FooterSection`)

```ts
type FooterSectionProps = FooterProps & {
  newsletter?: { title: string; input: InputProps }
}
```

`FooterSection` includes every `Footer` prop: `brand`, `description`, `columns`, `social`, `legal` and `className`.

## Installed paths

| What | Import | Notes |
|---|---|---|
| Common piece | `@/components/<slug>` | One named export, for example `import { Hero } from "@/components/hero"` |
| Unique piece | `@/components/<slug>` | Same folder. Its props are its own, not in the contract |
| Landing page | `@/components/landing` | Installed by `<kit>-landing` |
| Contract types | `@/lib/contract` | This file |
| `cn` helper | `@/lib/utils` | `restyle-utils` adds it when missing. Keep an existing compatible `cn` |
| Behavior hook | `@/hooks/<name>` | For example `@/hooks/use-reveal` |

## Kit type

A kit module exports a `kit` object with all 23 common pieces and a `unique` map. This is used by the Restyle UI site and is not needed in a user project, but it is the complete export map:

| Export | File | Export | File |
|---|---|---|---|
| `Button` | `button.tsx` | `CountUp` | `count-up.tsx` |
| `TextLink` | `text-link.tsx` | `Input` | `input.tsx` |
| `Badge` | `badge.tsx` | `Hero` | `hero.tsx` |
| `Card` | `card.tsx` | `LogoStrip` | `logo-strip.tsx` |
| `LogoRow` | `logo-row.tsx` | `FeatureGrid` | `feature-grid.tsx` |
| `Navbar` | `navbar.tsx` | `FeatureTabs` | `feature-tabs.tsx` |
| `Footer` | `footer.tsx` | `Testimonials` | `testimonials.tsx` |
| `Tabs` | `tabs.tsx` | `Faq` | `faq.tsx` |
| `Accordion` | `accordion.tsx` | `Cta` | `cta.tsx` |
| `Dialog` | `dialog.tsx` | `FooterSection` | `footer-section.tsx` |
| `Carousel` | `carousel.tsx` | | |
| `Marquee` | `marquee.tsx` | | |
| `Reveal` | `reveal.tsx` | | |
