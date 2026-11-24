# Restyle UI architecture

Every agent and contributor follows this file. The product scope is in `docs/SCOPE.md`.

## Layout

Everything lives in the Next.js app `apps/web`. The `@/` alias points to `apps/web/`.

```
apps/web/
  app/                         website routes
  lib/catalog.ts               website-only: kit slugs, KitMeta type, common piece list
  registry.json                shadcn registry manifest (generated, see "Registry")
  registry/
    kits.css                   imports every kit theme.css
    restyle/
      lib/contract.ts          shared props for every common piece and the Kit type
      lib/utils.ts             cn()
      theme.css                theme bridge: token names -> Tailwind utilities
      hooks/use-*.ts           shared behaviors
    <kit>/                     norma | linear | apple | teamwork | mckp
      theme.css                kit tokens under [data-kit="<kit>"]
      DESIGN.md                design rules for agents
      meta.ts                  default export: KitMeta (lib/catalog.ts)
      index.ts                 exports `kit` (satisfies Kit) and `unique`
      landing.tsx              full landing page built only from this kit
      components/<slug>.tsx    common components, sections and unique pieces (flat)
  public/kits/<kit>/           generated media for this kit
  public/r/                    built registry JSON (gitignored)
```

## Import rules

The shadcn CLI rewrites imports when a user installs an item. Use only these forms inside `registry/`:

| Import in our repo | Becomes in the user's project |
|---|---|
| `@/registry/<kit>/components/<slug>` | `@/components/<slug>` |
| `@/registry/restyle/hooks/<hook>` | `@/hooks/<hook>` |
| `@/registry/restyle/lib/contract` | `@/lib/contract` |
| `@/registry/restyle/lib/utils` | `@/lib/utils` |

- Never import from `@/lib/*`, `@/app/*` or `next/*` inside `registry/`. Registry code is plain React 19 and runs in Next.js, Vite or React Router.
- Use `<a>` and `<img>` / `<video>`, not `next/link` or `next/image`.
- Add `"use client"` to any file that uses state, effects, refs or event handlers.
- npm packages allowed in registry code: `react`, `@ui-sdk/core`, `@ui-sdk/react`, `motion`, `clsx`, `tailwind-merge`. Nothing else without asking the orchestrator.

## Contract

`registry/restyle/lib/contract.ts` is the single source of truth for props.

- Every kit implements all 15 common components and 8 common sections with exactly the contract props. Do not add props. Do not change the contract. If a prop seems missing, report it to the orchestrator instead of working around it.
- Export names and file slugs:

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

- Each file exports one named component. Sections compose the kit's own components (for example `Faq` uses the kit's `Accordion`).
- Unique pieces live in the same `components/` folder with their own slug. Every prop of a unique piece is optional and defaults to good demo content, so `<Globe />` renders a complete demo.
- `registry/<kit>/index.ts`:

```ts
import type { Kit } from "@/registry/restyle/lib/contract"
// ...imports of every component
export const kit = { Button, TextLink, /* ...all 23 */ } satisfies Kit
export const unique = { globe: Globe, /* slug: Component */ }
```

## Tokens

Each kit's `theme.css` defines these variables under `[data-kit="<kit>"]` and nothing at `:root`. Users add `data-kit="<kit>"` to `<html>`. The bridge in `registry/restyle/theme.css` maps them to Tailwind utilities.

| Variables | Tailwind utilities |
|---|---|
| `--background --foreground --card --card-foreground --popover --popover-foreground --primary --primary-foreground --secondary --secondary-foreground --muted --muted-foreground --accent --accent-foreground --border --input --ring` | `bg-background`, `text-muted-foreground`, `border-border`, ... (shadcn names) |
| `--kit-font-body --kit-font-display --kit-font-mono` | `font-body`, `font-display`, `font-mono` |
| `--kit-radius-sm --kit-radius --kit-radius-lg` | `rounded-kit-sm`, `rounded-kit`, `rounded-kit-lg` |
| `--kit-ease --kit-ease-in-out` | `ease-kit`, `ease-kit-in-out` |
| `--kit-container` (max width) | `max-w-kit` |
| `--kit-section-y` (section vertical padding) | `py-section` |
| `--kit-gutter` (page side padding) | `px-gutter` |

- Kit-specific extra values use the prefix `--<kit>-`, for example `--norma-sand`, and are used with Tailwind arbitrary values such as `bg-(--norma-sand)`.
- Type scale, letter spacing and similar details can be extra `--<kit>-*` variables or Tailwind arbitrary values inside components. Write them down in `DESIGN.md`.
- Each kit ships in its native mode only: Norma and Apple are light; Linear, Teamwork and mckp are dark.

## Fonts

The website loads these free Google fonts in `app/layout.tsx` and exposes them as CSS variables:

| Variable | Font |
|---|---|
| `--font-inter` | Inter |
| `--font-inter-tight` | Inter Tight |
| `--font-manrope` | Manrope |
| `--font-newsreader` | Newsreader |
| `--font-plex-mono` | IBM Plex Mono |
| `--font-dm-mono` | DM Mono |
| `--font-jetbrains-mono` | JetBrains Mono |

A kit font stack puts the original font name first, then a free fallback from this table, then generic families. Example: `--kit-font-body: "Suisse Intl", var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif;`. Apple style uses `-apple-system, BlinkMacSystemFont, "SF Pro Text", var(--font-inter), sans-serif`. Do not commit font files. Users load free fonts themselves; `theme.css` says how in a comment.

## Media

No original images, videos or logos. Kit media is generated (see the `imagegen` skill) or drawn with CSS and SVG, and saved under `apps/web/public/kits/<kit>/` as `.webp` images and `.mp4` loops. Every kit provides this standard set, so shared examples work with any kit:

| File | Use | Size |
|---|---|---|
| `hero.webp` | Hero media | 2400x1500 |
| `feature-1.webp` .. `feature-3.webp` | Feature grid and cards | 1200x900 |
| `tab-1.webp` .. `tab-3.webp` | Feature tabs | 1600x1000 |
| `avatar-1.webp` .. `avatar-3.webp` | Testimonials | 256x256 |
| `loop.mp4` + `loop-poster.webp` | Video media, 4 to 8 s, no audio, under 2 MB | 1600x900 |

Logos in examples are text wordmarks of invented company names (`Logo` without `src`).

## Behaviors

Shared behaviors live in `registry/restyle/hooks/`. Interaction-heavy parts come from `@ui-sdk/react` (Tabs, Accordion, Dialog, Drawer, NavigationMenu, Carousel). Read `apps/web/node_modules/@ui-sdk/react/docs/llms.txt` before using ui-sdk. Each hook file starts with a doc comment: what it does, its signature, and a usage example. Every behavior respects `prefers-reduced-motion`.

Overlays (dialogs, drawers, dropdowns) must render inside the element that carries `data-kit`, so kit tokens still apply. The behavior docs explain how (portal container).

## Registry

- Item names: `restyle-utils`, `restyle-contract`, `restyle-theme`, `use-<behavior>` for hooks, `<kit>-theme`, `<kit>-<slug>` for every component, section and unique piece, `<kit>-landing`.
- Users add `"@restyleui": "https://restyleui.dev/r/{name}.json"` to `registries` in `components.json`, then run `npx shadcn add @restyleui/linear-tabs`.
- `registry.json` is generated by `pnpm registry:gen` from the files on disk, `lib/catalog.ts` and each kit's `meta.ts`. Never edit it by hand.
- `pnpm registry:build` writes `apps/web/public/r/*.json`.

## Website routes

| Route | Page |
|---|---|
| `/` | Home: hero over a wall of live kit pieces, Copy Prompt |
| `/docs` | Introduction |
| `/docs/installation` | Setup for Next.js and Vite |
| `/docs/agents` | Agent skill, `llms.txt`, shadcn MCP |
| `/docs/kits/[kit]` | Kit page: live demo link, tokens, fonts, piece list |
| `/docs/kits/[kit]/[piece]` | Unique piece page |
| `/docs/behaviors/[slug]` | Behavior page |
| `/docs/components/[slug]` | Common component page, follows the kit switcher |
| `/docs/sections/[slug]` | Common section page, follows the kit switcher |
| `/demo/[kit]` | Full-screen landing page of a kit, no website chrome |
| `/r/<name>.json` | Registry items |
| `/llms.txt` | Agent index |

## Quality rules for registry code

- Accessible names, focus styles, keyboard support. ui-sdk parts handle ARIA for interactive pieces.
- Respect `prefers-reduced-motion` in every animation.
- Responsive from 360 px to 1920 px.
- No hard-coded colors or fonts outside `theme.css`: use the token utilities or `--<kit>-*` variables.
- Copy in examples and landing pages is neutral and invented. No original brand copy, no em dashes.
