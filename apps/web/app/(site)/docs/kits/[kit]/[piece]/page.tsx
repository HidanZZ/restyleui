import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { Command } from "@/components/site/code-block"
import { A, Code, DocsPage, DocsPageSkeleton, H2, P } from "@/components/site/docs-page"
import { UniquePiecePreview } from "@/components/site/kit-preview"
import { KitSwatch } from "@/components/site/kit-swatch"
import { SourceCode } from "@/components/site/piece-page"
import { PieceTabs } from "@/components/site/piece-tabs"
import { SourceLabel } from "@/components/site/ui"
import { KIT_SLUGS } from "@/lib/catalog"
import { isKitSlug, kitMeta } from "@/lib/kits"

function findPiece(kit: string, slug: string) {
  if (!isKitSlug(kit)) return null
  const piece = kitMeta[kit].unique.find((item) => item.slug === slug)
  return piece ? { kit, piece } : null
}

export function generateStaticParams() {
  const params = KIT_SLUGS.flatMap((kit) => kitMeta[kit].unique.map((piece) => ({ kit, piece: piece.slug })))
  // Cache Components needs at least one param; the placeholder resolves to a 404.
  return params.length > 0 ? params : [{ kit: KIT_SLUGS[0], piece: "none" }]
}

export async function generateMetadata({ params }: PageProps<"/docs/kits/[kit]/[piece]">): Promise<Metadata> {
  const { kit, piece } = await params
  const found = findPiece(kit, piece)
  return found
    ? { title: `${found.piece.title} · ${kitMeta[found.kit].name}`, description: found.piece.description }
    : {}
}

export default function UniquePiecePage({ params }: PageProps<"/docs/kits/[kit]/[piece]">) {
  return (
    <Suspense fallback={<DocsPageSkeleton />}>
      {params.then((resolved) => (
        <UniquePieceContent kit={resolved.kit} piece={resolved.piece} />
      ))}
    </Suspense>
  )
}

function UniquePieceContent({ kit: kitParam, piece: pieceParam }: { kit: string; piece: string }) {
  const found = findPiece(kitParam, pieceParam)
  if (!found) notFound()
  const { kit, piece } = found
  const meta = kitMeta[kit]
  const name = `@restyleui/${kit}-${piece.slug}`

  return (
    <DocsPage
      href={`/docs/kits/${kit}/${piece.slug}`}
      section={`Unique · ${meta.name}`}
      title={piece.title}
      description={piece.description}
      meta={
        <>
          <SourceLabel source={piece.source} />
          <span className="text-xs text-muted-foreground">
            Only in <A href={`/docs/kits/${kit}`}>{meta.name}</A>
          </span>
        </>
      }
      toc={[
        { id: "preview", title: "Preview" },
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
      ]}
    >
      <section id="preview" aria-labelledby="preview-heading" className="scroll-mt-20">
        <h2 id="preview-heading" className="sr-only">
          Preview
        </h2>
        <PieceTabs
          preview={<UniquePiecePreview kit={kit} slug={piece.slug} title={piece.title} />}
          code={<SourceCode kit={kit} slug={piece.slug} />}
          aside={
            <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <KitSwatch kit={kit} className="size-6 text-[10px]" />
              <span className="truncate">{meta.name}</span>
            </span>
          }
        />
      </section>

      <H2 id="installation">Installation</H2>
      <P>This piece belongs to {meta.name} only, so the kit switcher does not change it.</P>
      <Command command={`npx shadcn@latest add ${name}`} />

      <H2 id="usage">Usage</H2>
      <P>
        Every prop is optional and defaults to demo content, so <Code>{`<${toExportName(piece.slug)} />`}</Code>{" "}
        renders a complete piece. Pass your own content through its props; the installed file documents them.
      </P>
    </DocsPage>
  )
}

function toExportName(slug: string) {
  return slug.replace(/(^|-)(\w)/g, (_, __, char: string) => char.toUpperCase())
}
