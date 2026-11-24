import type { Logo, LogoRowProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Marquee } from "@/registry/linear/components/marquee"

function LogoMark({ logo, small = false }: { logo: Logo; small?: boolean }) {
  if (logo.src) {
    return <img src={logo.src} alt={logo.name} className={cn("w-auto", small ? "h-5" : "h-7")} />
  }
  return (
    <span
      className={cn(
        "whitespace-nowrap font-[590] leading-none tracking-[-0.03em] text-foreground",
        small ? "text-base" : "text-[1.0625rem] xl:text-[1.3125rem]"
      )}
    >
      {logo.name}
    </span>
  )
}

/**
 * Source: the customer logo row. Spaced across the row on wide screens; an
 * endless marquee below 1024px, where text wordmarks would not fit one row.
 * The label sits under it in mono caps.
 */
export function LogoRow({ logos, label, className }: LogoRowProps) {
  return (
    <div className={cn("w-full", className)}>
      <ul className="hidden min-h-10 w-full flex-wrap items-center justify-between gap-x-8 gap-y-4 lg:flex">
        {logos.map((logo) => (
          <li key={logo.name} className="flex h-full items-center">
            <LogoMark logo={logo} />
          </li>
        ))}
      </ul>
      <Marquee speed={24} pauseOnHover={false} className="[mask-image:none] lg:hidden">
        {logos.map((logo) => (
          <span key={logo.name} className="flex min-h-7 items-center">
            <LogoMark logo={logo} small />
          </span>
        ))}
      </Marquee>
      {label && (
        <p className="mt-9 font-mono text-xs uppercase leading-[1.4] text-(--linear-text-quaternary)">{label}</p>
      )}
    </div>
  )
}
