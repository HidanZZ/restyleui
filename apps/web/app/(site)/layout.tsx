import { Suspense } from "react"

import { KitSearchParam } from "@/components/site/kit-context"
import { KitSwitcher } from "@/components/site/kit-switcher"
import { SiteHeader } from "@/components/site/site-header"
import "@/components/site/site.css"

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-16 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div id="main" className="flex flex-1 flex-col">
        {children}
      </div>
      <KitSwitcher />
      <Suspense fallback={null}>
        <KitSearchParam />
      </Suspense>
    </>
  )
}
