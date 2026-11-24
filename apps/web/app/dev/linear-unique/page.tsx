import type { Metadata } from "next"
import { ProductDemoHero } from "@/registry/linear/components/product-demo-hero"
import { TechSpecDrawer } from "@/registry/linear/components/tech-spec-drawer"

export const metadata: Metadata = {
  title: "Linear unique pieces (dev)",
  robots: { index: false },
}

export default function Page() {
  return (
    <div data-kit="linear" className="min-h-screen bg-background font-body text-foreground">
      <ProductDemoHero />
      <section id="tech-specs" className="border-t border-border py-section">
        <TechSpecDrawer />
      </section>
      <div className="h-[60vh]" />
    </div>
  )
}
