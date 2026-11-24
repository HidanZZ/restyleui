import { Cta } from "@/registry/apple/components/cta"
import { EndlessGallery } from "@/registry/apple/components/endless-gallery"
import { Faq } from "@/registry/apple/components/faq"
import { FeatureGrid } from "@/registry/apple/components/feature-grid"
import { FeatureTabs } from "@/registry/apple/components/feature-tabs"
import { FooterSection } from "@/registry/apple/components/footer-section"
import { Hero } from "@/registry/apple/components/hero"
import { LogoStrip } from "@/registry/apple/components/logo-strip"
import { MegaNav } from "@/registry/apple/components/mega-nav"
import { Testimonials } from "@/registry/apple/components/testimonials"
import type { FooterSectionProps } from "@/registry/restyle/lib/contract"

const media = (file: string, alt: string) => ({ type: "image" as const, src: `/kits/apple/${file}`, alt })

// The light hero tile: the hero reads these variables in place of its dark defaults.
const lightTile =
  "[--apple-hero-bg:var(--apple-tile-light)] [--apple-hero-fg:var(--apple-text)] [--apple-hero-muted:var(--apple-secondary-text)] [--apple-hero-link:var(--apple-link)]"

const footer: FooterSectionProps = {
  brand: "Northwind",
  description:
    "Trade-in values depend on the condition, year and configuration of your device. Delivery times vary by location and model.",
  columns: [
    {
      title: "Shop and Learn",
      links: [
        { label: "Store", href: "#" },
        { label: "Laptops", href: "#" },
        { label: "Tablets", href: "#" },
        { label: "Phones", href: "#" },
        { label: "Wearables", href: "#" },
        { label: "Audio", href: "#" },
        { label: "Home", href: "#" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Northwind One", href: "#" },
        { label: "Stream", href: "#" },
        { label: "Music", href: "#" },
        { label: "Cloud Storage", href: "#" },
      ],
    },
    {
      title: "Northwind Store",
      links: [
        { label: "Find a Store", href: "#" },
        { label: "Order Status", href: "#" },
        { label: "Trade In", href: "#" },
        { label: "Financing", href: "#" },
        { label: "Personal Setup", href: "#" },
      ],
    },
    {
      title: "About Northwind",
      links: [
        { label: "Newsroom", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Environment", href: "#" },
        { label: "Accessibility", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ],
  social: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Sales and Refunds", href: "#" },
    { label: "Site Map", href: "#" },
  ],
  legal: "2026 Northwind Inc. All rights reserved.",
  newsletter: {
    title: "Hear about new devices first.",
    input: {
      label: "Email address",
      buttonLabel: "Sign up",
      type: "email",
      name: "email",
      placeholder: "name@example.com",
      hint: "One short note when something new arrives.",
      successMessage: "You’re on the list. See you at the next launch.",
    },
  },
}

/**
 * Northwind, an invented maker of calm home devices, in the order of the
 * source homepage: the flyout nav, full-bleed hero tiles, a two-up promo grid,
 * the endless gallery, then the kit's added sections and the global footer.
 */
export function Landing() {
  return (
    <div className="min-h-dvh bg-background font-body text-foreground antialiased">
      <h1 className="sr-only">Northwind</h1>
      <MegaNav brandLabel="Northwind" />

      <main className="flex flex-col gap-(--apple-section-gap) pb-(--apple-section-gap)">
        <Hero
          eyebrow="New"
          title="Echo Stone"
          description="Room-filling sound, shaped to sit quietly."
          actions={[
            { label: "Learn more", href: "#", variant: "primary" },
            { label: "Buy", href: "#", variant: "secondary" },
          ]}
          media={media("hero.webp", "The Echo Stone speaker and its round remote on a dark surface")}
        />

        <Hero
          title="Hub Cinema"
          description="A big picture that fits on a shelf."
          actions={[
            { label: "Learn more", href: "#", variant: "primary" },
            { label: "Buy", href: "#", variant: "secondary" },
          ]}
          media={media("tab-1.webp", "The Hub Cinema projector, a soft gray puck with a single lens")}
          className={lightTile}
        />

        <FeatureGrid
          title="There’s more to explore."
          description="New colors, new sizes and a few small surprises across the lineup."
          features={[
            {
              title: "Lens One",
              description: "Pocket sized. Studio sharp.",
              media: media("feature-1.webp", "The Lens One camera in brushed titanium"),
            },
            {
              title: "Echo Max",
              description: "Quiet, wherever you are.",
              media: media("feature-3.webp", "Echo Max over-ear headphones in silver"),
            },
            {
              title: "Slate Fold",
              description: "Two screens. One open idea.",
              media: media("tab-3.webp", "The Slate Fold display standing half open"),
            },
            {
              title: "Room Speaker",
              description: "Fills the room, not the shelf.",
              media: media("tab-2.webp", "The Room Speaker, a tall woven column with a warm light ring"),
            },
            {
              title: "Hub Remote",
              description: "One dial for the whole house.",
              media: media("feature-2.webp", "The Hub Remote, a white handheld with a glass face and a metal dial"),
            },
            {
              title: "Trade In",
              description: "Turn your old device into credit for a new one.",
              media: {
                type: "video",
                src: "/kits/apple/loop.mp4",
                poster: "/kits/apple/loop-poster.webp",
                alt: "A speaker, a camera and headphones shown one after another",
              },
            },
          ]}
        />

        <EndlessGallery title="New every night." />

        <FeatureTabs
          eyebrow="Northwind Home"
          title="One home. Every room."
          description="Picture, sound and control that set themselves up together."
          tabs={[
            {
              id: "watch",
              label: "Watch",
              title: "A cinema on any wall",
              description: "Hub Cinema finds the wall, sets the focus and dims the lights for you.",
              media: media("tab-1.webp", "The Hub Cinema projector on a pale blue surface"),
            },
            {
              id: "listen",
              label: "Listen",
              title: "Sound that follows you",
              description: "Echo Stone and Room Speaker pass the music along as you move between rooms.",
              media: media("hero.webp", "The Echo Stone speaker beside its round remote"),
            },
            {
              id: "control",
              label: "Control",
              title: "One dial for the house",
              description: "Hub Remote turns the volume, the lights and the heat from the same small dial.",
              media: media("feature-2.webp", "The Hub Remote, a white handheld with a glass face and a metal dial"),
            },
          ]}
        />

        <LogoStrip
          title="Reviewed by the people who test everything."
          logos={[
            { name: "Daylight Review" },
            { name: "Circuit Weekly" },
            { name: "Open Signal" },
            { name: "The Morning Ledger" },
            { name: "Field Notes" },
            { name: "Hearth & Home" },
          ]}
        />

        <Testimonials
          title="Made to be lived with."
          testimonials={[
            {
              quote: "It disappears into the room until you press play. Then it fills the whole house.",
              name: "Amara Okafor",
              role: "Audio editor, Daylight Review",
              avatar: "/kits/apple/avatar-1.webp",
            },
            {
              quote: "The setup took one tap. The projector found the wall before I found the remote.",
              name: "Jonas Lindqvist",
              role: "Senior writer, Circuit Weekly",
              avatar: "/kits/apple/avatar-2.webp",
            },
            {
              quote: "The rare device that looks as calm as it sounds. Everything just works together.",
              name: "Priya Raman",
              role: "Home tech columnist, Open Signal",
              avatar: "/kits/apple/avatar-3.webp",
            },
          ]}
        />

        <Faq
          title="Questions? Answers."
          description="Everything you need to know before your new device arrives."
          items={[
            {
              question: "How fast is delivery?",
              answer: "Most orders arrive in two to four business days. You can also pick up in a store near you, often the same day.",
            },
            {
              question: "Can I trade in my current device?",
              answer: "Yes. Answer a few questions about your device and get credit toward a new one, applied at checkout or as a gift card.",
            },
            {
              question: "Do Northwind devices work together?",
              answer: "Every speaker, screen and remote joins the same home on first start, so music, video and controls move with you.",
            },
            {
              question: "What does the warranty cover?",
              answer: "Each device includes one year of hardware coverage and ninety days of setup help. Northwind Care extends both.",
            },
            {
              question: "What if it’s not right for me?",
              answer: "Return any device within fourteen days of delivery for a full refund, no questions asked.",
            },
          ]}
        />

        <Cta
          title="Which Northwind is right for you?"
          description="Compare every model, side by side."
          actions={[
            { label: "Compare models", href: "#", variant: "primary" },
            { label: "Find a store", href: "#", variant: "secondary" },
          ]}
        />
      </main>

      <FooterSection {...footer} />
    </div>
  )
}
