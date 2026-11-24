import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { BehaviorDemo } from "@/components/site/behavior-demos"
import { CodeBlock, Command } from "@/components/site/code-block"
import { A, Code, DataTable, DocsPage, DocsPageSkeleton, H2, List, P } from "@/components/site/docs-page"
import { BEHAVIOR_SLUGS, getBehavior, type Behavior } from "@/lib/behaviors"

const TOC = [
  { id: "what-it-does", title: "What it does" },
  { id: "install", title: "Install" },
  { id: "demo", title: "Live demo" },
  { id: "signature", title: "Signature" },
  { id: "recipe", title: "Recipe" },
  { id: "notes", title: "Notes" },
]

const CSS_LAYER = `@layer ui-sdk;

@import "tailwindcss";`

export function generateStaticParams() {
  return BEHAVIOR_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<"/docs/behaviors/[slug]">): Promise<Metadata> {
  const behavior = getBehavior((await params).slug)
  return behavior ? { title: behavior.title, description: behavior.description } : {}
}

/** Renders backtick spans in the content strings as inline code. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, index) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <Code key={index}>{part.slice(1, -1)}</Code>
        ) : (
          part
        ),
      )}
    </>
  )
}

async function BehaviorDetail({ behavior }: { behavior: Behavior }) {
  return (
    <DocsPage
      href={`/docs/behaviors/${behavior.slug}`}
      section="Behaviors"
      title={behavior.title}
      description={behavior.summary}
      meta={
        <p className="text-sm text-muted-foreground">
          Shared by every kit.{" "}
          <A href="/docs/behaviors" className="text-foreground">
            All 8 behaviors
          </A>
        </p>
      }
      toc={TOC}
    >
      <H2 id="what-it-does">What it does</H2>
      {behavior.how.map((paragraph) => (
        <P key={paragraph}>
          <Inline text={paragraph} />
        </P>
      ))}
      <DataTable
        head={["Part", "Import", "What it handles"]}
        rows={behavior.parts.map((part) => [
          <code key="name" className="font-mono text-[13px] whitespace-nowrap">
            {part.name}
          </code>,
          <code key="path" className="font-mono text-[12.5px] text-muted-foreground">
            {part.path}
          </code>,
          <span key="role">
            <Inline text={part.role} />
          </span>,
        ])}
      />

      <H2 id="install">Install</H2>
      <P>
        Install the hooks with the shadcn CLI and the ui-sdk parts with npm. Both are unstyled, so the kit supplies the
        classes.
      </P>
      <div className="my-4 flex flex-col gap-4">
        {behavior.install.map((item) => (
          <div key={item.command} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            <Command command={item.command} />
          </div>
        ))}
      </div>
      {behavior.cssLayer && (
        <div className="my-5 rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-sm font-medium">Add the ui-sdk layer first</p>
          <P className="mt-1 mb-3 max-w-none text-sm">
            ui-sdk injects a small stylesheet of its own, and its docs ask for a cascade layer named{" "}
            <Code>ui-sdk</Code>. Put this line at the very top of your global CSS, before the Tailwind import, so the
            layer order is explicit for every bundler. Your utility classes still win: the layer is declared first and
            has the lowest priority.
          </P>
          <CodeBlock code={CSS_LAYER} lang="css" title="app/globals.css" />
        </div>
      )}

      <H2 id="demo">Live demo</H2>
      <P>
        This demo uses the website colors, not a kit. Every kit styles the same parts with its own tokens and motion
        feel. Try the controls: hover, focus, the keyboard and the scroll bar all matter.
      </P>
      <div className="my-4 rounded-xl border border-border bg-muted/20 p-4 md:p-6">
        <BehaviorDemo slug={behavior.slug} />
      </div>

      <H2 id="signature">Signature</H2>
      <P>The hook signature and options, copied from the hook file in the registry.</P>
      <div className="my-4 flex flex-col gap-4">
        {behavior.signatures.map((signature) => (
          <CodeBlock key={signature.title} code={signature.code} lang="tsx" title={signature.title} />
        ))}
      </div>

      <H2 id="recipe">Recipe</H2>
      <P>
        The complete component from{" "}
        <A href="https://github.com/HidanZZ/restyleui/blob/main/docs/BEHAVIORS.md">docs/BEHAVIORS.md</A>. Every kit
        starts from this code and changes the classes.
      </P>
      <div className="my-4 flex flex-col gap-5">
        {behavior.recipes.map((recipe) => (
          <CodeBlock key={recipe.title} code={recipe.code} lang="tsx" title={recipe.title} maxHeight />
        ))}
      </div>

      <H2 id="notes">Notes</H2>
      <List>
        {behavior.notes.map((note) => (
          <li key={note}>
            <Inline text={note} />
          </li>
        ))}
      </List>
    </DocsPage>
  )
}

export default function BehaviorPage({ params }: PageProps<"/docs/behaviors/[slug]">) {
  return (
    <Suspense fallback={<DocsPageSkeleton />}>
      {params.then(({ slug }) => {
        const behavior = getBehavior(slug)
        if (!behavior) notFound()
        return <BehaviorDetail behavior={behavior} />
      })}
    </Suspense>
  )
}
