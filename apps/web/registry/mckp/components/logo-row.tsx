import type { LogoRowProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * A quiet single row of wordmarks on the kit's 9 column grid: the label and
 * the row both start at column 2, the signature left indent.
 */
export function LogoRow({ logos, label, className }: LogoRowProps) {
  return (
    <div
      className={cn(
        "grid gap-6 text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) lg:grid-cols-9",
        className
      )}
    >
      {label && <p className="tracking-[-0.16px] text-(--mckp-ink-faint) lg:col-span-5 lg:col-start-2">{label}</p>}
      <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-8 lg:col-start-2 lg:justify-between">
        {logos.map((logo) => (
          <li key={logo.name} className="flex items-center">
            {logo.src ? (
              <img
                src={logo.src}
                alt={logo.name}
                className="h-6 w-auto opacity-60 transition-opacity duration-200 ease-kit-in-out hover:opacity-100 motion-reduce:transition-none"
              />
            ) : (
              <span className="whitespace-nowrap font-display font-medium tracking-[-0.4px] text-foreground/60 transition-colors duration-200 ease-kit-in-out hover:text-foreground motion-reduce:transition-none">
                {logo.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
