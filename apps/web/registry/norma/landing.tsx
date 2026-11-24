import type { FooterSectionProps } from "@/registry/restyle/lib/contract"
import { Badge } from "@/registry/norma/components/badge"
import { Button } from "@/registry/norma/components/button"
import { Card } from "@/registry/norma/components/card"
import { Carousel } from "@/registry/norma/components/carousel"
import { Cta } from "@/registry/norma/components/cta"
import { Faq } from "@/registry/norma/components/faq"
import { FeatureGrid } from "@/registry/norma/components/feature-grid"
import { FeatureTabs } from "@/registry/norma/components/feature-tabs"
import { FooterSection } from "@/registry/norma/components/footer-section"
import { Globe } from "@/registry/norma/components/globe"
import { Hero } from "@/registry/norma/components/hero"
import { LogoStrip } from "@/registry/norma/components/logo-strip"
import { Marquee } from "@/registry/norma/components/marquee"
import { Navbar } from "@/registry/norma/components/navbar"
import { Reveal } from "@/registry/norma/components/reveal"
import { ScreenTimeCalculator } from "@/registry/norma/components/screen-time-calculator"
import { ScrollVideoReveal } from "@/registry/norma/components/scroll-video-reveal"
import { Testimonials } from "@/registry/norma/components/testimonials"
import { TextLink } from "@/registry/norma/components/text-link"

/*
 * Halden: an invented product in the Norma style. A brushed steel disc for the
 * home; touch your phone to it and the apps you picked go quiet until the next
 * touch. Section order follows the source homepage.
 */

const media = (file: string) => `/kits/norma/${file}`

const ORDER = "#order"

const h2 =
  "text-(length:--norma-text-h2) leading-(--norma-leading-heading) font-semibold tracking-(--norma-tracking-heading) text-balance"
const lead = "text-(length:--norma-text-body-lg) leading-(--norma-leading-body) text-pretty text-muted-foreground"

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

const gallery = [
  { file: "hero.webp", alt: "The steel disc on a walnut table beside a folded linen cloth." },
  { file: "tab-2.webp", alt: "A hand sets the disc on a stack of books by a rainy window." },
  { file: "feature-3.webp", alt: "The disc on a dark bedside table in warm lamplight." },
  { file: "tab-3.webp", alt: "The disc on a stone coffee table in a quiet living room." },
  { file: "feature-1.webp", alt: "A close study of the brushed steel disc on pale limestone." },
]

const moments = [
  { title: "Reading", apps: 4, file: "tab-2.webp", text: "Mail and news go quiet so the next chapter gets your full attention." },
  { title: "Dinner", apps: 6, file: "tab-3.webp", text: "Feeds stay shut while the table is set and the plates go round." },
  { title: "Deep work", apps: 5, file: "tab-1.webp", text: "Chat and video pause for a long, unbroken stretch at the desk." },
  { title: "Sleep", apps: 9, file: "feature-3.webp", text: "Everything but alarms rests until the morning light comes in." },
  { title: "Slow mornings", apps: 7, file: "feature-1.webp", text: "Coffee first. The inbox can wait until you are ready for it." },
  { title: "Weekends", apps: 8, file: "hero.webp", text: "Work apps step aside from Friday evening to Monday morning." },
]

const posts = [
  { category: "Rest", date: "Mar 12, 2026", title: "What a phone-free hour before bed changes", file: "feature-3.webp" },
  { category: "Focus", date: "Feb 26, 2026", title: "Designing a desk that keeps you on one task", file: "tab-1.webp" },
  { category: "Home", date: "Feb 9, 2026", title: "Small rituals for a quieter living room", file: "tab-3.webp" },
  { category: "Habits", date: "Jan 21, 2026", title: "Why willpower is the wrong tool for screen time", file: "feature-1.webp" },
]

const footer: FooterSectionProps = {
  brand: "HALDEN",
  description: "A steel disc that gives your evenings back.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "How it works", href: "#how" },
        { label: "Features", href: "#features" },
        { label: "Order", href: ORDER },
        { label: "Questions", href: "#faq" },
      ],
    },
    {
      title: "Product",
      links: [
        { label: "Desktop app", href: "#" },
        { label: "Phone app", href: "#" },
        { label: "For teams", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Journal", href: "#journal" },
        { label: "Students", href: "#" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Support", href: "#" },
        { label: "Email", href: "#" },
        { label: "Community", href: "#" },
      ],
    },
  ],
  social: [
    { label: "Privacy", href: "#" },
    { label: "Shipping and returns", href: "#" },
  ],
  legal: "2026 Halden. All rights reserved.",
  newsletter: {
    title: "Join the list for the next batch",
    input: {
      label: "Email",
      buttonLabel: "Join",
      placeholder: "you@email.com",
      type: "email",
      name: "email",
      hint: "One email when a new batch ships. Nothing else.",
      successMessage: "Thanks. We will write when the next batch ships.",
    },
  },
}

/** Boundary: the statement panel beside the gallery. */
function Boundary() {
  return (
    <section className="bg-background py-section">
      <div className="mx-auto grid w-full max-w-kit grid-cols-1 gap-4 px-gutter lg:grid-cols-2 lg:items-stretch">
        <Reveal className="h-full">
          <div className="flex h-full flex-col justify-between rounded-kit-lg bg-secondary p-8 sm:p-12 lg:p-14">
            <div>
              <h2 className={`max-w-[16ch] ${h2}`}>A quiet line between you and the feed.</h2>
              <p className={`mt-5 max-w-[38ch] ${lead}`}>
                Halden sits on a shelf or a desk and holds the boundary for you. No settings to dig through at night, no willpower to
                spend.
              </p>
            </div>
            <Button href={ORDER} size="lg" icon={<ArrowIcon />} className="mt-10 w-full">
              Order
            </Button>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <Carousel
            label="Halden at home"
            loop
            className="lg:[&_[data-slot=carousel-item]]:aspect-[4/5]"
            items={gallery.map((slide) => (
              <img key={slide.file} src={media(slide.file)} alt={slide.alt} loading="lazy" />
            ))}
          />
        </Reveal>
      </div>
    </section>
  )
}

/** Moments: a slow rail of session cards that runs past the container edge. */
function Moments() {
  return (
    <section className="overflow-hidden bg-background py-section">
      <Reveal className="mx-auto w-full max-w-kit px-gutter">
        <h2 className={`max-w-[18ch] ${h2}`}>Make room for what you love.</h2>
        <p className={`mt-4 max-w-[48ch] ${lead}`}>Sessions shape Halden around your day. One touch starts the right one.</p>
      </Reveal>
      <Reveal delay={80} className="mt-12">
        <Marquee speed={28}>
          {/* One gap of 16px between cards and across the loop seam (the copy adds its own end padding). */}
          <div className="-me-10 flex gap-4 pe-4 sm:-me-14">
            {moments.map((moment) => (
              <figure key={moment.title} className="w-[280px] shrink-0 whitespace-normal sm:w-[340px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-kit-lg bg-(--norma-coal)">
                  <img src={media(moment.file)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center gap-2.5 rounded-full border border-primary-foreground/25 bg-background/15 py-1.5 ps-4 pe-1.5 backdrop-blur-md">
                      <span className="text-[0.9375rem] font-semibold tracking-normal text-primary-foreground">{moment.title}</span>
                      <span className="rounded-full bg-foreground/35 px-2.5 py-1 text-[0.75rem] leading-none font-medium tracking-normal text-primary-foreground/90">
                        {moment.apps} apps
                      </span>
                    </span>
                  </div>
                </div>
                <figcaption className="mt-4 px-1 text-[0.9375rem] leading-[1.5] font-normal tracking-normal text-muted-foreground">
                  {moment.text}
                </figcaption>
              </figure>
            ))}
          </div>
        </Marquee>
      </Reveal>
    </section>
  )
}

/** Journal: one lead story and the next three as hairline rows. */
function Journal() {
  const [first, ...rest] = posts
  return (
    <section id="journal" className="scroll-mt-24 bg-background py-section">
      <div className="mx-auto w-full max-w-kit px-gutter">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <h2 className={h2}>From the journal.</h2>
            <p className={`mt-4 max-w-[46ch] ${lead}`}>Short reads on attention, rest, and the hours you get back.</p>
          </div>
          <TextLink href="#journal" arrow>
            Read all
          </TextLink>
        </Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <Reveal delay={80}>
            <Card
              href="#journal"
              eyebrow={`${first.category} · ${first.date}`}
              title={first.title}
              description="An evening without a screen in reach is less about discipline and more about where the phone sleeps."
              media={{ type: "image", src: media(first.file), alt: "" }}
            />
          </Reveal>
          <Reveal delay={140}>
            <ul className="flex flex-col">
              {rest.map((post, index) => (
                <li key={post.title} className={index > 0 ? "border-t border-border" : undefined}>
                  <a href="#journal" className="group flex items-start gap-4 rounded-kit-sm py-5 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="relative aspect-square w-[4.5rem] shrink-0 overflow-hidden rounded-kit-sm bg-secondary sm:w-24">
                      <img
                        src={media(post.file)}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover transition-transform duration-[600ms] ease-kit group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </span>
                    <span className="min-w-0 pt-0.5">
                      <span className="flex items-center gap-2 text-[0.75rem] text-(--norma-ink-3)">
                        <span className="rounded-full border border-border px-2 py-0.5 font-medium text-muted-foreground">{post.category}</span>
                        {post.date}
                      </span>
                      <span className="mt-2 line-clamp-2 block text-[1.0625rem] leading-snug font-semibold tracking-[-0.01em] text-foreground underline-offset-4 group-hover:underline">
                        {post.title}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Landing() {
  return (
    <div className="min-h-svh bg-background font-body text-foreground [font-feature-settings:var(--norma-font-features)]">
      <Navbar
        brand="HALDEN"
        brandHref="#"
        items={[
          { label: "How it works", href: "#how" },
          { label: "Features", href: "#features" },
          { label: "Questions", href: "#faq" },
          { label: "Journal", href: "#journal" },
        ]}
        actions={[{ label: "Order", href: ORDER, variant: "primary" }]}
      />
      <main>
        <Hero
          eyebrow="Now shipping for spring"
          title={
            <>
              <span className="text-primary-foreground/55">Put the phone down.</span>
              <br />
              Keep the evening.
            </>
          }
          description="A brushed steel disc for your home. Touch your phone to it and the apps you picked go quiet until you touch it again."
          actions={[
            { label: "Order Halden", href: ORDER, variant: "primary" },
            { label: "See the features", href: "#features", variant: "secondary" },
          ]}
          media={{
            type: "video",
            src: media("loop.mp4"),
            poster: media("loop-poster.webp"),
            alt: "A hand rests a phone on a brushed steel disc.",
          }}
        />

        {/* Tucked under the hero: the well slides 28px up under the film's rounded corners. */}
        <LogoStrip
          className="-mt-7 sm:-mt-8 [&>div]:rounded-t-none [&>div]:pt-[4.75rem] sm:[&>div]:pt-24"
          title="People at these studios keep their evenings quiet too."
          logos={[
            { name: "Fieldnote" },
            { name: "Larkspur" },
            { name: "Oakhaven" },
            { name: "Northvale" },
            { name: "Quiet Room" },
            { name: "Tessellate" },
            { name: "Marlow & Co" },
            { name: "Brightwater" },
            { name: "Stonefold" },
          ]}
        />

        <Boundary />

        <div id="how" className="scroll-mt-24">
          <FeatureGrid
            className="pb-0 sm:pb-0"
            title="How it works."
            description="Pick your apps once. After that, a single touch turns them off and another turns them back on."
            features={[
              {
                title: "Choose your apps",
                description: "Pick the ones that pull you in, once.",
                media: { type: "image", src: media("feature-1.webp"), alt: "The steel disc resting on pale limestone." },
              },
              {
                title: "Touch the disc",
                description: "Hold your phone to Halden.",
                media: { type: "image", src: media("feature-2.webp"), alt: "A hand lays a phone flat on the disc." },
              },
              {
                title: "They go quiet",
                description: "Gone until you touch it again.",
                media: { type: "image", src: media("feature-3.webp"), alt: "The disc on a bedside table at night." },
              },
            ]}
          />
          <Reveal delay={120} className="mx-auto max-w-kit px-gutter pt-12 pb-(--norma-section-y-lg)">
            <p className="flex flex-wrap items-center justify-center gap-2 text-[0.9375rem] text-(--norma-ink-3)">
              Or start a session from
              <Badge className="bg-secondary px-2.5 py-1 text-foreground">Shortcut</Badge>
              <Badge className="bg-secondary px-2.5 py-1 text-foreground">Widget</Badge>
              <Badge className="bg-secondary px-2.5 py-1 text-foreground">Watch</Badge>
            </p>
            <div className="mt-8 flex justify-center">
              <Button href={ORDER} size="lg" icon={<ArrowIcon />}>
                Order
              </Button>
            </div>
          </Reveal>
        </div>

        <div id="features" className="scroll-mt-24">
          <FeatureTabs
            title="Everything lives in one calm app."
            tabs={[
              {
                id: "sessions",
                label: "Sessions",
                title: "One touch. The apps you chose go quiet.",
                description: "Pick the apps you want gone and start a session. They stay out of reach until you touch Halden again.",
                media: { type: "image", src: media("tab-1.webp"), alt: "A notebook, a cup and a phone on a sunlit oak desk." },
              },
              {
                id: "schedules",
                label: "Schedules",
                title: "Quiet hours that start on their own.",
                description: "Set a window for evenings or early mornings. Halden reminds you, and one touch seals it.",
                media: { type: "image", src: media("tab-2.webp"), alt: "A hand sets the disc on books beside a rainy window." },
              },
              {
                id: "wind-down",
                label: "Wind down",
                title: "Evenings that end softly.",
                description: "An hour before bed, feeds fade out and only calls from people you choose come through.",
                media: { type: "image", src: media("tab-3.webp"), alt: "The disc on a stone table in a lamplit living room." },
              },
              {
                id: "insights",
                label: "Insights",
                title: "See the time you got back.",
                description: "A weekly note shows the hours you spent away from the screen, with no streaks to chase.",
                media: { type: "image", src: media("feature-2.webp"), alt: "A hand rests a phone on the steel disc." },
              },
            ]}
          />
        </div>

        <ScreenTimeCalculator heading="Phones are designed to hold your attention." />

        <Cta
          title="One disc. No subscription."
          description="Pay once and keep it for years. Halden needs no account and no monthly plan."
          actions={[
            { label: "Order Halden", href: ORDER, variant: "primary" },
            { label: "Read the questions", href: "#faq", variant: "secondary" },
          ]}
        />

        <Testimonials
          title="People put their phone down."
          testimonials={[
            {
              quote: "It became part of the evening routine within a week. I read again before bed, and I fall asleep earlier.",
              name: "Ines Laurent",
              role: "Architect",
              avatar: media("avatar-1.webp"),
            },
            {
              quote: "The disc lives by the door. Touching it when I get home is the moment work ends.",
              name: "Tomas Reyes",
              role: "Product designer",
              avatar: media("avatar-2.webp"),
            },
            {
              quote: "I did not realise how often I reached for my phone until the apps were simply not there.",
              name: "Clara Novak",
              role: "Teacher",
              avatar: media("avatar-3.webp"),
            },
          ]}
        />

        <Moments />

        <div id="order">
          <ScrollVideoReveal title="Take one home." action={{ label: "Order Halden", href: ORDER }} />
        </div>

        <div id="faq" className="scroll-mt-24 bg-background px-(--norma-gutter-outer)">
          <div className="mx-auto max-w-(--norma-container-wide) rounded-kit-lg bg-secondary py-8 sm:py-12">
            <Faq
              className="bg-transparent"
              title="Questions, answered."
              items={[
                {
                  question: "How does Halden connect to my phone?",
                  answer: "The disc holds a small passive chip. Your phone reads it with a short touch, so there is nothing to charge or pair.",
                },
                {
                  question: "Will it drain my battery?",
                  answer: "No. The app does nothing in the background until you touch the disc, and the disc itself has no battery.",
                },
                {
                  question: "Can I choose which apps go quiet?",
                  answer: "Yes. Build as many sessions as you like, each with its own apps, websites and schedule.",
                },
                {
                  question: "What if I need an app during a session?",
                  answer: "Touch the disc again. If you are away from home, you can end a session from the app after a short pause.",
                },
                {
                  question: "What happens if I lose the disc?",
                  answer: "Write to support and we will unlock your sessions and send a replacement at cost.",
                },
                {
                  question: "Can I return it?",
                  answer: "Yes. You have 30 days to send it back for a full refund, in any condition.",
                },
              ]}
            />
          </div>
        </div>

        <Journal />

        <Globe title="Somewhere, someone just put their phone down." action={{ label: "Order Halden", href: ORDER }} />
      </main>
      <FooterSection {...footer} />
    </div>
  )
}
