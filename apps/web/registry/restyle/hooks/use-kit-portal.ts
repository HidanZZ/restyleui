"use client"

/**
 * useKitPortal: the element overlays should render into, so they keep the
 * kit's CSS variables.
 *
 * Kit tokens live on the closest `[data-kit]` element. ui-sdk popups (Dialog,
 * Drawer, Popover, NavigationMenu) render in place in the browser's top layer,
 * but fall back to a portal at `document.body` when the browser has no top
 * layer, which would lose the tokens. Passing this container as `container`
 * always keeps the popup inside the kit element. When the kit is set on
 * `<html>`, the container is `<body>`, which inherits the tokens.
 *
 * Attach the ref to any element inside the kit, usually the trigger. The
 * container is `null` on the server and until the ref attaches; ui-sdk then
 * renders in place, which is also inside the kit.
 *
 * Signature:
 *   useKitPortal<T extends Element = HTMLElement>():
 *     [ref: (node: T | null) => void, container: HTMLElement | null]
 *
 * Usage:
 *   const [kitRef, container] = useKitPortal<HTMLButtonElement>()
 *   <Dialog container={container}>
 *     <DialogTrigger ref={kitRef}>Open</DialogTrigger>
 *     <DialogBackdrop />
 *     <DialogContent>...</DialogContent>
 *   </Dialog>
 */
import { useCallback, useState } from "react"

export function useKitPortal<T extends Element = HTMLElement>(): [
  ref: (node: T | null) => void,
  container: HTMLElement | null,
] {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const ref = useCallback((node: T | null) => {
    if (!node) return
    const kit = node.closest<HTMLElement>("[data-kit]")
    setContainer(kit === node.ownerDocument.documentElement ? node.ownerDocument.body : kit)
  }, [])
  return [ref, container]
}
