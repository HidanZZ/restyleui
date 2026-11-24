"use client"

import { useId, useState, type FormEvent } from "react"
import { Button } from "@/registry/apple/components/button"
import type { InputProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"

/**
 * Designed: the Apple account-form text box. A 56px field with a 12px radius
 * whose label sits inside like a placeholder and floats up when the field is
 * focused or filled, next to a blue pill. The placeholder only shows while
 * focused, under the floated label.
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
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    try {
      await onSubmit?.(value)
      setDone(true)
      setValue("")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-[34rem] font-body antialiased", className)}>
      <div className="flex flex-col gap-3 min-[735px]:flex-row min-[735px]:items-center">
        <div className="relative flex-1">
          <input
            id={id}
            type={type}
            name={name}
            value={value}
            required
            autoComplete={type === "email" ? "email" : undefined}
            placeholder={placeholder ?? " "}
            aria-describedby={hint ? `${id}-hint` : undefined}
            onChange={(event) => {
              setValue(event.target.value)
              setDone(false)
            }}
            className={cn(
              "peer block h-14 w-full rounded-kit-lg border border-(--apple-tertiary-text) bg-background px-4 pt-[18px] text-(length:--apple-body-size) tracking-(--apple-body-letter-spacing) text-foreground",
              "placeholder:text-transparent focus:placeholder:text-(--apple-tertiary-text)",
              "transition-[border-color,box-shadow] duration-[240ms] ease-kit outline-none focus:border-primary focus:ring-4 focus:ring-primary/30 motion-reduce:transition-none"
            )}
          />
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 truncate text-(length:--apple-body-size) tracking-(--apple-body-letter-spacing) text-muted-foreground",
              "origin-[0_50%] transition-[top,font-size] duration-[125ms] ease-in motion-reduce:transition-none",
              "peer-focus:top-[17px] peer-focus:text-[12px] peer-focus:tracking-[-.01em] peer-[:not(:placeholder-shown)]:top-[17px] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:tracking-[-.01em]"
            )}
          >
            {label}
          </label>
        </div>
        <Button type="submit" size="lg" disabled={pending}>
          {buttonLabel}
        </Button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 ps-4 text-[12px] leading-[1.3333733333] tracking-[-.01em] text-muted-foreground">
          {hint}
        </p>
      )}
      <p role="status" className="mt-2 ps-4 text-[14px] leading-[1.2857742857] tracking-[-.016em] text-foreground">
        {done ? successMessage : null}
      </p>
    </form>
  )
}
