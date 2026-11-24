/**
 * Inline scripts that run in <head> before the first paint, so the theme and the
 * active kit never flash. Plain strings: safe to import from server components.
 */
import { KIT_SLUGS } from "@/lib/catalog"

export const THEME_STORAGE_KEY = "restyle-theme"
export const KIT_STORAGE_KEY = "restyle-kit"

/** Applies the stored theme, or the system preference, as the `.dark` class on <html>. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`

/** Copies `?kit=<slug>` into storage and marks the active kit on <html>. */
export const kitScript = `(function(){try{var k=${JSON.stringify(KIT_SLUGS)},p=new URLSearchParams(location.search).get("kit");if(p&&k.indexOf(p)>-1)localStorage.setItem("${KIT_STORAGE_KEY}",p);var s=localStorage.getItem("${KIT_STORAGE_KEY}");document.documentElement.dataset.activeKit=k.indexOf(s)>-1?s:k[0]}catch(e){}})()`
