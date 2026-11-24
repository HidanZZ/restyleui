/**
 * Code blocks for docs pages (server components). Highlighting runs at build time.
 */
import type { ReactNode } from "react"

import { ByKit } from "@/components/site/by-kit"
import { CopyButton } from "@/components/site/copy-button"
import { highlight, type CodeLang } from "@/components/site/highlight"
import { KIT_SLUGS, type KitSlug } from "@/lib/catalog"
import { cn } from "@/registry/restyle/lib/utils"

function CodeFrame({
  html,
  code,
  title,
  className,
  maxHeight,
}: {
  html: string
  code: string
  title?: string
  className?: string
  maxHeight?: boolean
}) {
  return (
    <figure className={cn("relative overflow-hidden rounded-xl border border-border bg-muted/40", className)}>
      {title ? (
        <figcaption className="flex h-10 items-center justify-between border-b border-border pr-1.5 pl-4 font-mono text-xs text-muted-foreground">
          {title}
          <CopyButton value={code} label={`Copy ${title}`} />
        </figcaption>
      ) : (
        <CopyButton value={code} label="Copy code" className="absolute top-1.5 right-1.5 z-10" />
      )}
      <div
        className={cn("site-code overflow-auto text-[13px] leading-6", maxHeight && "max-h-[32rem]", !title && "pr-12")}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}

export async function CodeBlock({
  code,
  lang,
  title,
  className,
  maxHeight,
}: {
  code: string
  lang: CodeLang
  title?: string
  className?: string
  maxHeight?: boolean
}) {
  const html = await highlight(code, lang)
  return <CodeFrame html={html} code={code} title={title} className={className} maxHeight={maxHeight} />
}

/** A code block whose content depends on the kit; follows the kit switcher. */
export async function KitCodeBlock({
  code,
  lang,
  title,
  className,
  maxHeight,
}: {
  code: (kit: KitSlug) => string
  lang: CodeLang
  title?: (kit: KitSlug) => string
  className?: string
  maxHeight?: boolean
}) {
  const entries = await Promise.all(
    KIT_SLUGS.map(async (kit) => {
      const source = code(kit)
      const html = await highlight(source, lang)
      return [
        kit,
        <CodeFrame
          key={kit}
          html={html}
          code={source}
          title={title?.(kit)}
          className={className}
          maxHeight={maxHeight}
        />,
      ] as const
    }),
  )
  return <ByKit items={Object.fromEntries(entries) as Record<KitSlug, ReactNode>} />
}

/** One-line shell command with a copy button. */
export function Command({ command, className }: { command: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl border border-border bg-muted/40 py-1.5 pr-1.5 pl-4 font-mono text-[13px]",
        className,
      )}
    >
      <span aria-hidden="true" className="text-muted-foreground select-none">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">{command}</code>
      <CopyButton value={command} label="Copy command" />
    </div>
  )
}

/** A one-line command that depends on the kit; follows the kit switcher. */
export function KitCommand({ command, className }: { command: (kit: KitSlug) => string; className?: string }) {
  const items = Object.fromEntries(
    KIT_SLUGS.map((kit) => [kit, <Command key={kit} command={command(kit)} className={className} />]),
  ) as Record<KitSlug, ReactNode>
  return <ByKit items={items} />
}
