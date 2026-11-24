import type { Metadata } from "next"
import { Globe } from "@/registry/norma/components/globe"
import { ScreenTimeCalculator } from "@/registry/norma/components/screen-time-calculator"
import { ScrollVideoReveal } from "@/registry/norma/components/scroll-video-reveal"

export const metadata: Metadata = {
  title: "Norma unique pieces (dev)",
  robots: { index: false },
}

function Note({ children }: { children: string }) {
  return (
    <div className="mx-auto max-w-kit px-gutter py-section">
      <p className="max-w-[48ch] text-(length:--norma-text-body-lg) text-muted-foreground">{children}</p>
    </div>
  )
}

export default function Page() {
  return (
    <div data-kit="norma" className="min-h-svh bg-background font-body text-foreground [font-feature-settings:var(--norma-font-features)]">
      <Note>Globe, tilt mode. Move the pointer over it to lean the globe and aim the beam; press and drag to spin it.</Note>
      <Globe />
      <Note>Globe, drift mode. It turns on its own and keeps the spin you give it.</Note>
      <Globe mode="drift" title="Somewhere, it is already evening." action={{ label: "See how it works", href: "#" }} />
      <Note>Screen time calculator, media variant. Drag the fields up or down, or type.</Note>
      <ScreenTimeCalculator />
      <Note>Screen time calculator, paper variant.</Note>
      <div className="mx-auto max-w-kit px-gutter">
        <ScreenTimeCalculator variant="paper" />
      </div>
      <div className="h-[60vh]" />
      <Note>Scroll video reveal. Scroll down slowly; scroll back up to rewind.</Note>
      <ScrollVideoReveal />
      <div className="h-[80vh]" />
    </div>
  )
}
