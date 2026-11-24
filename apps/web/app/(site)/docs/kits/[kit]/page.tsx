import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { CopyButton } from "@/components/site/copy-button"
import { Code, DataTable, DocsPage, DocsPageSkeleton, H2, P } from "@/components/site/docs-page"
import { ArrowRightIcon, ArrowUpRightIcon, ChevronIcon } from "@/components/site/icons"
import { KitSwatch } from "@/components/site/kit-swatch"
import { isColorValue, readKitTokens, type Token } from "@/components/site/theme-tokens"
import { buttonPrimary, buttonSecondary, focusRing, SourceLabel } from "@/components/site/ui"
import { COMMON_PIECES, KIT_SLUGS, type KitSlug } from "@/lib/catalog"
import { isKitRegistered, isKitSlug, kitMeta } from "@/lib/kits"
import { cn } from "@/registry/restyle/lib/utils"

export function generateStaticParams() {
  return KIT_SLUGS.map((kit) => ({ kit }))
}

export async function generateMetadata({ params }: PageProps<"/docs/kits/[kit]">): Promise<Metadata> {
  const { kit } = await params
  return isKitSlug(kit) ? { title: kitMeta[kit].name, description: kitMeta[kit].description } : {}
}

const LICENSE_LABEL = { free: "Free", paid: "Paid", private: "Private", system: "System" } as const

function ColorSwatches({ kit, tokens }: { kit: KitSlug; tokens: Token[] }) {
  return (
    <ul className="my-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
      {tokens.map((token) => (
        <li key={token.name} className="flex min-w-0 flex-col gap-2">
          {/* The frame carries data-kit, so it paints the kit's own background and translucent values read true. */}
          <span
            data-kit={kit}
            className="relative h-14 overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
          >
            <span className="absolute inset-0" style={{ background: `var(--${token.name})` }} />
          </span>
          <span className="flex min-w-0 flex-col">
            <code className="truncate font-mono text-[12.5px] text-foreground">--{token.name}</code>
            <code className="truncate font-mono text-xs text-muted-foreground" title={token.value}>
              {token.value}
            </code>
          </span>
        </li>
      ))}
    </ul>
  )
}

function TokenTable({ kit, tokens }: { kit: KitSlug; tokens: Token[] }) {
  return (
    <DataTable
      head={["Token", "Value"]}
      rows={tokens.map((token) => [
        <code key="name" className="font-mono text-[13px] whitespace-nowrap">
          --{token.name}
        </code>,
        <span key="value" className="flex min-w-0 items-center gap-2.5">
          {isColorValue(token.value) && (
            <span
              data-kit={kit}
              className="relative size-4 shrink-0 overflow-hidden rounded border border-black/10 dark:border-white/15"
            >
              <span className="absolute inset-0" style={{ background: `var(--${token.name})` }} />
            </span>
          )}
          <code className="font-mono text-[12.5px] leading-5 break-all text-muted-foreground">{token.value}</code>
        </span>,
      ])}
    />
  )
}

function PieceRows({ kit, kind }: { kit: KitSlug; kind: "component" | "section" }) {
  const meta = kitMeta[kit]
  const base = kind === "component" ? "/docs/components" : "/docs/sections"
  return (
    <ul className="my-4 divide-y divide-border rounded-xl border border-border">
      {COMMON_PIECES.filter((piece) => piece.kind === kind).map((piece) => {
        const name = `@restyleui/${kit}-${piece.slug}`
        const source = meta.pieces?.[piece.slug]
        return (
          <li key={piece.slug} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
            <Link
              href={`${base}/${piece.slug}?kit=${kit}`}
              className={cn("min-w-32 flex-1 text-sm font-medium hover:underline hover:underline-offset-4", focusRing)}
            >
              {piece.title}
            </Link>
            {source && <SourceLabel source={source} />}
            <span className="flex items-center gap-1 sm:w-64">
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{name}</code>
              <CopyButton value={`npx shadcn@latest add ${name}`} label={`Copy install command for ${piece.title}`} />
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default function KitPage({ params }: PageProps<"/docs/kits/[kit]">) {
  return (
    <Suspense fallback={<DocsPageSkeleton />}>
      {params.then(({ kit }) => (
        <KitContent kit={kit} />
      ))}
    </Suspense>
  )
}

function KitContent({ kit }: { kit: string }) {
  if (!isKitSlug(kit)) notFound()
  const meta = kitMeta[kit]
  const tokens = readKitTokens(kit)
  const registered = isKitRegistered(kit)
  const otherTokens = [...tokens.fonts, ...tokens.shape]

  return (
    <DocsPage
      href={`/docs/kits/${kit}`}
      section="Kits"
      title={
        <span className="flex items-center gap-4">
          <KitSwatch kit={kit} className="size-11 rounded-lg text-base" />
          {meta.name}
        </span>
      }
      description={meta.description}
      meta={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{meta.mode === "dark" ? "Dark mode" : "Light mode"}</span>
          <span aria-hidden="true">·</span>
          <a
            href={meta.url}
            className={cn("inline-flex items-center gap-1 hover:text-foreground", focusRing)}
            target="_blank"
            rel="noreferrer"
          >
            Inspired by {meta.brand}
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        </span>
      }
      toc={[
        { id: "demo", title: "Live demo" },
        { id: "fonts", title: "Fonts" },
        { id: "colors", title: "Colors" },
        { id: "tokens", title: "Other tokens" },
        { id: "components", title: "Components" },
        { id: "sections", title: "Sections" },
        { id: "unique", title: "Unique pieces" },
      ]}
    >
      <H2 id="demo">Live demo</H2>
      <div
        data-kit={kit}
        className="flex flex-col items-start gap-4 rounded-xl border border-border p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-col gap-1">
          <p className="font-display text-xl font-semibold">A full landing page, built only from this kit.</p>
          <p className="text-sm text-muted-foreground">
            {registered ? "Opens without the website around it." : "This kit is being built. The demo opens when it is ready."}
          </p>
        </div>
        {/* Inside data-kit, so the button takes the kit's own colors. */}
        <Link
          href={`/demo/${kit}`}
          className={cn(
            registered ? buttonPrimary : buttonSecondary,
            "shrink-0",
            !registered && "pointer-events-none opacity-60",
          )}
          aria-disabled={!registered}
          tabIndex={registered ? undefined : -1}
        >
          Open live demo
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <H2 id="fonts">Fonts</H2>
      <P>
        The original font comes first in each stack. When it is not available, the free fallback renders instead.
      </P>
      <DataTable
        head={["Role", "Original", "Fallback", "License"]}
        rows={meta.fonts.map((font) => [
          <span key="role" className="capitalize">
            {font.role}
          </span>,
          <span key="original" className="font-medium whitespace-nowrap">
            {font.original}
          </span>,
          <span key="fallback" className="whitespace-nowrap text-muted-foreground">
            {font.fallback}
          </span>,
          <span key="license" className="flex items-center gap-2 whitespace-nowrap">
            {LICENSE_LABEL[font.license]}
            {font.buyUrl && (
              <a
                href={font.buyUrl}
                target="_blank"
                rel="noreferrer"
                className={cn("inline-flex items-center gap-0.5 text-muted-foreground hover:text-foreground", focusRing)}
              >
                Buy
                <ArrowUpRightIcon className="size-3" />
              </a>
            )}
          </span>,
        ])}
      />

      <H2 id="colors">Colors</H2>
      {tokens.colors.length > 0 ? (
        <>
          <P>
            Defined under <Code>{`[data-kit="${kit}"]`}</Code> with the shadcn names, so kit tokens also restyle
            shadcn/ui components.
          </P>
          <ColorSwatches kit={kit} tokens={tokens.colors} />
        </>
      ) : (
        <P className="text-muted-foreground">The color tokens of this kit are being written.</P>
      )}

      <H2 id="tokens">Other tokens</H2>
      {otherTokens.length + tokens.extras.length > 0 ? (
        <>
          <TokenTable kit={kit} tokens={otherTokens} />
          {tokens.extras.length > 0 && (
            <details className="group my-4 rounded-xl border border-border [&>div]:my-0 [&>div]:rounded-none [&>div]:border-x-0 [&>div]:border-b-0">
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden",
                  focusRing,
                )}
              >
                <span>
                  {tokens.extras.length} kit-specific tokens
                  <span className="ml-2 font-normal text-muted-foreground">
                    used as arbitrary values, for example <Code>{`bg-(--${tokens.extras[0].name})`}</Code>
                  </span>
                </span>
                <ChevronIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-180" />
              </summary>
              <TokenTable kit={kit} tokens={tokens.extras} />
            </details>
          )}
        </>
      ) : (
        <P className="text-muted-foreground">The tokens of this kit are being written.</P>
      )}

      <H2 id="components">Components</H2>
      <PieceRows kit={kit} kind="component" />

      <H2 id="sections">Sections</H2>
      <PieceRows kit={kit} kind="section" />

      <H2 id="unique">Unique pieces</H2>
      {meta.unique.length > 0 ? (
        <ul className="my-4 grid gap-3 sm:grid-cols-2">
          {meta.unique.map((piece) => (
            <li key={piece.slug}>
              <Link
                href={`/docs/kits/${kit}/${piece.slug}`}
                className={cn(
                  "group flex h-full flex-col gap-2 rounded-xl border border-border p-4 transition-colors duration-150 hover:bg-muted/50",
                  focusRing,
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-semibold">{piece.title}</span>
                  <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
                <span className="text-sm text-muted-foreground">{piece.description}</span>
                <SourceLabel source={piece.source} className="mt-auto self-start" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <P className="text-muted-foreground">Unique pieces for this kit are being designed.</P>
      )}
    </DocsPage>
  )
}
