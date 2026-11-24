import type { Metadata } from "next"

import { CodeBlock, Command, KitCodeBlock, KitCommand } from "@/components/site/code-block"
import { A, Code, DocsPage, H2, P, Step, Steps } from "@/components/site/docs-page"

export const metadata: Metadata = {
  title: "Installation",
  description: "Add a Restyle UI kit to a Next.js or Vite project with the shadcn CLI.",
}

const REGISTRY_JSON = `{
  "registries": {
    "@restyleui": "https://restyleui.dev/r/{name}.json"
  }
}`

type Framework = {
  css: string
  cssImport: string
  html: string
  htmlLang: "tsx" | "html"
  htmlCode: (kit: string) => string
}

const NEXT: Framework = {
  css: "app/globals.css",
  cssImport: ".",
  html: "app/layout.tsx",
  htmlLang: "tsx",
  htmlCode: (kit) => `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-kit="${kit}">
      <body>{children}</body>
    </html>
  )
}`,
}

const VITE: Framework = {
  css: "src/index.css",
  cssImport: "../app",
  html: "index.html",
  htmlLang: "html",
  htmlCode: (kit) => `<html lang="en" data-kit="${kit}">`,
}

function RegistrySteps({ framework }: { framework: Framework }) {
  return (
    <>
      <Step title="Add the registry">
        <p>
          Add the <Code>@restyleui</Code> registry to <Code>components.json</Code>.
        </p>
        <CodeBlock code={REGISTRY_JSON} lang="json" title="components.json" />
      </Step>
      <Step title="Install the theme">
        <p>
          Install the theme bridge and the tokens of the kit you picked. The CLI writes them to{" "}
          <Code>app/restyle-theme.css</Code> and <Code>app/restyle-&lt;kit&gt;.css</Code>, plus the kit&apos;s{" "}
          <Code>DESIGN.md</Code> under <Code>restyle/</Code>.
        </p>
        <KitCommand command={(kit) => `npx shadcn@latest add @restyleui/restyle-theme @restyleui/${kit}-theme`} />
      </Step>
      <Step title="Import both CSS files">
        <p>
          Import them after Tailwind in <Code>{framework.css}</Code>.
        </p>
        <KitCodeBlock
          lang="css"
          title={() => framework.css}
          code={(kit) => `@import "tailwindcss";
@import "${framework.cssImport}/restyle-theme.css";
@import "${framework.cssImport}/restyle-${kit}.css";`}
        />
      </Step>
      <Step title="Set the kit on <html>">
        <p>
          Kit tokens apply under <Code>data-kit</Code>. Add it to the root element in <Code>{framework.html}</Code>.
        </p>
        <KitCodeBlock lang={framework.htmlLang} title={() => framework.html} code={framework.htmlCode} />
      </Step>
      <Step title="Add pieces">
        <p>Install any component, section or unique piece by name. Dependencies, such as shared behaviors, come along.</p>
        <KitCommand command={(kit) => `npx shadcn@latest add @restyleui/${kit}-hero @restyleui/${kit}-button`} />
        <KitCodeBlock
          lang="tsx"
          code={() => `import { Button } from "@/components/button"
import { Hero } from "@/components/hero"

export default function Page() {
  return (
    <Hero
      title="Plan the week in one place"
      description="Shared lists, calm reminders and a clear view of what comes next."
      actions={[{ label: "Get started", href: "/signup" }]}
    />
  )
}`}
        />
      </Step>
    </>
  )
}

export default function InstallationPage() {
  return (
    <DocsPage
      href="/docs/installation"
      section="Getting started"
      title="Installation"
      description="Restyle UI installs through the shadcn CLI. The code is copied into your project, so you own it and can change it."
      toc={[
        { id: "requirements", title: "Requirements" },
        { id: "nextjs", title: "Next.js" },
        { id: "vite", title: "Vite" },
        { id: "fonts", title: "Fonts" },
        { id: "switching-kits", title: "Switching kits" },
      ]}
    >
      <H2 id="requirements">Requirements</H2>
      <P>
        React 19, Tailwind CSS v4 and a <Code>components.json</Code> from the shadcn CLI. Commands follow the kit
        picked in the switcher at the bottom right of this page.
      </P>

      <H2 id="nextjs">Next.js</H2>
      <Steps>
        <Step title="Set up shadcn">
          <p>In a Next.js app with Tailwind CSS v4, run the shadcn init command.</p>
          <Command command="npx shadcn@latest init" />
        </Step>
        <RegistrySteps framework={NEXT} />
      </Steps>

      <H2 id="vite">Vite</H2>
      <Steps>
        <Step title="Set up Tailwind and shadcn">
          <p>
            Add Tailwind CSS v4 with <Code>@tailwindcss/vite</Code> and the <Code>@/*</Code> path alias, as in the{" "}
            <A href="https://ui.shadcn.com/docs/installation/vite">shadcn Vite guide</A>, then run the init command.
          </p>
          <Command command="npx shadcn@latest init" />
        </Step>
        <RegistrySteps framework={VITE} />
      </Steps>

      <H2 id="fonts">Fonts</H2>
      <P>
        Kit font stacks put the original font first, then a free fallback. Load the free fallback yourself, for
        example with <Code>next/font</Code> or a <Code>@font-face</Code> rule. Paid fonts load only when you own a
        license. Each kit page lists its fonts, fallbacks and licenses: see <A href="/docs/kits/norma">a kit page</A>.
      </P>

      <H2 id="switching-kits">Switching kits</H2>
      <P>
        Every kit has the same pieces with the same props. To move a site to another kit, install the new theme and
        pieces, change the CSS import and the <Code>data-kit</Code> value, and keep your page code as it is.
      </P>
    </DocsPage>
  )
}
