/**
 * Common component and section pages (server). Previews, labels and install
 * commands follow the kit switcher; code is highlighted at build time for every kit.
 */
import fs from "node:fs"
import path from "node:path"
import type { ReactNode } from "react"

import { CodeBlock, KitCommand } from "@/components/site/code-block"
import { getProps, type PropDoc } from "@/components/site/contract-props"
import { Code, DataTable, DocsPage, H2, P } from "@/components/site/docs-page"
import { ByKit } from "@/components/site/by-kit"
import {
  ActiveKitName,
  ActivePiecePreview,
  ActiveSourceLabel,
  CopyPageButton,
} from "@/components/site/piece-client"
import { PieceTabs } from "@/components/site/piece-tabs"
import { COMMON_PIECES, KIT_SLUGS, type CommonSlug, type KitSlug } from "@/lib/catalog"

/** Source of `registry/<kit>/components/<slug>.tsx`, or `null` while it is not written. */
export function readKitSource(kit: KitSlug, slug: string): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), "registry", kit, "components", `${slug}.tsx`), "utf8")
  } catch {
    return null
  }
}

/** Highlighted source of one kit's piece, as shown in the Code tab. */
export async function SourceCode({ kit, slug }: { kit: KitSlug; slug: string }) {
  const source = readKitSource(kit, slug)
  if (source === null) {
    return (
      <div className="flex min-h-48 items-center justify-center p-8 text-center text-sm text-muted-foreground">
        The source of this piece is not written yet.
      </div>
    )
  }
  return <CodeBlock code={source} lang="tsx" title={`components/${slug}.tsx`} maxHeight />
}

/** Renders `backtick` spans of a contract comment as inline code. */
function withInlineCode(text: string) {
  return text.split(/`([^`]+)`/g).map((part, index) => (index % 2 === 1 ? <Code key={index}>{part}</Code> : part))
}

export function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <DataTable
      head={["Prop", "Type", "Description"]}
      rows={props.map((prop) => [
        <code key="name" className="font-mono text-[13px] whitespace-nowrap text-foreground">
          {prop.name}
          {prop.required ? "" : "?"}
        </code>,
        <code key="type" className="block min-w-48 font-mono text-[12.5px] leading-5 text-muted-foreground">
          {prop.type}
        </code>,
        <span key="description" className="block min-w-40 text-sm leading-6 text-foreground/85">
          {prop.description ? withInlineCode(prop.description) : prop.required ? "Required." : ""}
        </span>,
      ])}
    />
  )
}

export function PiecePage({ slug }: { slug: CommonSlug }) {
  const piece = COMMON_PIECES.find((item) => item.slug === slug)!
  const isSection = piece.kind === "section"
  const base = isSection ? "/docs/sections" : "/docs/components"
  const props = getProps(`${piece.exportName}Props`)
  const doc = {
    slug,
    title: piece.title,
    description: piece.description,
    exportName: piece.exportName,
    url: `https://restyleui.dev${base}/${slug}`,
    props,
  }

  const code = Object.fromEntries(
    KIT_SLUGS.map((kit) => [kit, <SourceCode key={kit} kit={kit} slug={slug} />]),
  ) as Record<KitSlug, ReactNode>

  return (
    <DocsPage
      href={`${base}/${slug}`}
      section={isSection ? "Sections" : "Components"}
      title={piece.title}
      description={piece.description}
      meta={<ActiveSourceLabel slug={slug} />}
      actions={<CopyPageButton doc={doc} slug={slug} />}
      toc={[
        { id: "preview", title: "Preview" },
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "props", title: "Props" },
      ]}
    >
      <section id="preview" aria-labelledby="preview-heading" className="scroll-mt-20">
        <h2 id="preview-heading" className="sr-only">
          Preview
        </h2>
        <PieceTabs
          preview={<ActivePiecePreview slug={slug} section={isSection} />}
          code={<ByKit items={code} />}
          aside={<ActiveKitName />}
        />
      </section>

      <H2 id="installation">Installation</H2>
      <P>Install it for the kit picked in the switcher. The kit&apos;s theme comes along if it is missing.</P>
      <KitCommand command={(kit) => `npx shadcn@latest add @restyleui/${kit}-${slug}`} />

      <H2 id="usage">Usage</H2>
      <P>
        The import is the same in every kit. Switching kits changes the installed file, not your code.
      </P>
      <CodeBlock code={`import { ${piece.exportName} } from "@/components/${slug}"`} lang="tsx" />

      <H2 id="props">Props</H2>
      <P>
        Shared by every kit, from <Code>{`${piece.exportName}Props`}</Code> in the contract. Props marked with{" "}
        <Code>?</Code> are optional.
      </P>
      <PropsTable props={props} />
    </DocsPage>
  )
}
