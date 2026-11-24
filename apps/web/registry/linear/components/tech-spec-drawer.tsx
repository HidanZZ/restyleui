"use client"

import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer"
import { cn } from "@/registry/restyle/lib/utils"
import { useKitPortal } from "@/registry/restyle/hooks/use-kit-portal"

export type TechSpecRow = { label: string; value: string }

export type TechSpecBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  /** Blueprint-style placeholder drawing with a caption. */
  | { type: "figure"; caption: string }
  | { type: "table"; headers: [string, string]; rows: TechSpecRow[] }

export type TechSpec = {
  id: string
  /** Chip text. */
  label: string
  /** Drawer heading. */
  title: string
  blocks: TechSpecBlock[]
}

export type TechSpecDrawerProps = {
  /** Small label beside the chip grid. */
  label?: string
  /** Eyebrow in the drawer header. */
  eyebrow?: string
  specs?: TechSpec[]
  className?: string
}

const defaultSpecs: TechSpec[] = [
  {
    id: "intake",
    label: "Request intake",
    title: "Request intake",
    blocks: [
      {
        type: "paragraph",
        text: "Intake turns incoming requests into structured issues. Each request keeps its source, the people involved and the original thread, so nothing is lost on the way to the backlog.",
      },
      { type: "figure", caption: "Request form with routed fields" },
      { type: "heading", text: "Sources" },
      {
        type: "table",
        headers: ["Source", "Details"],
        rows: [
          { label: "Chat threads", value: "Mention the app in a thread to file it. The full conversation becomes the issue summary." },
          { label: "Email", value: "Each team gets a private address. Replies on the issue go back to the sender." },
          { label: "Web forms", value: "Shareable forms with required fields, templates and file uploads." },
          { label: "API", value: "Create requests from any internal tool with a scoped token." },
        ],
      },
    ],
  },
  {
    id: "automations",
    label: "Automations",
    title: "Automations",
    blocks: [
      {
        type: "paragraph",
        text: "Automations route new work and keep fields up to date. Rules run when an issue is created or changed, and every change they make shows in the activity log.",
      },
      { type: "heading", text: "Rules" },
      {
        type: "table",
        headers: ["Component", "Supported properties"],
        rows: [
          { label: "Triggers", value: "Created, Status changed, Label added, Due date reached, Comment added" },
          { label: "Filters", value: "Team, Priority, Labels, Assignee, Creator, Estimate, Project" },
          { label: "Actions", value: "Assign, Set status, Set priority, Add label, Move team, Notify channel" },
        ],
      },
      { type: "heading", text: "Limits" },
      { type: "paragraph", text: "Each workspace runs up to 200 rules. Rules run in order and stop after the first match when they are set to exclusive." },
    ],
  },
  {
    id: "roadmaps",
    label: "Roadmaps",
    title: "Roadmaps",
    blocks: [
      {
        type: "paragraph",
        text: "Roadmaps group projects on a shared timeline. Progress rolls up from the issues inside each project, so the plan stays current without manual updates.",
      },
      { type: "figure", caption: "Timeline view with grouped projects" },
      { type: "heading", text: "Views" },
      {
        type: "table",
        headers: ["View", "Details"],
        rows: [
          { label: "Timeline", value: "Drag projects to change dates. Dependencies draw as lines between bars." },
          { label: "List", value: "Sort and group by lead, status, health or target date." },
          { label: "Board", value: "Columns by status with progress on every card." },
        ],
      },
    ],
  },
  {
    id: "sync",
    label: "Offline sync",
    title: "Offline sync",
    blocks: [
      {
        type: "paragraph",
        text: "The app keeps a local copy of the workspace and syncs changes in the background. You can keep working on a plane or a poor connection, and edits merge when you are back online.",
      },
      { type: "heading", text: "Storage" },
      {
        type: "table",
        headers: ["Platform", "Details"],
        rows: [
          { label: "Desktop", value: "Full workspace cached locally, encrypted at rest." },
          { label: "Browser", value: "Recent teams and projects cached in the browser storage." },
          { label: "Mobile", value: "Assigned issues and inbox available offline." },
        ],
      },
    ],
  },
]

function Blueprint({ caption }: { caption: string }) {
  return (
    <figure className="my-8">
      <div
        aria-hidden
        className="relative h-56 overflow-hidden rounded-kit border border-(--linear-border-translucent-strong) bg-[linear-gradient(var(--linear-line-quaternary)_1px,transparent_1px),linear-gradient(90deg,var(--linear-line-quaternary)_1px,transparent_1px)] bg-size-[24px_24px] mask-b-from-75%"
      >
        <div className="absolute inset-x-10 top-10 -bottom-2 rounded-t-kit border border-(--linear-border-secondary) bg-(--linear-bg-level-1) p-4">
          <div className="h-2 w-24 rounded-full bg-(--linear-line-primary)" />
          <div className="mt-3 h-2 w-40 rounded-full bg-(--linear-line-secondary)" />
          <div className="mt-6 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 flex-1 rounded-kit-sm border border-(--linear-border-translucent-strong) p-2">
                <div className="h-1.5 w-1/2 rounded-full bg-(--linear-line-primary)" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] text-muted-foreground">{caption}</figcaption>
    </figure>
  )
}

function SpecBody({ blocks }: { blocks: TechSpecBlock[] }) {
  return (
    <div className="text-[15px] leading-6 tracking-[-0.011em] text-(--linear-text-secondary) [&>*+*]:mt-4 [&>*+h3]:mt-8">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") return <p key={i}>{block.text}</p>
        if (block.type === "heading")
          return (
            <h3 key={i} className="text-[17px] leading-[1.4] font-[590] tracking-[-0.012em] text-foreground">
              {block.text}
            </h3>
          )
        if (block.type === "figure") return <Blueprint key={i} caption={block.caption} />
        return (
          <dl key={i} className="text-[13px] leading-[1.5]">
            <div aria-hidden className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 border-b border-(--linear-border-translucent) pb-2 text-xs text-(--linear-text-quaternary)">
              <span>{block.headers[0]}</span>
              <span>{block.headers[1]}</span>
            </div>
            {block.rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 border-b border-(--linear-border-translucent) py-3"
              >
                <dt className="font-[510] text-foreground">{row.label}</dt>
                <dd className="text-muted-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        )
      })}
    </div>
  )
}

export function TechSpecDrawer({ label = "Features", eyebrow = "Tech specs", specs = defaultSpecs, className }: TechSpecDrawerProps) {
  const [kitRef, container] = useKitPortal<HTMLDivElement>()

  return (
    <div ref={kitRef} className={cn("mx-auto w-full max-w-kit px-gutter font-body", className)}>
      <Drawer side="right" container={container}>
        <div className="grid gap-4 px-(--linear-homepage-padding-inset) md:grid-cols-2 md:gap-0">
          <span className="text-[15px] leading-6 tracking-[-0.011em] text-(--linear-text-quaternary)">{label}</span>
          <ul className="grid grid-cols-2">
            {specs.map((spec, i) => (
              <li
                key={spec.id}
                className={cn(
                  "flex h-7 items-center",
                  i % 2 === 1 &&
                    "relative pl-6 before:absolute before:bottom-[-2px] before:left-0 before:h-7 before:w-px before:bg-(--linear-border-translucent-strong) md:pl-8"
                )}
              >
                <DrawerTrigger
                  payload={spec.id}
                  className="group/chip cursor-pointer rounded-kit-sm text-left text-[15px] leading-6 tracking-[-0.011em] text-muted-foreground outline-none transition-[filter,scale] duration-150 ease-kit hover:brightness-140 focus-visible:ring-2 focus-visible:ring-ring active:scale-97 motion-reduce:transition-none"
                >
                  {spec.label}
                  <span
                    aria-hidden
                    className="ml-1 text-lg leading-none text-(--linear-text-quaternary) transition-colors duration-150 ease-kit group-hover/chip:text-muted-foreground motion-reduce:transition-none"
                  >
                    +
                  </span>
                </DrawerTrigger>
              </li>
            ))}
          </ul>
        </div>

        <DrawerBackdrop className="fixed inset-0 bg-background/80" />
        <DrawerContent<string>
          className={cn(
            "m-2 flex h-[calc(100dvh-16px)] w-[calc(100vw-16px)] max-w-[640px] flex-col overflow-hidden md:m-6 md:h-[calc(100dvh-48px)] md:w-[calc(100vw-48px)]",
            "rounded-kit border border-(--linear-border-translucent) bg-popover font-body text-popover-foreground",
            "shadow-[0_0_32px_color-mix(in_srgb,var(--linear-bg-marketing)_40%,transparent),0_0_0_1px_var(--linear-bg-marketing)]"
          )}
        >
          {(state) => {
            const spec = specs.find((item) => item.id === state.payload) ?? specs[0]
            return (
              <>
                <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-(--linear-border-translucent) pr-3 pl-5 md:pl-8">
                  <span className="font-mono text-xs leading-[1.4] text-(--linear-text-quaternary) uppercase">{eyebrow}</span>
                  <DrawerClose
                    aria-label="Close"
                    className="grid size-10 cursor-pointer place-items-center rounded-kit text-(--linear-text-quaternary) outline-none transition-colors duration-150 ease-kit hover:text-(--linear-text-secondary) focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  >
                    <svg aria-hidden viewBox="0 0 20 20" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                      <path d="m5.5 5.5 9 9m0-9-9 9" />
                    </svg>
                  </DrawerClose>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-12 pb-8 md:px-8">
                  <DrawerTitle className="text-xl leading-[1.33] font-[590] tracking-[-0.012em] text-foreground">{spec?.title}</DrawerTitle>
                  <div className="mt-6">{spec && <SpecBody blocks={spec.blocks} />}</div>
                </div>
              </>
            )
          }}
        </DrawerContent>
      </Drawer>
    </div>
  )
}
