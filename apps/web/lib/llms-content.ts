/**
 * Build time markdown content for `/llms.txt`, `/llms-full.txt` and the docs
 * `.md` routes.
 *
 * The catalogue comes from the site modules. Files that are not part of the
 * website bundle are read from the repo: `docs/BEHAVIORS.md`, the contract and
 * each kit's `DESIGN.md`.
 */
import fs from "node:fs"
import path from "node:path"

import { getProps } from "@/components/site/contract-props"
import { readKitTokens } from "@/components/site/theme-tokens"
import { COMMON_PIECES, KIT_SLUGS } from "@/lib/catalog"
import { isKitSlug, kitMeta } from "@/lib/kits"
import {
  BEHAVIORS,
  SITE_URL,
  agentsMarkdown,
  behaviorIndexMarkdown,
  behaviorPageMarkdown,
  commonPageMarkdown,
  fence,
  installationMarkdown,
  introductionMarkdown,
  kitPageMarkdown,
  llmsTxtMarkdown,
  uniquePageMarkdown,
  type BehaviorSlug,
} from "@/lib/markdown"

/** Reads a file relative to `apps/web`. Returns `null` when it is not written yet. */
function readWebFile(relative: string) {
  try {
    return fs.readFileSync(path.join(process.cwd(), relative), "utf8")
  } catch {
    return null
  }
}

type BehaviorDocs = {
  /** Rules, hooks and the behavior map, before the numbered recipes. */
  intro: string
  overlay: string
  sections: Partial<Record<BehaviorSlug, string>>
}

let behaviorDocsCache: BehaviorDocs | null = null

/** Splits `docs/BEHAVIORS.md` into its intro, its overlay note and one body per behavior. */
function readBehaviorDocs(): BehaviorDocs {
  if (behaviorDocsCache) return behaviorDocsCache
  const source = readWebFile("../../docs/BEHAVIORS.md")
  const docs: BehaviorDocs = { intro: "", overlay: "", sections: {} }
  if (!source) {
    behaviorDocsCache = docs
    return docs
  }

  const intro: string[] = []
  const overlay: string[] = []
  const bodies = new Map<BehaviorSlug, string[]>()
  let current: "intro" | "overlay" | BehaviorSlug | null = "intro"
  let inFence = false

  for (const line of source.split("\n")) {
    const isFence = line.trimStart().startsWith("```")
    if (!inFence) {
      if (line.startsWith("# ")) continue
      if (line.startsWith("## ")) {
        const heading = line.slice(3).trim()
        if (heading.startsWith("Overlays stay inside")) {
          current = "overlay"
          continue
        }
        const numbered = /^([1-8])\.\s/.exec(heading)
        const behavior = numbered ? BEHAVIORS[Number(numbered[1]) - 1] : undefined
        if (behavior) {
          current = behavior.slug
          bodies.set(behavior.slug, [])
          continue
        }
        // Headings before the numbered recipes, such as "Rules", stay in the intro.
        if (current === "intro") {
          intro.push(line)
          continue
        }
        current = null
        continue
      }
    }
    if (current === "intro") intro.push(line)
    else if (current === "overlay") overlay.push(line)
    else if (current) bodies.get(current)?.push(line)
    if (isFence) inFence = !inFence
  }

  docs.intro = intro
    .join("\n")
    .replace(/^Live demo of everything below:.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  docs.overlay = overlay.join("\n").trim()
  for (const behavior of BEHAVIORS) docs.sections[behavior.slug] = bodies.get(behavior.slug)?.join("\n").trim()
  behaviorDocsCache = docs
  return docs
}

function behaviorMarkdown(slug: BehaviorSlug) {
  const docs = readBehaviorDocs()
  const body = [docs.sections[slug], slug === "overlay" ? docs.overlay : ""].filter(Boolean).join("\n\n")
  if (body) return behaviorPageMarkdown(slug, body)
  return behaviorPageMarkdown(
    slug,
    "This behavior page is being written. The full behavior notes are in /llms-full.txt.",
  )
}

/** Params for the `/docs-md/[...slug]` route. Every docs page except the introduction has one entry. */
export function docsMarkdownParams() {
  const params: { slug: string[] }[] = [
    { slug: ["installation"] },
    { slug: ["agents"] },
    { slug: ["behaviors"] },
  ]
  for (const behavior of BEHAVIORS) params.push({ slug: ["behaviors", behavior.slug] })
  for (const kit of KIT_SLUGS) {
    params.push({ slug: ["kits", kit] })
    for (const piece of kitMeta[kit].unique) params.push({ slug: ["kits", kit, piece.slug] })
  }
  for (const piece of COMMON_PIECES) {
    params.push({ slug: [piece.kind === "section" ? "sections" : "components", piece.slug] })
  }
  return params
}

/** Markdown of one docs page, addressed by its path segments under `/docs`. */
export async function docsMarkdown(params: Promise<string[]>): Promise<string | null> {
  "use cache"
  const slug = await params
  const [first, second, third] = slug

  if (slug.length === 1) {
    if (first === "installation") return installationMarkdown()
    if (first === "agents") return agentsMarkdown()
    if (first === "behaviors") return behaviorIndexMarkdown(readBehaviorDocs().intro)
    return null
  }

  if (slug.length === 2) {
    if (first === "behaviors") {
      const behavior = BEHAVIORS.find((item) => item.slug === second)
      return behavior ? behaviorMarkdown(behavior.slug) : null
    }
    if (first === "kits" && isKitSlug(second)) {
      return kitPageMarkdown(second, readKitTokens(second))
    }
    if (first === "components" || first === "sections") {
      const kind = first === "components" ? "component" : "section"
      const piece = COMMON_PIECES.find((item) => item.slug === second && item.kind === kind)
      return piece ? commonPageMarkdown(piece, getProps(`${piece.exportName}Props`)) : null
    }
    return null
  }

  if (slug.length === 3 && first === "kits" && isKitSlug(second)) {
    const piece = kitMeta[second].unique.find((item) => item.slug === third)
    return piece ? uniquePageMarkdown(second, piece) : null
  }

  return null
}

/** Markdown of the introduction page, also served at `/docs.md`. */
export async function docsIntroduction() {
  "use cache"
  return introductionMarkdown()
}

/** The `/llms.txt` index. */
export async function llmsTxt() {
  "use cache"
  return llmsTxtMarkdown()
}

function fullPages(): string[] {
  const pages: string[] = [
    introductionMarkdown(),
    installationMarkdown(),
    agentsMarkdown(),
    behaviorIndexMarkdown(readBehaviorDocs().intro),
    ...BEHAVIORS.map((behavior) => behaviorMarkdown(behavior.slug)),
  ]
  for (const kit of KIT_SLUGS) {
    pages.push(kitPageMarkdown(kit, readKitTokens(kit)))
  }
  for (const piece of COMMON_PIECES) {
    pages.push(commonPageMarkdown(piece, getProps(`${piece.exportName}Props`)))
  }
  for (const kit of KIT_SLUGS) {
    for (const piece of kitMeta[kit].unique) {
      pages.push(uniquePageMarkdown(kit, piece))
    }
  }
  return pages
}

/** The `/llms-full.txt` file: every docs page, the contract and every kit's design rules. */
export async function llmsFullTxt() {
  "use cache"
  const parts = [
    "# Restyle UI full documentation",
    "",
    `> Every docs page as markdown, plus the component contract and the design rules for all ${KIT_SLUGS.length} kits. Base URL: ${SITE_URL}.`,
    "",
    "Restyle UI is a free library of design kits rebuilt from real websites. Install pieces with the shadcn CLI from the `@restyleui` registry. All common pieces share the same contract props across kits.",
    "",
    `Index: ${SITE_URL}/llms.txt`,
    "",
  ]

  for (const page of fullPages()) {
    parts.push("---", "", page.trim(), "")
  }

  const contract = readWebFile("registry/restyle/lib/contract.ts")
  parts.push(
    "---",
    "",
    "# Component contract",
    "",
    "Source file: `apps/web/registry/restyle/lib/contract.ts`. Installed into user projects as `@/lib/contract`.",
    "",
    contract ? fence(contract, "ts") : "The contract is being written.",
    "",
  )

  for (const kit of KIT_SLUGS) {
    const design = readWebFile(`registry/${kit}/DESIGN.md`)?.replace(/^# .*\n+/, "").trim()
    parts.push(
      "---",
      "",
      `# ${kitMeta[kit].name} design rules`,
      "",
      `Source file: \`restyle/${kit}/DESIGN.md\`, installed with the kit theme.`,
      "",
      design ? design.trim() : "The design rules for this kit are being written.",
      "",
    )
  }

  return `${parts.join("\n").trimEnd()}\n`
}

