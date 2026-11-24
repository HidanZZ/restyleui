/**
 * Markdown builders for the docs pages and the llms.txt files.
 *
 * This module stays free of Node APIs because "Copy Page" runs `pieceMarkdown`
 * in the browser. Build time work, such as reading DESIGN.md, lives in
 * `lib/llms-content.ts`.
 */
import type { PropDoc } from "@/components/site/contract-props"
import { setupPrompt } from "@/components/site/setup-prompt"
import { COMMON_PIECES, KIT_SLUGS, type CommonSlug, type KitMeta, type KitSlug, type PieceSource } from "@/lib/catalog"
import { DEFAULT_KIT, kitMeta } from "@/lib/kits"

export const SITE_URL = "https://restyleui.dev"
export const REGISTRY_URL = `${SITE_URL}/r/{name}.json`
export const GITHUB_URL = "https://github.com/HidanZZ/restyleui"
export const SKILL_COMMAND = "npx skills@latest add HidanZZ/restyleui --skill restyleui"

export const BEHAVIORS = [
  {
    slug: "nav",
    title: "Responsive nav",
    summary: "Desktop dropdowns, a mobile drawer with scroll lock, and a header that hides on scroll.",
  },
  {
    slug: "reveal",
    title: "Scroll reveal",
    summary: "Content fades and lifts into place when it enters the viewport, with staggered delays.",
  },
  {
    slug: "video",
    title: "Video in view",
    summary: "Video that plays only in view, plus scroll scrubbing and parallax from one progress value.",
  },
  {
    slug: "carousel-marquee",
    title: "Carousel and marquee",
    summary: "Swipeable slides with autoplay, and an endless row that pauses on hover.",
  },
  {
    slug: "tabs",
    title: "Animated tabs",
    summary: "Panels that switch with arrow keys and a pill that slides to the active tab.",
  },
  {
    slug: "tilt",
    title: "Pointer tilt",
    summary: "A card that leans toward the pointer, with a glare that follows it.",
  },
  {
    slug: "count-up",
    title: "Count-up",
    summary: "Numbers that count to their value once, when they scroll into view.",
  },
  {
    slug: "overlay",
    title: "Overlay and dialog",
    summary: "A modal dialog with focus return, scroll lock, Escape, and kit tokens inside.",
  },
] as const

export type BehaviorSlug = (typeof BEHAVIORS)[number]["slug"]

const SOURCE_LABEL: Record<PieceSource, string> = {
  source: "From source",
  designed: "Designed in style",
}

/** The markdown route URL for a docs path, for example `/docs/kits/norma` becomes `/docs/kits/norma.md`. */
export function docsMarkdownUrl(path: string) {
  const clean = path.replace(/\/+$/, "")
  return `${SITE_URL}${clean === "/docs" ? "/docs.md" : `${clean}.md`}`
}

export function fence(code: string, lang = "") {
  return ["```" + lang, code.replace(/\n+$/, ""), "```"].join("\n")
}

function table(head: string[], rows: string[][]) {
  return [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((value) => value.replace(/\|/g, "\\|").replace(/\n/g, " ").trim()).join(" | ")} |`),
  ].join("\n")
}

function propsTable(props: PropDoc[]) {
  return table(
    ["Prop", "Type", "Required", "Description"],
    props.map((prop) => [
      `\`${prop.name}\``,
      `\`${prop.type}\``,
      prop.required ? "Yes" : "No",
      prop.description ?? (prop.required ? "Required." : ""),
    ]),
  )
}

function toExportName(slug: string) {
  return slug.replace(/(^|-)(\w)/g, (_, __, char: string) => char.toUpperCase())
}

export type PieceDoc = {
  slug: string
  title: string
  description: string
  /** Export name, for example "Button". */
  exportName: string
  url: string
  props: PropDoc[]
}

/** The page as markdown for the given kit, for "Copy Page". */
export function pieceMarkdown(doc: PieceDoc, kit: KitSlug, source: PieceSource | undefined) {
  const meta = kitMeta[kit]
  const lines = [
    `# ${doc.title}`,
    "",
    doc.description,
    "",
    `Kit: ${meta.name} (\`${kit}\`)${source ? `. ${SOURCE_LABEL[source]}.` : ""}`,
    `Docs: ${doc.url}`,
    "",
    "## Installation",
    "",
    "```bash",
    `npx shadcn@latest add @restyleui/${kit}-${doc.slug}`,
    "```",
    "",
    "## Usage",
    "",
    "```tsx",
    `import { ${doc.exportName} } from "@/components/${doc.slug}"`,
    "```",
  ]
  if (doc.props.length > 0) {
    lines.push(
      "",
      "## Props",
      "",
      "| Prop | Type | Required | Description |",
      "| --- | --- | --- | --- |",
      ...doc.props.map(
        (prop) =>
          `| \`${prop.name}\` | \`${prop.type.replace(/\|/g, "\\|").replace(/\n/g, " ")}\` | ${prop.required ? "Yes" : "No"} | ${(prop.description ?? (prop.required ? "Required." : "")).replace(/\|/g, "\\|").replace(/\n/g, " ")} |`,
      ),
    )
  }
  return `${lines.join("\n")}\n`
}

export function introductionMarkdown() {
  const kits = KIT_SLUGS.map(
    (kit) =>
      `- [${kitMeta[kit].name}](${docsMarkdownUrl(`/docs/kits/${kit}`)}): ${kitMeta[kit].description} Original site: ${kitMeta[kit].url}.`,
  )
  return [
    "# Restyle UI",
    "",
    "> Restyle UI is a free, MIT licensed library of design kits rebuilt from real websites. Every kit gives you the same 15 components and 8 sections with the same props, in a different look and motion.",
    "",
    `- Website: ${SITE_URL}`,
    `- Repository: ${GITHUB_URL}`,
    `- Full documentation for models: ${SITE_URL}/llms-full.txt`,
    `- License: MIT for the code. Brand names, original fonts and original media stay with their owners.`,
    "",
    "## How it works",
    "",
    "Every kit is built in three layers:",
    "",
    `- **Behaviors** are shared by all kits: responsive navigation, scroll reveal, carousels, tabs, count-up numbers, dialogs and more. Interaction logic comes from \`@ui-sdk/core\`; motion behaviors are small hooks that respect reduced motion. See [Behaviors](${docsMarkdownUrl("/docs/behaviors")}).`,
    "- **Common pieces** are 15 components and 8 sections. Every kit implements all of them with exactly the same props, so a site can move from one kit to another by changing imports only.",
    "- **Unique pieces** belong to one kit, such as a globe or a product demo hero. Every prop has a default, so they render a complete demo on their own.",
    "",
    "Kit tokens are CSS variables with the shadcn names (`--background`, `--primary`, `--border` and so on), mapped to Tailwind v4 utilities. Everything installs with the shadcn CLI, so the code lives in your project and you can change it freely.",
    "",
    "## Kits",
    "",
    "Five kits ship in v1. Each one ships in the native mode of its source site.",
    "",
    ...kits,
    "",
    "## One kit per site",
    "",
    "A site uses one kit. Every kit sets the same token names through `data-kit` on `<html>`, so one page holds one kit. Mixing kits is not supported. To try another look, switch the kit: the imports change, the props stay.",
    "",
    "## Source labels",
    "",
    "Every common piece carries a label. \"From source\" means the piece was rebuilt from the original website. \"Designed in style\" means the original site has no such piece, so it was designed to match the kit's rules.",
    "",
    "## License",
    "",
    `Restyle UI code is MIT licensed. Brand names, original fonts and original media stay with their owners. Kits use no original images, videos or logos: media is generated or drawn, and paid fonts fall back to free ones unless you own a license. See [${GITHUB_URL}](${GITHUB_URL}).`,
    "",
  ].join("\n")
}

export function installationMarkdown() {
  const registry = `{
  "registries": {
    "@restyleui": "https://restyleui.dev/r/{name}.json"
  }
}`
  return [
    "# Installation",
    "",
    "> Restyle UI installs through the shadcn CLI. The code is copied into your project, so you own it and can change it.",
    "",
    "## Requirements",
    "",
    "React 19, Tailwind CSS v4 and a `components.json` from the shadcn CLI. The commands below use `<kit>` as a placeholder for one of: `norma`, `linear`, `apple`, `teamwork`, `mckp`.",
    "",
    "## Registry",
    "",
    "Add the `@restyleui` registry to `components.json`:",
    "",
    fence(registry, "json"),
    "",
    "## Install the theme",
    "",
    "Install the theme bridge and the tokens of the kit you picked. The CLI writes them to `app/restyle-theme.css` and `app/restyle-<kit>.css`, plus the kit's `DESIGN.md` under `restyle/`. In a project with a `src/` folder they land under `src/`, for example `src/app/restyle-<kit>.css`.",
    "",
    fence(`npx shadcn@latest add @restyleui/restyle-theme @restyleui/<kit>-theme`, "bash"),
    "",
    "## Global stylesheet",
    "",
    "Add `@layer ui-sdk;` as the first line of the global stylesheet, before `@import \"tailwindcss\"`. ui-sdk injects a few runtime styles in that layer, and Tailwind utilities must win over them.",
    "",
    "Then import both theme files at the end of the same file, after the shadcn `:root`, `.dark` and `@theme` blocks:",
    "",
    fence(
      `@layer ui-sdk;

@import "tailwindcss";

/* shadcn :root, .dark and @theme blocks stay here */

@import "./restyle-theme.css";
@import "./restyle-<kit>.css";`,
      "css",
    ),
    "",
    "`:root` and `[data-kit=\"<kit>\"]` have equal specificity, so the later rule wins. Tailwind v4 inlines these imports. For Next.js this is `app/globals.css`. For Vite it is `src/index.css`, and shadcn writes the theme files to `src/app/`, so the imports are `./app/restyle-theme.css` and `./app/restyle-<kit>.css`. Fix the paths if the CLI wrote the files somewhere else.",
    "",
    "## Set the kit on `<html>`",
    "",
    "Kit tokens apply under `data-kit`. Add it to the root element in `app/layout.tsx` for Next.js, or in `index.html` for Vite:",
    "",
    fence(`<html lang="en" data-kit="norma">`, "html"),
    "",
    "## Fonts",
    "",
    "Load the free fallback fonts listed on the kit page and expose them as the CSS variables the kit font stacks read (`--font-*`). With Next.js, use `next/font/google` in `app/layout.tsx` and put the variables on `<html>`; with Vite, add a Google Fonts link and define the same variables in `:root`. Define every variable the kit uses: an undefined one makes the whole font stack invalid. Paid fonts load only when you own a license. Each kit page lists its fonts, fallbacks and licenses.",
    "",
    "## Read the design file",
    "",
    "Installing a kit theme also installs `restyle/<kit>/DESIGN.md`. Read it before building: it documents the tokens, type scale, spacing, motion and do and don't rules for that kit.",
    "",
    "## Add pieces",
    "",
    "Install any component, section or unique piece by name. Dependencies, such as shared behaviors, come along.",
    "",
    fence(`npx shadcn@latest add @restyleui/<kit>-hero @restyleui/<kit>-button`, "bash"),
    "",
    fence(
      `import { Button } from "@/components/button"
import { Hero } from "@/components/hero"

export default function Page() {
  return (
    <Hero
      title="Plan the week in one place"
      description="Shared lists, calm reminders and a clear view of what comes next."
      actions={[{ label: "Get started", href: "/signup" }]}
    />
  )
}`,
      "tsx",
    ),
    "",
    "## Switching kits",
    "",
    "Every kit has the same pieces with the same props. To move a site to another kit, install the new theme and pieces, change the CSS import and the `data-kit` value, and keep your page code as it is.",
    "",
  ].join("\n")
}

export function agentsMarkdown() {
  const mcp = `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}`
  return [
    "# Agents",
    "",
    "> Restyle UI is built for developers and their coding agents. Every kit comes with written design rules, and every piece installs by name.",
    "",
    `- Website: ${SITE_URL}`,
    `- Index for models: ${SITE_URL}/llms.txt`,
    `- Full text for models: ${SITE_URL}/llms-full.txt`,
    "",
    "## Setup prompt",
    "",
    `Paste this into your agent. It uses the ${kitMeta[DEFAULT_KIT].name} kit; replace \`${DEFAULT_KIT}\` with any kit slug.`,
    "",
    fence(setupPrompt(DEFAULT_KIT), "text"),
    "",
    "## Agent skill",
    "",
    "The `restyleui` skill teaches an agent the workflow: pick one kit, read its `DESIGN.md`, then compose pages from the kit's pieces instead of writing new styles.",
    "",
    fence(SKILL_COMMAND, "bash"),
    "",
    "The theme install writes the kit's rules to `restyle/<kit>/DESIGN.md`: tokens, type scale, motion feel, layout rules, and a list of do and don't. The skill reads this file before it builds.",
    "",
    "## Rules for agents",
    "",
    "- Use one kit per site. Mixing kits is not supported.",
    "- Use the contract props only. Every common piece has the same props in every kit, listed on each component page.",
    "- Style with token utilities such as `bg-background`, `text-muted-foreground`, `font-display`, `rounded-kit`, `py-section` and `max-w-kit`. No hard-coded colors or fonts.",
    "- Render overlays, such as dialogs and drawers, inside the element that carries `data-kit`, so the kit tokens still apply.",
    "- Respect reduced motion in any animation you add.",
    "",
    "## llms.txt",
    "",
    `${SITE_URL}/llms.txt is an index of the docs for language models: kits, pieces, install names and links. Every docs page also has a markdown URL, for example ${docsMarkdownUrl("/docs/components/button")}.`,
    "",
    "## shadcn MCP server",
    "",
    "Restyle UI has no MCP server of its own. The shadcn MCP server reads every registry in `components.json`, so once `@restyleui` is there, your agent can browse, search and install kit pieces.",
    "",
    "Run the init command for your client, for example Claude Code:",
    "",
    fence("npx shadcn@latest mcp init --client claude", "bash"),
    "",
    "Or add the server to your client's MCP configuration by hand:",
    "",
    fence(mcp, "json"),
    "",
    "## Ask for pieces",
    "",
    "- Show me the sections in the @restyleui registry.",
    "- Add the linear-hero and linear-faq sections.",
    "- Build a landing page with the norma kit: hero, logo strip, feature grid, FAQ and footer.",
    "",
  ].join("\n")
}

export function behaviorIndexMarkdown(intro: string) {
  const pages = BEHAVIORS.map(
    (behavior) =>
      `- [${behavior.title}](${docsMarkdownUrl(`/docs/behaviors/${behavior.slug}`)}): ${behavior.summary}`,
  )
  return [
    "# Behaviors",
    "",
    "> Every kit builds its interactive and moving pieces from the same 8 behaviors. This page is the reference: which hook or ui-sdk part to use, and a complete recipe for each common component that uses it.",
    "",
    "## Pages",
    "",
    ...pages,
    "",
    intro.trim(),
    "",
  ].join("\n")
}

export function behaviorPageMarkdown(behavior: BehaviorSlug, body: string) {
  const entry = BEHAVIORS.find((item) => item.slug === behavior)!
  return [
    `# ${entry.title}`,
    "",
    `> ${entry.summary}`,
    "",
    `- Docs: ${docsMarkdownUrl(`/docs/behaviors/${behavior}`)}`,
    `- All behaviors: ${docsMarkdownUrl("/docs/behaviors")}`,
    "",
    body.trim(),
    "",
  ].join("\n")
}

export function commonPageMarkdown(piece: (typeof COMMON_PIECES)[number], props: PropDoc[]) {
  const isSection = piece.kind === "section"
  const base = isSection ? "/docs/sections" : "/docs/components"
  const lines = [
    `# ${piece.title}`,
    "",
    `> ${piece.description}`,
    "",
    `- Kind: ${isSection ? "Section" : "Component"}`,
    `- Props type: \`${piece.exportName}Props\` in the contract`,
    `- Page: ${SITE_URL}${base}/${piece.slug}`,
    "",
    "## Installation",
    "",
    "Install the piece by name from any kit. The kit theme comes along if it is missing.",
    "",
    ...KIT_SLUGS.map(
      (kit) => `- ${kitMeta[kit].name}: \`npx shadcn@latest add @restyleui/${kit}-${piece.slug}\``,
    ),
    "",
    "## Usage",
    "",
    "The import is the same in every kit. Switching kits changes the installed file, not your code.",
    "",
    fence(`import { ${piece.exportName} } from "@/components/${piece.slug}"`, "tsx"),
  ]
  if (props.length > 0) {
    lines.push("", "## Props", "", `Shared by every kit, from \`${piece.exportName}Props\` in the contract.`, "", propsTable(props))
  }
  lines.push("")
  return lines.join("\n")
}

export type MarkdownToken = { name: string; value: string }

export type MarkdownTokens = {
  colors: MarkdownToken[]
  fonts: MarkdownToken[]
  shape: MarkdownToken[]
  extras: MarkdownToken[]
}

export function kitPageMarkdown(kit: KitSlug, tokens: MarkdownTokens) {
  const meta = kitMeta[kit]
  const components = COMMON_PIECES.filter((piece) => piece.kind === "component")
  const sections = COMMON_PIECES.filter((piece) => piece.kind === "section")
  const pieceLine = (kind: "component" | "section", slug: string, title: string) => {
    const source = meta.pieces[slug as CommonSlug]
    return `- [${title}](${docsMarkdownUrl(`/docs/${kind === "component" ? "components" : "sections"}/${slug}`)}): \`npx shadcn@latest add @restyleui/${kit}-${slug}\`${source ? `. ${SOURCE_LABEL[source]}.` : ""}`
  }
  const lines = [
    `# ${meta.name}`,
    "",
    `> ${meta.description}`,
    "",
    `- Original site: ${meta.url} (inspired by ${meta.brand})`,
    `- Mode: ${meta.mode === "dark" ? "Dark" : "Light"}`,
    `- Theme install: \`npx shadcn@latest add @restyleui/restyle-theme @restyleui/${kit}-theme\``,
    `- Live demo: ${SITE_URL}/demo/${kit}`,
    "",
    "## Fonts",
    "",
    "The original font comes first in each stack. When it is not available, the free fallback renders instead.",
    "",
    table(
      ["Role", "Original", "Fallback", "License"],
      meta.fonts.map((font) => [
        font.role,
        font.original,
        font.fallback,
        font.license + (font.buyUrl ? ` ([buy](${font.buyUrl}))` : ""),
      ]),
    ),
    "",
    "## Colors",
    "",
  ]

  if (tokens.colors.length > 0) {
    lines.push(
      "Defined under `[data-kit=\"" + kit + "\"]` with the shadcn names, so kit tokens also restyle shadcn/ui components.",
      "",
      table(
        ["Token", "Value"],
        tokens.colors.map((token) => [`--${token.name}`, `\`${token.value}\``]),
      ),
    )
  } else {
    lines.push("The color tokens of this kit are being written.")
  }

  lines.push("", "## Other tokens", "")
  const other = [...tokens.fonts, ...tokens.shape]
  if (other.length > 0) {
    lines.push(
      table(
        ["Token", "Value"],
        other.map((token) => [`--${token.name}`, `\`${token.value}\``]),
      ),
    )
  } else {
    lines.push("The tokens of this kit are being written.")
  }
  if (tokens.extras.length > 0) {
    lines.push(
      "",
      `### ${tokens.extras.length} kit-specific tokens`,
      "",
      table(
        ["Token", "Value"],
        tokens.extras.map((token) => [`--${token.name}`, `\`${token.value}\``]),
      ),
    )
  }

  lines.push(
    "",
    "## Components",
    "",
    "The 23 common pieces are 15 components and 8 sections. Every kit implements all of them with the same props.",
    "",
    ...components.map((piece) => pieceLine("component", piece.slug, piece.title)),
    "",
    "## Sections",
    "",
    ...sections.map((piece) => pieceLine("section", piece.slug, piece.title)),
    "",
    "## Unique pieces",
    "",
  )
  if (meta.unique.length > 0) {
    lines.push(
      ...meta.unique.map(
        (piece) =>
          `- [${piece.title}](${docsMarkdownUrl(`/docs/kits/${kit}/${piece.slug}`)}): ${piece.description} Install: \`npx shadcn@latest add @restyleui/${kit}-${piece.slug}\`.`,
      ),
    )
  } else {
    lines.push("Unique pieces for this kit are being designed.")
  }
  lines.push(
    "",
    "## Design rules",
    "",
    `The kit's rules install as \`restyle/${kit}/DESIGN.md\` with the theme. They cover tokens, type scale, motion feel, layout and do and don't. The full text is in ${SITE_URL}/llms-full.txt.`,
    "",
  )
  return lines.join("\n")
}

export function uniquePageMarkdown(kit: KitSlug, piece: KitMeta["unique"][number]) {
  const meta = kitMeta[kit]
  const exportName = toExportName(piece.slug)
  return [
    `# ${piece.title}`,
    "",
    `> ${piece.description}`,
    "",
    `- Kit: ${meta.name} only`,
    `- Source: ${SOURCE_LABEL[piece.source]}`,
    `- Page: ${SITE_URL}/docs/kits/${kit}/${piece.slug}`,
    "",
    "## Installation",
    "",
    "This piece belongs to this kit only, so the kit switcher does not change it.",
    "",
    fence(`npx shadcn@latest add @restyleui/${kit}-${piece.slug}`, "bash"),
    "",
    "## Usage",
    "",
    "Every prop is optional and defaults to demo content, so the component renders a complete piece. Pass your own content through its props; the installed file documents them.",
    "",
    fence(
      `import { ${exportName} } from "@/components/${piece.slug}"

export default function Page() {
  return <${exportName} />
}`,
      "tsx",
    ),
    "",
  ].join("\n")
}

export function llmsTxtMarkdown() {
  const components = COMMON_PIECES.filter((piece) => piece.kind === "component")
  const sections = COMMON_PIECES.filter((piece) => piece.kind === "section")
  const uniqueCount = KIT_SLUGS.reduce((sum, kit) => sum + kitMeta[kit].unique.length, 0)
  return [
    "# Restyle UI",
    "",
    `> A free public library of design kits rebuilt from real websites. ${KIT_SLUGS.length} kits share 15 components and 8 sections with identical props, plus ${uniqueCount} unique pieces. Install with the shadcn CLI.`,
    "",
    "Restyle UI is MIT licensed. Each kit is a working clone of one site's design language: tokens, type, surfaces, motion and piece layouts. All kits use the same contract props, so switching kits changes imports, not page code.",
    "",
    "## Setup",
    "",
    "1. In a React 19 and Tailwind CSS v4 project, run `npx shadcn@latest init` if there is no `components.json`.",
    `2. Add the registry to \`components.json\`: \`"registries": { "@restyleui": "${REGISTRY_URL}" }\`.`,
    "3. Install the theme for one kit: `npx shadcn@latest add @restyleui/restyle-theme @restyleui/<kit>-theme`.",
    "4. Add `@layer ui-sdk;` as the first line of the global stylesheet, before `@import \"tailwindcss\"`, then import `restyle-theme.css` and `restyle-<kit>.css` at the end of the same file, after the shadcn `:root`, `.dark` and `@theme` blocks.",
    "5. Add `data-kit=\"<kit>\"` to `<html>`.",
    "6. Load the kit's free fonts and expose them as the CSS variables its font stacks read.",
    "7. Read `restyle/<kit>/DESIGN.md` before building, then add pieces with `npx shadcn@latest add @restyleui/<kit>-<piece>`.",
    "",
    `Full steps: ${docsMarkdownUrl("/docs/installation")}`,
    "",
    "## Kits",
    "",
    ...KIT_SLUGS.map(
      (kit) =>
        `- [${kitMeta[kit].name}](${docsMarkdownUrl(`/docs/kits/${kit}`)}): ${kitMeta[kit].description} Source: ${kitMeta[kit].url}. Mode: ${kitMeta[kit].mode}.`,
    ),
    "",
    "## Behaviors",
    "",
    `Every kit builds its interactive and moving pieces from the same 8 behaviors. Reference: ${docsMarkdownUrl("/docs/behaviors")}`,
    "",
    ...BEHAVIORS.map(
      (behavior) =>
        `- [${behavior.title}](${docsMarkdownUrl(`/docs/behaviors/${behavior.slug}`)}): ${behavior.summary}`,
    ),
    "",
    "## Components",
    "",
    "The 23 common pieces are 15 components and 8 sections. Every kit implements all of them with the same props.",
    "",
    ...components.map(
      (piece) =>
        `- [${piece.title}](${docsMarkdownUrl(`/docs/components/${piece.slug}`)}): ${piece.description}`,
    ),
    "",
    "## Sections",
    "",
    ...sections.map(
      (piece) =>
        `- [${piece.title}](${docsMarkdownUrl(`/docs/sections/${piece.slug}`)}): ${piece.description}`,
    ),
    "",
    "## Unique pieces",
    "",
    ...KIT_SLUGS.flatMap((kit) => [
      `### ${kitMeta[kit].name}`,
      "",
      ...kitMeta[kit].unique.map(
        (piece) =>
          `- [${piece.title}](${docsMarkdownUrl(`/docs/kits/${kit}/${piece.slug}`)}): ${piece.description}`,
      ),
      "",
    ]),
    "## Registry",
    "",
    `- Registry URL pattern: \`${REGISTRY_URL}\`.`,
    "- Install a piece: `npx shadcn@latest add @restyleui/<kit>-<piece>`, for example `npx shadcn@latest add @restyleui/norma-hero`.",
    `- Agent skill: \`${SKILL_COMMAND}\`.`,
    `- Repository: ${GITHUB_URL}`,
    `- License: MIT for the code. Brand names, fonts and original media stay with their owners.`,
    "",
    "## Docs",
    "",
    `- [Introduction](${docsMarkdownUrl("/docs")})`,
    `- [Installation](${docsMarkdownUrl("/docs/installation")})`,
    `- [Agents](${docsMarkdownUrl("/docs/agents")})`,
    `- [Behaviors](${docsMarkdownUrl("/docs/behaviors")})`,
    `- [Full text of every page](${SITE_URL}/llms-full.txt)`,
    "",
  ].join("\n")
}
