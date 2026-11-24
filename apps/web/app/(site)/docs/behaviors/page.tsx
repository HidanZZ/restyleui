import type { Metadata } from "next"
import Link from "next/link"

import { A, Code, DocsPage, H2, List, P } from "@/components/site/docs-page"
import { ArrowRightIcon } from "@/components/site/icons"
import { focusRing } from "@/components/site/ui"
import { BEHAVIORS } from "@/lib/behaviors"
import { cn } from "@/registry/restyle/lib/utils"

export const metadata: Metadata = {
  title: "Behaviors",
  description:
    "The 8 interactive and motion behaviors shared by every Restyle UI kit: nav, reveal, video, carousel, marquee, tabs, tilt, count-up and overlays.",
}

export default function BehaviorsIndexPage() {
  return (
    <DocsPage
      href="/docs/behaviors"
      section="Behaviors"
      title="Behaviors"
      description="Every kit is built from the same 8 behaviors. Interaction comes from @ui-sdk/react parts; motion and scroll come from small hooks. A kit only supplies the styles."
      toc={[
        { id: "how-they-fit", title: "How they fit" },
        { id: "all-behaviors", title: "All 8 behaviors" },
      ]}
    >
      <H2 id="how-they-fit">How they fit</H2>
      <P>
        Each kit implements the same behaviors with the same props. The logic is shared, so keyboard support, focus
        handling, scroll lock and reduced motion work the same in every kit. Only the look changes.
      </P>
      <List>
        <li>
          <strong className="font-medium text-foreground">Hooks</strong> install by name from the{" "}
          <Code>@restyleui</Code> registry. For example{" "}
          <Code>npx shadcn@latest add @restyleui/use-reveal</Code>. A hook that needs reduced motion installs{" "}
          <Code>use-reduced-motion</Code> with it.
        </li>
        <li>
          <strong className="font-medium text-foreground">UI parts</strong> come from one npm package,{" "}
          <Code>@ui-sdk/react</Code>. Install it once: <Code>npm install @ui-sdk/react</Code>. Each part has its own
          entry, such as <Code>@ui-sdk/react/dialog</Code>.
        </li>
        <li>
          <strong className="font-medium text-foreground">Recipes</strong> on each page are complete components copied
          from <Code>docs/BEHAVIORS.md</Code>, the reference every kit author uses.
        </li>
      </List>
      <P>
        If you use a ui-sdk overlay, add <Code>@layer ui-sdk;</Code> at the top of your global CSS. The{" "}
        <A href="/docs/behaviors/overlay">overlay page</A> shows the exact snippet and explains why the order matters.
      </P>

      <H2 id="all-behaviors">All 8 behaviors</H2>
      <ul className="my-4 grid gap-3 md:grid-cols-2">
        {BEHAVIORS.map((behavior, index) => (
          <li key={behavior.slug}>
            <Link
              href={`/docs/behaviors/${behavior.slug}`}
              className={cn(
                "group flex h-full flex-col gap-2 rounded-xl border border-border p-4 transition-colors duration-150 hover:bg-muted/50",
                focusRing,
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="text-[15px] font-medium">
                  {behavior.title}
                </span>
                <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                  <ArrowRightIcon className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </span>
              <span className="text-sm leading-6 text-muted-foreground">{behavior.description}</span>
              <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {behavior.parts.map((part) => (
                  <span key={part.name} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {part.name}
                  </span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DocsPage>
  )
}
