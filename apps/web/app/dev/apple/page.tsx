import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getExample } from "@/lib/examples"
import { Accordion } from "@/registry/apple/components/accordion"
import { Badge } from "@/registry/apple/components/badge"
import { Button } from "@/registry/apple/components/button"
import { Card } from "@/registry/apple/components/card"
import { Carousel } from "@/registry/apple/components/carousel"
import { CountUp } from "@/registry/apple/components/count-up"
import { Dialog } from "@/registry/apple/components/dialog"
import { Footer } from "@/registry/apple/components/footer"
import { Input } from "@/registry/apple/components/input"
import { LogoRow } from "@/registry/apple/components/logo-row"
import { Marquee } from "@/registry/apple/components/marquee"
import { Navbar } from "@/registry/apple/components/navbar"
import { Reveal } from "@/registry/apple/components/reveal"
import { Tabs } from "@/registry/apple/components/tabs"
import { TextLink } from "@/registry/apple/components/text-link"

export const metadata: Metadata = {
  title: "Apple components (dev)",
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

const card = getExample("card", "apple")

export default function Page() {
  return (
    <div data-kit="apple" className="min-h-screen bg-background font-body text-foreground antialiased">
      <Navbar {...getExample("navbar", "apple")} />

      <Piece slug="button">
        <div className="flex flex-wrap items-center gap-4">
          <Button {...getExample("button", "apple")} />
          <Button variant="secondary" href="/pricing">
            View pricing
          </Button>
          <Button variant="ghost">Ghost action</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="lg" variant="secondary">
            Large outline
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Piece>

      <Piece slug="text-link">
        <p className="text-[17px] tracking-[-.022em]">
          <TextLink {...getExample("text-link", "apple")} />
        </p>
      </Piece>

      <Piece slug="badge">
        <div className="flex items-center gap-3">
          <Badge {...getExample("badge", "apple")} />
          <Badge>Neutral</Badge>
        </div>
      </Piece>

      <Piece slug="card" wide>
        <div className="grid gap-3 px-3 min-[735px]:grid-cols-2 max-[734px]:px-0">
          <Card {...card} />
          <Card
            eyebrow={card.eyebrow}
            title="Notes beside the work"
            description="Decisions stay close to the plan."
            media={{ type: "image", src: "/kits/apple/feature-1.webp", alt: "A compact camera on a gray backdrop" }}
            href="/features/notes"
          />
        </div>
      </Piece>

      <Piece slug="logo-row">
        <LogoRow {...getExample("logo-row", "apple")} />
      </Piece>

      <Piece slug="tabs">
        <Tabs {...getExample("tabs", "apple")} />
      </Piece>

      <Piece slug="accordion">
        <Accordion {...getExample("accordion", "apple")} />
      </Piece>

      <Piece slug="dialog">
        <Dialog {...getExample("dialog", "apple")} />
      </Piece>

      <Piece slug="carousel" wide>
        <Carousel {...getExample("carousel", "apple")} />
      </Piece>

      <Piece slug="carousel-autoplay" wide>
        <Carousel {...getExample("carousel", "apple")} autoplay />
      </Piece>

      <Piece slug="marquee" wide>
        <Marquee {...getExample("marquee", "apple")} />
      </Piece>

      <Piece slug="reveal">
        <Reveal
          {...getExample("reveal", "apple")}
          className="text-center [&_h3]:font-display [&_h3]:text-[40px] [&_h3]:leading-[1.1] [&_h3]:font-semibold [&_p]:mt-2 [&_p]:text-[21px] [&_p]:text-muted-foreground"
        />
      </Piece>

      <Piece slug="count-up">
        <CountUp {...getExample("count-up", "apple")} />
      </Piece>

      <Piece slug="input">
        <Input {...getExample("input", "apple")} />
      </Piece>

      <Piece slug="footer" wide>
        <Footer {...getExample("footer", "apple")} />
      </Piece>
    </div>
  )
}
