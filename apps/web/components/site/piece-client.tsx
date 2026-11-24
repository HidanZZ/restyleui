"use client"

import { CopyButton } from "@/components/site/copy-button"
import { useActiveKit } from "@/components/site/kit-context"
import { CommonPiecePreview } from "@/components/site/kit-preview"
import { KitSwatch } from "@/components/site/kit-swatch"
import { pieceMarkdown, type PieceDoc } from "@/components/site/piece-markdown"
import { SourceLabel } from "@/components/site/ui"
import type { CommonSlug } from "@/lib/catalog"
import { DEFAULT_KIT, kitMeta } from "@/lib/kits"

function PreviewPlaceholder({ tall }: { tall?: boolean }) {
  return (
    <div className={tall ? "min-h-[28rem]" : "min-h-72"} aria-hidden="true">
      <div className="flex h-full min-h-[inherit] items-center justify-center">
        <span className="h-2 w-24 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
      </div>
    </div>
  )
}

/** Preview of a common piece in the active kit. */
export function ActivePiecePreview({ slug, section }: { slug: CommonSlug; section?: boolean }) {
  const { kit } = useActiveKit()
  if (!kit) return <PreviewPlaceholder tall={section} />
  return <CommonPiecePreview key={kit} kit={kit} slug={slug} />
}

/** Swatch and name of the active kit, for the preview toolbar. */
export function ActiveKitName() {
  const { kit } = useActiveKit()
  if (!kit) return null
  return (
    <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
      <KitSwatch kit={kit} className="size-6 text-[10px]" />
      <span className="truncate">{kitMeta[kit].name}</span>
    </span>
  )
}

/** "From source" or "Designed in style" for the active kit. */
export function ActiveSourceLabel({ slug }: { slug: CommonSlug }) {
  const { kit } = useActiveKit()
  if (!kit) return <span className="h-6 w-28 rounded-full border border-border" aria-hidden="true" />
  const source = kitMeta[kit].pieces?.[slug]
  return (
    <>
      {source && <SourceLabel source={source} />}
      <span className="text-xs text-muted-foreground">in {kitMeta[kit].name}</span>
    </>
  )
}

/** Copies the page as markdown, for the active kit. */
export function CopyPageButton({ doc, slug }: { doc: PieceDoc; slug: CommonSlug }) {
  const { kit } = useActiveKit()
  return (
    <CopyButton
      variant="secondary"
      value={() => {
        const active = kit ?? DEFAULT_KIT
        return pieceMarkdown(doc, active, kitMeta[active].pieces[slug])
      }}
    >
      Copy Page
    </CopyButton>
  )
}
