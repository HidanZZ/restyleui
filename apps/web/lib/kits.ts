/**
 * Website-only kit loader.
 *
 * `kitMeta` is static data from each kit's `meta.ts`.
 * `kitModules` lists the kits whose components are wired into the website.
 * A kit that is missing from `kitModules` is still being built: pages show a
 * "This kit is being built" state for it instead of previews.
 */
import type { ComponentType } from "react"

import { KIT_SLUGS, type KitMeta, type KitSlug } from "@/lib/catalog"
import type { Kit } from "@/registry/restyle/lib/contract"
import apple from "@/registry/apple/meta"
import linear from "@/registry/linear/meta"
import mckp from "@/registry/mckp/meta"
import norma from "@/registry/norma/meta"
import teamwork from "@/registry/teamwork/meta"

export const kitMeta: Record<KitSlug, KitMeta> = { norma, linear, apple, teamwork, mckp }

export type KitModule = {
  kit: Kit
  unique: Record<string, ComponentType>
  Landing: ComponentType
}

/**
 * Registered kits. The orchestrator adds one entry per finished kit, for example:
 * `norma: async () => ({ ...(await import("@/registry/norma/index")), Landing: (await import("@/registry/norma/landing")).Landing })`
 */
export const kitModules: Partial<Record<KitSlug, () => Promise<KitModule>>> = {}

export const DEFAULT_KIT: KitSlug = "norma"

export function isKitSlug(value: unknown): value is KitSlug {
  return typeof value === "string" && (KIT_SLUGS as readonly string[]).includes(value)
}

export function isKitRegistered(slug: KitSlug): boolean {
  return slug in kitModules
}

const loaded = new Map<KitSlug, Promise<KitModule>>()

/** Loads a registered kit once and reuses the promise. Returns `null` while the kit is being built. */
export function loadKitModule(slug: KitSlug): Promise<KitModule> | null {
  const load = kitModules[slug]
  if (!load) return null
  let promise = loaded.get(slug)
  if (!promise) {
    promise = load()
    loaded.set(slug, promise)
  }
  return promise
}
