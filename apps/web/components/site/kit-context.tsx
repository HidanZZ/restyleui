"use client"

import { createContext, use, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"

import type { KitSlug } from "@/lib/catalog"
import { DEFAULT_KIT, isKitSlug } from "@/lib/kits"
import { KIT_STORAGE_KEY } from "@/components/site/head-scripts"

const listeners = new Set<() => void>()

/** Used only when localStorage is unavailable (private mode, blocked storage). */
let memoryKit: KitSlug = DEFAULT_KIT

function getSnapshot(): KitSlug {
  try {
    const value = localStorage.getItem(KIT_STORAGE_KEY)
    return isKitSlug(value) ? value : DEFAULT_KIT
  } catch {
    return memoryKit
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === KIT_STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

/** Sets the active kit for every preview and install command, and persists it. */
export function setActiveKit(kit: KitSlug) {
  memoryKit = kit
  try {
    localStorage.setItem(KIT_STORAGE_KEY, kit)
  } catch {
    // Storage is unavailable: the kit still changes for this page view.
  }
  document.documentElement.dataset.activeKit = kit
  for (const listener of listeners) listener()
}

/** The server cannot know the stored kit, so it renders the "unknown" state. */
function getServerSnapshot(): null {
  return null
}

type KitContextValue = {
  /** Active kit, or `null` during server render and hydration. */
  kit: KitSlug | null
  setKit: (kit: KitSlug) => void
}

const KitContext = createContext<KitContextValue | null>(null)

export function KitProvider({ children }: { children: ReactNode }) {
  const kit = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const value = useMemo(() => ({ kit, setKit: setActiveKit }), [kit])
  return <KitContext value={value}>{children}</KitContext>
}

/** Active kit chosen with the kit switcher (`null` until the browser has read it). */
export function useActiveKit(): KitContextValue {
  const value = use(KitContext)
  if (!value) throw new Error("useActiveKit must be used inside <KitProvider>.")
  return value
}

function useMountEffect(effect: () => void | (() => void)) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}

function ApplyKit({ kit }: { kit: KitSlug }) {
  useMountEffect(() => setActiveKit(kit))
  return null
}

/**
 * Applies `?kit=<slug>` on client-side navigations (the head script covers full loads).
 * Render inside <Suspense>: it reads search params.
 */
export function KitSearchParam() {
  const param = useSearchParams().get("kit")
  return isKitSlug(param) ? <ApplyKit key={param} kit={param} /> : null
}
