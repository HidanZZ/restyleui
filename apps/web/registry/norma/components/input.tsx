"use client"

import { useId, useState, type FormEvent } from "react"
import type { InputProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

type Status = "idle" | "pending" | "success" | "error"

/**
 * Norma signup field: one hairline pill holding the input and a small ink
 * button, like the source footer waitlist. The border darkens on focus; the
 * hint line below turns into the result message.
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
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = value.trim()
    if (type === "email" ? !EMAIL.test(trimmed) : !trimmed) {
      setStatus("error")
      setError(type === "email" ? "Please enter a valid email." : "Please fill in this field.")
      return
    }
    setStatus("pending")
    try {
      await onSubmit?.(trimmed)
      setStatus("success")
      setValue("")
    } catch {
      setStatus("error")
      setError("Something went wrong. Please try again.")
    }
  }

  const message = status === "success" ? successMessage : status === "error" ? error : hint

  return (
    <form noValidate onSubmit={handleSubmit} className={cn("w-full max-w-sm font-body", className)}>
      <label htmlFor={`${id}-field`} className="block text-[0.8125rem] font-medium text-foreground">
        {label}
      </label>
      <div
        className={cn(
          "mt-1.5 flex w-full items-center gap-2 rounded-full border bg-background p-1.5 ps-5 transition-colors duration-200 ease-kit motion-reduce:transition-none",
          status === "error" ? "border-foreground/40" : "border-border",
          "focus-within:border-foreground"
        )}
      >
        <input
          id={`${id}-field`}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete={type === "email" ? "email" : undefined}
          aria-invalid={status === "error" || undefined}
          aria-describedby={message ? `${id}-message` : undefined}
          disabled={status === "pending"}
          onChange={(event) => {
            setValue(event.target.value)
            if (status !== "idle" && status !== "pending") setStatus("idle")
          }}
          className="min-w-0 flex-1 bg-transparent text-[0.9375rem] text-foreground outline-none placeholder:text-(--norma-ink-3) disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className="inline-flex h-9 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full bg-primary px-4 text-[0.875rem] font-medium text-primary-foreground outline-none transition-[background-color,scale] duration-200 ease-kit hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] disabled:cursor-default disabled:opacity-70 motion-reduce:transition-none"
        >
          {buttonLabel}
        </button>
      </div>
      <p
        id={`${id}-message`}
        aria-live="polite"
        className={cn(
          "mt-2 min-h-[1.4em] text-[0.8125rem] leading-[1.4]",
          status === "success" || status === "error" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {message}
      </p>
    </form>
  )
}
