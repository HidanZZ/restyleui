"use client"

import type { ButtonProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const base =
  "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-(--apple-button-radius) border border-transparent text-center font-body font-normal no-underline antialiased select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-[.42] disabled:pointer-events-none disabled:opacity-[.42]"

// Fill, outline and text: the colors change at once on hover and press, like the source.
const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-(--apple-blue-hover) active:bg-(--apple-blue-active)",
  secondary:
    "border-(--apple-link) bg-transparent text-(--apple-link) hover:border-transparent hover:bg-(--apple-blue-hover) hover:text-primary-foreground active:bg-(--apple-blue-active)",
  ghost: "bg-transparent text-(--apple-link) hover:underline",
}

// sm: reduced (12px), md: default (14px), lg: elevated (17px), the source's three pill sizes.
const sizes = {
  sm: "min-w-[23px] gap-1 px-[10px] py-[3px] text-[12px] leading-[1.3333733333] tracking-[-.01em]",
  md: "min-w-[28px] gap-1.5 px-[15px] py-[8px] text-(length:--apple-button-size) leading-(--apple-button-line-height) tracking-(--apple-button-letter-spacing)",
  lg: "min-w-[26px] gap-2 px-[21px] py-[11px] text-(length:--apple-button-size-large) leading-(--apple-button-line-height-large) tracking-(--apple-button-letter-spacing-large)",
}

/** Apple pill action: blue fill, blue outline that fills on hover, or a plain blue text action. */
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
        <span aria-hidden="true" className="inline-flex rtl:-scale-x-100 [&_svg]:size-[1em]">
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
