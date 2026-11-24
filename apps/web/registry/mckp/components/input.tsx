"use client"

import { useId, useState, type FormEvent } from "react"
import type { InputProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

type Status = "idle" | "pending" | "success" | "error"

/**
 * A dark field with a 1px hairline and the white kit button inside it. The
 * hint is a mono micro label; success swaps the field for a white line with a
 * green check.
 */
export function Input({
  label,
  buttonLabel,
  placeholder,
  type = "email",
  name,
  hint,
  successMessage = "Thanks. You're on the list.",
  onSubmit,
  className,
}: InputProps) {
  const id = useId()
  const [value, setValue] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "pending") return
    setStatus("pending")
    try {
      await onSubmit?.(value)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  const note = status === "error" ? "Something went wrong. Try again." : hint

  return (
    <form onSubmit={handleSubmit} className={cn("grid w-full max-w-[440px] gap-2", className)}>
      <label
        htmlFor={id}
        className="text-[length:var(--mckp-type-small)] leading-(--mckp-type-small-line) text-(--mckp-ink-faint)"
      >
        {label}
      </label>

      {status === "success" ? (
        <p
          role="status"
          className="flex min-h-12 items-center gap-2.5 text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line) text-foreground motion-safe:animate-[mckp-field-in_.6s_cubic-bezier(.16,1,.3,1)_both]"
        >
          <style href="mckp-field-in" precedence="default">
            {"@keyframes mckp-field-in{0%{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}"}
          </style>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-(--mckp-code-green)">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {successMessage}
        </p>
      ) : (
        <div
          className={cn(
            "flex items-center gap-1 rounded-kit border border-input bg-(--mckp-surface-deep) p-1 transition-colors duration-200 ease-kit-in-out motion-reduce:transition-none",
            "focus-within:border-(--mckp-ink-faint) hover:border-(--mckp-line-strong)",
            status === "error" && "border-(--mckp-code-orange)"
          )}
        >
          <input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            required
            autoComplete={type === "email" ? "email" : undefined}
            aria-invalid={status === "error" || undefined}
            aria-describedby={note ? `${id}-note` : undefined}
            className="h-10 w-0 min-w-0 flex-1 bg-transparent px-3 text-[length:var(--mckp-type-body)] text-foreground outline-none placeholder:text-(--mckp-ink-dim)"
          />
          <button
            type="submit"
            disabled={status === "pending"}
            className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-kit-sm bg-primary px-4 text-[length:var(--mckp-type-small)] text-primary-foreground transition-[background-color,opacity] duration-200 ease-kit-in-out hover:bg-primary/85 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
          >
            {buttonLabel}
          </button>
        </div>
      )}

      {note && status !== "success" && (
        <p
          id={`${id}-note`}
          role={status === "error" ? "alert" : undefined}
          className={cn(
            "font-mono text-[length:var(--mckp-type-mono)] leading-(--mckp-type-mono-line)",
            status === "error" ? "text-(--mckp-code-orange)" : "text-(--mckp-ink-mono)"
          )}
        >
          {note}
        </p>
      )}
    </form>
  )
}
