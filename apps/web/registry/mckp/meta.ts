import type { KitMeta } from "@/lib/catalog"

export default {
  slug: "mckp",
  name: "mckp style",
  brand: "mckp.live",
  url: "https://mckp.live",
  description:
    "A black cinematic studio for 3D device mockups, with white product buttons, quiet grey type, 2px tile gaps and slow, precise motion.",
  mode: "dark",
  fonts: [
    { role: "body", original: "Inter", license: "free", fallback: "Inter" },
    { role: "display", original: "Inter", license: "free", fallback: "Inter" },
    { role: "mono", original: "DM Mono", license: "free", fallback: "DM Mono" },
  ],
  pieces: {
    button: "source",
    "text-link": "source",
    badge: "source",
    card: "source",
    "logo-row": "designed",
    navbar: "source",
    footer: "source",
    tabs: "source",
    accordion: "source",
    dialog: "designed",
    carousel: "designed",
    marquee: "designed",
    reveal: "source",
    "count-up": "designed",
    input: "designed",
    hero: "source",
    "logo-strip": "designed",
    "feature-grid": "source",
    "feature-tabs": "source",
    testimonials: "designed",
    faq: "source",
    cta: "source",
    "footer-section": "source",
  },
  unique: [
    {
      slug: "library-preview",
      title: "Library Preview",
      description:
        "A four-column wall of looping scene tiles that picks a random subset, preloads ahead of the viewport and plays one clip at a time.",
      source: "source",
    },
    {
      slug: "code-typing-demo",
      title: "Code Typing Demo",
      description:
        "An embed snippet types itself into a tilted code dialog, then presses its own copy button in a slow loop.",
      source: "source",
    },
  ],
} satisfies KitMeta
