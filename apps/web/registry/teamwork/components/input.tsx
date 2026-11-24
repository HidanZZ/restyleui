"use client"

import { useId, useState, type FormEvent } from "react"
import type { InputProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

// The source's text field: dark fill, thin grey border, 6px corners, blue focus ring.
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
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const value = String(new FormData(form).get(name ?? "value") ?? "").trim()
    setStatus("pending")
    try {
      await onSubmit?.(value)
      form.reset()
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex w-full max-w-md flex-col gap-1 font-body", className)}>
      <label htmlFor={id} className="text-xs leading-4 font-bold text-muted-foreground">
        {label}
      </label>
      <div className="flex gap-2 max-[480px]:flex-col">
        <input
          id={id}
          type={type}
          name={name ?? "value"}
          placeholder={placeholder}
          required
          autoComplete={type === "email" ? "email" : undefined}
          aria-describedby={hint || status !== "idle" ? `${id}-note` : undefined}
          onInput={() => {
            if (status === "done" || status === "error") setStatus("idle")
          }}
          className={cn(
            "h-10 min-w-0 flex-1 rounded-kit border border-input bg-secondary px-2 text-sm leading-5 text-foreground placeholder:text-(--teamwork-text-subtle) max-[480px]:flex-none",
            "transition-[background-color,border-color,box-shadow] duration-150 ease-kit hover:bg-popover motion-reduce:transition-none",
            "focus:border-ring focus:bg-secondary focus:shadow-[inset_0_0_0_1px_var(--ring)] focus:outline-none",
            "user-invalid:border-[color-mix(in_srgb,var(--teamwork-yellow)_70%,var(--input))]"
          )}
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-kit bg-primary px-4 text-sm leading-5 font-medium whitespace-nowrap text-primary-foreground transition-colors duration-150 ease-kit hover:bg-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-progress disabled:opacity-60 motion-reduce:transition-none"
        >
          {buttonLabel}
        </button>
      </div>
      <p id={`${id}-note`} aria-live="polite" className="min-h-4 text-xs leading-4 text-(--teamwork-text-subtle)">
        {status === "done" ? (
          <span className="inline-flex items-center gap-1.5 text-(--teamwork-green)">
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5">
              <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {successMessage ?? "Thanks. You're on the list."}
          </span>
        ) : status === "error" ? (
          <span className="text-(--teamwork-yellow)">Something went wrong. Please try again.</span>
        ) : (
          hint
        )}
      </p>
    </form>
  )
}
