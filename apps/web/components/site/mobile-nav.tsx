"use client"

import Link from "next/link"
import { useRef, type MouseEvent } from "react"

import { DocsSidebar } from "@/components/site/docs-sidebar"
import { CloseIcon, MenuIcon } from "@/components/site/icons"
import { Wordmark } from "@/components/site/wordmark"
import { iconButton } from "@/components/site/ui"

/** Menu button and left drawer with the full docs navigation, below the `lg` breakpoint. */
export function MobileNav() {
  const dialog = useRef<HTMLDialogElement>(null)

  function onDialogClick(event: MouseEvent<HTMLDialogElement>) {
    const target = event.target as Element
    // Backdrop clicks land on the dialog itself; link clicks navigate away.
    if (target === event.currentTarget || target.closest("a")) event.currentTarget.close()
  }

  return (
    <>
      <button
        type="button"
        className={iconButton}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <MenuIcon className="size-4" />
      </button>
      <dialog
        ref={dialog}
        aria-label="Navigation"
        onClick={onDialogClick}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(20rem,86vw)] max-w-none -translate-x-full border-r border-border bg-background p-0 text-foreground transition-[translate,overlay,display] transition-discrete duration-200 ease-out backdrop:bg-black/0 backdrop:transition-[background-color,overlay,display] backdrop:transition-discrete backdrop:duration-200 open:translate-x-0 open:backdrop:bg-black/40 starting:open:-translate-x-full starting:open:backdrop:bg-black/0 motion-reduce:transition-none"
      >
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background px-4">
          <Link href="/" className="rounded-md">
            <Wordmark />
          </Link>
          <button
            type="button"
            className={iconButton}
            aria-label="Close navigation"
            onClick={() => dialog.current?.close()}
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
        <div className="px-5 pt-5 pb-24">
          <ul className="mb-7 flex flex-col gap-1 border-b border-border pb-5">
            <li>
              <Link href="/" className="flex min-h-9 items-center text-sm font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="/docs" className="flex min-h-9 items-center text-sm font-medium">
                Docs
              </Link>
            </li>
            <li>
              <Link href="/docs#kits" className="flex min-h-9 items-center text-sm font-medium">
                Kits
              </Link>
            </li>
          </ul>
          <DocsSidebar />
        </div>
      </dialog>
    </>
  )
}
