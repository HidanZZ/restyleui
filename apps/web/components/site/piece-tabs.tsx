"use client"

import { useId, useState, type KeyboardEvent, type ReactNode } from "react"

import { focusRing } from "@/components/site/ui"
import { cn } from "@/registry/restyle/lib/utils"

type Tab = "preview" | "code"

const TABS: { id: Tab; label: string }[] = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Code" },
]

/** Preview and Code tabs around a piece. Both panels stay mounted so the preview keeps its state. */
export function PieceTabs({ preview, code, aside }: { preview: ReactNode; code: ReactNode; aside?: ReactNode }) {
  const [tab, setTab] = useState<Tab>("preview")
  const id = useId()

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const next: Tab = tab === "preview" ? "code" : "preview"
    setTab(next)
    document.getElementById(`${id}-${next}-tab`)?.focus()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex h-11 items-center justify-between gap-3 border-b border-border bg-background px-1.5">
        <div role="tablist" aria-label="View" className="flex items-center gap-1" onKeyDown={onKeyDown}>
          {TABS.map((item) => {
            const selected = tab === item.id
            return (
              <button
                key={item.id}
                id={`${id}-${item.id}-tab`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${id}-${item.id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(item.id)}
                className={cn(
                  "h-8 rounded-md px-3 text-sm transition-colors duration-150",
                  selected ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                  focusRing,
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        {aside && <div className="flex min-w-0 items-center gap-2 pr-1.5">{aside}</div>}
      </div>
      <div
        id={`${id}-preview-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-preview-tab`}
        hidden={tab !== "preview"}
      >
        {preview}
      </div>
      <div
        id={`${id}-code-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-code-tab`}
        hidden={tab !== "code"}
        className="[&_figure]:rounded-none [&_figure]:border-0"
      >
        {code}
      </div>
    </div>
  )
}
