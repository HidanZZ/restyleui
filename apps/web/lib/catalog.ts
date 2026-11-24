/**
 * Website-only catalog of kits and common pieces. Not installed by users.
 */
import type { Kit } from "@/registry/restyle/lib/contract"

export const KIT_SLUGS = ["norma", "linear", "apple", "teamwork", "mckp"] as const
export type KitSlug = (typeof KIT_SLUGS)[number]

export type PieceSource = "source" | "designed"

export type KitMeta = {
  slug: KitSlug
  /** Display name, for example "Linear style". */
  name: string
  /** Original brand, for example "Linear". */
  brand: string
  /** Original website. */
  url: string
  /** One sentence about the look and motion feel. */
  description: string
  mode: "light" | "dark"
  fonts: {
    role: "body" | "display" | "mono"
    original: string
    license: "free" | "paid" | "private" | "system"
    /** Free font used when the original is not available. */
    fallback: string
    buyUrl?: string
  }[]
  /** Whether each common piece was ported from the source or designed in the kit's style. */
  pieces: Record<CommonSlug, PieceSource>
  unique: { slug: string; title: string; description: string; source: PieceSource }[]
}

type CommonPiece = {
  slug: string
  /** Export name in the kit module, matching `Kit`. */
  exportName: keyof Kit
  title: string
  description: string
  kind: "component" | "section"
  group: "Actions" | "Layout" | "Navigation" | "Disclosure" | "Motion" | "Forms" | "Sections"
}

export const COMMON_PIECES = [
  { slug: "button", exportName: "Button", title: "Button", kind: "component", group: "Actions", description: "Primary, secondary and ghost actions, as a button or a link." },
  { slug: "text-link", exportName: "TextLink", title: "Text Link", kind: "component", group: "Actions", description: "Inline link with the kit's hover and arrow treatment." },
  { slug: "badge", exportName: "Badge", title: "Badge", kind: "component", group: "Actions", description: "Small label for status, category or announcements." },
  { slug: "card", exportName: "Card", title: "Card", kind: "component", group: "Layout", description: "Media, title and copy in the kit's surface style." },
  { slug: "logo-row", exportName: "LogoRow", title: "Logo Row", kind: "component", group: "Layout", description: "A row of customer or partner logos." },
  { slug: "navbar", exportName: "Navbar", title: "Navbar", kind: "component", group: "Navigation", description: "Top navigation with dropdowns and a mobile drawer." },
  { slug: "footer", exportName: "Footer", title: "Footer", kind: "component", group: "Navigation", description: "Link columns, social links and legal line." },
  { slug: "tabs", exportName: "Tabs", title: "Tabs", kind: "component", group: "Disclosure", description: "Switch between panels with the kit's animated indicator." },
  { slug: "accordion", exportName: "Accordion", title: "Accordion", kind: "component", group: "Disclosure", description: "Sections that expand in place." },
  { slug: "dialog", exportName: "Dialog", title: "Dialog", kind: "component", group: "Disclosure", description: "Modal overlay that returns focus when it closes." },
  { slug: "carousel", exportName: "Carousel", title: "Carousel", kind: "component", group: "Motion", description: "Swipeable slides with controls and optional autoplay." },
  { slug: "marquee", exportName: "Marquee", title: "Marquee", kind: "component", group: "Motion", description: "Endless horizontal scroll of content." },
  { slug: "reveal", exportName: "Reveal", title: "Reveal", kind: "component", group: "Motion", description: "Entrance animation when content scrolls into view." },
  { slug: "count-up", exportName: "CountUp", title: "Count Up", kind: "component", group: "Motion", description: "Number that counts up when it scrolls into view." },
  { slug: "input", exportName: "Input", title: "Input", kind: "component", group: "Forms", description: "Single field with a submit button, for signups." },
  { slug: "hero", exportName: "Hero", title: "Hero", kind: "section", group: "Sections", description: "Headline, copy, actions and media at the top of a page." },
  { slug: "logo-strip", exportName: "LogoStrip", title: "Logo Strip", kind: "section", group: "Sections", description: "Section of trusted-by logos." },
  { slug: "feature-grid", exportName: "FeatureGrid", title: "Feature Grid", kind: "section", group: "Sections", description: "Grid of features with icons or media." },
  { slug: "feature-tabs", exportName: "FeatureTabs", title: "Feature Tabs", kind: "section", group: "Sections", description: "Features shown one at a time behind tabs." },
  { slug: "testimonials", exportName: "Testimonials", title: "Testimonials", kind: "section", group: "Sections", description: "Customer quotes." },
  { slug: "faq", exportName: "Faq", title: "FAQ", kind: "section", group: "Sections", description: "Questions and answers in an accordion." },
  { slug: "cta", exportName: "Cta", title: "Call to Action", kind: "section", group: "Sections", description: "Closing call to action with buttons or a signup field." },
  { slug: "footer-section", exportName: "FooterSection", title: "Footer Section", kind: "section", group: "Sections", description: "Page footer with an optional newsletter signup." },
] as const satisfies readonly CommonPiece[]

export type CommonSlug = (typeof COMMON_PIECES)[number]["slug"]
