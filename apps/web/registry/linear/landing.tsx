import type { ReactNode } from "react"
import type { FeatureTabsProps, Media } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Badge } from "@/registry/linear/components/badge"
import { CountUp } from "@/registry/linear/components/count-up"
import { Cta } from "@/registry/linear/components/cta"
import { Faq } from "@/registry/linear/components/faq"
import { FeatureGrid } from "@/registry/linear/components/feature-grid"
import { FeatureTabs } from "@/registry/linear/components/feature-tabs"
import { FooterSection } from "@/registry/linear/components/footer-section"
import { LogoStrip } from "@/registry/linear/components/logo-strip"
import { Navbar } from "@/registry/linear/components/navbar"
import { ProductDemoHero } from "@/registry/linear/components/product-demo-hero"
import { Reveal } from "@/registry/linear/components/reveal"
import { TechSpecDrawer, type TechSpec } from "@/registry/linear/components/tech-spec-drawer"
import { Testimonials } from "@/registry/linear/components/testimonials"
import { TextLink } from "@/registry/linear/components/text-link"

// ---------------------------------------------------------------------------
// Content: Fieldnote, an invented issue tracker and planning tool.
// ---------------------------------------------------------------------------

const media = (file: string, alt: string): Media => ({ type: "image", src: `/kits/linear/${file}`, alt })
const loop: Media = {
  type: "video",
  src: "/kits/linear/loop.mp4",
  poster: "/kits/linear/loop-poster.webp",
  alt: "Issues moving across a Fieldnote board as rules sort them",
}

function Mark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={className}>
      <rect x="1.5" y="1.5" width="17" height="17" rx="4.5" fill="currentColor" />
      <path d="M6 7h8M6 10h8M6 13h4.5" fill="none" stroke="var(--background)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const brand = (
  <span className="inline-flex items-center gap-2">
    <Mark className="size-5" />
    Fieldnote
  </span>
)

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d={path} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const logos = [
  { name: "Driftwell" },
  { name: "Copperline" },
  { name: "Kestrel Labs" },
  { name: "Ambergrove" },
  { name: "Tidemark" },
  { name: "Pinecraft" },
  { name: "Halden & Co" },
]

/** Spec rows share one shape: a short intro, a heading and a two-column table. */
function spec(
  id: string,
  label: string,
  intro: string,
  heading: string,
  headers: [string, string],
  rows: [string, string][],
  figure?: string
): TechSpec {
  return {
    id,
    label,
    title: label,
    blocks: [
      { type: "paragraph", text: intro },
      ...(figure ? [{ type: "figure" as const, caption: figure }] : []),
      { type: "heading", text: heading },
      { type: "table", headers, rows: rows.map(([rowLabel, value]) => ({ label: rowLabel, value })) },
    ],
  }
}

type FeatureSection = Omit<FeatureTabsProps, "className"> & { specs: TechSpec[] }

const featureSections: FeatureSection[] = [
  {
    eyebrow: "1.0 Intake",
    title: (
      <>
        Intake
        <br />
        and triage
      </>
    ),
    description: "Turn threads, emails and forms into clear issues that arrive routed, labeled and ranked for the right team.",
    tabs: [
      {
        id: "requests",
        label: "Requests",
        title: "Every request in one queue",
        description: "New issues land with their source, the people involved and the original thread attached.",
        media: media("tab-1.webp", "A Fieldnote board of incoming requests grouped by status"),
      },
      {
        id: "triage",
        label: "Triage",
        title: "Sorted before you look",
        description: "Rules set the team, priority and labels as soon as a request arrives.",
        media: loop,
      },
      {
        id: "routing",
        label: "Routing",
        title: "The right owner, every time",
        description: "Hand work across teams without losing the context that came with it.",
        media: media("feature-1.webp", "Issues assigned to owners across several teams"),
      },
    ],
    specs: [
      spec(
        "requests",
        "Shared inbox",
        "The shared inbox collects every new request for a team. Each item keeps its source and the conversation it came from.",
        "Sources",
        ["Source", "Details"],
        [
          ["Chat threads", "Mention Fieldnote in a thread and the conversation becomes the issue summary."],
          ["Email", "Each team gets a private address. Replies on the issue go back to the sender."],
          ["Web forms", "Shareable forms with required fields and file uploads."],
        ],
        "Inbox with grouped requests"
      ),
      spec(
        "triage",
        "Triage rules",
        "Triage rules run when an issue is created. They set fields, assign owners and post a note in the activity log.",
        "Rules",
        ["Component", "Supported properties"],
        [
          ["Triggers", "Created, Label added, Status changed, Comment added"],
          ["Filters", "Team, Priority, Labels, Creator, Source"],
          ["Actions", "Assign, Set priority, Add label, Move team"],
        ]
      ),
      spec(
        "forms",
        "Request forms",
        "Forms give other teams a simple way to ask for work, with the fields your team needs to act on it.",
        "Fields",
        ["Field", "Details"],
        [
          ["Text", "Short answers, long answers and links."],
          ["Choice", "Single or multiple choice, mapped to labels."],
          ["Files", "Screenshots and logs up to 50 MB each."],
        ]
      ),
      spec(
        "sla",
        "Response targets",
        "Response targets track how long new requests wait. Fieldnote highlights anything close to its limit.",
        "Targets",
        ["Priority", "Default target"],
        [
          ["Urgent", "First response within 2 hours"],
          ["High", "First response within 1 working day"],
          ["Normal", "First response within 3 working days"],
        ]
      ),
    ],
  },
  {
    eyebrow: "2.0 Plan",
    title: (
      <>
        Planning
        <br />
        and roadmaps
      </>
    ),
    description: "Shape the quarter from idea to launch. Keep projects, timelines and updates in step with the work underneath.",
    tabs: [
      {
        id: "roadmaps",
        label: "Roadmaps",
        title: "A timeline that updates itself",
        description: "Progress rolls up from issues, so the plan stays current without manual edits.",
        media: media("tab-2.webp", "A roadmap timeline with project bars and progress charts"),
      },
      {
        id: "projects",
        label: "Projects",
        title: "Projects with a clear owner",
        description: "Each project has a lead, a target date and a short brief the whole team can read.",
        media: media("feature-2.webp", "Project health charts beside a list of milestones"),
      },
      {
        id: "cycles",
        label: "Cycles",
        title: "A steady weekly rhythm",
        description: "Unfinished work moves to the next cycle on its own, with a summary of what changed.",
        media: media("hero.webp", "A cycle board with issues grouped by status"),
      },
    ],
    specs: [
      spec(
        "projects",
        "Projects",
        "Projects group issues around one outcome. Each one has a lead, members, a target date and a health status.",
        "Properties",
        ["Property", "Details"],
        [
          ["Lead", "One person who owns the outcome and posts updates."],
          ["Milestones", "Named checkpoints with their own target dates."],
          ["Health", "On track, At risk or Off track, set with each update."],
        ],
        "Project page with milestones"
      ),
      spec(
        "roadmaps",
        "Roadmaps",
        "Roadmaps place projects on a shared timeline. Drag a bar to change its dates; dependencies draw as lines.",
        "Views",
        ["View", "Details"],
        [
          ["Timeline", "Months or quarters, grouped by team or lead."],
          ["List", "Sort by status, health or target date."],
          ["Board", "Columns by status with progress on every card."],
        ]
      ),
      spec(
        "cycles",
        "Cycles",
        "Cycles are short, repeating periods of work. Fieldnote moves unfinished issues forward when a cycle ends.",
        "Settings",
        ["Setting", "Options"],
        [
          ["Length", "One to eight weeks."],
          ["Start day", "Any weekday, per team."],
          ["Cooldown", "Optional break between cycles."],
        ]
      ),
      spec(
        "updates",
        "Status updates",
        "Project leads post short written updates. Readers get a digest instead of a stream of notifications.",
        "Delivery",
        ["Channel", "Details"],
        [
          ["Inbox", "One digest per week, grouped by project."],
          ["Email", "Optional, for people outside the workspace."],
          ["Chat", "Posted to the project channel when published."],
        ]
      ),
    ],
  },
  {
    eyebrow: "3.0 Automate",
    title: (
      <>
        Assistants
        <br />
        and automations
      </>
    ),
    description: "Hand routine upkeep to the workspace. Summaries, drafts and status changes happen in the background.",
    tabs: [
      {
        id: "automations",
        label: "Automations",
        title: "Rules that keep the board tidy",
        description: "Close stale issues, move linked work and notify the right channel on its own.",
        media: loop,
      },
      {
        id: "summaries",
        label: "Summaries",
        title: "Long threads, short summaries",
        description: "Read the decision and the next step without scrolling through the whole discussion.",
        media: media("feature-1.webp", "An issue list with a short summary beside each thread"),
      },
      {
        id: "drafts",
        label: "Drafts",
        title: "First drafts from rough notes",
        description: "Turn a few bullet points into a clear issue with steps and acceptance notes.",
        media: media("tab-1.webp", "Drafted issues waiting for review on a board"),
      },
    ],
    specs: [
      spec(
        "automations",
        "Automations",
        "Automations run when an issue changes. Every change they make shows in the activity log with the rule that made it.",
        "Limits",
        ["Item", "Limit"],
        [
          ["Rules", "Up to 200 per workspace."],
          ["Runs", "Unlimited on every plan."],
          ["Order", "Top to bottom; exclusive rules stop after a match."],
        ]
      ),
      spec(
        "summaries",
        "Summaries",
        "Summaries condense long threads into the decision, open questions and the next step. Authors can edit them.",
        "Coverage",
        ["Surface", "Details"],
        [
          ["Issues", "Thread summary at the top of the issue."],
          ["Projects", "Weekly summary of updates and changes."],
          ["Inbox", "One line per notification group."],
        ],
        "Issue with a pinned summary"
      ),
      spec(
        "api",
        "Assistant API",
        "Build your own assistants on the same events Fieldnote uses. Tokens are scoped to a team and can be revoked any time.",
        "Endpoints",
        ["Endpoint", "Details"],
        [
          ["Events", "Webhooks for issue, project and comment changes."],
          ["Actions", "Create, update and comment with a scoped token."],
          ["Search", "Query issues with the same filters as the app."],
        ]
      ),
      spec(
        "privacy",
        "Data controls",
        "Admins choose which teams use assistant features. Workspace content is never used to train shared models.",
        "Controls",
        ["Control", "Details"],
        [
          ["Per team", "Turn features on or off for each team."],
          ["Retention", "Summaries follow the issue's retention rules."],
          ["Audit", "Every assistant action is logged."],
        ]
      ),
    ],
  },
  {
    eyebrow: "4.0 Build",
    title: (
      <>
        Review
        <br />
        and release
      </>
    ),
    description: "Connect issues to branches and reviews, then ship with release notes that write themselves from the work.",
    tabs: [
      {
        id: "reviews",
        label: "Reviews",
        title: "Reviews next to the issue",
        description: "See the diff, the discussion and the issue it closes in one view.",
        media: media("feature-3.webp", "A code review with added and removed lines side by side"),
      },
      {
        id: "branches",
        label: "Branches",
        title: "Status follows the branch",
        description: "Opening, merging and deploying a branch moves its issue along for you.",
        media: media("tab-3.webp", "A branch view with linked issues and review status"),
      },
      {
        id: "releases",
        label: "Releases",
        title: "Release notes from shipped work",
        description: "Group merged issues by release and publish a clean summary to your team.",
        media: media("tab-2.webp", "A release timeline with grouped issues and charts"),
      },
    ],
    specs: [
      spec(
        "review",
        "Code review",
        "Reviews show the diff beside the issue, so reviewers see why a change exists before they read it.",
        "Supported hosts",
        ["Host", "Details"],
        [
          ["Git hosting", "Pull requests, comments and checks sync both ways."],
          ["Self-hosted", "Connect with a deploy key and a webhook."],
          ["Local", "Open the branch from the issue with one command."],
        ],
        "Review view with linked issue"
      ),
      spec(
        "branches",
        "Branch sync",
        "Branch names carry the issue ID. Fieldnote updates the issue status as the branch moves through review.",
        "Transitions",
        ["Event", "Issue status"],
        [
          ["Branch created", "In progress"],
          ["Review requested", "In review"],
          ["Merged", "Done"],
        ]
      ),
      spec(
        "releases",
        "Release notes",
        "Release notes collect merged issues and their summaries. Edit the draft, then publish it to the team or a public page.",
        "Formats",
        ["Format", "Details"],
        [
          ["Page", "A hosted changelog page with your own domain."],
          ["Email", "Send to a list of subscribers."],
          ["Markdown", "Copy into any tool you already use."],
        ]
      ),
      spec(
        "offline",
        "Offline sync",
        "The app keeps a local copy of your workspace. Keep working on a poor connection; edits merge when you are back online.",
        "Storage",
        ["Platform", "Details"],
        [
          ["Desktop", "Full workspace cached locally, encrypted at rest."],
          ["Browser", "Recent teams and projects cached in the browser."],
          ["Mobile", "Assigned issues and inbox available offline."],
        ]
      ),
    ],
  },
]

const changelog = [
  { version: "4.12", title: "Release timelines", description: "Group shipped work by release and see what went out in each one.", date: "Nov 18, 2026" },
  { version: "4.11", title: "Faster board filters", description: "Filters now apply instantly on boards with thousands of issues.", date: "Nov 6, 2026" },
  { version: "4.10", title: "Triage rule templates", description: "Start from ready-made rules for support, design and platform teams.", date: "Oct 23, 2026" },
  { version: "4.9", title: "Weekly digest", description: "One calm summary of project updates, delivered every Monday morning.", date: "Oct 9, 2026" },
]

/** Plain section heading in the source's 48px medium title style. */
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[length:var(--linear-title-3-size)] font-[510] leading-[1.33] tracking-[-0.012em] md:text-[length:var(--linear-title-5-size)] md:leading-[1.1] md:tracking-[-0.022em] xl:text-[length:var(--linear-title-6-size)] xl:leading-none">
      {children}
    </h2>
  )
}

function Changelog() {
  return (
    <section
      aria-labelledby="changelog-title"
      className="border-t border-(--linear-border-translucent-strong) pb-section pt-[calc(var(--kit-section-y)*2)] shadow-[0_-1px_0_var(--linear-bg-marketing)] lg:pt-[calc(var(--kit-section-y)*2.5)]"
    >
      <div className="mx-auto max-w-kit px-gutter">
        <Reveal className="px-(--linear-homepage-padding-inset)">
          <div id="changelog-title">
            <SectionTitle>Changelog</SectionTitle>
          </div>
        </Reveal>
        <Reveal
          stagger
          className="relative mt-12 grid gap-x-16 gap-y-12 px-(--linear-homepage-padding-inset) sm:grid-cols-2 md:mt-[72px] lg:grid-cols-4"
        >
          {changelog.map((entry, i) => (
            <article key={entry.title} className="relative min-w-0">
              <div className="relative mb-6 flex h-7 items-center lg:mb-12">
                <span
                  aria-hidden
                  className={cn("absolute inset-x-0 top-1/2 h-px bg-(--linear-border-translucent-strong)", i < changelog.length - 1 && "lg:-right-16")}
                />
                <span className="relative -ml-1.5 bg-background pr-3">
                  <Badge variant={i === 0 ? "accent" : "neutral"}>{entry.version}</Badge>
                </span>
              </div>
              <a
                href="#changelog"
                className="block rounded-[4px] transition-[filter] duration-100 ease-kit hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--linear-accent) motion-reduce:transition-none"
              >
                <h3 className="truncate text-[15px] font-[510] leading-[1.6] tracking-[-0.011em] text-(--linear-text-secondary)">{entry.title}</h3>
                <p className="mt-2 line-clamp-2 text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground">{entry.description}</p>
                <p className="mt-5 font-mono text-xs uppercase leading-[1.4] text-(--linear-text-quaternary)">{entry.date}</p>
              </a>
            </article>
          ))}
        </Reveal>
        <div className="mt-16 px-(--linear-homepage-padding-inset) md:mt-20">
          <TextLink href="#changelog" arrow>
            View all updates
          </TextLink>
        </div>
      </div>
    </section>
  )
}

const footer = {
  brand,
  description: "The calm issue tracker for teams that ship every week.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Intake", href: "#intake" },
        { label: "Planning", href: "#plan" },
        { label: "Automations", href: "#automate" },
        { label: "Reviews", href: "#build" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Features",
      links: [
        { label: "Shared inbox", href: "#intake" },
        { label: "Roadmaps", href: "#plan" },
        { label: "Cycles", href: "#plan" },
        { label: "Release notes", href: "#build" },
        { label: "Changelog", href: "#changelog" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Customers", href: "#customers" },
        { label: "Careers", href: "#careers" },
        { label: "Journal", href: "#journal" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#docs" },
        { label: "Developers", href: "#developers" },
        { label: "Status", href: "#status" },
        { label: "Download", href: "#download" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Contact us", href: "#contact" },
        { label: "Community", href: "#community" },
        { label: "Events", href: "#events" },
      ],
    },
  ],
  social: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Security", href: "#security" },
  ],
  legal: "Fieldnote. A demo product made for Restyle UI.",
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function Landing() {
  return (
    <div className="min-h-dvh bg-background font-body text-foreground antialiased">
      <Navbar
        brand={brand}
        items={[
          {
            label: "Product",
            href: "#product",
            children: [
              { label: "Intake", href: "#intake", description: "Collect requests from every channel." },
              { label: "Planning", href: "#plan", description: "Roadmaps, projects and cycles." },
              { label: "Automations", href: "#automate", description: "Rules and summaries that run on their own." },
              { label: "Reviews", href: "#build", description: "Branches, reviews and release notes." },
            ],
          },
          {
            label: "Resources",
            href: "#resources",
            children: [
              { label: "Documentation", href: "#docs", description: "Guides for every part of Fieldnote." },
              { label: "Changelog", href: "#changelog", description: "What shipped this month." },
            ],
          },
          { label: "Customers", href: "#customers" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ]}
        actions={[
          { label: "Log in", href: "#login", variant: "secondary" },
          { label: "Sign up", href: "#signup", variant: "primary" },
        ]}
      />

      <main>
        <ProductDemoHero
          titleLines={["The calm issue tracker", "for teams that ship every week"]}
          description="Requests, plans and reviews in one fast workspace. Built for teams who like to keep moving."
          announcement={{ label: "New", text: "Release timelines", href: "#changelog" }}
          workspace="Fieldnote"
          defaultScene="issues"
        />

        <LogoStrip title="Trusted by teams that ship every week" logos={logos} className="pb-9 pt-[52px] max-md:pt-[34px]" />

        <FeatureGrid
          title="A calmer kind of issue tracker."
          description="Fieldnote brings requests, plans and code review into one quiet workspace, so teams spend the week building instead of sorting."
          features={[
            {
              title: "Built around the work",
              description: "Issues, projects and cycles follow the habits of focused product teams.",
              icon: icon("M4 9h16M4 15h16M9 4v16M15 4v16"),
            },
            {
              title: "Quiet by default",
              description: "Digests and summaries replace a steady stream of pings and badges.",
              icon: icon("M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0M5 12a7 7 0 1 0 14 0a7 7 0 1 0-14 0"),
            },
            {
              title: "Fast in every view",
              description: "Local sync makes every search, filter and edit feel instant.",
              icon: icon("M4 12h15M13 6l6 6-6 6"),
            },
          ]}
          className="pb-[calc(var(--kit-section-y)*2)] pt-9 lg:pb-[calc(var(--kit-section-y)*2.5)]"
        />

        {featureSections.map(({ specs, ...section }, i) => {
          const id = ["intake", "plan", "automate", "build"][i]
          return (
            <div key={id} id={id} className="scroll-mt-(--linear-header-height)">
              <FeatureTabs {...section} className="pb-9" />
              <TechSpecDrawer label="Features" eyebrow="Tech specs" specs={specs} className="pb-[calc(var(--kit-section-y)*2)]" />
            </div>
          )
        })}

        <div id="changelog" className="scroll-mt-(--linear-header-height)">
          <Changelog />
        </div>

        <div id="customers" className="scroll-mt-(--linear-header-height) pt-[calc(var(--kit-section-y)*1.5)]">
          <Testimonials
            title="Teams that found their pace"
            testimonials={[
              {
                quote: "Our planning meeting went from an hour to fifteen minutes. The board already tells the story.",
                name: "Mara Lindqvist",
                role: "Head of Product, Driftwell",
                avatar: "/kits/linear/avatar-1.webp",
              },
              {
                quote: "Triage rules took the sorting off our plate. We start each day with the right work.",
                name: "Tomas Okafor",
                role: "Engineering Lead, Tidemark",
                avatar: "/kits/linear/avatar-2.webp",
              },
              {
                quote: "It is the first tracker our designers open without being asked.",
                name: "Ines Varga",
                role: "Design Manager, Kestrel Labs",
                avatar: "/kits/linear/avatar-3.webp",
              },
            ]}
            className="pb-0"
          />
          <div className="mx-auto max-w-kit px-gutter">
            <Reveal className="mt-12 flex flex-col gap-4 px-(--linear-homepage-padding-inset) sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-[15px] leading-[1.6] tracking-[-0.011em] text-muted-foreground">
                Fieldnote supports over{" "}
                <CountUp
                  value={18000}
                  className="text-[15px] font-[510] leading-[1.6] tracking-[-0.011em] text-(--linear-text-secondary) sm:text-[15px]"
                />{" "}
                product teams, from two-person studios to large engineering groups.
              </p>
              <TextLink href="#customers" arrow className="shrink-0">
                Customer stories
              </TextLink>
            </Reveal>
          </div>
        </div>

        <Faq
          title="Questions, answered"
          description="Short answers about trying Fieldnote with your team. Write to us for anything else."
          items={[
            {
              question: "How long does it take to move from another tracker?",
              answer: "Most teams import their issues, labels and projects in under an hour. History and comments come across too.",
            },
            {
              question: "Does Fieldnote work offline?",
              answer: "Yes. The desktop app keeps a local copy of your workspace and merges your edits when you reconnect.",
            },
            {
              question: "Can other teams send us requests without an account?",
              answer: "Share a request form or a team email address. Requests arrive in your shared inbox with their context.",
            },
            {
              question: "Which code hosts can we connect?",
              answer: "Hosted and self-hosted Git services both work. Branches, reviews and checks sync in both directions.",
            },
            {
              question: "Is there a free plan?",
              answer: "Small teams can use Fieldnote free with unlimited issues. Paid plans add automations, insights and admin controls.",
            },
          ]}
          className="mt-[calc(var(--kit-section-y)*1.5)] border-t border-(--linear-border-translucent-strong) pb-0 shadow-[0_-1px_0_var(--linear-bg-marketing)]"
        />

        <Cta
          title="Built for focus. Ready when you are."
          actions={[
            { label: "Get started", href: "#signup", variant: "primary" },
            { label: "Talk to us", href: "#contact", variant: "secondary" },
          ]}
        />
      </main>

      <FooterSection
        {...footer}
        newsletter={{
          title: "Product notes, once a month",
          input: {
            label: "Work email",
            buttonLabel: "Subscribe",
            placeholder: "you@company.com",
            type: "email",
            name: "email",
            hint: "One short email with what shipped. No tracking pixels.",
            successMessage: "You are on the list. See you next month.",
          },
        }}
      />
    </div>
  )
}
