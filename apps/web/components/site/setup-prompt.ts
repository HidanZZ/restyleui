import type { KitSlug } from "@/lib/catalog"
import { kitMeta } from "@/lib/kits"

/** The "Copy Prompt" text: sets up Restyle UI in a project through a coding agent. */
export function setupPrompt(kit: KitSlug) {
  const name = kitMeta[kit].name
  return `Set up Restyle UI in this project with the ${name} kit (${kit}). It needs React 19, Tailwind CSS v4 and the shadcn CLI.

1. If there is no components.json, run: npx shadcn@latest init
2. Add the registry to components.json: "registries": { "@restyleui": "https://restyleui.dev/r/{name}.json" }
3. Install the theme: npx shadcn@latest add @restyleui/restyle-theme @restyleui/${kit}-theme
4. Add "@layer ui-sdk;" as the first line of the global stylesheet, before @import "tailwindcss".
5. At the end of that file, after the shadcn :root, .dark and @theme blocks, add: @import "./restyle-theme.css"; @import "./restyle-${kit}.css"; The CLI writes them to app/ in Next.js, or under src/app/ when the project has src/, so fix the paths to match.
6. Add data-kit="${kit}" to the <html> element, then load the kit's free fonts and expose them as the CSS variables its font stacks read.
7. Read restyle/${kit}/DESIGN.md before building anything. Follow its tokens, motion and layout rules.
8. Add pieces with: npx shadcn@latest add @restyleui/${kit}-<slug> (for example ${kit}-hero, ${kit}-navbar, ${kit}-faq). The list is at https://restyleui.dev/llms.txt
9. Add a note to AGENTS.md: this site uses the Restyle UI ${name} kit only. Never mix kits. Use the token utilities (bg-background, text-muted-foreground, font-display, rounded-kit) instead of hard-coded colors and fonts.
10. If you support skills, run: npx skills@latest add HidanZZ/restyleui --skill restyleui`
}
