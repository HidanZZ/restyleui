import type { Metadata } from "next"

import { A, Code, DocsPage, H2, List, P } from "@/components/site/docs-page"
import { KitList } from "@/components/site/kit-list"

export const metadata: Metadata = {
  title: "Introduction",
  description: "Restyle UI is a free library of design kits rebuilt from real websites.",
}

export default function IntroductionPage() {
  return (
    <DocsPage
      href="/docs"
      section="Getting started"
      title="Introduction"
      description="Restyle UI is a free library of design kits rebuilt from real websites. Each kit gives you the same components with the same props, in a different look and motion."
      toc={[
        { id: "how-it-works", title: "How it works" },
        { id: "kits", title: "Kits" },
        { id: "one-kit-per-site", title: "One kit per site" },
        { id: "source-labels", title: "Source labels" },
        { id: "license", title: "License" },
      ]}
    >
      <H2 id="how-it-works">How it works</H2>
      <P>Every kit is built in three layers.</P>
      <List>
        <li>
          <strong className="font-medium text-foreground">Behaviors</strong> are shared by all kits: responsive
          navigation, scroll reveal, carousels, tabs, count-up numbers and dialogs. Interaction logic comes from{" "}
          <Code>@ui-sdk/core</Code>; motion behaviors are small hooks that respect reduced motion.
        </li>
        <li>
          <strong className="font-medium text-foreground">Common pieces</strong> are 15 components and 8 sections.
          Every kit implements all of them with exactly the same props, so a site can move from one kit to another by
          changing imports only.
        </li>
        <li>
          <strong className="font-medium text-foreground">Unique pieces</strong> belong to one kit, such as a globe or
          a product demo hero. Every prop has a default, so they render a complete demo on their own.
        </li>
      </List>
      <P>
        Kit tokens are CSS variables with the shadcn names (<Code>--background</Code>, <Code>--primary</Code>,{" "}
        <Code>--border</Code> and so on), mapped to Tailwind v4 utilities. You install everything with the shadcn
        CLI, so the code lives in your project and you can change it freely. See{" "}
        <A href="/docs/installation">Installation</A>.
      </P>

      <H2 id="kits">Kits</H2>
      <P>Five kits ship in v1. Each one ships in the native mode of its source site.</P>
      <KitList className="my-4" />

      <H2 id="one-kit-per-site">One kit per site</H2>
      <P>
        A site uses one kit. Every kit sets the same token names through <Code>data-kit</Code> on{" "}
        <Code>&lt;html&gt;</Code>, so one page holds one kit.
        Mixing kits is not supported. To try another look, switch the kit: the imports change, the props stay.
      </P>

      <H2 id="source-labels">Source labels</H2>
      <P>
        Every common piece carries a label. <strong className="font-medium text-foreground">From source</strong>{" "}
        means the piece was rebuilt from the original website. <strong className="font-medium text-foreground">
          Designed in style
        </strong>{" "}
        means the original site has no such piece, so it was designed to match the kit&apos;s rules.
      </P>

      <H2 id="license">License</H2>
      <P>
        Restyle UI code is MIT licensed. Brand names, original fonts and original media stay with their owners. Kits
        use no original images, videos or logos: media is generated or drawn, and paid fonts fall back to free ones
        unless you own a license.
      </P>
    </DocsPage>
  )
}
