"use client"

import { useRef, useState, type ReactNode } from "react"

import { CheckIcon, CopyIcon } from "@/components/site/icons"
import { buttonPrimary, buttonSecondary, iconButton } from "@/components/site/ui"
import { cn } from "@/registry/restyle/lib/utils"

type CopyButtonProps = {
  /** Text to copy, or a function that builds it at click time. */
  value: string | (() => string)
  /** Visible label. Without one, the button is a square icon button. */
  children?: ReactNode
  /** Accessible name for the icon-only form. */
  label?: string
  variant?: "icon" | "primary" | "secondary"
  className?: string
}

/** Copies text to the clipboard and confirms with a check for 1.6 s. */
export function CopyButton({ value, children, label = "Copy", variant = "icon", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  async function copy() {
    const text = typeof value === "function" ? value() : value
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  const icon = copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />

  if (variant === "icon") {
    return (
      <button type="button" onClick={copy} className={cn(iconButton, className)} aria-label={copied ? "Copied" : label}>
        {icon}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(variant === "primary" ? buttonPrimary : buttonSecondary, className)}
    >
      {icon}
      <span>{children}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  )
}
