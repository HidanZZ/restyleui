import type { KitSlug } from "@/lib/catalog"
import { kitMeta } from "@/lib/kits"

/** The "Copy Prompt" text: sets up Restyle UI in a project through a coding agent. */
export function setupPrompt(kit: KitSlug) {
  const name = kitMeta[kit].name
  return `Set up Restyle UI in this project with the ${name} kit (${kit}). It needs React 19, Tailwind CSS v4 and the shadcn CLI.

1. If there is no components.json, run: npx shadcn@latest init
2. Add the registry to components.json: "registries": { "@restyleui": "https://restyleui.dev/r/{name}.json" }
3. Install the theme: npx shadcn@latest add @restyleui/restyle-theme @restyleui/${kit}-theme
4. Import app/restyle-theme.css and app/restyle-${kit}.css after @import "tailwindcss" in the global stylesheet, and add data-kit="${kit}" to the <html> element.
5. Read restyle/${kit}/DESIGN.md before building anything. Follow its tokens, motion and layout rules.
6. Add pieces with: npx shadcn@latest add @restyleui/${kit}-<slug> (for example ${kit}-hero, ${kit}-navbar, ${kit}-faq). The list is at https://restyleui.dev/llms.txt
7. Add a note to AGENTS.md: this site uses the Restyle UI ${name} kit only. Never mix kits. Use the token utilities (bg-background, text-muted-foreground, font-display, rounded-kit) instead of hard-coded colors and fonts.
8. If you support skills, run: npx skills@latest add HidanZZ/restyleui --skill restyleui`
}
