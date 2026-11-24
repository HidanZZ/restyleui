import type {
  AccordionProps,
  BadgeProps,
  ButtonProps,
  CardProps,
  CarouselProps,
  CountUpProps,
  CtaProps,
  DialogProps,
  FaqProps,
  FeatureGridProps,
  FeatureTabsProps,
  FooterProps,
  FooterSectionProps,
  HeroProps,
  InputProps,
  Logo,
  LogoRowProps,
  LogoStripProps,
  MarqueeProps,
  Media,
  NavbarProps,
  RevealProps,
  TabsProps,
  TestimonialsProps,
  TextLinkProps,
} from "@/registry/restyle/lib/contract"
import type { CommonSlug, KitSlug } from "@/lib/catalog"

type ExampleProps = {
  button: ButtonProps
  "text-link": TextLinkProps
  badge: BadgeProps
  card: CardProps
  "logo-row": LogoRowProps
  navbar: NavbarProps
  footer: FooterProps
  tabs: TabsProps
  accordion: AccordionProps
  dialog: DialogProps
  carousel: CarouselProps
  marquee: MarqueeProps
  reveal: RevealProps
  "count-up": CountUpProps
  input: InputProps
  hero: HeroProps
  "logo-strip": LogoStripProps
  "feature-grid": FeatureGridProps
  "feature-tabs": FeatureTabsProps
  testimonials: TestimonialsProps
  faq: FaqProps
  cta: CtaProps
  "footer-section": FooterSectionProps
}

type ExampleFactories = {
  [S in CommonSlug]: (kit: KitSlug) => ExampleProps[S]
}

const image = (kit: KitSlug, file: string, alt: string): Media => ({
  type: "image",
  src: `/kits/${kit}/${file}`,
  alt,
})

const logos: Logo[] = [
  { name: "Bluefern" },
  { name: "Copperline" },
  { name: "Daymark Studio" },
  { name: "Kindred Field" },
  { name: "Morrow Works" },
  { name: "Pine & Pixel" },
  { name: "Tandem Grove" },
]

const footerProps: FooterProps = {
  brand: "Northwind",
  description: "A thoughtful workspace for teams doing their best work.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Overview", href: "/product" },
        { label: "Features", href: "/features" },
        { label: "What's new", href: "/updates" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "For teams", href: "/teams" },
        { label: "Templates", href: "/templates" },
        { label: "Guides", href: "/guides" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Journal", href: "/journal" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Help center", href: "/help" },
        { label: "Contact", href: "/contact" },
        { label: "Status", href: "/status" },
      ],
    },
  ],
  social: [
    { label: "Community", href: "/community" },
    { label: "Updates", href: "/updates" },
    { label: "Contact", href: "/contact" },
  ],
  legal: "Northwind. All rights reserved.",
}

const signupInput: InputProps = {
  label: "Work email",
  buttonLabel: "Get product notes",
  placeholder: "you@company.com",
  type: "email",
  name: "email",
  hint: "Occasional notes about making work clearer.",
  successMessage: "Thanks. We'll send the next update soon.",
}

const featureIcon = (path: string) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={path}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const examples: ExampleFactories = {
  button: () => ({
    children: "Create a workspace",
    variant: "primary",
    size: "md",
    href: "/signup",
  }),
  "text-link": () => ({
    children: "Explore the workflow",
    href: "/features/overview",
    arrow: true,
  }),
  badge: () => ({ children: "New this week", variant: "accent" }),
  card: (kit) => ({
    eyebrow: "Workspace",
    title: "A shared home for project work",
    description: "Keep plans, owners, and updates easy to find.",
    media: {
      type: "video",
      src: `/kits/${kit}/loop.mp4`,
      poster: `/kits/${kit}/loop-poster.webp`,
      alt: "A short view of a project plan in Northwind",
    },
    href: "/features/projects",
    children: <p>Bring your team&apos;s next steps into one clear view.</p>,
  }),
  "logo-row": () => ({ logos, label: "Teams with room for focused work" }),
  navbar: () => ({
    brand: "Northwind",
    brandHref: "/",
    items: [
      {
        label: "Product",
        href: "/product",
        children: [
          { label: "Overview", href: "/product", description: "See the workspace at a glance." },
          { label: "Projects", href: "/projects", description: "Plan work from start to finish." },
          { label: "Updates", href: "/updates", description: "Share progress with your team." },
        ],
      },
      {
        label: "Solutions",
        href: "/solutions",
        children: [
          { label: "For small teams", href: "/teams/small", description: "Keep a close-knit team in sync." },
          { label: "For growing teams", href: "/teams/growing", description: "Make shared plans easier to follow." },
          { label: "For operations", href: "/teams/operations", description: "Connect routines and responsibilities." },
          { label: "For studios", href: "/teams/studios", description: "Bring creative projects into focus." },
        ],
      },
      { label: "Pricing", href: "/pricing" },
      { label: "Resources", href: "/resources" },
    ],
    actions: [
      { label: "Sign in", href: "/login", variant: "secondary" },
      { label: "Get started", href: "/signup", variant: "primary" },
    ],
  }),
  footer: () => footerProps,
  tabs: () => ({
    defaultValue: "projects",
    items: [
      {
        id: "projects",
        label: "Projects",
        content: (
          <div>
            <h3>Keep projects moving</h3>
            <p>See owners, milestones, and the next step together.</p>
          </div>
        ),
      },
      {
        id: "notes",
        label: "Notes",
        content: (
          <div>
            <h3>Keep the context close</h3>
            <p>Collect decisions and helpful details beside the work.</p>
          </div>
        ),
      },
      {
        id: "updates",
        label: "Updates",
        content: (
          <div>
            <h3>Share progress clearly</h3>
            <p>Give everyone a simple view of what has changed.</p>
          </div>
        ),
      },
    ],
  }),
  accordion: () => ({
    items: [
      {
        id: "planning",
        title: "How does Northwind organize projects?",
        content: <p>Each project brings its plan, owners, notes, and updates together.</p>,
      },
      {
        id: "team",
        title: "Can different teams share one workspace?",
        content: <p>Yes. Teams can keep their own projects while sharing useful context.</p>,
      },
      {
        id: "start",
        title: "How do we get started?",
        content: <p>Create a workspace, invite your team, and add a first project.</p>,
      },
    ],
  }),
  dialog: () => ({
    trigger: "See how it works",
    title: "A calmer way to plan",
    description: "A quick look at a shared project workspace.",
    children: (
      <div>
        <h3>Everything has a place</h3>
        <p>Plans, decisions, and progress stay connected to the work.</p>
      </div>
    ),
  }),
  carousel: (kit) => ({
    label: "Northwind workspace highlights",
    loop: true,
    items: [
      // eslint-disable-next-line @next/next/no-img-element -- registry demo content stays framework-agnostic
      <img key="hero" src={`/kits/${kit}/hero.webp`} alt="Northwind project overview" />,
      // eslint-disable-next-line @next/next/no-img-element
      <img key="feature-1" src={`/kits/${kit}/feature-1.webp`} alt="A project plan with clear owners" />,
      // eslint-disable-next-line @next/next/no-img-element
      <img key="feature-2" src={`/kits/${kit}/feature-2.webp`} alt="Notes collected beside team work" />,
      // eslint-disable-next-line @next/next/no-img-element
      <img key="feature-3" src={`/kits/${kit}/feature-3.webp`} alt="Progress shared across a team" />,
      // eslint-disable-next-line @next/next/no-img-element
      <img key="tab-1" src={`/kits/${kit}/tab-1.webp`} alt="A focused view of team projects" />,
    ],
  }),
  marquee: () => ({
    speed: 36,
    direction: "left",
    pauseOnHover: true,
    children: (
      <ul>
        <li>Plan with care</li>
        <li>Share the context</li>
        <li>Make steady progress</li>
        <li>Keep teams in sync</li>
      </ul>
    ),
  }),
  reveal: () => ({
    delay: 120,
    stagger: true,
    children: (
      <div>
        <h3>One view for every project</h3>
        <p>Help your team see the plan, the people, and the next step.</p>
      </div>
    ),
  }),
  "count-up": () => ({
    value: 12400,
    suffix: "+",
    format: { style: "decimal", maximumFractionDigits: 0 },
  }),
  input: () => signupInput,
  hero: (kit) => ({
    eyebrow: "A workspace for thoughtful teams",
    title: "Make room for your best work.",
    description: "Plan projects, share context, and move forward together.",
    actions: [
      { label: "Start a workspace", href: "/signup", variant: "primary" },
      { label: "Explore the product", href: "/product", variant: "secondary" },
    ],
    media: image(kit, "hero.webp", "A clear overview of projects in Northwind"),
  }),
  "logo-strip": () => ({
    title: "Teams that make room for focused work",
    logos,
  }),
  "feature-grid": () => ({
    eyebrow: "Made for the day-to-day",
    title: "The details that keep good work moving",
    description: "A few simple tools help teams stay clear, connected, and on track.",
    features: [
      {
        title: "Clear project views",
        description: "See the goal, owner, and next step in one place.",
        icon: featureIcon("M4 5h16v14H4z M8 9h8 M8 13h5 M8 16h3"),
      },
      {
        title: "Notes beside the work",
        description: "Keep useful decisions close to the project they support.",
        icon: featureIcon("M6 4h12v16H6z M9 8h6 M9 12h6 M9 16h3"),
      },
      {
        title: "Owners and due dates",
        description: "Make responsibilities and timing easy to understand.",
        icon: featureIcon("M5 6h14v14H5z M8 4v4 M16 4v4 M5 10h14 M9 14h2 M13 14h2"),
      },
      {
        title: "Weekly progress summaries",
        description: "Share what changed and what needs attention next.",
        icon: featureIcon("M5 19V11 M10 19V5 M15 19v-6 M20 19V8"),
      },
      {
        title: "Reusable team templates",
        description: "Start recurring work with a plan that already fits.",
        icon: featureIcon("M5 4h14v16H5z M8 8h8 M8 12h8 M8 16h5"),
      },
      {
        title: "Quiet, useful reminders",
        description: "Nudge the right person when a next step is waiting.",
        icon: featureIcon("M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4"),
      },
    ],
  }),
  "feature-tabs": (kit) => ({
    eyebrow: "A connected workspace",
    title: "See the work from every angle",
    description: "Move between a plan, its details, and the latest progress.",
    tabs: [
      {
        id: "plan",
        label: "Plan",
        title: "A plan everyone can follow",
        description: "Set milestones, clarify ownership, and see what comes next.",
        media: image(kit, "tab-1.webp", "A project plan with milestones and owners"),
      },
      {
        id: "context",
        label: "Context",
        title: "Keep decisions close to the work",
        description: "Give notes and useful references a clear home.",
        media: image(kit, "tab-2.webp", "Project notes collected in one workspace"),
      },
      {
        id: "progress",
        label: "Progress",
        title: "Make progress easy to share",
        description: "Help your team understand what moved and what needs attention.",
        media: image(kit, "tab-3.webp", "A simple view of project progress"),
      },
    ],
  }),
  testimonials: (kit) => ({
    title: "A clearer day for every team",
    testimonials: [
      {
        quote: "We spend less time finding context and more time moving projects forward.",
        name: "Mara Chen",
        role: "Operations lead, Bluefern",
        avatar: `/kits/${kit}/avatar-1.webp`,
      },
      {
        quote: "Our plans feel easier to follow, even when several teams are involved.",
        name: "Elias Ward",
        role: "Studio manager, Daymark Studio",
        avatar: `/kits/${kit}/avatar-2.webp`,
      },
      {
        quote: "Northwind gives our weekly check-ins a much calmer rhythm.",
        name: "Nina Patel",
        role: "Team lead, Tandem Grove",
        avatar: `/kits/${kit}/avatar-3.webp`,
      },
    ],
  }),
  faq: () => ({
    title: "Questions about Northwind",
    description: "A few details to help your team get started.",
    items: [
      {
        question: "What is Northwind?",
        answer: "Northwind is a shared workspace for planning projects and keeping team context together.",
      },
      {
        question: "Who is it designed for?",
        answer: "Small and growing teams that want a clear place for plans, notes, and progress.",
      },
      {
        question: "Can we organize work by team?",
        answer: "Yes. Teams can organize their projects while keeping shared work easy to find.",
      },
      {
        question: "Can we bring our own workflow?",
        answer: "Use a simple project template or shape a workspace around your team's routine.",
      },
      {
        question: "How do we try it?",
        answer: "Create a workspace and invite a few teammates to start with one project.",
      },
    ],
  }),
  cta: () => ({
    title: "Make your next project easier to follow.",
    description: "Bring your plans and people together in one thoughtful workspace.",
    actions: [
      { label: "Start a workspace", href: "/signup", variant: "primary" },
      { label: "See the features", href: "/features", variant: "secondary" },
    ],
  }),
  "footer-section": () => ({
    ...footerProps,
    newsletter: {
      title: "A little clarity in your inbox",
      input: signupInput,
    },
  }),
}

export function getExample<S extends CommonSlug>(slug: S, kit: KitSlug): ExampleProps[S] {
  return examples[slug](kit)
}
