/**
 * Docs navigation, built from the catalog and each kit's meta.
 */
import { BEHAVIOR_NAV } from "@/lib/behavior-nav"
import { COMMON_PIECES, KIT_SLUGS } from "@/lib/catalog"
import { kitMeta } from "@/lib/kits"

export type NavLink = { title: string; href: string }
export type NavGroup = { title: string; links: NavLink[]; subgroups?: { title: string; links: NavLink[] }[] }

export const GITHUB_URL = "https://github.com/HidanZZ/restyleui"

export const DOCS_NAV: NavGroup[] = [
  {
    title: "Getting started",
    links: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Agents", href: "/docs/agents" },
    ],
  },
  {
    title: "Kits",
    links: KIT_SLUGS.map((slug) => ({ title: kitMeta[slug].name, href: `/docs/kits/${slug}` })),
  },
  {
    title: "Behaviors",
    links: BEHAVIOR_NAV.map((behavior) => ({
      title: behavior.title,
      href: `/docs/behaviors/${behavior.slug}`,
    })),
  },
  {
    title: "Components",
    links: COMMON_PIECES.filter((piece) => piece.kind === "component").map((piece) => ({
      title: piece.title,
      href: `/docs/components/${piece.slug}`,
    })),
  },
  {
    title: "Sections",
    links: COMMON_PIECES.filter((piece) => piece.kind === "section").map((piece) => ({
      title: piece.title,
      href: `/docs/sections/${piece.slug}`,
    })),
  },
  {
    title: "Unique",
    links: [],
    subgroups: KIT_SLUGS.map((slug) => ({
      title: kitMeta[slug].name,
      links: kitMeta[slug].unique.map((piece) => ({
        title: piece.title,
        href: `/docs/kits/${slug}/${piece.slug}`,
      })),
    })),
  },
]

/** Flat reading order, used for previous and next links. */
export const DOCS_ORDER: NavLink[] = DOCS_NAV.flatMap((group) => [
  ...group.links,
  ...(group.subgroups?.flatMap((sub) => sub.links) ?? []),
])
