import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { KIT_SLUGS } from "@/lib/catalog"
import { isKitSlug, kitMeta, loadKitModule } from "@/lib/kits"

export function generateStaticParams() {
  return KIT_SLUGS.map((kit) => ({ kit }))
}

export async function generateMetadata({ params }: PageProps<"/demo/[kit]">): Promise<Metadata> {
  const { kit } = await params
  return isKitSlug(kit) ? { title: `${kitMeta[kit].name} demo`, description: kitMeta[kit].description } : {}
}

/** Full-screen landing page of a kit, without the website chrome. */
export default function DemoPage({ params }: PageProps<"/demo/[kit]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      {params.then(({ kit }) => (
        <DemoContent kit={kit} />
      ))}
    </Suspense>
  )
}

async function DemoContent({ kit }: { kit: string }) {
  if (!isKitSlug(kit)) notFound()
  const load = loadKitModule(kit)

  if (!load) {
    return (
      <main data-kit={kit} className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="font-display text-3xl font-semibold">{kitMeta[kit].name}</h1>
        <p className="max-w-[40ch] text-muted-foreground">
          This kit is being built. Its live demo opens here as soon as the pieces are ready.
        </p>
        <a href={`/docs/kits/${kit}`} className="text-sm font-medium underline underline-offset-4">
          Back to the kit page
        </a>
      </main>
    )
  }

  const { Landing } = await load
  return (
    <div data-kit={kit} className="min-h-dvh">
      <Landing />
    </div>
  )
}
