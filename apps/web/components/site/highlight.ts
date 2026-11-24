/**
 * Server-only syntax highlighting with Shiki. Output carries both light and dark
 * colors as CSS variables (`--shiki-light`, `--shiki-dark`); site.css picks one.
 */
import { cacheLife } from "next/cache"
import { createHighlighterCore, type HighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import bash from "shiki/langs/bash.mjs"
import css from "shiki/langs/css.mjs"
import html from "shiki/langs/html.mjs"
import json from "shiki/langs/json.mjs"
import tsx from "shiki/langs/tsx.mjs"
import githubDark from "shiki/themes/github-dark-default.mjs"
import githubLight from "shiki/themes/github-light-default.mjs"

export type CodeLang = "tsx" | "bash" | "json" | "css" | "html"

let highlighter: Promise<HighlighterCore> | undefined

/** Returns highlighted HTML for `code`. Cached: the same input renders once per build. */
export async function highlight(code: string, lang: CodeLang): Promise<string> {
  "use cache"
  cacheLife("max")
  highlighter ??= createHighlighterCore({
    themes: [githubLight, githubDark],
    langs: [tsx, bash, json, css, html],
    engine: createJavaScriptRegexEngine(),
  })
  return (await highlighter).codeToHtml(code, {
    lang,
    themes: { light: "github-light-default", dark: "github-dark-default" },
    defaultColor: false,
  })
}
