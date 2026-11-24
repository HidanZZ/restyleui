import type { Metadata } from "next"

import { CodeBlock, Command } from "@/components/site/code-block"
import { A, Code, DocsPage, H2, H3, List, P } from "@/components/site/docs-page"
import { PromptCard } from "@/components/site/prompt"

export const metadata: Metadata = {
  title: "Agents",
  description: "Set up Restyle UI with a coding agent: setup prompt, agent skill, llms.txt and the shadcn MCP server.",
}

const MCP_CONFIG = `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}`

export default function AgentsPage() {
  return (
    <DocsPage
      href="/docs/agents"
      section="Getting started"
      title="Agents"
      description="Restyle UI is built for developers and their coding agents. Every kit comes with written design rules, and every piece installs by name."
      toc={[
        { id: "setup-prompt", title: "Setup prompt" },
        { id: "agent-skill", title: "Agent skill" },
        { id: "rules", title: "Rules for agents" },
        { id: "llms-txt", title: "llms.txt" },
        { id: "mcp", title: "shadcn MCP server" },
      ]}
    >
      <H2 id="setup-prompt">Setup prompt</H2>
      <P>
        Paste this prompt into your agent. It adds the registry, installs the theme of the kit picked in the switcher,
        and tells the agent where the design rules live.
      </P>
      <PromptCard />

      <H2 id="agent-skill">Agent skill</H2>
      <P>
        The <Code>restyleui</Code> skill teaches an agent the workflow: pick one kit, read its <Code>DESIGN.md</Code>,
        then compose pages from the kit&apos;s pieces instead of writing new styles. Install it in agents that
        support skills.
      </P>
      <Command command="npx skills@latest add HidanZZ/restyleui --skill restyleui" />
      <P>
        The theme install writes the kit&apos;s rules to <Code>restyle/&lt;kit&gt;/DESIGN.md</Code>: tokens, type
        scale, motion feel, layout rules, and a list of do and don&apos;t. The skill reads this file before it builds.
      </P>

      <H2 id="rules">Rules for agents</H2>
      <List>
        <li>Use one kit per site. Mixing kits is not supported.</li>
        <li>
          Use the contract props only. Every common piece has the same props in every kit, listed on each component
          page.
        </li>
        <li>
          Style with token utilities such as <Code>bg-background</Code>, <Code>text-muted-foreground</Code>,{" "}
          <Code>font-display</Code>, <Code>rounded-kit</Code>, <Code>py-section</Code> and <Code>max-w-kit</Code>.
          No hard-coded colors or fonts.
        </li>
        <li>
          Render overlays, such as dialogs and drawers, inside the element that carries <Code>data-kit</Code>, so the
          kit tokens still apply.
        </li>
        <li>Respect reduced motion in any animation you add.</li>
      </List>

      <H2 id="llms-txt">llms.txt</H2>
      <P>
        <A href="/llms.txt">restyleui.dev/llms.txt</A> is an index of the docs for language models: kits, pieces,
        install names and links. Every component and section page also has a <strong className="font-medium text-foreground">Copy Page</strong>{" "}
        button that copies the page as markdown, with the install command and the props table for the active kit.
      </P>

      <H2 id="mcp">shadcn MCP server</H2>
      <P>
        Restyle UI has no MCP server of its own. The shadcn MCP server reads every registry in{" "}
        <Code>components.json</Code>, so once <Code>@restyleui</Code> is there, your agent can browse, search and
        install kit pieces.
      </P>
      <H3>Set it up</H3>
      <P>Run the init command for your client, for example Claude Code:</P>
      <Command command="npx shadcn@latest mcp init --client claude" />
      <P>Or add the server to your client&apos;s MCP configuration by hand:</P>
      <CodeBlock code={MCP_CONFIG} lang="json" title=".mcp.json" />
      <H3>Ask for pieces</H3>
      <List>
        <li>Show me the sections in the @restyleui registry.</li>
        <li>Add the linear-hero and linear-faq sections.</li>
        <li>Build a landing page with the norma kit: hero, logo strip, feature grid, FAQ and footer.</li>
      </List>
    </DocsPage>
  )
}
