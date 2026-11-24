"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { DOCS_NAV, type NavLink } from "@/components/site/nav"
import { focusRing } from "@/components/site/ui"
import { cn } from "@/registry/restyle/lib/utils"

function SidebarLink({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <li>
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "-mx-2 flex min-h-8 items-center rounded-md px-2 text-sm transition-colors duration-150",
          active
            ? "bg-muted font-medium text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          focusRing,
        )}
      >
        {link.title}
      </Link>
    </li>
  )
}

/** Docs navigation tree. Shared by the desktop sidebar and the mobile drawer. */
export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Documentation" className={cn("flex flex-col gap-7", className)}>
      {DOCS_NAV.map((group) => (
        <div key={group.title}>
          <h2 className="mb-1.5 text-xs font-medium text-muted-foreground/80">{group.title}</h2>
          {group.links.length > 0 && (
            <ul className="flex flex-col">
              {group.links.map((link) => (
                <SidebarLink key={link.href} link={link} active={pathname === link.href} />
              ))}
            </ul>
          )}
          {group.subgroups?.map((sub) => (
            <div key={sub.title} className="mt-2 first:mt-0">
              <h3 className="flex min-h-8 items-center text-sm font-medium text-foreground">{sub.title}</h3>
              <ul className="ml-0.5 flex flex-col border-l border-border pl-3">
                {sub.links.length > 0 ? (
                  sub.links.map((link) => (
                    <SidebarLink key={link.href} link={link} active={pathname === link.href} />
                  ))
                ) : (
                  <li className="flex min-h-8 items-center text-sm text-muted-foreground">Coming soon</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </nav>
  )
}
