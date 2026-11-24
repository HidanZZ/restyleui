import type { Metadata } from "next"
import { EndlessGallery } from "@/registry/apple/components/endless-gallery"
import { MegaNav } from "@/registry/apple/components/mega-nav"

export const metadata: Metadata = {
  title: "Apple unique pieces (dev)",
  robots: { index: false },
}

const tiles = [
  { title: "Field 15", text: "Thin, light and ready for the long day.", image: "/kits/apple/hero.webp", dark: true },
  { title: "Slate Studio", text: "A bigger canvas for every idea.", image: "/kits/apple/feature-1.webp", dark: false },
]

/** Scratch page for the Apple unique pieces: the mega nav over page content, then the gallery. */
export default function Page() {
  return (
    <div data-kit="apple" className="min-h-dvh bg-background font-body text-foreground">
      <MegaNav />
      <main className="grid gap-3 pt-3">
        {tiles.map((tile) => (
          <section
            key={tile.title}
            className={
              tile.dark
                ? "bg-(--apple-tile-dark) px-gutter pt-12 text-center text-(--apple-tile-dark-text)"
                : "bg-(--apple-tile-light) px-gutter pt-12 text-center text-foreground"
            }
          >
            <h1 className="font-display text-[40px] leading-[1.1] font-semibold min-[1069px]:text-[56px] min-[1069px]:leading-[1.0714285714]">
              {tile.title}
            </h1>
            <p className="mt-1.5 text-[21px] leading-[1.1904761905] min-[1069px]:text-[28px] min-[1069px]:leading-[1.1428571429]">
              {tile.text}
            </p>
            <img src={tile.image} alt="" className="mx-auto mt-8 h-[360px] w-full max-w-[960px] object-cover" />
          </section>
        ))}
        <EndlessGallery />
        <section className="bg-(--apple-tile-light) px-gutter py-section text-center text-muted-foreground">
          <p className="mx-auto max-w-[640px]">
            Hover a category in the bar to open the flyout. Below 834px the burger opens the full-screen menu.
          </p>
        </section>
      </main>
    </div>
  )
}
