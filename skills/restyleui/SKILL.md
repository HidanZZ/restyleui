---
name: restyleui
description: Build or restyle a React site with Restyle UI design kits. Use when the user asks for a Restyle UI site, wants @restyleui registry items installed with shadcn, or wants the Norma, Linear, Apple, Teamwork Graph or mckp look built from 15 shared components and 8 sections.
---

# Restyle UI

Restyle UI is a free, public library of design kits rebuilt from real websites. Every kit has the same 15 components and 8 sections with identical props, plus 2 or 3 unique pieces. Pieces install with the shadcn CLI.

Install this skill for another agent:

```bash
npx skills@latest add HidanZZ/restyleui --skill restyleui
```

Full index for agents: https://restyleui.dev/llms.txt

## Rules

- Pick exactly one kit for the site. Mixing kits is not supported.
- Read the installed kit `DESIGN.md` before building any UI.
- Use kit tokens for colors, fonts, radii and spacing. No hard-coded colors or font families.
- Use the shipped behaviors. Do not rebuild tabs, dialogs, drawers or carousels by hand.
- Restyle UI needs React 19 and Tailwind CSS v4.

## 1. Setup

If the project has no `components.json`, run:

```bash
npx shadcn@latest init
```

Let it add Tailwind and the `@/*` alias if they are missing.

Add the registry to `components.json`. Merge it with any existing `registries` keys:

```json
{
  "registries": {
    "@restyleui": "https://restyleui.dev/r/{name}.json"
  }
}
```

Install the theme bridge and one kit theme. This example uses Linear:

```bash
npx shadcn@latest add @restyleui/restyle-theme @restyleui/linear-theme
```

The files land at `app/restyle-theme.css`, `app/restyle-linear.css` and `restyle/linear/DESIGN.md`. In a project with a `src/` folder they land under `src/` (`src/app/restyle-linear.css`).

Add `@layer ui-sdk;` as the first line of the global stylesheet (`app/globals.css`, Vite `src/index.css`). ui-sdk injects a few runtime styles in that layer, and Tailwind utilities must win over them.

Add the two theme imports at the end of the same file, after the shadcn `:root`, `.dark` and `@theme` blocks. The result looks like this:

```css
@layer ui-sdk;

@import "tailwindcss";

/* shadcn theme blocks stay here */

@import "./restyle-theme.css";
@import "./restyle-linear.css";
```

Tailwind v4 inlines these imports. They must come after the shadcn variables because `:root` and `[data-kit="linear"]` have equal specificity, and the later rule wins. Fix the paths when the stylesheet lives in another folder (Vite with `src/` uses `./app/restyle-theme.css`).

Put one kit value on `<html>`:

```html
<html lang="en" data-kit="linear">
```

Next.js: `app/layout.tsx`. Vite: `index.html`. Only one `data-kit` value is supported.

Load the free fonts listed in `references/kits.md` and expose them as the CSS variables the kit stack reads. With Next.js:

```tsx
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" })

<html lang="en" data-kit="linear" className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
```

With Vite, add the Google Fonts link and define the same variables in `:root`. Define every variable the kit uses. If `--font-inter` is undefined, `var(--font-inter)` makes the whole font stack invalid.

## 2. Pick one kit

| Kit | `data-kit` | Mode | Look | Unique items after the kit prefix |
|---|---|---|---|---|
| Norma | `norma` | Light | White Swiss minimalism, near-black type, pill controls, steel photography | `globe`, `scroll-video-reveal`, `screen-time-calculator` |
| Linear | `linear` | Dark | Near-black product canvas, crisp Inter, restrained indigo, quick fades | `product-demo-hero`, `tech-spec-drawer` |
| Apple | `apple` | Light | Image-led product tiles, centered type, generous space, small blue actions | `endless-gallery`, `mega-nav` |
| Teamwork Graph | `teamwork` | Dark | Ink-black graph canvas, editorial display type, blue connectors, colored nodes | `odometer`, `overview-carousel`, `connector-marquee` |
| mckp | `mckp` | Dark | Black cinematic studio, 3D device renders, white buttons, quiet grey type | `library-preview`, `code-typing-demo` |

Item names are `<kit>-<slug>`, for example `@restyleui/teamwork-odometer`. Unique pieces have optional props with demo defaults, so `<Globe />` renders a complete demo. Read the installed file for their props; they are not part of the shared contract.

## 3. Read the design file

Installing a kit theme also installs `restyle/<kit>/DESIGN.md`. Read it before building. It documents the tokens, type scale, spacing, motion and do and don't rules for that kit.

## 4. Install pieces

Every common piece is one registry item: `@restyleui/<kit>-<slug>`.

```bash
npx shadcn@latest add @restyleui/linear-hero
npx shadcn@latest add @restyleui/linear-navbar @restyleui/linear-footer
```

The 23 common slugs:
- Components (15): `button`, `text-link`, `badge`, `card`, `logo-row`, `navbar`, `footer`, `tabs`, `accordion`, `dialog`, `carousel`, `marquee`, `reveal`, `count-up`, `input`.
- Sections (8): `hero`, `logo-strip`, `feature-grid`, `feature-tabs`, `testimonials`, `faq`, `cta`, `footer-section`.
- Landing page: `<kit>-landing`, for example `@restyleui/linear-landing`.

Each item writes `components/<slug>.tsx` and pulls the theme, contract, utils and hooks it needs. Imports are always:

```tsx
import { Hero } from "@/components/hero"
import type { HeroProps } from "@/lib/contract"
```

`@/lib/contract` is the installed source of truth for props. It is the same in every kit. See `references/contract.md` for a summary.

### Switch kits

Reinstall the same slugs with another kit prefix. Confirm the overwrite prompt, or pass `--overwrite`. Then change `data-kit`, swap the kit CSS import and load that kit's fonts. Page code does not change because props and export names are identical. Unique pieces exist only in their own kit, so replace or remove them when switching.

## 5. Compose pages

Build pages from the 8 sections and place the shared components inside them. A typical page: `Navbar`, `Hero`, `LogoStrip`, `FeatureGrid` or `FeatureTabs`, `Testimonials`, `Faq`, `Cta`, `FooterSection`.

```tsx
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Cta } from "@/components/cta"
import { FooterSection } from "@/components/footer-section"

export default function Page() {
  return (
    <>
      <Navbar brand="Acme" items={[{ label: "Product", href: "/product" }]} />
      <main>
        <Hero
          eyebrow="New"
          title="Ship your next idea"
          description="A short line about the product."
          actions={[{ label: "Start", href: "/start", variant: "primary" }]}
        />
        <Cta title="Ready to start?" actions={[{ label: "Get started", href: "/start" }]} />
      </main>
      <FooterSection
        brand="Acme"
        columns={[{ title: "Product", links: [{ label: "Features", href: "/features" }] }]}
        legal="© 2026 Acme"
      />
    </>
  )
}
```

Use the kit's landing item as a full reference page:

```bash
npx shadcn@latest add @restyleui/linear-landing
```

It installs `components/landing.tsx`. Read it before writing your own composition.

## 6. Build new components in the kit style

Read `DESIGN.md` first, then copy the patterns in the installed pieces from the same kit. Do not copy from another kit.

| Use | Utilities |
|---|---|
| Colors | `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `bg-accent`, `bg-popover` |
| Fonts | `font-body`, `font-display`, `font-mono` |
| Radii | `rounded-kit-sm`, `rounded-kit`, `rounded-kit-lg` |
| Motion | `ease-kit`, `ease-kit-in-out` |
| Layout | `max-w-kit`, `py-section`, `px-gutter` |
| Kit extras | `bg-(--norma-paper-2)`, `text-(--mckp-ink-dim)` and other `--<kit>-*` tokens |

Colors come from the token variables and nowhere else. If a value is missing, add a `--<kit>-*` variable to the kit theme and use `bg-(--<kit>-name)`. Never put hex, rgb or hsl values in a component.

Pieces pull their hooks automatically. When you need a behavior in a new component, install the hook explicitly:

```bash
npx shadcn@latest add @restyleui/use-reveal
```

The hooks are `use-kit-portal`, `use-scroll-state`, `use-reveal`, `use-in-view-video`, `use-scroll-progress`, `use-marquee`, `use-tilt`, `use-count-up` and `use-reduced-motion`. Each installs as `@restyleui/<name>` and imports from `@/hooks/<name>`. Read the doc comment at the top of each file for its signature.

Interaction parts come from ui-sdk:

```bash
npm install @ui-sdk/react @ui-sdk/core
```

Read `node_modules/@ui-sdk/react/docs/llms.txt` before using it. Import one entry per component, for example `import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@ui-sdk/react/dialog"`. Style parts with token utilities and their `data-*` state attributes (`data-open:`, `data-selected:`, `data-starting-style:`). Do not rebuild the behavior.

Kit tokens live on `[data-kit]`. Pass the container from `useKitPortal` to every Dialog, Drawer and NavigationMenu so the overlay stays inside the kit when ui-sdk falls back to a portal:

```tsx
"use client"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@ui-sdk/react/dialog"
import { useKitPortal } from "@/hooks/use-kit-portal"

export function ExampleDialog() {
  const [kitRef, container] = useKitPortal<HTMLButtonElement>()
  return (
    <Dialog container={container}>
      <DialogTrigger ref={kitRef}>Open</DialogTrigger>
      <DialogContent className="rounded-kit-lg border border-border bg-popover p-6 text-popover-foreground">
        <DialogTitle>Title</DialogTitle>
      </DialogContent>
    </Dialog>
  )
}
```

Put `kitRef` on an element that is always rendered, usually the trigger. Add `"use client"` to any file that uses state, effects, refs or event handlers.

Destructure hook results instead of reading fields off the returned object, for example `const { ref, visible } = useReveal()`. react-hooks v7 flags refs read during render. Never read `ref.current` during render.

## 7. Checks before finishing

- One kit: one `data-kit` value, one kit theme import, no pieces from another kit.
- Reduced motion: emulate `prefers-reduced-motion: reduce`. Content is visible, marquees are static, videos do not autoplay and numbers show final values. Add `motion-reduce:transition-none` or `motion-reduce:animate-none` to every transition or animation you write.
- Keyboard: tab through the navbar, tabs, accordion, carousel and dialogs. Focus is visible. Enter and Space activate. Escape closes overlays and focus returns to the trigger. Links are `<a>`, actions are `<button>`.
- Mobile 360 px: no horizontal scroll, the navbar uses its drawer, media fits and text does not overflow. Check 360 and 390 wide.
- Colors: grep your components for `#`, `rgb(`, `hsl(` and `oklch(`. Only the installed theme CSS may contain them.
- Fonts: the browser shows the kit fonts, not the generic fallback.
- Copy: no em dashes.

## More context

- https://restyleui.dev/llms.txt: index of kits, pieces, behaviors and docs.
- https://restyleui.dev/r/<name>.json: raw registry items.
- shadcn MCP: `npx shadcn@latest mcp init`. After `components.json` has `@restyleui`, the agent can search and view items.
- Preview an item without installing: `npx shadcn@latest view @restyleui/linear-hero`.
- `references/contract.md`: all contract props.
- `references/kits.md`: fonts, modes and unique items per kit.
