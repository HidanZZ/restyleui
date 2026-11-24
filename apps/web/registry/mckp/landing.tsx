import { Card } from "@/registry/mckp/components/card"
import { CodeTypingDemo } from "@/registry/mckp/components/code-typing-demo"
import { Cta } from "@/registry/mckp/components/cta"
import { Faq } from "@/registry/mckp/components/faq"
import { FeatureGrid } from "@/registry/mckp/components/feature-grid"
import { FeatureTabs } from "@/registry/mckp/components/feature-tabs"
import { FooterSection } from "@/registry/mckp/components/footer-section"
import { Hero } from "@/registry/mckp/components/hero"
import { LibraryPreview } from "@/registry/mckp/components/library-preview"
import { LogoStrip } from "@/registry/mckp/components/logo-strip"
import { Navbar } from "@/registry/mckp/components/navbar"
import { Reveal } from "@/registry/mckp/components/reveal"
import { Testimonials } from "@/registry/mckp/components/testimonials"
import { TextLink } from "@/registry/mckp/components/text-link"
import type { Media } from "@/registry/restyle/lib/contract"

const media = "/kits/mckp"

const image = (file: string, alt: string): Media => ({ type: "image", src: `${media}/${file}`, alt })

const scene = (file: string, alt: string): Media => ({
  type: "video",
  src: `${media}/${file}.mp4`,
  poster: `${media}/${file}-poster.webp`,
  alt,
})

const divider = "border-border"
const spacedDivider = "mt-(--mckp-section-y-sm) border-border max-md:mt-10"

const releases = [
  {
    date: "Nov 18, 2026",
    title: "Camera presets",
    description: "Start from a ready-made camera move in one click, then make it your own.",
  },
  {
    date: "Nov 4, 2026",
    title: "Multi-shot clips",
    description: "Cut several shots into one clip, each with its own camera move and screen.",
  },
  {
    date: "Oct 21, 2026",
    title: "Curve editor",
    description: "Shape every keyframe and its easing curve on a row of its own.",
  },
]

/**
 * Plinth: an invented light studio for device scenes, laid out in the same
 * order and rhythm as the clone's homepage.
 */
export function Landing() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar
        brand="Plinth"
        items={[
          { label: "Stage", href: "#stage" },
          { label: "Scenes", href: "#scenes" },
          { label: "Pricing", href: "#pricing" },
        ]}
        actions={[{ label: "Open App", href: "#open", variant: "primary" }]}
      />

      <main>
        <Hero
          eyebrow="New: Stage mode"
          title={
            <>
              A Light Studio
              <br />
              for Your Screens
            </>
          }
          description="Choose a scene, drop in a screenshot or a clip, and match it to your brand. The camera work is already done."
          actions={[{ label: "Open Stage", href: "#stage", variant: "primary" }]}
          media={image("hero.webp", "Laptop floating above a dark concrete floor in soft fog")}
        />

        <FeatureGrid
          title={
            <>
              From a flat screenshot
              <br />
              to a lit product film.
              <br />
              In minutes.
            </>
          }
          description="Made by a small team that has lit device scenes for designers for over ten years."
          features={[
            { title: "Pick a scene", description: "Dozens of them, lit and ready to roll." },
            { title: "Make it yours", description: "Your screens, your colors, your pace." },
            { title: "Export it anywhere", description: "Any size for a site, a post, a deck or an ad." },
          ]}
        />

        <LogoStrip
          title="Scenes shot for product teams at"
          logos={[
            { name: "Halden" },
            { name: "Northvale" },
            { name: "Orbitra" },
            { name: "Quillwork" },
            { name: "Strata Labs" },
            { name: "Vellum" },
          ]}
        />

        <hr className={divider} />

        <div id="stage">
          <FeatureTabs
            eyebrow="01"
            title="Stage."
            description="Here you direct the camera yourself. Open a preset, drag a keyframe and watch the shot change."
            tabs={[
              {
                id: "light",
                label: "Light",
                title: "Shape the light",
                description: "Move the key light and the fog until the device reads the way you want.",
                media: image("tab-1.webp", "Phone suspended between two slabs of dark stone under a cool beam"),
              },
              {
                id: "camera",
                label: "Camera",
                title: "Plan the move",
                description: "Set keyframes on a timeline and ease every pan, dolly and turn.",
                media: image("tab-2.webp", "Two open laptops facing each other across a foggy studio floor"),
              },
              {
                id: "export",
                label: "Export",
                title: "Export the shot",
                description: "4K video or a transparent background, ready for any page.",
                media: image("tab-3.webp", "Phone, tablet and laptop lined up under a single spotlight"),
              },
            ]}
          />
        </div>
        <LibraryPreview title={"40 presets, 12 devices\nand counting"} subtitle="New camera moves every month" />

        <hr className={spacedDivider} />

        <div id="scenes">
          <FeatureTabs
            eyebrow="02"
            title="Scenes."
            description="Device mockups, but in motion. Every scene is lit, shot and graded by our designers, and the library keeps growing."
            tabs={[
              {
                id: "dolly",
                label: "Dolly",
                title: "A slow studio dolly",
                description: "Six seconds of camera travel around a lit device.",
                media: scene("loop", "Camera gliding past a device in a dark studio"),
              },
              {
                id: "float",
                label: "Float",
                title: "Weightless phones",
                description: "A device drifts in the dark while the light turns.",
                media: scene("library-phone-float", "Phone floating in a dark studio"),
              },
              {
                id: "stone",
                label: "Stone",
                title: "Tablets on rock",
                description: "Raw stone, hard light and a slow push in.",
                media: scene("library-tablet-rock", "Tablet resting on a dark rock"),
              },
            ]}
          />
        </div>
        <LibraryPreview pick={4} />

        <hr className={spacedDivider} />

        <CodeTypingDemo
          title="Not only a video file."
          titleDetail="Run the scene live on your page."
          aside="The same scene, rendered inside your own site"
          tag="plinth-scene"
          scriptSrc="https://cdn.plinth.example/scene.js"
          image={{ src: `${media}/feature-3.webp`, alt: "Studio display on a stand under a single beam of light" }}
        />

        <section className="mx-auto max-w-kit px-gutter pt-(--mckp-section-y-lg)">
          <div className="mb-20 grid grid-cols-9 max-lg:mb-10 max-lg:grid-cols-1 max-lg:gap-6">
            <Reveal className="col-[2/6] max-lg:col-[1]">
              <h2 className="flex flex-col font-display text-[length:var(--mckp-type-h2)] font-normal leading-(--mckp-type-h2-line) tracking-(--mckp-type-h2-tracking)">
                <span className="text-foreground">Recent releases.</span>
                <span className="text-(--mckp-ink-dim)">Notes from recent weeks.</span>
              </h2>
            </Reveal>
            <Reveal delay={100} className="col-[7/9] self-end max-lg:col-[1]">
              <TextLink href="#releases" arrow>
                All release notes
              </TextLink>
            </Reveal>
          </div>
          <div className="grid grid-cols-3 gap-(--mckp-tile-gap) max-md:grid-cols-1">
            {releases.map((release) => (
              <Card
                key={release.title}
                eyebrow={release.date}
                title={release.title}
                description={release.description}
                href="#releases"
              />
            ))}
          </div>
        </section>

        <hr className={spacedDivider} />

        <Testimonials
          title={
            <>
              Made for people who ship.
              <br />
              <span className="text-(--mckp-ink-soft)">Notes from the studio floor</span>
            </>
          }
          testimonials={[
            {
              quote: "We traded a week of render queues for one afternoon in Stage. The shots look like a real studio day.",
              name: "Ines Moreau",
              role: "Design lead, Halden",
              avatar: `${media}/avatar-1.webp`,
            },
            {
              quote: "Our launch page finally moves the way the product feels, and nobody guesses it was made in a browser.",
              name: "Theo Lindqvist",
              role: "Founder, Orbitra",
              avatar: `${media}/avatar-2.webp`,
            },
            {
              quote: "I pick a scene, drop in the build and the camera work is done. It is part of every release now.",
              name: "Amara Okafor",
              role: "Brand designer, Quillwork",
              avatar: `${media}/avatar-3.webp`,
            },
          ]}
        />

        <Faq
          title="Questions"
          items={[
            {
              question: "What is Plinth?",
              answer: "A browser studio that places your screens inside lit 3D device scenes and renders them as video or a live embed.",
            },
            {
              question: "How do Stage and Scenes differ?",
              answer: "Scenes gives you finished shots to fill with your screens. Stage lets you direct the camera, light and timing yourself.",
            },
            {
              question: "Which devices are in the library?",
              answer: "Phones, foldables, tablets, laptops and studio displays, each shot in several moods.",
            },
            {
              question: "Can I put a video on the screen?",
              answer: "Yes. Drop in a screen recording and it plays inside the device for the whole shot.",
            },
            {
              question: "How do I embed a scene on my site?",
              answer: "Copy one line from the editor and paste it into your page builder or plain HTML.",
            },
            {
              question: "What can I export?",
              answer: "4K video, a transparent background, stills, or the live embed for your site.",
            },
            {
              question: "Do I need to install anything?",
              answer: "No. Plinth runs in the browser and renders on our side.",
            },
            {
              question: "Is it free?",
              answer: "Starting is free with a small watermark. Paid plans remove it and unlock 4K export.",
            },
          ]}
        />

        <div id="open">
          <Cta
            title={
              <>
                Your first shot
                <br />
                in a few minutes
              </>
            }
            description="Free to start. No card needed."
            actions={[{ label: "Open Stage", href: "#stage", variant: "primary" }]}
          />
        </div>
      </main>

      <FooterSection
        brand="Plinth"
        description="A light studio for device scenes."
        columns={[
          {
            title: "Product",
            links: [
              { label: "Overview", href: "#" },
              { label: "Stage", href: "#stage" },
              { label: "Scenes", href: "#scenes" },
              { label: "Camera presets", href: "#stage" },
              { label: "Pricing", href: "#pricing" },
              { label: "Release notes", href: "#releases" },
              { label: "Developers", href: "#developers" },
            ],
          },
          {
            title: "Connect",
            links: [
              { label: "Community", href: "#community" },
              { label: "Newsletter", href: "#newsletter" },
              { label: "Contact", href: "#contact" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Terms", href: "#terms" },
              { label: "Privacy", href: "#privacy" },
              { label: "Cookies", href: "#cookies" },
            ],
          },
        ]}
        legal="2026 Plinth. All rights reserved."
      />
    </div>
  )
}
