import type { ReactNode } from "react"
import { ConnectorMarquee } from "@/registry/teamwork/components/connector-marquee"
import { Cta } from "@/registry/teamwork/components/cta"
import { Faq } from "@/registry/teamwork/components/faq"
import { FeatureGrid } from "@/registry/teamwork/components/feature-grid"
import { FeatureTabs } from "@/registry/teamwork/components/feature-tabs"
import { FooterSection } from "@/registry/teamwork/components/footer-section"
import { Hero } from "@/registry/teamwork/components/hero"
import { LogoStrip } from "@/registry/teamwork/components/logo-strip"
import { Navbar } from "@/registry/teamwork/components/navbar"
import { Odometer } from "@/registry/teamwork/components/odometer"
import { OverviewCarousel } from "@/registry/teamwork/components/overview-carousel"
import { Reveal } from "@/registry/teamwork/components/reveal"
import { Testimonials } from "@/registry/teamwork/components/testimonials"

const media = (file: string) => `/kits/teamwork/${file}`

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
)

const METRICS = [
  { label: "Work items mapped", value: 52_418_906_237 },
  { label: "Links between items", value: 96_302_775_419 },
  { label: "Questions each week", value: 386_215_904 },
  { label: "Teams on the map", value: 240, suffix: "K+" },
]

export function Landing() {
  return (
    <div className="min-h-dvh bg-background font-body text-foreground">
      <Navbar
        brand="Weft Graph"
        items={[
          {
            label: "About",
            href: "#overview",
            children: [
              { label: "Overview", href: "#overview", description: "How the map comes together." },
              { label: "Connectors", href: "#connectors", description: "The tools Weft reads from." },
              { label: "Security", href: "#faq", description: "Who can see what, and why." },
            ],
          },
          { label: "CLI", href: "#assistants" },
          { label: "Benchmark", href: "#benchmark" },
        ]}
        actions={[
          { label: "Sign up", href: "#signup", variant: "secondary" },
          { label: "Log in", href: "#login", variant: "primary" },
        ]}
      />

      <main>
        <Hero
          title="Weft Graph"
          description="Meet the map that links your team's work across every tool you already use"
          actions={[{ label: "Preview your map", href: "#overview", variant: "primary" }]}
        />

        <div id="overview" className="scroll-mt-[88px]">
          <OverviewCarousel label="How Weft Graph works" />
        </div>

        <section aria-label="Weft Graph in numbers" className="w-full bg-background pb-section max-sm:pb-20">
          <Reveal stagger className="mx-auto grid w-full max-w-kit grid-cols-1 px-gutter sm:grid-cols-2 xl:grid-cols-4">
            {METRICS.map((metric) => (
              <Odometer key={metric.label} label={metric.label} value={metric.value} suffix={metric.suffix} className="w-full" />
            ))}
          </Reveal>
        </section>

        <div id="connectors" className="scroll-mt-[88px]">
          <ConnectorMarquee
            title="The more you connect, the clearer the map"
            description="Link the apps your teams already use, from docs and tickets to chat and calendars, or build a connector of your own."
            action={{ label: "Browse connectors", href: "#connectors" }}
          />
        </div>

        <div id="assistants" className="scroll-mt-[88px]">
          <FeatureGrid
            eyebrow="Assistants"
            title="Every assistant, working from the same map"
            description="Point your terminal, your browser and your desktop helpers at Weft and they start from the full picture."
            features={[
              {
                title: "In your terminal",
                description: "Ask about a release, a log or a flaky test and get answers that know which work it belongs to.",
                icon: icon(<path d="M4 6h16v12H4zM7.5 10l2.5 2-2.5 2M12 14h4" />),
                media: { type: "image", src: media("feature-1.webp"), alt: "Linked people, files and tasks in a small graph" },
              },
              {
                title: "In your browser",
                description: "Summaries, briefs and decisions pull from the pages and threads your team already wrote.",
                icon: icon(<path d="M3.5 5h17v14h-17zM3.5 9h17M7 7h.01M9.5 7h.01" />),
                media: { type: "image", src: media("feature-2.webp"), alt: "A document card linked to a person and a timeline" },
              },
              {
                title: "In your desktop helpers",
                description: "Any assistant that speaks the open protocol can read the map, with the same permissions as you.",
                icon: icon(<path d="M8 4h8v4H8zM4 16h6v4H4zM14 16h6v4h-6zM12 8v4M7 16v-4h10v4" />),
                media: { type: "image", src: media("feature-3.webp"), alt: "App tiles feeding a shared hub of context" },
              },
            ]}
          />
        </div>

        <LogoStrip
          title="Teams already weaving their work together"
          logos={[
            { name: "Bluefern" },
            { name: "Copperline" },
            { name: "Daymark Studio" },
            { name: "Kindred Field" },
            { name: "Morrow Works" },
            { name: "Tandem Grove" },
          ]}
        />

        <div id="benchmark" className="scroll-mt-[88px]">
          <Cta
            title={
              <>
                Benchmark your assistant.
                <br />
                Measure what the map changes.
              </>
            }
            description="When an assistant reads from Weft, it follows the links between work instead of searching each tool on its own. In our pilot runs, answers got sharper and used fewer steps. Your own results will depend on your setup."
            actions={[{ label: "Join the pilot", href: "#signup", variant: "primary" }]}
          />
        </div>

        <FeatureTabs
          eyebrow="Sample questions"
          title="Tour a sample map or start your own"
          description="Pick a question to see how Weft connects the dots, or jump straight into a map built from your own tools."
          tabs={[
            {
              id: "update",
              label: "Weekly update",
              title: "Draft my weekly project update",
              description: "Weft gathers the merged work, open risks and decisions from the week, then links each line back to its source.",
              media: { type: "image", src: media("tab-1.webp"), alt: "A project hub linked to people, charts and notes" },
            },
            {
              id: "regression",
              label: "Root cause",
              title: "Find the root cause of a regression",
              description: "Follow the change from the alert to the pull request, the ticket behind it and the people who reviewed it.",
              media: { type: "image", src: media("tab-2.webp"), alt: "A focused view of a project hub and its linked items" },
            },
            {
              id: "goals",
              label: "Goals",
              title: "See how work tracks to our goals",
              description: "Roll projects up to the goals they serve and spot the ones that have gone quiet.",
              media: { type: "image", src: media("tab-3.webp"), alt: "Files, people and tiles linked around a bright center" },
            },
          ]}
        />

        <Testimonials
          title="Teams that stopped hunting for context"
          testimonials={[
            {
              quote: "Our assistant used to guess. Now it cites the ticket, the doc and the thread, and it is usually right.",
              name: "Priya Raman",
              role: "Platform lead, Copperline",
              avatar: media("avatar-1.webp"),
            },
            {
              quote: "Weekly updates went from an afternoon of tab hopping to ten minutes of light editing.",
              name: "Arjun Mehta",
              role: "Program manager, Morrow Works",
              avatar: media("avatar-2.webp"),
            },
            {
              quote: "The map showed us two teams solving the same problem. That alone paid for the pilot.",
              name: "Dev Kapoor",
              role: "Head of engineering, Kindred Field",
              avatar: media("avatar-3.webp"),
            },
          ]}
        />

        <div id="faq" className="scroll-mt-[88px]">
          <Faq
            title="Questions about Weft Graph"
            description="What it reads, who can see it and how to get started."
            items={[
              {
                question: "What does Weft Graph read?",
                answer: "Pages, tickets, pull requests, threads, meetings and the people behind them, from every tool you connect.",
              },
              {
                question: "Can people see work they do not have access to?",
                answer: "No. Every answer respects the permissions each person already has in the source tools.",
              },
              {
                question: "Which assistants can use it?",
                answer: "Our command line tool works in any terminal, and any assistant that supports the open protocol can read the map.",
              },
              {
                question: "How long does setup take?",
                answer: "Connect a first tool in a few minutes. The map fills in on its own as more tools join.",
              },
            ]}
          />
        </div>
      </main>

      <FooterSection
        brand="Weft"
        description="A living map of how your team's work connects."
        columns={[
          {
            title: "Product",
            links: [
              { label: "Overview", href: "#overview" },
              { label: "Connectors", href: "#connectors" },
              { label: "Command line", href: "#assistants" },
              { label: "Benchmark", href: "#benchmark" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About", href: "#about" },
              { label: "Careers", href: "#careers" },
              { label: "Press", href: "#press" },
              { label: "Contact", href: "#contact" },
            ],
          },
          {
            title: "Resources",
            links: [
              { label: "Documentation", href: "#docs" },
              { label: "Guides", href: "#guides" },
              { label: "Status", href: "#status" },
            ],
          },
          {
            title: "Learn",
            links: [
              { label: "Sample maps", href: "#samples" },
              { label: "Community", href: "#community" },
              { label: "Partners", href: "#partners" },
            ],
          },
        ]}
        social={[
          { label: "Privacy", href: "#privacy" },
          { label: "Terms", href: "#terms" },
          { label: "Security", href: "#security" },
        ]}
        legal="2026 Weft Labs"
        newsletter={{
          title: "Notes from the map, about once a month",
          input: {
            label: "Work email",
            buttonLabel: "Subscribe",
            placeholder: "you@company.com",
            type: "email",
            name: "email",
            hint: "No spam. Unsubscribe any time.",
            successMessage: "Thanks. The next note is on its way.",
          },
        }}
      />
    </div>
  )
}
