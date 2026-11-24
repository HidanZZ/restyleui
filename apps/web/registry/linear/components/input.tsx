"use client"

import { useId, useState, type FormEvent } from "react"
import type { InputProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Button } from "@/registry/linear/components/button"

/**
 * Designed from the source form field: a 40px translucent field with a hairline
 * edge and an indigo caret, beside the light pill button. The hint turns into
 * the success message after a submit.
 */
export function Input({
  label,
  buttonLabel,
  placeholder,
  type = "email",
  name,
  hint,
  successMessage,
  onSubmit,
  className,
}: InputProps) {
  const id = useId()
  const [value, setValue] = useState("")
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("pending")
    try {
      await onSubmit?.(value)
      setStatus("done")
      setValue("")
    } catch {
      setStatus("idle")
    }
  }

  const message = status === "done" && successMessage ? successMessage : hint

  return (
    <form onSubmit={handleSubmit} className={cn("grid w-full max-w-md gap-2", className)}>
      <label htmlFor={id} className="text-[13px] font-[510] leading-normal tracking-[-0.01em] text-(--linear-text-secondary)">
        {label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          required
          placeholder={placeholder}
          autoComplete={type === "email" ? "email" : undefined}
          aria-describedby={message ? `${id}-message` : undefined}
          onChange={(event) => {
            setValue(event.target.value)
            if (status === "done") setStatus("idle")
          }}
          className={cn(
            "h-10 w-full min-w-0 appearance-none rounded-[8px] border border-(--linear-border-translucent) bg-(--linear-bg-translucent) px-2.5",
            "text-sm leading-[21px] text-foreground caret-(--linear-brand) outline-none placeholder:text-(--linear-text-quaternary)",
            "transition-[border-color,box-shadow] duration-100 ease-kit hover:border-(--linear-border-translucent-strong)",
            "focus:border-(--linear-brand) focus:shadow-[0_0_0_1px_var(--linear-brand)] motion-reduce:transition-none"
          )}
        />
        <Button type="submit" size="md" disabled={status === "pending"} className="w-full sm:w-auto">
          {buttonLabel}
        </Button>
      </div>
      {message && (
        <p
          id={`${id}-message`}
          aria-live="polite"
          className={cn(
            "flex items-center gap-1.5 text-[13px] leading-normal tracking-[-0.01em]",
            status === "done" && successMessage ? "text-(--linear-text-secondary)" : "text-muted-foreground"
          )}
        >
          {status === "done" && successMessage && (
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 shrink-0 text-(--linear-green)">
              <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {message}
        </p>
      )}
    </form>
  )
}
