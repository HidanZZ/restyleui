import Link from "next/link"

import { ArrowRightIcon } from "@/components/site/icons"
import { KitSwatch } from "@/components/site/kit-swatch"
import { focusRing } from "@/components/site/ui"
import { KIT_SLUGS } from "@/lib/catalog"
import { isKitRegistered, kitMeta } from "@/lib/kits"
import { cn } from "@/registry/restyle/lib/utils"

/** The five kits as a list: specimen, name, look and mode. */
export function KitList({ className }: { className?: string }) {
  return (
    <ul className={cn("divide-y divide-border overflow-hidden rounded-xl border border-border", className)}>
      {KIT_SLUGS.map((slug) => {
        const meta = kitMeta[slug]
        return (
          <li key={slug}>
            <Link
              href={`/docs/kits/${slug}`}
              className={cn(
                "group flex items-center gap-4 px-4 py-4 transition-colors duration-150 hover:bg-muted/50 sm:px-5",
                focusRing,
                "focus-visible:-outline-offset-2",
              )}
            >
              <KitSwatch kit={slug} className="size-11 rounded-lg text-base" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[15px] font-semibold">{meta.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {meta.mode === "dark" ? "Dark" : "Light"}
                    {isKitRegistered(slug) ? "" : " · Being built"}
                  </span>
                </span>
                <span className="line-clamp-2 text-sm text-muted-foreground">{meta.description}</span>
              </span>
              <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
