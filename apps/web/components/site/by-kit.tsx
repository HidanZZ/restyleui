"use client"

import type { ReactNode } from "react"

import { useActiveKit } from "@/components/site/kit-context"
import { KIT_SLUGS, type KitSlug } from "@/lib/catalog"
import { cn } from "@/registry/restyle/lib/utils"

/** Full class names so Tailwind generates them. The head script sets `data-active-kit` before paint. */
const SHOW_BEFORE_HYDRATION: Record<KitSlug, string> = {
  norma: "[html[data-active-kit=norma]_&]:contents",
  linear: "[html[data-active-kit=linear]_&]:contents",
  apple: "[html[data-active-kit=apple]_&]:contents",
  teamwork: "[html[data-active-kit=teamwork]_&]:contents",
  mckp: "[html[data-active-kit=mckp]_&]:contents",
}

/**
 * Shows the variant of some content that matches the active kit. Content is
 * prepared on the server for every kit; the server render shows the right one
 * with CSS, so install commands and code never flash the wrong kit.
 */
export function ByKit({ items }: { items: Record<KitSlug, ReactNode> }) {
  const { kit } = useActiveKit()
  if (kit) return <>{items[kit]}</>
  return KIT_SLUGS.map((slug) => (
    <div key={slug} className={cn("hidden", SHOW_BEFORE_HYDRATION[slug])}>
      {items[slug]}
    </div>
  ))
}
