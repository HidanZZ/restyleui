import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getExample } from "@/lib/examples"
import { Accordion } from "@/registry/norma/components/accordion"
import { Badge } from "@/registry/norma/components/badge"
import { Button } from "@/registry/norma/components/button"
import { Card } from "@/registry/norma/components/card"
import { Carousel } from "@/registry/norma/components/carousel"
import { CountUp } from "@/registry/norma/components/count-up"
import { Dialog } from "@/registry/norma/components/dialog"
import { Footer } from "@/registry/norma/components/footer"
import { Input } from "@/registry/norma/components/input"
import { LogoRow } from "@/registry/norma/components/logo-row"
import { Marquee } from "@/registry/norma/components/marquee"
import { Navbar } from "@/registry/norma/components/navbar"
import { Reveal } from "@/registry/norma/components/reveal"
import { Tabs } from "@/registry/norma/components/tabs"
import { TextLink } from "@/registry/norma/components/text-link"

export const metadata: Metadata = {
  title: "Norma components (dev)",
  robots: { index: false },
}

function Piece({ slug, children, wide = false }: { slug: string; children: ReactNode; wide?: boolean }) {
  return (
    <section id={slug} className={wide ? "py-10" : "mx-auto w-full max-w-kit px-gutter py-10"}>
      <p className={wide ? "mx-auto mb-5 max-w-kit px-gutter font-mono text-xs text-muted-foreground" : "mb-5 font-mono text-xs text-muted-foreground"}>
        {slug}
      </p>
      {children}
    </section>
  )
}

export default function Page() {
  return (
    <div
      data-kit="norma"
      className="min-h-screen bg-background pb-24 font-body text-foreground antialiased [font-feature-settings:var(--norma-font-features)]"
    >
      <Navbar {...getExample("navbar", "norma")} />

      {/* Dark block marked data-norma-invert: the navbar turns to white glass over it. */}
      <div className="px-(--norma-gutter-outer) pt-(--norma-gutter-outer)">
        <div
          data-norma-invert
          className="relative mx-auto flex min-h-[70vh] max-w-(--norma-container-wide) items-end overflow-hidden rounded-kit-lg bg-(--norma-coal)"
        >
          <img src="/kits/norma/hero.webp" alt="" className="absolute inset-0 size-full object-cover" />
          <p className="relative mx-auto w-full max-w-kit px-gutter pb-10 font-mono text-xs text-primary-foreground/80">
            navbar (over a block with data-norma-invert)
          </p>
        </div>
      </div>

      <Piece slug="button">
        <div className="flex flex-wrap items-center gap-3">
          <Button {...getExample("button", "norma")} />
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button
            size="lg"
            icon={
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
              </svg>
            }
          >
            Large with icon
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Piece>

      <Piece slug="text-link">
        <TextLink {...getExample("text-link", "norma")} />
      </Piece>

      <Piece slug="badge">
        <div className="flex flex-wrap gap-3">
          <Badge {...getExample("badge", "norma")} />
          <Badge>Neutral badge</Badge>
        </div>
      </Piece>

      <Piece slug="card">
        <div className="grid gap-4 md:grid-cols-2">
          <Card {...getExample("card", "norma")} />
          <Card
            title="A card without a link"
            description="Image media, no eyebrow."
            media={{ type: "image", src: "/kits/norma/feature-2.webp", alt: "A steel disc on linen" }}
          />
        </div>
      </Piece>

      <Piece slug="logo-row">
        <LogoRow {...getExample("logo-row", "norma")} />
      </Piece>

      <Piece slug="tabs">
        <Tabs {...getExample("tabs", "norma")} />
      </Piece>

      <Piece slug="accordion">
        <Accordion {...getExample("accordion", "norma")} />
      </Piece>

      <Piece slug="dialog">
        <Dialog {...getExample("dialog", "norma")} />
      </Piece>

      <Piece slug="carousel">
        <Carousel {...getExample("carousel", "norma")} />
      </Piece>

      <Piece slug="marquee" wide>
        <Marquee {...getExample("marquee", "norma")} />
      </Piece>

      <Piece slug="reveal">
        <Reveal {...getExample("reveal", "norma")} />
      </Piece>

      <Piece slug="count-up">
        <CountUp {...getExample("count-up", "norma")} />
      </Piece>

      <Piece slug="input">
        <Input {...getExample("input", "norma")} />
      </Piece>

      <Piece slug="footer" wide>
        <Footer {...getExample("footer", "norma")} />
      </Piece>
    </div>
  )
}
