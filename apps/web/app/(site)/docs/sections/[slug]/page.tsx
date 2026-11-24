import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { DocsPageSkeleton } from "@/components/site/docs-page"
import { PiecePage } from "@/components/site/piece-page"
import { COMMON_PIECES } from "@/lib/catalog"

const KIND = "section"

const findPiece = (slug: string) => COMMON_PIECES.find((piece) => piece.slug === slug && piece.kind === KIND)

export function generateStaticParams() {
  return COMMON_PIECES.filter((piece) => piece.kind === KIND).map((piece) => ({ slug: piece.slug }))
}

export async function generateMetadata({ params }: PageProps<"/docs/sections/[slug]">): Promise<Metadata> {
  const piece = findPiece((await params).slug)
  return piece ? { title: piece.title, description: piece.description } : {}
}

export default function SectionPage({ params }: PageProps<"/docs/sections/[slug]">) {
  return (
    <Suspense fallback={<DocsPageSkeleton />}>
      {params.then(({ slug }) => {
        const piece = findPiece(slug)
        if (!piece) notFound()
        return <PiecePage slug={piece.slug} />
      })}
    </Suspense>
  )
}
