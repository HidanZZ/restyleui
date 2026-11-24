"use client"

import type { ButtonProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const variants = {
  // Bright brand blue: the kit's one filled action.
  primary: "border-primary bg-primary text-primary-foreground hover:border-ring hover:bg-ring active:border-accent-foreground active:bg-accent-foreground",
  // The source's outlined call to action: ink fill, 1px grey border, quiet grey label.
  secondary:
    "border-[color-mix(in_srgb,var(--input)_58%,var(--background))] bg-background text-muted-foreground hover:bg-foreground/7 hover:text-foreground active:bg-border",
  // The source's "Sign up" control: no fill until hover.
  ghost: "border-transparent bg-transparent text-foreground hover:bg-foreground/7 active:bg-border",
}

const sizes = {
  sm: "h-8 gap-1 px-3 text-sm",
  md: "h-[35px] gap-1.5 px-[10.5px] text-sm",
  lg: "h-11 gap-2 px-4 text-base",
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
  const classes = cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-kit border font-body leading-5 font-medium",
    "transition-[background-color,border-color,color] duration-150 ease-kit motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "aria-disabled:pointer-events-none aria-disabled:opacity-40 disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    className
  )
  const content = (
    <>
      {children}
      {icon && (
        <span aria-hidden className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
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
