/**
 * Reads a kit's tokens from `registry/<kit>/theme.css` at build time. Server only.
 */
import fs from "node:fs"
import path from "node:path"

import type { KitSlug } from "@/lib/catalog"

export type Token = { name: string; value: string }

export type KitTokens = {
  colors: Token[]
  fonts: Token[]
  /** Radius, easing and layout tokens. */
  shape: Token[]
  /** Kit-specific `--<kit>-*` extras. */
  extras: Token[]
}

const COLOR_NAMES = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "border",
  "input",
  "ring",
]

const COLOR_VALUE = /^(#|rgb|hsl|oklch|oklab|lab\(|lch\(|color\(|color-mix\(|hwb\()/i

/** True when a token value is a color, so the docs can draw a swatch for it. */
export function isColorValue(value: string) {
  return COLOR_VALUE.test(value.trim())
}

export function readKitTokens(kit: KitSlug): KitTokens {
  let source = ""
  try {
    source = fs.readFileSync(path.join(process.cwd(), "registry", kit, "theme.css"), "utf8")
  } catch {
    // Theme not written yet: every list stays empty.
  }
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "")
  const declared = new Map<string, string>()
  for (const match of css.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    declared.set(match[1], match[2].replace(/\s+/g, " ").trim())
  }
  const tokens = [...declared].map(([name, value]) => ({ name, value }))

  return {
    colors: COLOR_NAMES.flatMap((name) => (declared.has(name) ? [{ name, value: declared.get(name)! }] : [])),
    fonts: tokens.filter((token) => token.name.startsWith("kit-font-")),
    shape: tokens.filter((token) => token.name.startsWith("kit-") && !token.name.startsWith("kit-font-")),
    extras: tokens.filter((token) => token.name.startsWith(`${kit}-`)),
  }
}
