"use client"

import { THEME_STORAGE_KEY } from "@/components/site/head-scripts"
import { MoonIcon, SunIcon } from "@/components/site/icons"
import { iconButton } from "@/components/site/ui"

/** Light/dark switch. Icons follow the `.dark` class, so the server render is already correct. */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const dark = !root.classList.contains("dark")
    // Switch in one frame: hover color transitions would otherwise fade every element.
    const freeze = document.createElement("style")
    freeze.textContent = "*,*::before,*::after{transition:none!important}"
    document.head.appendChild(freeze)
    root.classList.toggle("dark", dark)
    root.style.colorScheme = dark ? "dark" : "light"
    void getComputedStyle(root).color
    requestAnimationFrame(() => freeze.remove())
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light")
    } catch {
      // Storage is unavailable: the theme still changes for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={iconButton}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <SunIcon className="size-4 dark:hidden" />
      <MoonIcon className="hidden size-4 dark:block" />
    </button>
  )
}
