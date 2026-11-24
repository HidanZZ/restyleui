import { DocsSidebar } from "@/components/site/docs-sidebar"

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-10 px-4 md:px-6 xl:gap-14">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-14 -mx-2 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain px-2 pt-10 pb-24">
          <DocsSidebar />
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
