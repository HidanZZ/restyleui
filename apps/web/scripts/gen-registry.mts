/**
 * Generates apps/web/registry.json for the Restyle UI shadcn registry.
 *
 * The file on disk is the source of truth:
 * - lib/catalog.ts holds the kit order and the common piece list.
 * - registry/<kit>/meta.ts holds the kit name and its unique pieces.
 * - registry/<kit>/components/*.tsx is one item per file.
 * - registry/restyle/hooks/*.ts(x) is one item per file.
 *
 * Dependencies are read from each file's static imports, so registry items
 * never drift from the code. Node 24 runs this file directly with type
 * stripping: keep it to erasable TypeScript and use file extensions on
 * relative runtime imports.
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { KitMeta } from "../lib/catalog"

type RegistryFile = {
  path: string
  type: string
  target?: string
}

type RegistryItem = {
  name: string
  type: string
  title: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
  meta?: { categories: string[] }
}

type CatalogPiece = {
  slug: string
  exportName: string
  title: string
  description: string
  kind: "component" | "section"
  group: string
}

type CatalogModule = {
  KIT_SLUGS: readonly string[]
  COMMON_PIECES: readonly CatalogPiece[]
}

type Analysis = {
  source: string
  dependencies: string[]
  registryDependencies: string[]
}

type SourceImport = {
  specifier: string
  typeOnly: boolean
}

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const REGISTRY_ROOT = path.join(WEB_ROOT, "registry")
const OUTPUT_FILE = path.join(WEB_ROOT, "registry.json")

const errors: string[] = []
const warnings: string[] = []

const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0)

function displayPath(absolute: string): string {
  return path.relative(WEB_ROOT, absolute).split(path.sep).join("/")
}

function registryPath(...parts: string[]): string {
  return parts.join("/")
}

async function isFile(absolute: string): Promise<boolean> {
  try {
    return (await stat(absolute)).isFile()
  } catch {
    return false
  }
}

async function isDirectory(absolute: string): Promise<boolean> {
  try {
    return (await stat(absolute)).isDirectory()
  } catch {
    return false
  }
}

async function listFiles(absolute: string): Promise<string[]> {
  try {
    const entries = await readdir(absolute, { withFileTypes: true })
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name)
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined
    if (code === "ENOENT") return []
    throw error
  }
}

function cleanCopy(text: string): string {
  return text
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function humanize(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function camelize(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("")
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Marks positions that are code, excluding comments and string or template
 * literals. Doc comments and code samples often contain import statements, so
 * import detection must only see keywords in real code.
 */
function codeMask(source: string): Uint8Array {
  const mask = new Uint8Array(source.length)
  let index = 0
  let quote: "\"" | "'" | "`" | null = null

  while (index < source.length) {
    const character = source[index] ?? ""
    const next = source[index + 1]

    if (quote) {
      if (character === "\\") {
        index += 2
        continue
      }
      if (character === quote) {
        quote = null
        index += 1
        continue
      }
      // Single and double quoted strings cannot span a line, so an unmatched
      // quote is JSX text (an apostrophe) or invalid code. Do not let it hide
      // the rest of the file.
      if (character === "\n" && quote !== "`") {
        quote = null
        index += 1
        continue
      }
      index += 1
      continue
    }

    if (character === "/" && next === "/") {
      while (index < source.length && source[index] !== "\n") index += 1
      continue
    }

    if (character === "/" && next === "*") {
      index += 2
      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        index += 1
      }
      index += 2
      continue
    }

    if (character === "\"" || character === "'" || character === "`") {
      quote = character
      index += 1
      continue
    }

    mask[index] = 1
    index += 1
  }

  return mask
}

/**
 * Collects static import and re-export specifiers. Dynamic imports and
 * `import.meta` are ignored on purpose: only static imports create install
 * dependencies.
 */
function parseImports(source: string): SourceImport[] {
  const found: SourceImport[] = []
  const mask = codeMask(source)

  const patterns: { regex: RegExp; typeGroup: boolean }[] = [
    {
      regex: /\bimport\s+(type\s+)?[^"'`;]{0,500}?\bfrom\s*["']([^"'\n]+)["']/g,
      typeGroup: true,
    },
    {
      regex: /\bimport\s*["']([^"'\n]+)["']/g,
      typeGroup: false,
    },
    {
      regex: /\bexport\s+(type\s+)?(?:\*|\{)[^;]{0,500}?\bfrom\s*["']([^"'\n]+)["']/g,
      typeGroup: true,
    },
  ]

  for (const { regex, typeGroup } of patterns) {
    for (const match of source.matchAll(regex)) {
      const index = match.index ?? -1
      if (index < 0 || mask[index] !== 1) continue

      const specifier = typeGroup ? match[2] : match[1]
      if (!specifier) continue
      found.push({
        specifier,
        typeOnly: typeGroup ? Boolean(match[1]) : false,
      })
    }
  }

  return found
}

function internalRegistryItem(specifier: string): string | null {
  if (specifier === "@/registry/restyle/lib/contract") return "@restyleui/restyle-contract"
  if (specifier === "@/registry/restyle/lib/utils") return "@restyleui/restyle-utils"

  const component = /^@\/registry\/([^/]+)\/components\/([^/]+)$/.exec(specifier)
  if (component) return `@restyleui/${component[1]}-${component[2]}`

  const hook = /^@\/registry\/restyle\/hooks\/([^/]+)$/.exec(specifier)
  if (hook) return `@restyleui/${hook[1]}`

  return null
}

function npmPackageName(specifier: string): string | null {
  if (specifier === "react" || specifier === "react-dom") return null
  if (specifier.startsWith(".") || specifier.startsWith("/")) return null
  if (specifier.startsWith("@/")) return null
  if (specifier.includes(":")) return null

  const parts = specifier.split("/")
  if (specifier.startsWith("@")) {
    const scope = parts[0]
    const name = parts[1]
    if (!scope || !name) return null
    return `${scope}/${name}`
  }

  return parts[0] || null
}

async function analyzeFile(relative: string, selfName: string): Promise<Analysis> {
  const source = await readFile(path.join(WEB_ROOT, relative), "utf8")
  const dependencies = new Set<string>()
  const registryDependencies = new Set<string>()

  for (const { specifier, typeOnly } of parseImports(source)) {
    if (specifier.startsWith("@/")) {
      const item = internalRegistryItem(specifier)
      if (!item) {
        errors.push(`${relative}: unsupported import "${specifier}"`)
        continue
      }
      if (item !== selfName) registryDependencies.add(item)
      continue
    }

    // A type-only import of a package never becomes an npm dependency.
    if (typeOnly) continue

    const packageName = npmPackageName(specifier)
    if (packageName && packageName !== "react" && packageName !== "react-dom") {
      dependencies.add(packageName)
    }
  }

  return {
    source,
    dependencies: [...dependencies].sort(compare),
    registryDependencies: [...registryDependencies].sort(compare),
  }
}

function dependencyFields(analysis: Analysis): Pick<RegistryItem, "dependencies" | "registryDependencies"> {
  const fields: Pick<RegistryItem, "dependencies" | "registryDependencies"> = {}
  if (analysis.dependencies.length > 0) fields.dependencies = analysis.dependencies
  if (analysis.registryDependencies.length > 0) fields.registryDependencies = analysis.registryDependencies
  return fields
}

function withTheme(analysis: Analysis, kit: string): Analysis {
  const registryDependencies = new Set(analysis.registryDependencies)
  registryDependencies.add(`@restyleui/${kit}-theme`)
  return {
    source: analysis.source,
    dependencies: analysis.dependencies,
    registryDependencies: [...registryDependencies].sort(compare),
  }
}

/** Returns the raw body of the first doc comment, skipping client directives. */
function leadingComment(source: string): string | null {
  let index = 0
  const skipWhitespace = () => {
    while (index < source.length && /\s/.test(source[index] ?? "")) index += 1
  }

  skipWhitespace()

  const directives = ["\"use client\"", "'use client'", "\"use server\"", "'use server'"]
  let matchedDirective = true
  while (matchedDirective) {
    matchedDirective = false
    for (const directive of directives) {
      if (source.startsWith(directive, index)) {
        const newline = source.indexOf("\n", index)
        index = newline === -1 ? source.length : newline + 1
        skipWhitespace()
        matchedDirective = true
        break
      }
    }
  }

  if (source.startsWith("/**", index)) {
    const end = source.indexOf("*/", index + 3)
    if (end === -1) return null
    return source.slice(index + 3, end)
  }

  if (source.startsWith("//", index)) {
    const lines: string[] = []
    while (index < source.length && source.startsWith("//", index)) {
      const newline = source.indexOf("\n", index)
      const end = newline === -1 ? source.length : newline
      lines.push(source.slice(index + 2, end))
      index = newline === -1 ? source.length : newline + 1
      while (index < source.length && (source[index] === " " || source[index] === "\t")) index += 1
    }
    return lines.join("\n")
  }

  return null
}

/** First readable sentence of a hook's leading doc comment. */
function describeHook(source: string, hook: string): string | null {
  const doc = leadingComment(source)
  if (!doc) return null

  const paragraphs: string[][] = []
  let paragraph: string[] = []
  let inFence = false

  for (const raw of doc.split(/\r?\n/)) {
    const line = raw.replace(/^\s*\*/, "").trim()

    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    if (!line) {
      if (paragraph.length > 0) {
        paragraphs.push(paragraph)
        paragraph = []
      }
      continue
    }

    paragraph.push(line)
  }
  if (paragraph.length > 0) paragraphs.push(paragraph)

  const camelName = camelize(hook)
  const nameVariants = [hook, camelName, camelName.charAt(0).toUpperCase() + camelName.slice(1)].map(
    escapeRegExp
  )
  const namePrefix = new RegExp(`^(?:${nameVariants.join("|")})\\s*(?:[:(-]|\\s-)\\s*`, "i")

  for (const lines of paragraphs) {
    let text = cleanCopy(lines.join(" "))
    text = text.replace(namePrefix, "").trim()

    if (!text) continue
    if (/^@\w+/.test(text)) continue
    if (/^(usage|example|signature|props|returns|parameters|notes?)\b/i.test(text)) continue
    if (/^(import|export|const|let|var|function|interface|type|return)\b/.test(text)) continue

    const words = text.split(/\s+/).filter(Boolean)
    if (words.length < 4 && !/[.!?]$/.test(text)) continue

    const sentence = /^(.+?[.!?])(?=\s|$)/.exec(text)?.[1] ?? text
    return capitalizeFirst(cleanCopy(sentence))
  }

  return null
}

async function loadMeta(kit: string): Promise<KitMeta | null> {
  const file = path.join(REGISTRY_ROOT, kit, "meta.ts")
  if (!(await isFile(file))) return null

  const mod = (await import(pathToFileURL(file).href)) as { default?: KitMeta }
  if (!mod.default) {
    errors.push(`${displayPath(file)}: missing default export`)
    return null
  }

  return mod.default
}

function fail(messages: string[]): never {
  console.error("Registry generation failed:")
  for (const message of messages) console.error(`  ${message}`)
  process.exit(1)
}

const catalogFile = path.join(WEB_ROOT, "lib", "catalog.ts")
if (!(await isFile(catalogFile))) fail([`missing ${displayPath(catalogFile)}`])

const catalog = (await import(pathToFileURL(catalogFile).href)) as unknown as CatalogModule
const kitSlugs = catalog.KIT_SLUGS
const commonPieces = catalog.COMMON_PIECES

if (!Array.isArray(kitSlugs) || !Array.isArray(commonPieces)) {
  fail(["lib/catalog.ts must export KIT_SLUGS and COMMON_PIECES"])
}

const commonBySlug = new Map(commonPieces.map((piece) => [piece.slug, piece]))

const coreFiles = [
  "registry/restyle/lib/utils.ts",
  "registry/restyle/lib/contract.ts",
  "registry/restyle/theme.css",
]
const missingCore: string[] = []
for (const file of coreFiles) {
  if (!(await isFile(path.join(WEB_ROOT, file)))) missingCore.push(file)
}
if (missingCore.length > 0) fail(missingCore.map((file) => `missing ${file}`))

const items: RegistryItem[] = []

items.push({
  name: "restyle-utils",
  type: "registry:lib",
  title: "Restyle UI Utils",
  description: "The cn() helper every Restyle UI piece uses.",
  dependencies: ["clsx", "tailwind-merge"],
  files: [{ path: "registry/restyle/lib/utils.ts", type: "registry:lib" }],
})

const contractAnalysis = await analyzeFile("registry/restyle/lib/contract.ts", "restyle-contract")
items.push({
  name: "restyle-contract",
  type: "registry:lib",
  title: "Restyle UI Contract",
  description: "Shared props for every common component and section.",
  ...dependencyFields(contractAnalysis),
  files: [{ path: "registry/restyle/lib/contract.ts", type: "registry:lib" }],
})

items.push({
  name: "restyle-theme",
  type: "registry:file",
  title: "Restyle UI Theme Bridge",
  description: "Maps the token names every kit defines to Tailwind v4 utilities.",
  files: [
    {
      path: "registry/restyle/theme.css",
      type: "registry:file",
      target: "app/restyle-theme.css",
    },
  ],
})

const hooksDirectory = path.join(REGISTRY_ROOT, "restyle", "hooks")
const hookFiles = (await listFiles(hooksDirectory))
  .filter((file) => /\.tsx?$/.test(file) && !/^index\.tsx?$/.test(file))
  .sort(compare)

for (const file of hookFiles) {
  const hook = file.replace(/\.tsx?$/, "")
  const relative = registryPath("registry", "restyle", "hooks", file)
  const analysis = await analyzeFile(relative, hook)
  const description = describeHook(analysis.source, hook)
  if (!description) warnings.push(`${relative}: no leading doc comment sentence`)

  items.push({
    name: hook,
    type: "registry:hook",
    title: humanize(hook),
    ...(description ? { description } : {}),
    ...dependencyFields(analysis),
    files: [{ path: relative, type: "registry:hook" }],
  })
}

type KitSummary = {
  kit: string
  items: number
  missing: string[]
}

const kitSummaries: KitSummary[] = []

for (const kit of kitSlugs) {
  const kitDirectory = path.join(REGISTRY_ROOT, kit)
  if (!(await isDirectory(kitDirectory))) {
    warnings.push(`registry/${kit}: folder is missing, skipped`)
    continue
  }

  const meta = await loadMeta(kit)
  if (!meta) {
    warnings.push(`registry/${kit}: no meta.ts, skipped`)
    continue
  }
  if (typeof meta.name !== "string" || meta.name.trim() === "") {
    errors.push(`registry/${kit}/meta.ts: missing name`)
    continue
  }
  if (typeof meta.slug !== "string" || meta.slug !== kit) {
    warnings.push(`registry/${kit}/meta.ts: slug should be "${kit}"`)
  }

  const kitDescription =
    typeof meta.description === "string" && meta.description.trim() !== ""
      ? cleanCopy(meta.description)
      : `Theme tokens and fonts for the ${meta.name} kit.`

  const themeRelative = registryPath("registry", kit, "theme.css")
  if (!(await isFile(path.join(WEB_ROOT, themeRelative)))) {
    errors.push(`${kit}: missing ${themeRelative}`)
    continue
  }

  const designRelative = registryPath("registry", kit, "DESIGN.md")
  const hasDesign = await isFile(path.join(WEB_ROOT, designRelative))

  const kitThemeFiles: RegistryFile[] = [
    {
      path: themeRelative,
      type: "registry:file",
      target: `app/restyle-${kit}.css`,
    },
  ]
  if (hasDesign) {
    kitThemeFiles.push({
      path: designRelative,
      type: "registry:file",
      target: `restyle/${kit}/DESIGN.md`,
    })
  }

  let kitItemCount = 0

  items.push({
    name: `${kit}-theme`,
    type: "registry:file",
    title: `${meta.name} Theme`,
    description: kitDescription,
    registryDependencies: ["@restyleui/restyle-theme"],
    files: kitThemeFiles,
  })
  kitItemCount += 1

  const componentsDirectory = path.join(kitDirectory, "components")
  const componentFiles = (await listFiles(componentsDirectory))
    .filter((file) => file.endsWith(".tsx"))
    .sort(compare)

  const componentSlugs = new Set(componentFiles.map((file) => file.replace(/\.tsx$/, "")))
  const uniquePieces = Array.isArray(meta.unique) ? meta.unique : []

  for (const file of componentFiles) {
    const slug = file.replace(/\.tsx$/, "")
    const relative = registryPath("registry", kit, "components", file)
    const common = commonBySlug.get(slug)
    const unique = uniquePieces.find((piece) => piece.slug === slug)

    if (!common && !unique) {
      warnings.push(`${relative}: not in lib/catalog.ts or meta.unique`)
    }

    const kind = common?.kind ?? "component"
    const pieceTitle = common?.title ?? unique?.title ?? humanize(slug)
    const description = common?.description ?? unique?.description
    const itemName = `${kit}-${slug}`
    const analysis = withTheme(await analyzeFile(relative, itemName), kit)

    items.push({
      name: itemName,
      type: kind === "section" ? "registry:block" : "registry:component",
      title: `${meta.name} ${pieceTitle}`,
      ...(description ? { description: cleanCopy(description) } : {}),
      ...dependencyFields(analysis),
      files: [{ path: relative, type: "registry:component" }],
      meta: { categories: [kit, kind] },
    })
    kitItemCount += 1
  }

  for (const piece of uniquePieces) {
    if (!componentSlugs.has(piece.slug)) {
      warnings.push(`registry/${kit}: unique piece ${piece.slug} has no components/${piece.slug}.tsx`)
    }
  }

  const landingRelative = registryPath("registry", kit, "landing.tsx")
  if (await isFile(path.join(WEB_ROOT, landingRelative))) {
    const itemName = `${kit}-landing`
    const analysis = withTheme(await analyzeFile(landingRelative, itemName), kit)
    items.push({
      name: itemName,
      type: "registry:block",
      title: `${meta.name} Landing`,
      description: `Full landing page built only from ${meta.name} pieces.`,
      ...dependencyFields(analysis),
      files: [{ path: landingRelative, type: "registry:component" }],
      meta: { categories: [kit, "landing"] },
    })
    kitItemCount += 1
  }

  const missing = commonPieces
    .filter((piece) => !componentSlugs.has(piece.slug))
    .map((piece) => piece.slug)
    .sort(compare)

  kitSummaries.push({ kit, items: kitItemCount, missing })
}

if (errors.length > 0) fail(errors)

// Stable, name-sorted output keeps diffs small regardless of filesystem order.
items.sort((a, b) => compare(a.name, b.name))

const seenNames = new Set<string>()
for (const item of items) {
  if (seenNames.has(item.name)) errors.push(`duplicate item name "${item.name}"`)
  seenNames.add(item.name)
}
if (errors.length > 0) fail(errors)

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "restyleui",
  homepage: "https://restyleui.dev",
  items,
}

await writeFile(OUTPUT_FILE, `${JSON.stringify(registry, null, 2)}\n`, "utf8")

const kitTotal = kitSummaries.reduce((total, summary) => total + summary.items, 0)
const coreTotal = items.length - kitTotal - hookFiles.length
console.log(`Generated registry.json with ${items.length} items.`)
console.log(`  core: ${coreTotal}`)
console.log(`  hooks: ${hookFiles.length}`)
for (const summary of kitSummaries) {
  const missing = summary.missing.length > 0 ? summary.missing.join(", ") : "none"
  console.log(`  ${summary.kit}: ${summary.items} items, missing common slugs: ${missing}`)
}

if (warnings.length > 0) {
  console.error("Warnings:")
  for (const warning of warnings) console.error(`  ${warning}`)
}

console.log(`Wrote ${displayPath(OUTPUT_FILE)}`)
