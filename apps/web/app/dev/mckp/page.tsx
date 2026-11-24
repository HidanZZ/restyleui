import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getExample } from "@/lib/examples"
import { Accordion } from "@/registry/mckp/components/accordion"
import { Badge } from "@/registry/mckp/components/badge"
import { Button } from "@/registry/mckp/components/button"
import { Card } from "@/registry/mckp/components/card"
import { Carousel } from "@/registry/mckp/components/carousel"
import { CountUp } from "@/registry/mckp/components/count-up"
import { Dialog } from "@/registry/mckp/components/dialog"
import { Footer } from "@/registry/mckp/components/footer"
import { Input } from "@/registry/mckp/components/input"
import { LogoRow } from "@/registry/mckp/components/logo-row"
import { Marquee } from "@/registry/mckp/components/marquee"
import { Navbar } from "@/registry/mckp/components/navbar"
import { Reveal } from "@/registry/mckp/components/reveal"
import { Tabs } from "@/registry/mckp/components/tabs"
import { TextLink } from "@/registry/mckp/components/text-link"

export const metadata: Metadata = {
  title: "mckp components (dev)",
  robots: { index: false },
}

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-border py-12">
      <p className="font-mono text-xs leading-6 text-(--mckp-ink-mono)">{label}</p>
      {children}
    </section>
  )
}

export default function Page() {
  const card = getExample("card", "mckp")
  const button = getExample("button", "mckp")
  const badge = getExample("badge", "mckp")

  return (
    <div data-kit="mckp" className="min-h-dvh">
      <Navbar {...getExample("navbar", "mckp")} />

      <main className="mx-auto max-w-kit px-gutter pb-24">
        <Demo label="button">
          <div className="flex flex-wrap items-center gap-3">
            <Button {...button} />
            <Button {...button} variant="secondary" href={undefined}>
              Secondary
            </Button>
            <Button {...button} variant="ghost" href={undefined}>
              Ghost
            </Button>
            <Button {...button} size="sm" href={undefined}>
              Small
            </Button>
            <Button {...button} size="lg" href={undefined}>
              Large
            </Button>
            <Button {...button} href={undefined} disabled>
              Disabled
            </Button>
          </div>
        </Demo>

        <Demo label="text-link">
          <div className="flex flex-wrap gap-8">
            <TextLink {...getExample("text-link", "mckp")} />
            <TextLink href="/docs">Read the docs</TextLink>
          </div>
        </Demo>

        <Demo label="badge">
          <div className="flex flex-wrap gap-8">
            <Badge {...badge} />
            <Badge variant="neutral">Version notes</Badge>
          </div>
        </Demo>

        <Demo label="card">
          <div className="grid gap-0.5 md:grid-cols-3">
            <Card {...card} />
            <Card eyebrow="Sep 28, 2026" title={card.title} description={card.description} href={card.href} />
            <Card eyebrow="02" title="Notes beside the work" description="Keep decisions close to the project they support." />
          </div>
        </Demo>

        <Demo label="logo-row">
          <LogoRow {...getExample("logo-row", "mckp")} />
        </Demo>

        <Demo label="tabs">
          <Tabs {...getExample("tabs", "mckp")} />
        </Demo>

        <Demo label="accordion">
          <div className="lg:grid lg:grid-cols-9">
            <Accordion {...getExample("accordion", "mckp")} className="lg:col-span-4 lg:col-start-5" />
          </div>
        </Demo>

        <Demo label="dialog">
          <div>
            <Dialog {...getExample("dialog", "mckp")} />
          </div>
        </Demo>

        <Demo label="carousel">
          <Carousel {...getExample("carousel", "mckp")} />
        </Demo>

        <Demo label="marquee">
          <Marquee {...getExample("marquee", "mckp")} />
        </Demo>

        <Demo label="reveal">
          <Reveal {...getExample("reveal", "mckp")} />
        </Demo>

        <Demo label="count-up">
          <CountUp {...getExample("count-up", "mckp")} />
        </Demo>

        <Demo label="input">
          <Input {...getExample("input", "mckp")} />
        </Demo>
      </main>

      <Footer {...getExample("footer", "mckp")} />
    </div>
  )
}
