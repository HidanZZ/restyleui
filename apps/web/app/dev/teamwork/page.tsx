import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getExample } from "@/lib/examples"
import { Accordion } from "@/registry/teamwork/components/accordion"
import { Badge } from "@/registry/teamwork/components/badge"
import { Button } from "@/registry/teamwork/components/button"
import { Card } from "@/registry/teamwork/components/card"
import { Carousel } from "@/registry/teamwork/components/carousel"
import { CountUp } from "@/registry/teamwork/components/count-up"
import { Dialog } from "@/registry/teamwork/components/dialog"
import { Footer } from "@/registry/teamwork/components/footer"
import { Input } from "@/registry/teamwork/components/input"
import { LogoRow } from "@/registry/teamwork/components/logo-row"
import { Marquee } from "@/registry/teamwork/components/marquee"
import { Navbar } from "@/registry/teamwork/components/navbar"
import { Reveal } from "@/registry/teamwork/components/reveal"
import { Tabs } from "@/registry/teamwork/components/tabs"
import { TextLink } from "@/registry/teamwork/components/text-link"

export const metadata: Metadata = {
  title: "Teamwork kit (dev)",
  robots: { index: false },
}

const kit = "teamwork"

function Piece({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className={wide ? "flex flex-col gap-4" : "mx-auto flex w-full max-w-kit flex-col gap-4 px-gutter"}>
      <p className={wide ? "mx-auto w-full max-w-kit px-gutter font-mono text-xs text-muted-foreground" : "font-mono text-xs text-muted-foreground"}>
        {label}
      </p>
      {children}
    </section>
  )
}

export default function Page() {
  return (
    <div data-kit="teamwork" className="min-h-screen">
      <Navbar {...getExample("navbar", kit)} />
      <main className="flex flex-col gap-24 py-16">
        <Piece label="button">
          <div className="flex flex-wrap items-center gap-4">
            <Button {...getExample("button", kit)} />
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm" variant="secondary">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Piece>
        <Piece label="text-link">
          <div>
            <TextLink {...getExample("text-link", kit)} />
          </div>
        </Piece>
        <Piece label="badge">
          <div className="flex flex-wrap gap-3">
            <Badge {...getExample("badge", kit)} />
            <Badge>Neutral</Badge>
          </div>
        </Piece>
        <Piece label="card">
          <div className="grid gap-4 md:grid-cols-3">
            <Card {...getExample("card", kit)} />
            <Card
              eyebrow="Notes"
              title="Decisions beside the work"
              description="Keep context close to the project it supports."
              media={{ type: "image", src: "/kits/teamwork/feature-2.webp", alt: "Notes beside a project" }}
            />
            <Card title="A card without media" description="Plain cards keep the same raised surface." href="/cards" />
          </div>
        </Piece>
        <Piece label="logo-row">
          <LogoRow {...getExample("logo-row", kit)} />
        </Piece>
        <Piece label="tabs">
          <Tabs {...getExample("tabs", kit)} />
        </Piece>
        <Piece label="accordion">
          <div className="max-w-md">
            <Accordion {...getExample("accordion", kit)} defaultValue={["planning"]} />
          </div>
        </Piece>
        <Piece label="dialog">
          <div>
            <Dialog {...getExample("dialog", kit)} />
          </div>
        </Piece>
        <Piece label="carousel">
          <Carousel {...getExample("carousel", kit)} />
        </Piece>
        <Piece label="marquee" wide>
          <Marquee {...getExample("marquee", kit)} />
        </Piece>
        <Piece label="reveal">
          <Reveal {...getExample("reveal", kit)} />
        </Piece>
        <Piece label="count-up">
          <div className="flex flex-wrap gap-12">
            <CountUp {...getExample("count-up", kit)} />
            <CountUp value={67874635481} />
          </div>
        </Piece>
        <Piece label="input">
          <Input {...getExample("input", kit)} />
        </Piece>
      </main>
      <p className="mx-auto w-full max-w-kit px-gutter pb-4 font-mono text-xs text-muted-foreground">footer</p>
      <Footer {...getExample("footer", kit)} />
    </div>
  )
}
