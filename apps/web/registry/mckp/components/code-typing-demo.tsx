"use client"

import {
  useCallback,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { cn } from "@/registry/restyle/lib/utils"
import { useReducedMotion } from "@/registry/restyle/hooks/use-reduced-motion"
import { useReveal } from "@/registry/restyle/hooks/use-reveal"
import { useTilt } from "@/registry/restyle/hooks/use-tilt"

export type CodeAttribute = { name: string; value: string }

export type CodeTypingDemoCard = { title: string; description: string }

export type CodeTypingDemoProps = {
  /** White first line of the heading. Empty string hides the heading block. */
  title?: string
  /** Grey second line of the heading. */
  titleDetail?: string
  /** Short note on the right of the heading. */
  aside?: string
  /** Custom element name in the snippet. */
  tag?: string
  /** Attributes listed before `trigger`. */
  attributes?: CodeAttribute[]
  /** Values the `trigger` attribute cycles through; the first one shows at rest. */
  triggers?: string[]
  /** Script URL in the copied snippet. */
  scriptSrc?: string
  /** Text under the snippet, trigger and progressive demos, in that order. */
  cards?: [CodeTypingDemoCard, CodeTypingDemoCard, CodeTypingDemoCard]
  /** Scene behind the progressive loading demo. */
  image?: { src: string; alt: string }
  className?: string
}

const defaultAttributes: CodeAttribute[] = [
  { name: "scene-id", value: "a7c2e914-55d0-4b1e" },
  { name: "width", value: "100vw" },
  { name: "height", value: "100vh" },
]

const defaultTriggers = ["scroll", "click", "hover", "load"]

const defaultCards: [CodeTypingDemoCard, CodeTypingDemoCard, CodeTypingDemoCard] = [
  { title: "Paste one line", description: "Copy the snippet from the editor and drop it into any page builder or plain HTML." },
  { title: "Choose what starts it", description: "Click, hover, scroll, in view or on load, set per scene." },
  {
    title: "Light first, full later",
    description: "A light version shows at once. Full textures stream in behind it and swap in.",
  },
]

const defaultImage = { src: "/kits/mckp/hero.webp", alt: "Laptop floating above a dark studio floor" }

// Demo surfaces are drawn in a unit `--u` that scales with the demo width, so
// the whole stage keeps its proportions from 360px phones to wide desktops.
const u = (n: number) => `calc(${n} * var(--u))`

// Tones of the editor UI, mixed from the kit tokens.
const tones = {
  "--ctd-ink": "color-mix(in srgb, var(--foreground) 80%, var(--background))",
  "--ctd-soft": "color-mix(in srgb, var(--foreground) 61%, var(--background))",
  "--ctd-edge": "color-mix(in srgb, var(--foreground) 30%, var(--background))",
  "--ctd-lift": "color-mix(in srgb, var(--foreground) 7%, var(--background))",
  "--ctd-key": "color-mix(in srgb, var(--foreground) 12%, var(--background))",
  "--ctd-glass": "color-mix(in srgb, var(--foreground) 8%, transparent)",
  "--ctd-shade": "color-mix(in srgb, var(--mckp-page-black) 30%, transparent)",
} as CSSProperties

// Pointer parallax: useTilt with max 1deg writes --tilt-y = x deg and
// --tilt-x = -y deg; sin() turns them back into the -1..1 numbers --mx / --my.
const parallax = "[--mx:calc(sin(var(--tilt-y,0deg))/0.017452)] [--my:calc(sin(var(--tilt-x,0deg))/-0.017452)]"

const shimmerKeyframes = "@keyframes mckp-shimmer{0%{background-position:100% 0}to{background-position:0 0}}"
const popKeyframes = "@keyframes mckp-pop{0%{opacity:0;transform:scale(.4)}}"

const reveal =
  "translate-y-[50px] opacity-0 transition-[opacity,translate] duration-900 ease-kit delay-(--reveal-delay) data-visible:translate-y-0 data-visible:opacity-100 motion-reduce:transition-none"

const body = "text-[length:var(--mckp-type-body)] leading-(--mckp-type-body-line)"

type Phase = "pending" | "run" | "done"

type RefSetter<T> = (node: T | null) => void

/** One callback ref that feeds up to three hook refs (all stable state setters). */
function useMergedRef<T>(a: RefSetter<T>, b: RefSetter<T>, c?: RefSetter<T>) {
  return useCallback(
    (node: T | null) => {
      a(node)
      b(node)
      c?.(node)
    },
    [a, b, c]
  )
}

/**
 * Staged card intro: pending until 40 percent of the demo is on screen, then
 * `run` (entrance transitions with their delays) for `duration` ms, then done.
 * The skeleton shimmer shows until `skeleton` ms after the start.
 */
function useCardIntro<T extends Element>(duration: number, skeleton: number) {
  const reduced = useReducedMotion()
  const { ref, visible } = useReveal<T>({ threshold: 0.4, rootMargin: "0px" })
  const [ended, setEnded] = useState({ intro: false, skeleton: skeleton === 0 })

  useEffect(() => {
    if (!visible || reduced) return
    const skeletonTimer = window.setTimeout(() => setEnded((e) => ({ ...e, skeleton: true })), skeleton)
    const introTimer = window.setTimeout(() => setEnded((e) => ({ ...e, intro: true })), duration)
    return () => {
      window.clearTimeout(skeletonTimer)
      window.clearTimeout(introTimer)
    }
  }, [visible, reduced, duration, skeleton])

  const phase: Phase = reduced || ended.intro ? "done" : visible ? "run" : "pending"
  return { ref, phase, skeleton: !reduced && !ended.skeleton }
}

function Skeleton({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -inset-px rounded-[inherit] bg-[linear-gradient(100deg,var(--mckp-surface-raised)_30%,var(--mckp-line-strong)_50%,var(--mckp-surface-raised)_70%)] bg-[length:300%_100%] transition-opacity duration-[450ms] motion-reduce:hidden",
        on ? "animate-[mckp-shimmer_1.1s_linear_infinite] opacity-100" : "opacity-0"
      )}
    />
  )
}

function Icon({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("flex-none", className)}
      style={{ width: u(15.725), height: u(15.725), ...style }}
    >
      {children}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Snippet card: the trigger value deletes and retypes itself, and every full
// round the card presses its own copy button.
// ---------------------------------------------------------------------------

const ROUND_PAUSE = 2200
const TYPE_DELAY = 75
const DELETE_DELAY = 45
const COPIED_LINGER = 1300

function useTypingLoop(words: string[], active: boolean) {
  const [text, setText] = useState(words[0] ?? "")
  const [typing, setTyping] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [copied, setCopied] = useState(false)
  // Loop progress lives outside render: the loop pauses and resumes with the viewport.
  const loop = useRef({ text: words[0] ?? "", round: 0, hovering: false, copiedTimer: 0 })

  const showCopied = useCallback(() => {
    const state = loop.current
    setCopied(true)
    window.clearTimeout(state.copiedTimer)
    state.copiedTimer = window.setTimeout(() => setCopied(false), COPIED_LINGER)
  }, [])

  useEffect(() => {
    if (!active || !words.length) return
    const state = loop.current
    const timers = new Set<number>()
    let cancelled = false
    const sleep = (ms: number) => {
      const { promise, resolve } = Promise.withResolvers<void>()
      const id = window.setTimeout(() => {
        timers.delete(id)
        resolve()
      }, ms)
      timers.add(id)
      return promise
    }
    const write = (next: string) => {
      state.text = next
      setText(next)
    }

    const run = async () => {
      while (!cancelled) {
        await sleep(ROUND_PAUSE)
        if (cancelled) return
        if (state.hovering) continue
        state.round += 1
        const next = words[state.round % words.length]
        setTyping(true)
        while (state.text.length) {
          write(state.text.slice(0, -1))
          await sleep(DELETE_DELAY)
          if (cancelled) return
        }
        for (const character of next) {
          write(state.text + character)
          await sleep(TYPE_DELAY)
          if (cancelled) return
        }
        setTyping(false)
        if (state.round % words.length === 0) {
          await sleep(500)
          if (cancelled) return
          setPressed(true)
          await sleep(160)
          if (cancelled) return
          setPressed(false)
          showCopied()
        }
      }
    }
    void run()

    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
      setTyping(false)
      setPressed(false)
    }
  }, [active, words, showCopied])

  const setHovering = useCallback((hovering: boolean) => {
    loop.current.hovering = hovering
  }, [])
  const currentText = useCallback(() => loop.current.text, [])

  return { text, typing, pressed, copied, showCopied, setHovering, currentText }
}

function SnippetDemo({
  tag,
  attributes,
  triggers,
  scriptSrc,
}: {
  tag: string
  attributes: CodeAttribute[]
  triggers: string[]
  scriptSrc: string
}) {
  const reduced = useReducedMotion()
  const fadeId = useId()
  const { ref: introRef, phase, skeleton } = useCardIntro<HTMLDivElement>(1900, 700)
  const { ref: screenRef, visible: onScreen } = useReveal<HTMLDivElement>({ once: false, threshold: 0, rootMargin: "0px" })
  const tiltRef = useTilt<HTMLDivElement>({ max: 1, ease: 0.08 })
  const ref = useMergedRef<HTMLDivElement>(introRef, screenRef, tiltRef)
  const { text, typing, pressed, copied, showCopied, setHovering, currentText } = useTypingLoop(
    triggers,
    onScreen && phase === "done" && !reduced
  )
  const [announce, setAnnounce] = useState("")

  const copy = async () => {
    const attrs = [...attributes.map((a) => `${a.name}="${a.value}"`), `trigger="${currentText()}"`].join(" ")
    const snippet = `<script src="${scriptSrc}" async></script>\n\n<${tag} ${attrs}></${tag}>`
    try {
      await navigator.clipboard.writeText(snippet)
      setAnnounce("Snippet copied")
    } catch {
      // Clipboard access can be denied; the button still shows the press.
      setAnnounce("")
    }
    showCopied()
  }

  const pending = phase === "pending"
  const run = phase === "run"
  const lineCount = attributes.length + 2

  const line = (n: number, children: ReactNode) => (
    <span
      key={n}
      style={{ translate: pending ? `${u(-6)} 0` : undefined, transitionDelay: run ? `${750 + n * 80}ms` : undefined }}
      className={cn(
        "inline-block transition-[opacity,translate] duration-[350ms,450ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
        pending && "opacity-0"
      )}
    >
      {children}
    </span>
  )

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Embed code demo"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className={cn("@container aspect-[700/448] w-full select-none [--u:calc(100cqw/351)]", parallax)}
    >
      <div
        className="relative size-full text-(--ctd-ink)"
        style={{ fontSize: u(13.151), lineHeight: u(17.535), perspective: u(600) }}
      >
        <div
          className={cn(
            "absolute flex flex-col items-start border-solid border-(--mckp-line-strong) bg-[linear-gradient(-32.53deg,var(--mckp-surface-deep)_40.39%,var(--ctd-lift)_100%)]",
            "transition-[opacity,scale,translate] duration-[450ms,700ms,700ms] ease-[ease,cubic-bezier(.2,.9,.3,1.1),cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
            pending && "scale-[.96] opacity-0"
          )}
          style={{
            left: u(20),
            top: u(15),
            width: u(413.94),
            height: u(211.83),
            gap: u(8.768),
            padding: u(17.535),
            borderWidth: u(1.096),
            borderRadius: u(17.535),
            translate: pending ? `0 ${u(8)}` : undefined,
            transform: `translate3d(calc(var(--mx,0) * 6 * var(--u)), calc(var(--my,0) * 4 * var(--u)), 0) rotateY(calc(var(--mx,0) * 3deg)) rotateX(calc(var(--my,0) * -4deg))`,
          }}
        >
          <div className="flex w-full items-center" style={{ gap: u(10.96) }}>
            <span className="flex-1">Export code</span>
            <Icon style={{ width: u(17.535), height: u(17.535) }}>
              <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
            </Icon>
          </div>

          <div
            className="relative flex w-full items-center overflow-hidden border-solid border-(--mckp-line-strong)"
            style={{
              height: u(106),
              padding: `0 ${u(13.151)} 0 ${u(14.23)}`,
              borderWidth: u(1.096),
              borderRadius: u(6.439),
            }}
          >
            <Skeleton on={skeleton} />
            <pre className="m-0 font-mono [font-size:inherit] [line-height:inherit] whitespace-pre text-(--mckp-ink-faint)">
              {line(
                0,
                <>
                  <span className="text-(--mckp-code-blue)">&lt;</span>
                  <span className="text-(--mckp-code-violet)">{tag}</span>
                </>
              )}
              {attributes.map((attribute, i) => (
                <span key={attribute.name}>
                  {"\n"}
                  {line(
                    i + 1,
                    <>
                      {"  "}
                      <span className="text-(--mckp-code-orange)">{attribute.name}</span>=&quot;
                      <span className="text-(--mckp-code-green)">{attribute.value}</span>&quot;
                    </>
                  )}
                </span>
              ))}
              {"\n"}
              {line(
                lineCount - 1,
                <>
                  {"  "}
                  <span className="text-(--mckp-code-orange)">trigger</span>=&quot;
                  <span className="text-(--mckp-code-green)">{text}</span>
                  <span
                    aria-hidden="true"
                    className={cn("inline-block bg-(--ctd-ink)", typing ? "opacity-100" : "opacity-0")}
                    style={{ width: u(1.2), height: u(14), marginLeft: u(0.5), verticalAlign: u(-2) }}
                  />
                  &quot;
                </>
              )}
            </pre>
          </div>

          <button
            type="button"
            onClick={copy}
            style={{
              gap: u(4.384),
              width: u(135.9),
              height: u(35.07),
              borderWidth: u(1.096),
              borderRadius: u(6.439),
              fontSize: u(14.41),
              lineHeight: u(19.218),
              translate: pending ? `0 ${u(4)}` : undefined,
              transitionDelay: run ? "1200ms, 1200ms, 0ms, 0ms" : undefined,
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center border-solid border-(--ctd-edge) bg-[linear-gradient(var(--ctd-key)_-35.45%,var(--mckp-surface-deep)_99.82%)] p-0 text-(--ctd-ink)",
              "transition-[opacity,translate,transform,border-color] duration-[400ms,500ms,150ms,200ms] hover:border-(--mckp-ink-faint) active:scale-[.96] motion-reduce:transition-none",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              pressed && "scale-[.96]",
              pending && "opacity-0"
            )}
          >
            {copied ? (
              <Icon
                className="animate-[mckp-pop_.3s_cubic-bezier(.3,1.5,.5,1)] text-(--mckp-code-green) motion-reduce:animate-none"
                style={{ width: u(17.535), height: u(17.535) }}
              >
                <path d="M3.8 8.4l2.8 2.8 5.6-6" strokeWidth="1.5" />
              </Icon>
            ) : (
              <Icon style={{ width: u(17.535), height: u(17.535) }}>
                <rect x="5.5" y="5.5" width="8" height="8" rx="2" strokeWidth="1.1" />
                <path d="M3.5 10.4A1.8 1.8 0 0 1 2.5 8.8V4.3a1.8 1.8 0 0 1 1.8-1.8h4.5a1.8 1.8 0 0 1 1.6 1" strokeWidth="1.1" />
              </Icon>
            )}
            <span>{copied ? "Copied" : "Copy code"}</span>
          </button>
          <span role="status" className="sr-only">
            {announce && copied ? announce : ""}
          </span>
        </div>
      </div>

      {/* The dialog runs off the right edge into a fade, as if the editor continued. */}
      <svg
        viewBox="0 0 373 227"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 max-w-none"
        style={{ left: u(-20), width: u(373), height: u(227) }}
      >
        <defs>
          <linearGradient id={fadeId} x1="49.12" y1="86.18" x2="298.13" y2="242.15" gradientUnits="userSpaceOnUse">
            <stop style={{ stopColor: "var(--mckp-surface-deep)" }} stopOpacity="0" />
            <stop style={{ stopColor: "var(--mckp-surface-deep)" }} offset="0.7305" />
            <stop style={{ stopColor: "var(--mckp-surface-deep)" }} offset="1" />
          </linearGradient>
        </defs>
        <rect width="373" height="227" fill={`url(#${fadeId})`} />
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bg-(--mckp-surface-deep)"
        style={{ left: u(352), top: u(-20), width: u(90), height: u(260) }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Trigger card: a settings panel and a glass menu whose highlight walks the
// options every 1.5s; the field swaps to the new pick after 450ms.
// ---------------------------------------------------------------------------

type TriggerOption = { muted: string; label: string; fieldMuted: string; icon: ReactNode }

const triggerOptions: TriggerOption[] = [
  { muted: "No Trigger", label: "", fieldMuted: "", icon: null },
  {
    muted: "animate on",
    label: "Click",
    fieldMuted: "Animate on",
    icon: <path d="M7.2 7.2l2.4 6.6 1.1-2.7 2.7-1.1zM6 1.8v1.7M2.6 3.4l1.2 1.2M1.8 6.8h1.7M9.4 3.4L8.2 4.6M3.4 10.2l1.2-1.2" />,
  },
  {
    muted: "animate on",
    label: "Hover",
    fieldMuted: "Animate on",
    icon: <path d="M7.6 7.6l2.2 6.2 1-2.5 2.5-1zM4.3 11.2A5.4 5.4 0 1 1 13.3 7M6.2 9.4A2.8 2.8 0 1 1 10.6 6.4" />,
  },
  {
    muted: "animate on",
    label: "Scroll",
    fieldMuted: "Animate on",
    icon: (
      <>
        <rect x="4.2" y="1.5" width="7.6" height="13" rx="3.8" />
        <path d="M8 4.2v1.8" strokeWidth="1.5" />
      </>
    ),
  },
  {
    muted: "scrolled into",
    label: "View",
    fieldMuted: "Scrolled into",
    icon: <path d="M5.6 6H4a1.5 1.5 0 0 0-1.5 1.5v4A1.5 1.5 0 0 0 4 13h8a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 12 6h-1.6M8 2.5v7M5.8 7.6L8 9.8l2.2-2.2" />,
  },
  {
    muted: "animate on",
    label: "Load",
    fieldMuted: "Animate on",
    icon: <path d="M13 8a5 5 0 0 1-8.6 3.5M3 8a5 5 0 0 1 8.6-3.5M11.8 2v2.6H9.2M4.2 14v-2.6h2.6" />,
  },
  {
    muted: "animate on",
    label: "Cursor Move",
    fieldMuted: "Animate on",
    icon: <path d="M8 2v12M2 8h12M6.5 3.5L8 2l1.5 1.5M6.5 12.5L8 14l1.5-1.5M3.5 6.5L2 8l1.5 1.5M12.5 6.5L14 8l-1.5 1.5" />,
  },
]

const ADVANCE_DELAY = 1500
const SWAP_WINDOW = 450

type TriggerState = { highlight: number; selected: number }
type TriggerAction =
  | { type: "advance" }
  | { type: "commit" }
  | { type: "reset" }
  | { type: "highlight"; index: number }
  | { type: "select"; index: number }

function triggerReducer(state: TriggerState, action: TriggerAction): TriggerState {
  switch (action.type) {
    case "advance":
      return { ...state, highlight: (state.highlight % (triggerOptions.length - 1)) + 1 }
    case "commit":
      return { ...state, selected: state.highlight }
    case "reset":
      return { ...state, highlight: state.selected }
    case "highlight":
      return { ...state, highlight: action.index }
    case "select":
      return { highlight: action.index, selected: action.index }
  }
}

function useTriggerCycle(active: boolean) {
  const [state, dispatch] = useReducer(triggerReducer, { highlight: 2, selected: 6 })
  useEffect(() => {
    if (!active) return
    let swap = 0
    const advance = window.setInterval(() => {
      dispatch({ type: "advance" })
      window.clearTimeout(swap)
      swap = window.setTimeout(() => dispatch({ type: "commit" }), SWAP_WINDOW)
    }, ADVANCE_DELAY)
    return () => {
      window.clearInterval(advance)
      window.clearTimeout(swap)
    }
  }, [active])
  return [state, dispatch] as const
}

function Chevron() {
  return (
    <Icon className="text-(--mckp-ink-faint)">
      <path d="M4 6l4 4 4-4" />
    </Icon>
  )
}

function TriggerDemo() {
  const reduced = useReducedMotion()
  const { ref: introRef, phase, skeleton } = useCardIntro<HTMLDivElement>(1700, 900)
  const { ref: screenRef, visible: onScreen } = useReveal<HTMLDivElement>({ once: false, threshold: 0, rootMargin: "0px" })
  const tiltRef = useTilt<HTMLDivElement>({ max: 1, ease: 0.08 })
  const ref = useMergedRef<HTMLDivElement>(introRef, screenRef, tiltRef)
  const [pointerInside, setPointerInside] = useState(false)
  const [{ highlight, selected }, dispatch] = useTriggerCycle(
    onScreen && phase !== "pending" && !pointerInside && !reduced
  )

  const pending = phase === "pending"
  const run = phase === "run"
  const field = "relative flex items-center overflow-hidden whitespace-nowrap border-solid border-border"
  const fieldStyle: CSSProperties = {
    gap: u(3.931),
    height: u(31.45),
    padding: `0 ${u(7.863)}`,
    borderWidth: u(0.983),
    borderRadius: u(5.897),
  }
  const arrow = <path d="M6 5L3.6 8 6 11M3.6 8h10M2.2 4.9v6.2" />
  const fade = (deg: number) =>
    `linear-gradient(${deg}deg, transparent 40.455%, var(--mckp-surface-deep) 76.925%)`

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Trigger picker demo"
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => {
        setPointerInside(false)
        dispatch({ type: "reset" })
      }}
      className={cn("@container aspect-[700/448] w-full select-none", parallax)}
    >
      <div
        className="relative size-full text-(--ctd-ink) [--u:calc(100cqw/350)]"
        style={{ fontSize: u(11.79), lineHeight: u(15.725), perspective: u(600) }}
      >
        <div
          className={cn(
            "absolute flex flex-col transition-[opacity,translate] duration-[450ms,600ms] ease-[ease,cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
            pending && "opacity-0"
          )}
          style={{
            left: u(16.54),
            top: u(61.82),
            width: u(220.15),
            gap: u(7.863),
            translate: pending ? `${u(-8)} 0` : undefined,
            transform: "translate3d(calc(var(--mx,0) * 2.5 * var(--u)), calc(var(--my,0) * 2 * var(--u)), 0)",
          }}
        >
          <span>Trigger</span>
          <div className={field} style={fieldStyle}>
            <Skeleton on={skeleton} />
            {triggerOptions.map((option, index) => (
              <span
                key={index}
                aria-hidden={index !== selected || undefined}
                className={cn(
                  "absolute top-1/2 flex items-center transition-[opacity,transform] duration-[250ms,300ms] motion-reduce:transition-none",
                  index === selected ? "opacity-100" : "opacity-0"
                )}
                style={{
                  left: u(7.863),
                  right: u(27),
                  gap: u(3.931),
                  transform: index === selected ? "translateY(-50%)" : `translateY(calc(-50% + 4 * var(--u)))`,
                }}
              >
                {option.icon && <Icon>{option.icon}</Icon>}
                {option.fieldMuted && <span className="text-(--mckp-ink-faint)">{option.fieldMuted}</span>}
                <span>{option.label || option.muted}</span>
              </span>
            ))}
            <span className="ml-auto">
              <Chevron />
            </span>
          </div>
          <div className={field} style={fieldStyle}>
            <Skeleton on={skeleton} />
            <span className="flex-1">Horizontal</span>
            <Chevron />
          </div>
          <div className="flex" style={{ gap: u(7.863) }}>
            {[false, true].map((flip) => (
              <div key={String(flip)} className={cn(field, "flex-1")} style={fieldStyle}>
                <Skeleton on={skeleton} />
                <Icon className={cn("text-(--mckp-ink-faint)", flip && "-scale-x-100")}>{arrow}</Icon>
                <span className="flex-1">20</span>
                <small className="text-(--mckp-ink-faint)" style={{ fontSize: u(9.83) }}>
                  %
                </small>
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: u(16), top: u(19.88), width: u(95.556), height: u(220), background: fade(128.25) }}
        />

        <div
          role="listbox"
          aria-label="Trigger"
          className={cn(
            "absolute flex origin-top flex-col overflow-hidden border-solid border-(--ctd-glass) backdrop-blur-[11px]",
            "bg-[linear-gradient(var(--ctd-glass),transparent),color-mix(in_srgb,var(--mckp-surface)_80%,transparent)]",
            "transition-[opacity,scale] delay-[250ms] duration-[400ms,600ms] ease-[ease,cubic-bezier(.2,.9,.3,1.1)] motion-reduce:transition-none",
            pending && "scale-y-90 opacity-0"
          )}
          style={{
            left: u(111.37),
            top: u(7.66),
            width: u(222.62),
            height: u(246.82),
            padding: u(13.333),
            borderWidth: u(0.795),
            borderRadius: u(17.778),
            transform:
              "translate3d(calc(var(--mx,0) * 7 * var(--u)), calc(var(--my,0) * 5 * var(--u)), 0) rotateY(calc(var(--mx,0) * 4deg)) rotateX(calc(var(--my,0) * -4deg))",
            boxShadow:
              "calc((4 - var(--mx,0) * 3) * var(--u)) calc((8 - var(--my,0) * 3) * var(--u)) calc(18 * var(--u)) var(--ctd-shade)",
          }}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute bg-[color-mix(in_srgb,var(--background)_40%,transparent)] transition-[opacity,transform] duration-[400ms,350ms] ease-[ease,cubic-bezier(.3,.9,.3,1)] motion-reduce:transition-none",
              pending && "opacity-0"
            )}
            style={{
              left: u(13.333),
              top: u(13.333),
              width: u(198.53),
              height: u(31.45),
              borderRadius: u(5.897),
              transform: `translateY(calc(${highlight} * 31.45 * var(--u)))`,
              transitionDelay: run ? "1050ms, 0ms" : undefined,
            }}
          />
          {triggerOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              role="option"
              aria-selected={index === selected}
              onPointerEnter={() => dispatch({ type: "highlight", index })}
              onFocus={() => dispatch({ type: "highlight", index })}
              onClick={() => dispatch({ type: "select", index })}
              className={cn(
                "relative flex flex-none cursor-pointer items-center border-0 bg-transparent text-left whitespace-nowrap text-inherit [font:inherit]",
                "transition-[opacity,translate] duration-[350ms,450ms] ease-[ease,cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
                "focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring",
                pending && "opacity-0"
              )}
              style={{
                gap: u(3.931),
                width: u(198.53),
                height: u(31.45),
                padding: `0 ${u(7.863)}`,
                borderRadius: u(5.897),
                translate: pending ? `0 ${u(-4)}` : undefined,
                transitionDelay: run ? `${450 + index * 70}ms` : undefined,
              }}
            >
              {option.icon && <Icon>{option.icon}</Icon>}
              <span className="text-(--ctd-soft)">{option.muted}</span>
              {option.label && <span>{option.label}</span>}
            </button>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute after:absolute after:inset-x-0 after:top-[calc(100%_-_var(--u))] after:h-[calc(40*var(--u))] after:bg-(--mckp-surface-deep)"
          style={{ left: u(-144), top: u(-90), width: u(640), height: u(330), background: fade(164.14) }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Progressive card: a 7s cycle. Hold, then a 3s uneven load curve sweeps the
// full scene over the light one, hold the done check, fade back, repeat.
// ---------------------------------------------------------------------------

const HOLD = 700
const LOADING = 3000
const CYCLE = 7000
const RESET_AT = 6300

/** Fast start to 46 percent, a squeeze to 54 percent, then an ease-out to 100. */
function progressAt(ratio: number) {
  if (ratio < 0.35) return (ratio / 0.35) * 0.46
  if (ratio < 0.55) return 0.46 + ((ratio - 0.35) / 0.2) * 0.08
  return 0.54 + (1 - (1 - (ratio - 0.55) / 0.45) ** 2) * 0.46
}

/** Drives `--p`, `data-done`, `data-resetting` and the percent text without re-rendering. */
function useProgressCycle(active: boolean, reduced: boolean) {
  const [root, setRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!root) return
    const percent = root.querySelector<HTMLElement>("[data-pct]")
    const paint = (progress: number, done: boolean, resetting = false) => {
      root.style.setProperty("--p", progress.toFixed(4))
      root.toggleAttribute("data-done", done)
      root.toggleAttribute("data-resetting", resetting)
      if (percent) percent.textContent = `${Math.round(progress * 100)}%`
    }
    if (reduced) {
      paint(1, true)
      return
    }
    if (!active) return

    const startedAt = performance.now() + 300
    let frame = 0
    const tick = (now: number) => {
      const elapsed = now - startedAt
      const t = elapsed < 0 ? 0 : elapsed % CYCLE
      if (t < HOLD) paint(0, false)
      else if (t < HOLD + LOADING) paint(progressAt((t - HOLD) / LOADING), false)
      else paint(1, true, t >= RESET_AT)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [root, active, reduced])

  return setRoot
}

function ProgressiveDemo({ image }: { image: { src: string; alt: string } }) {
  const reduced = useReducedMotion()
  const { ref: introRef, phase } = useCardIntro<HTMLDivElement>(1200, 0)
  const { ref: screenRef, visible: onScreen } = useReveal<HTMLDivElement>({ once: false, threshold: 0, rootMargin: "0px" })
  const cycleRef = useProgressCycle(onScreen && phase !== "pending", reduced)
  const ref = useMergedRef<HTMLDivElement>(introRef, screenRef, cycleRef)
  const pending = phase === "pending"
  const edge = "calc(var(--p) * 140% - 20%)"

  return (
    <div ref={ref} role="img" aria-label={image.alt} className="group/prog @container size-full [--p:0]">
      <div
        className="relative size-full text-(--ctd-ink) [--u:calc(min(100cqw,556px)/600)]"
        style={{ fontSize: u(13), lineHeight: u(18), perspective: u(900) }}
      >
        <div
          className="absolute"
          style={{
            inset: u(-8),
            transform: "translate3d(calc(var(--mx,0) * 3 * var(--u)), calc(var(--my,0) * 2.5 * var(--u)), 0)",
          }}
        >
          <img
            src={image.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full scale-[1.02] object-cover [filter:grayscale(1)_contrast(.75)_brightness(.8)_blur(3px)]"
          />
          <img
            src={image.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-opacity duration-700 group-data-resetting/prog:opacity-0 motion-reduce:transition-none"
            style={{
              maskImage: `linear-gradient(115deg, var(--mckp-page-black) calc(${edge} - 12%), transparent calc(${edge} + 4%))`,
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[calc(1_-_var(--p)_*_var(--p))] mix-blend-screen group-data-done/prog:opacity-0"
            style={{
              background: `linear-gradient(115deg, transparent calc(${edge} - 10%), color-mix(in srgb, var(--foreground) 5%, transparent) calc(${edge} - 3%), transparent calc(${edge} + 3%))`,
            }}
          />
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "absolute flex items-center border-solid border-(--ctd-glass) bg-[color-mix(in_srgb,var(--mckp-surface-raised)_82%,transparent)] backdrop-blur-[12px]",
            "transition-[opacity,translate] delay-300 duration-[400ms,600ms] ease-[ease,cubic-bezier(.2,.9,.3,1.2)] motion-reduce:transition-none",
            "@max-[420px]:origin-top-left @max-[420px]:scale-160",
            pending && "opacity-0"
          )}
          style={{
            left: u(32),
            top: u(32),
            gap: u(8),
            minWidth: u(214),
            padding: `${u(9)} ${u(14)} ${u(9)} ${u(10)}`,
            borderWidth: u(1),
            borderRadius: u(12),
            translate: pending ? `0 ${u(-10)}` : undefined,
            transform:
              "translate3d(calc(var(--mx,0) * 8 * var(--u)), calc(var(--my,0) * 6 * var(--u)), 0) rotateY(calc(var(--mx,0) * 5deg)) rotateX(calc(var(--my,0) * -6deg))",
            boxShadow:
              "calc((4 - var(--mx,0) * 3) * var(--u)) calc((10 - var(--my,0) * 3) * var(--u)) calc(22 * var(--u)) color-mix(in srgb, var(--mckp-page-black) 40%, transparent)",
          }}
        >
          <span className="relative flex-none" style={{ width: u(20), height: u(20) }}>
            <svg
              viewBox="0 0 20 20"
              className="absolute inset-0 size-full -rotate-90 transition-[opacity,scale] duration-[300ms,400ms] ease-[ease,cubic-bezier(.3,1.5,.5,1)] group-data-done/prog:scale-60 group-data-done/prog:opacity-0 motion-reduce:transition-none"
            >
              <circle cx="10" cy="10" r="7.5" fill="none" strokeWidth="2" className="stroke-(--mckp-line-strong)" />
              <circle
                cx="10"
                cy="10"
                r="7.5"
                pathLength="100"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="100"
                className="stroke-(--ctd-ink) [stroke-dashoffset:calc(100_-_var(--p)_*_100)]"
              />
            </svg>
            <svg
              viewBox="0 0 20 20"
              className="absolute inset-0 size-full scale-40 opacity-0 transition-[opacity,scale] duration-[300ms,400ms] ease-[ease,cubic-bezier(.3,1.5,.5,1)] group-data-done/prog:scale-100 group-data-done/prog:opacity-100 motion-reduce:transition-none"
            >
              <path
                d="M5.5 10.4l3 3 6-6.6"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-(--mckp-code-green)"
              />
            </svg>
          </span>
          <span className="relative grid flex-1 whitespace-nowrap">
            <span className="col-start-1 row-start-1 transition-[opacity,translate] duration-300 group-data-done/prog:-translate-y-[calc(4*var(--u))] group-data-done/prog:opacity-0 motion-reduce:transition-none">
              Loading textures
            </span>
            <span className="col-start-1 row-start-1 -translate-y-[calc(4*var(--u))] opacity-0 transition-[opacity,translate] duration-300 group-data-done/prog:translate-y-0 group-data-done/prog:opacity-100 motion-reduce:transition-none">
              Full quality
            </span>
          </span>
          <span
            data-pct=""
            className="text-(--mckp-ink-faint) tabular-nums transition-opacity duration-300 group-data-done/prog:opacity-0 motion-reduce:transition-none"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

function CardText({ card }: { card: CodeTypingDemoCard }) {
  return (
    <div className={cn("relative z-1 max-w-[400px] flex-none", body)}>
      <p className="text-foreground">{card.title}</p>
      <p className="text-(--mckp-ink-dim)">{card.description}</p>
    </div>
  )
}

function useCardReveal(delay: number) {
  const { ref, visible, delayStyle } = useReveal<HTMLElement>({
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
    delay,
  })
  return { ref, visible, style: delayStyle() }
}

const cardShell =
  "relative flex flex-col gap-2.5 overflow-clip rounded-kit p-(--mckp-feature-pad) [@media(width<=768px)]:min-h-[400px]"

export function CodeTypingDemo({
  title = "Not just a video file.",
  titleDetail = "Run the scene live.",
  aside = "The same scene, running inside your own page",
  tag = "scene-player",
  attributes = defaultAttributes,
  triggers = defaultTriggers,
  scriptSrc = "https://cdn.example.com/scene-player.js",
  cards = defaultCards,
  image = defaultImage,
  className,
}: CodeTypingDemoProps) {
  const { ref: headRef, visible: headVisible, delayStyle: headDelay } = useReveal({
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
    stagger: 150,
  })
  const { ref: snippetRef, visible: snippetVisible, style: snippetStyle } = useCardReveal(0)
  const { ref: triggerRef, visible: triggerVisible, style: triggerStyle } = useCardReveal(100)
  const { ref: progRevealRef, visible: progVisible, style: progStyle } = useCardReveal(250)
  const progTiltRef = useTilt<HTMLElement>({ max: 1, ease: 0.08 })
  const progRef = useMergedRef<HTMLElement>(progRevealRef, progTiltRef)
  const headReveal =
    "translate-y-[50px] opacity-0 transition-[opacity,translate] duration-900 ease-kit delay-(--reveal-delay) group-data-visible/head:translate-y-0 group-data-visible/head:opacity-100 motion-reduce:transition-none"

  return (
    <section className={cn("pb-(--mckp-section-y-sm)", className)} style={tones}>
      <style href="mckp-shimmer" precedence="default">
        {shimmerKeyframes}
      </style>
      <style href="mckp-pop" precedence="default">
        {popKeyframes}
      </style>

      {title && (
        <div
          ref={headRef}
          data-visible={headVisible || undefined}
          className="group/head mx-auto grid max-w-kit grid-cols-9 px-gutter pt-(--mckp-section-y-lg) pb-(--mckp-section-y-sm) [@media(width<=1024px)]:grid-cols-1 [@media(width<=1024px)]:gap-6"
        >
          <h2
            style={headDelay(0)}
            className={cn(
              "col-[2/6] font-display text-[length:var(--mckp-type-h2)] leading-(--mckp-type-h2-line) font-normal tracking-(--mckp-type-h2-tracking) [@media(width<=1024px)]:col-[1]",
              headReveal
            )}
          >
            <span className="text-foreground">{title}</span>
            {titleDetail && (
              <>
                <br />
                <span className="text-(--mckp-ink-dim)">{titleDetail}</span>
              </>
            )}
          </h2>
          {aside && (
            <p
              style={headDelay(1)}
              className={cn(
                "col-[7/9] text-(--mckp-ink-dim) [@media(width<=1024px)]:col-[1] [@media(width<=1024px)]:max-w-[400px]",
                body,
                headReveal
              )}
            >
              {aside}
            </p>
          )}
        </div>
      )}

      <div className="mx-auto grid max-w-kit grid-cols-2 grid-rows-[548px_548px] gap-1 px-gutter [@media(width<=768px)]:grid-cols-1 [@media(width<=768px)]:grid-rows-none">
        <article
          ref={snippetRef}
          data-visible={snippetVisible || undefined}
          style={snippetStyle}
          className={cn(cardShell, "bg-(--mckp-surface-deep)", reveal)}
        >
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <SnippetDemo tag={tag} attributes={attributes} triggers={triggers} scriptSrc={scriptSrc} />
          </div>
          <CardText card={cards[0]} />
        </article>

        <article
          ref={triggerRef}
          data-visible={triggerVisible || undefined}
          style={triggerStyle}
          className={cn(cardShell, "bg-(--mckp-surface-deep)", reveal)}
        >
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <TriggerDemo />
          </div>
          <CardText card={cards[1]} />
        </article>

        <article
          ref={progRef}
          data-visible={progVisible || undefined}
          style={progStyle}
          className={cn(
            cardShell,
            "col-span-2 bg-(--mckp-page-black) [@media(width<=768px)]:col-span-1",
            parallax,
            reveal
          )}
        >
          <div className="absolute inset-0 overflow-hidden after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[36%] after:bg-[linear-gradient(transparent,color-mix(in_srgb,var(--mckp-page-black)_70%,transparent)_50%,var(--mckp-page-black)_90%)]">
            <ProgressiveDemo image={image} />
          </div>
          <div className="flex-1" />
          <CardText card={cards[2]} />
        </article>
      </div>
    </section>
  )
}
