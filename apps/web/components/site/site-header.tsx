"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { GitHubIcon } from "@/components/site/icons"
import { MobileNav } from "@/components/site/mobile-nav"
import { GITHUB_URL } from "@/components/site/nav"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { focusRing, iconButton } from "@/components/site/ui"
import { Wordmark } from "@/components/site/wordmark"
import { cn } from "@/registry/restyle/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const inKits = pathname.startsWith("/docs/kits")
  const inDocs = pathname.startsWith("/docs") && !inKits

  const links = [
    { title: "Docs", href: "/docs", active: inDocs },
    { title: "Kits", href: "/docs#kits", active: inKits },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-4 md:px-6">
        <Link href="/" className={cn("-mx-1 rounded-md px-1", focusRing)} aria-label="Restyle UI home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              className={cn(
                "flex h-8 items-center rounded-md px-2.5 text-sm transition-colors duration-150",
                link.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                focusRing,
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <a href={GITHUB_URL} className={iconButton} aria-label="Restyle UI on GitHub" target="_blank" rel="noreferrer">
            <GitHubIcon className="size-4" />
          </a>
          <ThemeToggle />
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
