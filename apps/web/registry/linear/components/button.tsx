"use client"

import type { ButtonProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const base =
  "relative inline-flex max-w-full shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-full font-[510] " +
  "transition-[border-color,background-color,color,box-shadow,opacity,filter,transform] duration-[160ms] ease-kit " +
  "active:scale-[.97] motion-reduce:transition-none motion-reduce:active:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "[&_svg]:size-(--button-icon-size) [&_svg]:shrink-0"

const variants = {
  // Source "invert": a light pill on the dark canvas.
  primary:
    "border border-(--linear-button-invert) bg-(--linear-button-invert) text-background hover:bg-foreground " +
    "shadow-[0_8px_2px_0_#0000,0_5px_2px_0_#00000003,0_3px_2px_0_#0000000a,0_1px_1px_0_#00000012,0_0_1px_0_#00000014]",
  // Source "secondary": translucent glass with a hairline ring.
  secondary:
    "bg-(--linear-bg-translucent) text-foreground backdrop-blur-[4px] hover:bg-(--linear-bg-level-3) active:bg-(--linear-bg-level-3) " +
    "shadow-[inset_0_0_0_1px_#ffffff08,inset_0_1px_#ffffff0a,0_0_0_1px_#0009,0_4px_4px_#0000001a]",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-(--linear-bg-quaternary) hover:text-foreground active:text-foreground",
}

const sizes = {
  sm: "h-8 gap-2 px-3 text-[13px] [--button-icon-size:16px]",
  md: "h-10 gap-1.5 px-4 text-[15px] [--button-icon-size:16px]",
  lg: "h-11 gap-1.5 px-5 text-base [--button-icon-size:18px]",
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
      {icon && (
        <span aria-hidden className="inline-flex">
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
