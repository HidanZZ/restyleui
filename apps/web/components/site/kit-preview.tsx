"use client"

import { Component, Suspense, use, type ComponentType, type ReactNode } from "react"

import { COMMON_PIECES, type CommonSlug, type KitSlug } from "@/lib/catalog"
import { getExample } from "@/lib/examples"
import { kitMeta, loadKitModule, type KitModule } from "@/lib/kits"
import { cn } from "@/registry/restyle/lib/utils"

export type PreviewKind = "component" | "section" | "unique"

const FRAME: Record<PreviewKind, string> = {
  component: "min-h-72 justify-center p-6 sm:p-10",
  section: "min-h-[28rem]",
  unique: "min-h-[26rem] justify-center",
}

/** Components that span the frame edge to edge, like on a real page. */
const FULL_BLEED: Partial<Record<CommonSlug, string>> = {
  navbar: "min-h-[26rem] justify-start p-0 sm:p-0",
  footer: "p-0 sm:p-0",
  marquee: "px-0 sm:px-0",
  "logo-row": "px-0 sm:px-0",
  carousel: "px-0 sm:px-0",
}

/**
 * Preview frame for kit pieces. Applies the kit's tokens with `data-kit`, and
 * `contain: layout paint` makes it the containing block for `position: fixed`
 * descendants (navbars, dialogs, drawers), so they stay inside the frame.
 */
export function KitPreview({
  kit,
  kind = "component",
  className,
  children,
}: {
  kit: KitSlug
  kind?: PreviewKind
  className?: string
  children: ReactNode
}) {
  return (
    <div
      data-kit={kit}
      className={cn(
        "relative isolate flex w-full flex-col overflow-hidden [contain:layout_paint]",
        FRAME[kind],
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Shown in place of previews while a kit is not registered on the website yet. */
export function KitPending({ kit, switchable = true }: { kit: KitSlug; switchable?: boolean }) {
  const meta = kitMeta[kit]
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="font-display text-2xl leading-tight font-semibold">{meta.name}</span>
      <p className="max-w-[34ch] text-sm text-muted-foreground">
        This kit is being built. Its pieces appear here as soon as they are ready.
        {switchable && " Pick another kit with the switcher in the corner."}
      </p>
    </div>
  )
}

function PreviewSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center p-8" aria-hidden="true">
      <span className="h-2 w-24 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
    </div>
  )
}

class PreviewBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="text-sm font-medium">This preview failed to render.</p>
          <p className="max-w-[44ch] font-mono text-xs text-muted-foreground">{this.state.error.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}

function Loaded({ promise, render }: { promise: Promise<KitModule>; render: (mod: KitModule) => ReactNode }) {
  return render(use(promise))
}

/** Loads a kit module and renders from it, with pending, loading and error states. */
export function KitModuleView({
  kit,
  render,
  switchable,
}: {
  kit: KitSlug
  render: (mod: KitModule) => ReactNode
  /** Whether the kit switcher changes this preview; tunes the "being built" hint. */
  switchable?: boolean
}) {
  const promise = loadKitModule(kit)
  if (!promise) return <KitPending kit={kit} switchable={switchable} />
  return (
    <PreviewBoundary key={kit}>
      <Suspense fallback={<PreviewSkeleton />}>
        <Loaded promise={promise} render={render} />
      </Suspense>
    </PreviewBoundary>
  )
}

/** A common component or section of one kit, rendered with the shared example props. */
export function CommonPiecePreview({ kit, slug, kind }: { kit: KitSlug; slug: CommonSlug; kind?: PreviewKind }) {
  const piece = COMMON_PIECES.find((item) => item.slug === slug)!
  const frameKind = kind ?? piece.kind
  return (
    <KitPreview kit={kit} kind={frameKind} className={frameKind === "component" ? FULL_BLEED[slug] : undefined}>
      <KitModuleView
        kit={kit}
        render={(mod) => {
          const Piece = mod.kit[piece.exportName] as ComponentType<object> | undefined
          if (!Piece) return <MissingPiece title={piece.title} />
          const element = <Piece {...(getExample(slug, kit) as object)} />
          // Components sit centered; full-width ones (w-full) still stretch inside the row.
          return frameKind === "component" ? <div className="flex w-full justify-center">{element}</div> : element
        }}
      />
    </KitPreview>
  )
}

/** A unique piece of one kit, rendered with its built-in demo content. */
export function UniquePiecePreview({ kit, slug, title }: { kit: KitSlug; slug: string; title: string }) {
  return (
    <KitPreview kit={kit} kind="unique">
      <KitModuleView
        kit={kit}
        switchable={false}
        render={(mod) => {
          const Piece = mod.unique[slug]
          return Piece ? <Piece /> : <MissingPiece title={title} />
        }}
      />
    </KitPreview>
  )
}

function MissingPiece({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
      {title} is not in this kit yet.
    </div>
  )
}
