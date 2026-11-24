import type { Metadata } from "next"
import { ConnectorMarquee } from "@/registry/teamwork/components/connector-marquee"
import { Odometer } from "@/registry/teamwork/components/odometer"
import { OverviewCarousel } from "@/registry/teamwork/components/overview-carousel"

export const metadata: Metadata = {
  title: "Teamwork unique pieces (dev)",
  robots: { index: false },
}

function Note({ children }: { children: string }) {
  return (
    <div className="mx-auto max-w-kit px-gutter pt-16">
      <p className="max-w-[60ch] font-mono text-xs text-muted-foreground">{children}</p>
    </div>
  )
}

export default function Page() {
  return (
    <div data-kit="teamwork" className="min-h-svh bg-background font-body text-foreground">
      <Note>Staged overview carousel. Scenes advance every 7 s while in view; use the rows, dots or arrows to jump and reverse.</Note>
      <OverviewCarousel />
      <div className="h-[40vh]" />
      <Note>Odometer. Each column rolls into place when the row enters view.</Note>
      <div className="mx-auto grid w-full max-w-kit grid-cols-4 px-gutter py-16 max-xl:grid-cols-2 max-md:grid-cols-1">
        <Odometer />
        <Odometer label="Links between items" value={96604228915} />
        <Odometer label="Weekly lookups" value={392517064} />
        <Odometer label="Teams onboard" value={280} suffix="K+" />
      </div>
      <Note>Connector marquee. The rail drifts at 60 px/s; move the pointer along it to lift nearby tiles.</Note>
      <ConnectorMarquee />
      <div className="h-[30vh]" />
    </div>
  )
}
