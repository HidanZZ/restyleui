import type { ButtonProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-kit font-body font-normal transition-[background-color,opacity] duration-200 ease-kit-in-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0"

const variants = {
  // White fill, black text; hover dims to the clone's #dbdbdb.
  primary: "bg-primary text-primary-foreground hover:bg-primary/85",
  // The clone's glass link: a faint white fill that brightens on hover.
  secondary: "bg-foreground/[0.06] text-foreground hover:bg-foreground/10",
  // Header nav link: no fill until hovered.
  ghost: "bg-transparent text-foreground hover:bg-(--mckp-surface)",
}

const sizes = {
  sm: "px-3 py-1.5 text-[length:var(--mckp-type-small)] leading-(--mckp-type-small-line)",
  md: "px-5 py-[9px] text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line)",
  lg: "px-[26px] py-3 text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line)",
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  icon,
  type = "button",
  disabled,
  onClick,
  className,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)
  const content = (
    <>
      {children}
      {icon}
    </>
  )

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        onClick={onClick}
        className={classes}
      >
        {content}
      </a>
    )
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {content}
    </button>
  )
}
