import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getExample } from "@/lib/examples"
import { Accordion } from "@/registry/linear/components/accordion"
import { Badge } from "@/registry/linear/components/badge"
import { Button } from "@/registry/linear/components/button"
import { Card } from "@/registry/linear/components/card"
import { Carousel } from "@/registry/linear/components/carousel"
import { CountUp } from "@/registry/linear/components/count-up"
import { Dialog } from "@/registry/linear/components/dialog"
import { Footer } from "@/registry/linear/components/footer"
import { Input } from "@/registry/linear/components/input"
import { LogoRow } from "@/registry/linear/components/logo-row"
import { Marquee } from "@/registry/linear/components/marquee"
import { Navbar } from "@/registry/linear/components/navbar"
import { Reveal } from "@/registry/linear/components/reveal"
import { Tabs } from "@/registry/linear/components/tabs"
import { TextLink } from "@/registry/linear/components/text-link"

export const metadata: Metadata = {
  title: "Linear kit (dev)",
  robots: { index: false },
}

const kit = "linear"

function Piece({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <section id={slug} className="scroll-mt-24 border-t border-border py-12">
      <p className="mb-6 font-mono text-xs uppercase text-(--linear-text-quaternary)">{slug}</p>
      {children}
    </section>
  )
}

export default function Page() {
  return (
    <div data-kit="linear" className="min-h-screen bg-background font-body text-foreground [font-feature-settings:'cv01','ss03']">
      <Navbar {...getExample("navbar", kit)} />
      <main className="mx-auto max-w-kit px-[calc(var(--linear-homepage-padding-inset)+var(--linear-homepage-outer-padding))] pb-24 pt-12">
        <Piece slug="button">
          <div className="flex flex-wrap items-center gap-3">
            <Button {...getExample("button", kit)} />
            <Button {...getExample("button", kit)} variant="secondary" />
            <Button {...getExample("button", kit)} variant="ghost" />
            <Button {...getExample("button", kit)} size="sm" />
            <Button {...getExample("button", kit)} size="lg" />
            <Button {...getExample("button", kit)} href={undefined} disabled />
          </div>
        </Piece>
        <Piece slug="text-link">
          <TextLink {...getExample("text-link", kit)} />
        </Piece>
        <Piece slug="badge">
          <div className="flex flex-wrap items-center gap-6">
            <Badge {...getExample("badge", kit)} />
            <Badge {...getExample("badge", kit)} variant="neutral" />
          </div>
        </Piece>
        <Piece slug="card">
          <div className="grid gap-4 md:grid-cols-3">
            <Card {...getExample("card", kit)} />
          </div>
        </Piece>
        <Piece slug="logo-row">
          <LogoRow {...getExample("logo-row", kit)} />
        </Piece>
        <Piece slug="navbar">
          <p className="text-sm text-muted-foreground">Rendered at the top of the page.</p>
        </Piece>
        <Piece slug="tabs">
          <Tabs {...getExample("tabs", kit)} />
        </Piece>
        <Piece slug="accordion">
          <Accordion {...getExample("accordion", kit)} />
        </Piece>
        <Piece slug="dialog">
          <Dialog {...getExample("dialog", kit)} />
        </Piece>
        <Piece slug="carousel">
          <Carousel {...getExample("carousel", kit)} />
        </Piece>
        <Piece slug="marquee">
          <Marquee {...getExample("marquee", kit)} />
        </Piece>
        <Piece slug="reveal">
          <Reveal {...getExample("reveal", kit)} />
        </Piece>
        <Piece slug="count-up">
          <CountUp {...getExample("count-up", kit)} />
        </Piece>
        <Piece slug="input">
          <Input {...getExample("input", kit)} />
        </Piece>
        <Piece slug="footer">
          <p className="text-sm text-muted-foreground">Rendered at the bottom of the page.</p>
        </Piece>
      </main>
      <Footer {...getExample("footer", kit)} />
    </div>
  )
}
