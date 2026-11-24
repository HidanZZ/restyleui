"use client"

import type { ButtonProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const base =
  "group inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full font-body outline-none select-none " +
  "transition-[background-color,border-color,color,scale] duration-200 ease-kit active:scale-[0.99] motion-reduce:transition-none " +
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50"

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/85",
  secondary: "border border-border bg-background text-foreground hover:border-foreground/30",
  ghost: "text-foreground hover:bg-foreground/5",
}

const sizes = {
  sm: "h-9 gap-2 px-4 text-[0.875rem] font-medium",
  md: "h-10 gap-2 px-5 text-[0.875rem] font-medium",
  lg: "h-12 gap-2.5 px-7 text-[1rem] font-semibold",
}

/** Norma pill button: ink fill or white with a hairline, trailing icon slides 4px on hover. */
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
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex transition-transform duration-300 ease-kit group-hover:translate-x-1 motion-reduce:transition-none rtl:-scale-x-100 [&_svg]:size-4"
        >
          {icon}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
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
