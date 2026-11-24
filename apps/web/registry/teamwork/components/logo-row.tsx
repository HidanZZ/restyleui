import type { LogoRowProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

// Abstract partner marks for text wordmarks: one geometric node per logo, cycling the graph accents.
const glyphs = [
  { color: "text-(--teamwork-blue)", shape: <circle cx="8" cy="8" r="5" /> },
  { color: "text-(--teamwork-yellow)", shape: <rect x="3" y="3" width="10" height="10" rx="2" /> },
  { color: "text-(--teamwork-green)", shape: <path d="M8 2.5 13 5.25v5.5L8 13.5l-5-2.75v-5.5z" /> },
  { color: "text-(--teamwork-lilac)", shape: <path d="M8 2.5 13.5 12.5h-11z" /> },
  { color: "text-(--teamwork-teal)", shape: <path d="M8 2.5 13.5 8 8 13.5 2.5 8z" /> },
]

export function LogoRow({ logos, label, className }: LogoRowProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && <p className="font-body text-sm leading-5 font-medium text-muted-foreground">{label}</p>}
      <ul className="flex flex-wrap gap-2">
        {logos.map((logo, i) => {
          const glyph = glyphs[i % glyphs.length]
          return (
            <li
              key={logo.name}
              className="flex h-8 items-center gap-1.5 rounded-kit bg-card px-2 font-body text-sm leading-7 text-foreground"
            >
              {logo.src ? (
                // eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-agnostic
                <img src={logo.src} alt="" className="size-4 rounded-[3px] object-contain" />
              ) : (
                <span aria-hidden className="grid size-4 place-items-center rounded-[3px] bg-(--teamwork-surface-sunken)">
                  <svg viewBox="0 0 16 16" className={cn("size-3 fill-current", glyph.color)}>
                    {glyph.shape}
                  </svg>
                </span>
              )}
              <span>{logo.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
