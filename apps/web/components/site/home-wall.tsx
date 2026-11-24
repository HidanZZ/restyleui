/**
 * Home page wall: live pieces from every registered kit, mostly unique ones.
 * Kits that are not registered yet show a specimen tile drawn with their tokens.
 */
import Link from "next/link"

import { ArrowRightIcon } from "@/components/site/icons"
import { CommonPiecePreview, UniquePiecePreview } from "@/components/site/kit-preview"
import { focusRing } from "@/components/site/ui"
import { COMMON_PIECES, KIT_SLUGS, type CommonSlug, type KitSlug } from "@/lib/catalog"
import { isKitRegistered, kitMeta } from "@/lib/kits"
import { cn } from "@/registry/restyle/lib/utils"

type Tile =
  | { type: "unique"; kit: KitSlug; slug: string; title: string; href: string }
  | { type: "common"; kit: KitSlug; slug: CommonSlug; title: string; href: string }
  | { type: "pending"; kit: KitSlug; href: string }

/** Small common components that read well at tile size, one per kit in turn. */
const WALL_COMPONENTS: CommonSlug[] = ["button", "count-up", "input", "tabs", "badge", "accordion", "card", "marquee"]

function buildTiles(): Tile[] {
  const perKit = KIT_SLUGS.map((kit, kitIndex): Tile[] => {
    const meta = kitMeta[kit]
    if (!isKitRegistered(kit)) return [{ type: "pending", kit, href: `/docs/kits/${kit}` }]
    const unique: Tile[] = meta.unique.map((piece) => ({
      type: "unique",
      kit,
      slug: piece.slug,
      title: piece.title,
      href: `/docs/kits/${kit}/${piece.slug}`,
    }))
    const common: Tile[] = [0, 1].map((offset) => {
      const slug = WALL_COMPONENTS[(kitIndex * 2 + offset) % WALL_COMPONENTS.length]
      const piece = COMMON_PIECES.find((item) => item.slug === slug)!
      return { type: "common", kit, slug, title: piece.title, href: `/docs/components/${slug}?kit=${kit}` }
    })
    return [...unique, ...common]
  })
  // Interleave kits so neighbouring tiles come from different kits.
  const tiles: Tile[] = []
  for (let round = 0; perKit.some((list) => round < list.length); round++) {
    for (const list of perKit) if (list[round]) tiles.push(list[round])
  }
  return tiles
}

function PendingTile({ kit }: { kit: KitSlug }) {
  const meta = kitMeta[kit]
  return (
    <div data-kit={kit} className="flex min-h-64 flex-col justify-between gap-10 p-6">
      <div className="flex flex-col gap-2">
        <span className="font-display text-3xl leading-[1.05] font-semibold">{meta.brand}</span>
        <span className="max-w-[30ch] text-sm text-muted-foreground">{meta.description}</span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {meta.unique.map((piece) => (
          <li key={piece.slug} className="rounded-full border border-border px-3 py-1 text-xs">
            {piece.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HomeWall() {
  const tiles = buildTiles()
  // A long wall is capped and fades out; a short one (kits still being built) shows in full.
  const capped = tiles.length > 9
  return (
    <div className={cn("relative", capped && "max-h-[2200px] overflow-hidden")}>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {tiles.map((tile) => (
          <WallTile key={`${tile.kit}-${tile.type}-${"slug" in tile ? tile.slug : ""}`} tile={tile} />
        ))}
      </div>
      {capped && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background to-transparent" />
      )}
    </div>
  )
}

function WallTile({ tile }: { tile: Tile }) {
  const meta = kitMeta[tile.kit]
  const label = tile.type === "pending" ? "Being built" : tile.title
  return (
    <figure className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-background">
      {tile.type === "unique" && <UniquePiecePreview kit={tile.kit} slug={tile.slug} title={tile.title} />}
      {tile.type === "common" && <CommonPiecePreview kit={tile.kit} slug={tile.slug} />}
      {tile.type === "pending" && <PendingTile kit={tile.kit} />}
      <figcaption className="border-t border-border">
        <Link
          href={tile.href}
          className={cn(
            "group flex h-11 items-center justify-between gap-3 px-4 text-sm transition-colors duration-150 hover:bg-muted/50",
            focusRing,
            "focus-visible:-outline-offset-2",
          )}
        >
          <span className="min-w-0 truncate">
            <span className="font-medium">{label}</span>
            <span className="text-muted-foreground"> · {meta.name}</span>
          </span>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
      </figcaption>
    </figure>
  )
}
