"use client"

import type { ReactNode } from "react"

import { ByKit } from "@/components/site/by-kit"
import { CopyButton } from "@/components/site/copy-button"
import { useActiveKit } from "@/components/site/kit-context"
import { setupPrompt } from "@/components/site/setup-prompt"
import { KIT_SLUGS, type KitSlug } from "@/lib/catalog"
import { DEFAULT_KIT, kitMeta } from "@/lib/kits"

/** "Copy Prompt" button: copies the setup prompt for the active kit. */
export function CopyPromptButton({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  const { kit } = useActiveKit()
  return (
    <CopyButton variant={variant} value={() => setupPrompt(kit ?? DEFAULT_KIT)}>
      Copy Prompt
    </CopyButton>
  )
}

/** The setup prompt shown in full, with a copy button. Follows the kit switcher. */
export function PromptCard() {
  const items = Object.fromEntries(
    KIT_SLUGS.map((kit) => [
      kit,
      <figure key={kit} className="my-4 overflow-hidden rounded-xl border border-border bg-muted/40">
        <figcaption className="flex h-11 items-center justify-between gap-3 border-b border-border pr-1.5 pl-4 text-sm">
          <span className="text-muted-foreground">
            Setup prompt for <span className="font-medium text-foreground">{kitMeta[kit].name}</span>
          </span>
          <CopyButton variant="secondary" value={setupPrompt(kit)} className="h-8">
            Copy Prompt
          </CopyButton>
        </figcaption>
        <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-6 whitespace-pre-wrap text-foreground/85">
          {setupPrompt(kit)}
        </pre>
      </figure>,
    ]),
  ) as Record<KitSlug, ReactNode>
  return <ByKit items={items} />
}
