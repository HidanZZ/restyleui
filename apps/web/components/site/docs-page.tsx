/**
 * Docs page shell and prose elements (server components).
 */
import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

import { ArrowRightIcon } from "@/components/site/icons"
import { DOCS_ORDER } from "@/components/site/nav"
import { OnThisPage, type TocItem } from "@/components/site/on-this-page"
import { focusRing } from "@/components/site/ui"
import { cn } from "@/registry/restyle/lib/utils"

/** Placeholder shown while a dynamic docs page resolves its URL params. */
export function DocsPageSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-8 pb-28 lg:pt-12" aria-hidden="true">
      <span className="h-4 w-24 rounded bg-muted" />
      <span className="h-9 w-64 rounded-md bg-muted" />
      <span className="h-5 w-full max-w-lg rounded bg-muted" />
      <span className="mt-8 h-72 w-full rounded-xl bg-muted/60" />
    </div>
  )
}

export function DocsPage({
  href,
  section,
  title,
  description,
  meta,
  actions,
  toc = [],
  children,
}: {
  /** Route of this page, for previous and next links. */
  href: string
  /** Sidebar group shown above the title. */
  section: string
  title: ReactNode
  description?: ReactNode
  /** Line under the description, for labels. */
  meta?: ReactNode
  /** Buttons at the top right, such as Copy Page. */
  actions?: ReactNode
  toc?: TocItem[]
  children: ReactNode
}) {
  const index = DOCS_ORDER.findIndex((link) => link.href === href)
  const previous = index > 0 ? DOCS_ORDER[index - 1] : undefined
  const next = index >= 0 ? DOCS_ORDER[index + 1] : undefined

  return (
    <div className="flex min-w-0 gap-12">
      <article className="min-w-0 flex-1 pt-8 pb-28 lg:pt-12">
        <header className="mb-10 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{section}</p>
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
            <h1 className="text-[2rem] leading-tight font-semibold tracking-[-0.025em] text-balance">{title}</h1>
            {actions && <div className="flex shrink-0 items-center gap-2 pt-1">{actions}</div>}
          </div>
          {description && (
            <p className="max-w-[60ch] text-[17px] leading-relaxed text-pretty text-muted-foreground">{description}</p>
          )}
          {meta && <div className="mt-1 flex flex-wrap items-center gap-2">{meta}</div>}
        </header>

        <div className="flex flex-col">{children}</div>

        {(previous || next) && (
          <nav aria-label="Pages" className="mt-20 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
            {previous ? <Pager link={previous} label="Previous" /> : <span />}
            {next && <Pager link={next} label="Next" align="end" />}
          </nav>
        )}
      </article>

      <aside className="hidden w-52 shrink-0 xl:block">
        <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto pt-12 pb-10">
          <OnThisPage items={toc} />
        </div>
      </aside>
    </div>
  )
}

function Pager({ link, label, align }: { link: { title: string; href: string }; label: string; align?: "end" }) {
  return (
    <Link
      href={link.href}
      className={cn(
        "group flex flex-col gap-1 rounded-xl border border-border px-4 py-3 transition-colors duration-150 hover:bg-muted/50",
        align === "end" && "sm:items-end sm:text-right",
        focusRing,
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-sm font-medium">
        {link.title}
        {align === "end" && (
          <ArrowRightIcon className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        )}
      </span>
    </Link>
  )
}

/** Section heading with an anchor. Pair every H2 with an entry in the page's `toc`. */
export function H2({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <h2
      id={id}
      className={cn(
        "group mt-14 mb-4 scroll-mt-20 text-xl font-semibold tracking-[-0.015em] text-balance first:mt-0",
        className,
      )}
    >
      <a href={`#${id}`} className={cn("rounded-sm", focusRing)}>
        {children}
      </a>
    </h2>
  )
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="mt-9 mb-3 scroll-mt-20 text-base font-semibold tracking-[-0.01em]">
      {children}
    </h3>
  )
}

export function P({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("my-3 max-w-[68ch] text-[15px] leading-7 text-pretty text-foreground/85", className)}>{children}</p>
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[5px] border border-border bg-muted/60 px-1 py-px font-mono text-[0.86em] break-words">
      {children}
    </code>
  )
}

export function A({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "font-medium text-foreground underline decoration-foreground/25 underline-offset-[3px] transition-colors duration-150 hover:decoration-foreground",
        focusRing,
        className,
      )}
      {...props}
    />
  )
}

export function List({ children, ordered }: { children: ReactNode; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul"
  return (
    <Tag
      className={cn(
        "my-3 flex max-w-[68ch] flex-col gap-2 pl-5 text-[15px] leading-7 text-foreground/85 marker:text-muted-foreground",
        ordered ? "list-decimal" : "list-disc",
      )}
    >
      {children}
    </Tag>
  )
}

/** Numbered setup step: a heading and its content, joined by a rule. */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="my-4 flex flex-col [counter-reset:step]">{children}</ol>
}

export function Step({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <li className="relative pb-8 pl-10 [counter-increment:step] before:absolute before:top-0 before:left-0 before:flex before:size-6 before:items-center before:justify-center before:rounded-full before:bg-muted before:font-mono before:text-xs before:font-medium before:text-foreground before:content-[counter(step)] after:absolute after:top-8 after:bottom-2 after:left-3 after:w-px after:bg-border last:pb-0 last:after:hidden">
      <h3 className="mb-2 pt-0.5 text-[15px] leading-5 font-semibold">{title}</h3>
      <div className="flex flex-col gap-3 text-[15px] leading-7 text-foreground/85 [&>p]:max-w-[68ch]">{children}</div>
    </li>
  )
}

/** Plain data table in the docs style. */
export function DataTable({ head, rows, className }: { head: ReactNode[]; rows: ReactNode[][]; className?: string }) {
  return (
    <div className={cn("my-4 overflow-x-auto rounded-xl border border-border", className)}>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {head.map((cell, index) => (
              <th key={index} scope="col" className="px-4 py-2.5 text-xs font-medium whitespace-nowrap text-muted-foreground">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
