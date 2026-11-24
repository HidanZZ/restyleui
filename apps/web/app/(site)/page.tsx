import Link from "next/link"

import { HomeWall } from "@/components/site/home-wall"
import { ArrowRightIcon } from "@/components/site/icons"
import { KitList } from "@/components/site/kit-list"
import { KitSwatch } from "@/components/site/kit-swatch"
import { GITHUB_URL } from "@/components/site/nav"
import { CopyPromptButton } from "@/components/site/prompt"
import { buttonPrimary, focusRing } from "@/components/site/ui"
import { KIT_SLUGS } from "@/lib/catalog"
import { kitMeta } from "@/lib/kits"
import { cn } from "@/registry/restyle/lib/utils"

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto flex max-w-[1440px] flex-col items-center px-4 pt-20 pb-14 text-center md:px-6 md:pt-28 md:pb-16">
        <h1 className="max-w-[16ch] text-[clamp(2.5rem,6.4vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
          Design kits rebuilt from real websites
        </h1>
        <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-pretty text-muted-foreground md:text-lg">
          Five kits share the same 23 components and sections with the same props. Pick a look, install it with the
          shadcn CLI, and let your agent build the rest in that style.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/docs" className={cn(buttonPrimary, "h-10 px-4")}>
            Get started
            <ArrowRightIcon className="size-4" />
          </Link>
          <CopyPromptButton variant="secondary" />
        </div>
        <ul aria-label="Kits" className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          {KIT_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                href={`/docs/kits/${slug}`}
                className={cn(
                  "flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground",
                  focusRing,
                )}
              >
                <KitSwatch kit={slug} className="size-6 text-[10px]" />
                {kitMeta[slug].brand}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Live pieces from every kit" className="mx-auto max-w-[1440px] px-4 md:px-6">
        <HomeWall />
      </section>

      <section id="kits" className="mx-auto max-w-3xl scroll-mt-20 px-4 pt-24 pb-28 md:px-6">
        <h2 className="text-2xl font-semibold tracking-[-0.02em]">Five kits, one set of props</h2>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-7 text-muted-foreground">
          Every kit ships in the native mode of its source site, with written design rules your agent reads before it
          builds.
        </p>
        <KitList className="mt-8" />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:px-6">
          <p>Restyle UI. MIT licensed. Brands, fonts and media belong to their owners.</p>
          <a href={GITHUB_URL} className={cn("rounded-sm hover:text-foreground", focusRing)}>
            GitHub
          </a>
        </div>
      </footer>
    </main>
  )
}
