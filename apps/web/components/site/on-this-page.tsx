"use client"

import { useEffect, useState } from "react"

import { focusRing } from "@/components/site/ui"
import { cn } from "@/registry/restyle/lib/utils"

export type TocItem = { id: string; title: string; depth?: 2 | 3 }

/** Tracks the section heading nearest the top of the viewport. */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(",")

  useEffect(() => {
    const headings = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)
    if (headings.length === 0) return

    function update() {
      // The last heading that has crossed the top quarter of the viewport.
      const line = window.innerHeight * 0.25
      let current = headings[0].id
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id
      }
      setActive(current)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [key])

  return active
}

export function OnThisPage({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items.map((item) => item.id))
  if (items.length === 0) return null

  return (
    <nav aria-label="On this page">
      <h2 className="mb-2 text-xs font-medium text-muted-foreground/80">On this page</h2>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "flex min-h-7 items-center rounded-sm py-0.5 text-[13px] leading-snug transition-colors duration-150",
                item.depth === 3 && "pl-3",
                active === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                focusRing,
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
