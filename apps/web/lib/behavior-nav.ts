/**
 * The lightweight behavior index, shared by the docs sidebar and the behavior
 * pages. It lives apart from `behaviors.ts` so client components such as the
 * sidebar do not bundle the recipes, signatures and prose.
 */

export const BEHAVIOR_NAV = [
  { slug: "nav", title: "Responsive nav" },
  { slug: "reveal", title: "Scroll reveal" },
  { slug: "video", title: "Video in view" },
  { slug: "carousel-marquee", title: "Carousel and marquee" },
  { slug: "tabs", title: "Animated tabs" },
  { slug: "tilt", title: "Pointer tilt" },
  { slug: "count-up", title: "Count-up" },
  { slug: "overlay", title: "Overlay and dialog" },
] as const

export type BehaviorSlug = (typeof BEHAVIOR_NAV)[number]["slug"]

export const BEHAVIOR_SLUGS: BehaviorSlug[] = BEHAVIOR_NAV.map((behavior) => behavior.slug)

export const BEHAVIOR_TITLES = Object.fromEntries(
  BEHAVIOR_NAV.map((behavior) => [behavior.slug, behavior.title]),
) as Record<BehaviorSlug, string>
