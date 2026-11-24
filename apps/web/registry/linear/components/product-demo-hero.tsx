"use client"

import type { CSSProperties, ReactNode } from "react"
import { MotionConfig, motion } from "motion/react"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import { cn } from "@/registry/restyle/lib/utils"

export type ProductDemoHeroScene = "inbox" | "issues" | "board" | "roadmap"

export type ProductDemoHeroProps = {
  /** Headline, one entry per desktop line. Lines wrap freely on mobile. */
  titleLines?: string[]
  description?: string
  /** Small link at the end of the description row. Pass null to hide it. */
  announcement?: { label: string; text: string; href: string } | null
  /** Workspace name in the demo sidebar. */
  workspace?: string
  /** Scene shown first in the demo window. */
  defaultScene?: ProductDemoHeroScene
  className?: string
}

/** Entrance curve of the source hero. */
const ENTRANCE = [0.22, 0.61, 0.36, 1] as const

type Tone = "green" | "yellow" | "red" | "blue" | "orange" | "teal" | "indigo"
const TONE: Record<Tone, string> = {
  green: "var(--linear-green)",
  yellow: "var(--linear-yellow)",
  red: "var(--linear-red)",
  blue: "var(--linear-blue)",
  orange: "var(--linear-orange)",
  teal: "var(--linear-teal)",
  indigo: "var(--linear-accent)",
}
const tone = (t: Tone) => ({ "--tone": TONE[t] }) as CSSProperties

type Status = "backlog" | "todo" | "progress" | "review" | "done"
type Label = { name: string; tone: Tone }
type Person = { name: string; tone: Tone }

const people: Record<string, Person> = {
  mara: { name: "Mara", tone: "indigo" },
  tomas: { name: "Tomas", tone: "teal" },
  ines: { name: "Ines", tone: "orange" },
  kofi: { name: "Kofi", tone: "green" },
  lena: { name: "Lena", tone: "blue" },
}
const labels: Record<string, Label> = {
  sync: { name: "Sync", tone: "yellow" },
  reliability: { name: "Reliability", tone: "indigo" },
  bug: { name: "Bug", tone: "red" },
  performance: { name: "Performance", tone: "green" },
  mobile: { name: "Mobile", tone: "blue" },
  design: { name: "Design", tone: "teal" },
  email: { name: "Email", tone: "orange" },
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function Icon({ children, size = 14, className }: { children: ReactNode; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
    >
      {children}
    </svg>
  )
}

const icons = {
  search: (
    <>
      <circle cx="7" cy="7" r="4.25" />
      <path d="m10.5 10.5 3 3" />
    </>
  ),
  compose: (
    <>
      <path d="M7 2.5H4.75A2.25 2.25 0 0 0 2.5 4.75v6.5a2.25 2.25 0 0 0 2.25 2.25h6.5a2.25 2.25 0 0 0 2.25-2.25V9" />
      <path d="m8 8 5.5-5.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M2 9.5 3.6 3.6A1.5 1.5 0 0 1 5 2.5h6a1.5 1.5 0 0 1 1.4 1.1L14 9.5v2.25a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 2 11.75Z" />
      <path d="M2 9.5h3l1 1.5h4l1-1.5h3" />
    </>
  ),
  issues: (
    <>
      <path d="M2 5V4a2 2 0 0 1 2-2h1M11 2h1a2 2 0 0 1 2 2v1M14 11v1a2 2 0 0 1-2 2h-1M5 14H4a2 2 0 0 1-2-2v-1" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  review: (
    <>
      <circle cx="4" cy="3.5" r="1.5" />
      <circle cx="12" cy="12.5" r="1.5" />
      <path d="M4 5v9M7.5 4.5H10a2 2 0 0 1 2 2V11" />
    </>
  ),
  board: (
    <>
      <rect x="2" y="2.5" width="12" height="11" rx="2.5" />
      <path d="M6.25 2.5v11M9.75 2.5v11" />
    </>
  ),
  roadmap: <path d="M2.5 4h6.5M5 8h8.5M3.5 12h5" />,
  cycle: <path d="M13.25 8a5.25 5.25 0 1 1-1.54-3.71M13.25 2.75v2.5h-2.5" />,
  more: (
    <>
      <circle cx="3.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  chevron: <path d="m5 6.5 3 3 3-3" />,
  filter: <path d="M3 4.5h10M5 8h6M7 11.5h2" />,
  sliders: (
    <>
      <path d="M2.5 5h3M8.5 5h5M2.5 11h6M11.5 11h2" />
      <circle cx="7" cy="5" r="1.5" />
      <circle cx="10" cy="11" r="1.5" />
    </>
  ),
  chart: <path d="M4 13V9M8 13V5M12 13V3" />,
  panel: (
    <>
      <rect x="2" y="2.5" width="12" height="11" rx="2.5" />
      <path d="M10 5.5v5" />
    </>
  ),
  plus: <path d="M8 3.5v9M3.5 8h9" />,
  bell: <path d="M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3zM6.5 14h3" />,
  link: <path d="M7 9a2.5 2.5 0 0 0 3.5 0l2-2A2.5 2.5 0 0 0 9 3.5l-.75.75M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5l.75-.75" />,
}

/** Disclosure caret, rotated to point down for open groups. */
function Caret() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" width={14} height={14} fill="currentColor">
      <path d="M7 10.6c-.33.2-.75-.04-.75-.43V5.8c0-.39.42-.63.75-.43l3.76 2.19c.33.2.33.67 0 .87Z" />
    </svg>
  )
}

/** Status ring with a pie for progress, in the source's 14px drawing. */
function StatusIcon({ status, size = 14 }: { status: Status; size?: number }) {
  const color = {
    backlog: "var(--linear-text-quaternary)",
    todo: "var(--muted-foreground)",
    progress: "var(--linear-yellow)",
    review: "var(--linear-green)",
    done: "var(--primary)",
  }[status]
  return (
    <svg aria-hidden viewBox="0 0 14 14" width={size} height={size} className="shrink-0">
      {status === "done" ? (
        <>
          <circle cx="7" cy="7" r="6.25" fill={color} />
          <path d="m4.5 7.2 1.7 1.7 3.3-3.6" fill="none" stroke="var(--background)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <rect x={1} y={1} width={12} height={12} rx={6} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray={status === "backlog" ? "1.4 1.4" : undefined} />
          {status === "progress" && <path fill={color} d="M3.5 3.5 3.5 0A3.5 3.5 0 0 1 3.5 7z" transform="translate(3.5 3.5)" />}
          {status === "review" && <path fill={color} d="M3.5 3.5 3.5 0A3.5 3.5 0 1 1 0 3.5z" transform="translate(3.5 3.5)" />}
        </>
      )}
    </svg>
  )
}

/** Three signal bars; `level` 0 draws the "no priority" dashes. */
function Priority({ level }: { level: 0 | 1 | 2 | 3 }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" width={16} height={16} fill="var(--muted-foreground)" className={cn("shrink-0", level === 0 ? "opacity-45" : "opacity-90")}>
      {level === 0
        ? [1.5, 6.5, 11.5].map((x) => <rect key={x} x={x} y={7.25} width={3} height={1.5} rx={0.5} />)
        : [
            [1.5, 8, 6],
            [6.5, 5, 9],
            [11.5, 2, 12],
          ].map(([x, y, h], i) => <rect key={x} x={x} y={y} width={3} height={h} rx={1} fillOpacity={i < level ? 1 : 0.4} />)}
    </svg>
  )
}

function Avatar({ person, size = 16 }: { person: Person; size?: number }) {
  return (
    <span
      aria-hidden
      style={{ ...tone(person.tone), width: size, height: size, fontSize: size * 0.5 }}
      className="grid shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--tone)_45%,var(--linear-bg-tertiary))] font-[590] leading-none text-foreground"
    >
      {person.name[0]}
    </span>
  )
}

function LabelChip({ label }: { label: Label }) {
  return (
    <span className="flex h-6 shrink-0 items-center gap-1 rounded-full border border-(--linear-line-primary) py-1 pr-2 pl-1.5 text-xs leading-[14px] font-[510] text-muted-foreground">
      <span style={tone(label.tone)} className="grid size-4 place-items-center">
        <span className="size-[9px] rounded-full bg-(--tone)" />
      </span>
      {label.name}
    </span>
  )
}

function PullChip({ number }: { number: number }) {
  return (
    <span className="flex h-6 shrink-0 items-center gap-1 rounded-full border border-(--linear-line-primary) py-1 pr-2 pl-1.5 text-xs leading-[14px] font-[510] text-muted-foreground">
      <Icon className="text-(--linear-green)">{icons.review}</Icon>#{number}
    </span>
  )
}

/** Staggered rise used by every scene when it mounts. */
function Rise({ index, className, children }: { index: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.04 + index * 0.025, ease: ENTRANCE }}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Shared scene chrome
// ---------------------------------------------------------------------------

function SceneHeader({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-(--linear-border-translucent) px-3 py-2">
      <div className="flex min-w-0 items-center gap-2 px-2.5 text-[13px] font-[510] text-foreground">{children}</div>
      {actions && <div className="flex items-center gap-1 text-(--linear-text-quaternary)">{actions}</div>}
    </header>
  )
}

function Pill({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-7 shrink-0 items-center rounded-full px-3 text-xs leading-[14px] font-[510] shadow-[inset_0_0_0_1px_var(--linear-border-translucent)]",
        active ? "bg-foreground/8 text-foreground" : "bg-foreground/2 text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

function PillIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid h-7 w-[30px] place-items-center rounded-full bg-foreground/2 text-muted-foreground shadow-[inset_0_0_0_1px_var(--linear-border-translucent)]">
      <Icon>{children}</Icon>
    </span>
  )
}

function ViewBar({ tabs }: { tabs: string[] }) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between px-3 py-2">
      <div className="flex items-center gap-1.5">
        {tabs.map((tab, i) => (
          <Pill key={tab} active={i === 0}>
            {tab}
          </Pill>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <PillIcon>{icons.filter}</PillIcon>
        <PillIcon>{icons.sliders}</PillIcon>
        <PillIcon>{icons.chart}</PillIcon>
        <PillIcon>{icons.panel}</PillIcon>
      </div>
    </div>
  )
}

const statusName: Record<Status, string> = {
  backlog: "Backlog",
  todo: "Todo",
  progress: "In Progress",
  review: "In Review",
  done: "Done",
}

// ---------------------------------------------------------------------------
// Scene: My issues
// ---------------------------------------------------------------------------

type Issue = {
  id: string
  title: string
  status: Status
  priority: 0 | 1 | 2 | 3
  labels: Label[]
  pr?: number
  who: Person
  date: string
}

const issues: Issue[] = [
  { id: "APP-412", title: "Cache workspace settings on first load", status: "review", priority: 2, labels: [labels.sync], pr: 1824, who: people.mara, date: "Mar 9" },
  { id: "APP-398", title: "Show an offline banner while reconnecting", status: "review", priority: 1, labels: [labels.reliability], pr: 1817, who: people.tomas, date: "Mar 9" },
  { id: "APP-377", title: "Keep draft state when the editor reloads", status: "review", priority: 0, labels: [labels.bug, labels.reliability], pr: 1809, who: people.kofi, date: "Mar 8" },
  { id: "APP-431", title: "Reduce list re-renders while scrolling", status: "progress", priority: 2, labels: [labels.performance], pr: 1830, who: people.lena, date: "Mar 6" },
  { id: "APP-426", title: "Retry uploads after a dropped connection", status: "progress", priority: 2, labels: [labels.mobile], who: people.ines, date: "Mar 4" },
  { id: "APP-419", title: "Batch notification emails by the hour", status: "progress", priority: 3, labels: [labels.email], who: people.mara, date: "Mar 7" },
  { id: "APP-415", title: "Prevent duplicate saves on slow networks", status: "progress", priority: 0, labels: [labels.bug], who: people.tomas, date: "Mar 5" },
  { id: "APP-440", title: "Add a shortcut for quick filters", status: "todo", priority: 1, labels: [labels.design], who: people.kofi, date: "Mar 10" },
  { id: "APP-438", title: "Remove unused export endpoints", status: "todo", priority: 1, labels: [labels.performance], who: people.lena, date: "Mar 11" },
  { id: "APP-436", title: "Write the release checklist for mobile", status: "todo", priority: 0, labels: [labels.mobile], who: people.ines, date: "Mar 12" },
]

function IssuesScene() {
  const groups: Status[] = ["review", "progress", "todo"]
  let index = 0
  return (
    <div className="flex h-full flex-col">
      <SceneHeader>My issues</SceneHeader>
      <ViewBar tabs={["Assigned", "Created", "Subscribed", "Activity"]} />
      <div className="flex min-h-0 flex-col pt-2">
        {groups.map((status) => {
          const rows = issues.filter((issue) => issue.status === status)
          return (
            <div key={status}>
              <Rise index={index++} className="mx-2 flex h-9 items-center gap-2 overflow-hidden rounded-kit bg-foreground/2 p-2">
                <span className="-mr-1 grid size-6 place-items-center text-(--linear-text-quaternary)">
                  <span className="rotate-90">
                    <Caret />
                  </span>
                </span>
                <StatusIcon status={status} />
                <span className="text-[13px] font-[510] text-foreground">{statusName[status]}</span>
                <span className="text-[13px] text-muted-foreground">{rows.length}</span>
              </Rise>
              {rows.map((issue) => (
                <Rise
                  key={issue.id}
                  index={index++}
                  className="group/row relative mx-2 flex h-10 items-center justify-between pr-7 pl-9"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-kit bg-foreground/3 opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 motion-reduce:transition-none" />
                  <span className="relative flex min-w-0 items-center gap-2">
                    <Priority level={issue.priority} />
                    <span className="w-[72px] shrink-0 text-[13px] text-muted-foreground">{issue.id}</span>
                    <span className="grid size-4 place-items-center">
                      <StatusIcon status={issue.status} />
                    </span>
                    <span className="truncate text-[13px] font-[510] text-foreground">{issue.title}</span>
                  </span>
                  <span className="relative flex items-center gap-2">
                    {issue.pr && <PullChip number={issue.pr} />}
                    {issue.labels.map((label) => (
                      <LabelChip key={label.name} label={label} />
                    ))}
                    <span className="grid size-6 place-items-center">
                      <Avatar person={issue.who} />
                    </span>
                    <span className="w-10 text-right text-xs text-muted-foreground">{issue.date}</span>
                  </span>
                </Rise>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Scene: Board
// ---------------------------------------------------------------------------

const boardColumns: { status: Status; cards: Issue[] }[] = [
  {
    status: "backlog",
    cards: [
      { id: "APP-452", title: "Explore saved views for teams", status: "backlog", priority: 0, labels: [labels.design], who: people.lena, date: "" },
      { id: "APP-449", title: "Audit color contrast in settings", status: "backlog", priority: 1, labels: [labels.design], who: people.kofi, date: "" },
    ],
  },
  { status: "todo", cards: issues.filter((issue) => issue.status === "todo") },
  { status: "progress", cards: issues.filter((issue) => issue.status === "progress").slice(0, 3) },
  { status: "review", cards: issues.filter((issue) => issue.status === "review") },
]

function BoardScene() {
  let index = 0
  return (
    <div className="flex h-full flex-col">
      <SceneHeader actions={<PillIcon>{icons.plus}</PillIcon>}>
        <span className="text-muted-foreground">Core app</span>
        <span className="text-(--linear-text-quaternary)">/</span>
        Board
      </SceneHeader>
      <ViewBar tabs={["All issues", "Active", "Backlog"]} />
      <div className="grid min-h-0 flex-1 grid-cols-4 gap-2 px-3 pt-1">
        {boardColumns.map((column) => (
          <div key={column.status} className="flex min-w-0 flex-col gap-2 rounded-[12px] bg-foreground/[0.015] p-1.5">
            <Rise index={index++} className="flex h-8 items-center gap-2 px-2">
              <StatusIcon status={column.status} />
              <span className="text-[13px] font-[510] text-foreground">{statusName[column.status]}</span>
              <span className="text-[13px] text-muted-foreground">{column.cards.length}</span>
              <span className="ml-auto text-(--linear-text-quaternary)">
                <Icon>{icons.plus}</Icon>
              </span>
            </Rise>
            {column.cards.map((card) => (
              <Rise
                key={card.id}
                index={index++}
                className="rounded-kit border border-(--linear-border-translucent) bg-(--linear-bg-level-2) p-3 shadow-(--linear-shadow-low) transition-colors duration-150 hover:border-(--linear-border-translucent-strong) motion-reduce:transition-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{card.id}</span>
                  <Avatar person={card.who} />
                </div>
                <p className="mt-1.5 flex items-start gap-2 text-[13px] leading-[18px] font-[510] text-foreground">
                  <span className="mt-0.5">
                    <StatusIcon status={card.status} />
                  </span>
                  {card.title}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="grid size-6 place-items-center rounded-kit-sm border border-(--linear-line-primary)">
                    <Priority level={card.priority} />
                  </span>
                  {card.labels.slice(0, 1).map((label) => (
                    <LabelChip key={label.name} label={label} />
                  ))}
                </div>
              </Rise>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Scene: Roadmap
// ---------------------------------------------------------------------------

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
const TODAY = 2.45
const projects: { name: string; lead: Person; tone: Tone; start: number; end: number; progress: number; status: Status }[] = [
  { name: "Design tokens", lead: people.kofi, tone: "green", start: 0.2, end: 2.3, progress: 100, status: "done" },
  { name: "Search revamp", lead: people.mara, tone: "indigo", start: 1.1, end: 3.6, progress: 82, status: "progress" },
  { name: "Offline mode", lead: people.tomas, tone: "blue", start: 2, end: 4.7, progress: 54, status: "progress" },
  { name: "Public API v3", lead: people.lena, tone: "yellow", start: 2.4, end: 5.6, progress: 31, status: "progress" },
  { name: "Billing settings", lead: people.ines, tone: "orange", start: 3.3, end: 5.2, progress: 12, status: "todo" },
  { name: "Mobile onboarding", lead: people.mara, tone: "teal", start: 4.2, end: 6.7, progress: 0, status: "backlog" },
]

function RoadmapScene() {
  const pct = (value: number) => `${(value / months.length) * 100}%`
  return (
    <div className="flex h-full flex-col">
      <SceneHeader actions={<PillIcon>{icons.sliders}</PillIcon>}>Roadmap</SceneHeader>
      <ViewBar tabs={["Timeline", "List", "Board"]} />
      <div className="grid min-h-0 flex-1 grid-cols-[248px_1fr] border-t border-(--linear-border-translucent)">
        <div className="border-r border-(--linear-border-translucent)">
          <div className="flex h-9 items-center border-b border-(--linear-border-translucent) px-4 text-xs text-muted-foreground">Projects</div>
          {projects.map((project, i) => (
            <Rise key={project.name} index={i} className="flex h-14 items-center gap-2.5 px-4">
              <StatusIcon status={project.status} />
              <span className="truncate text-[13px] font-[510] text-foreground">{project.name}</span>
              <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                {project.progress}%
                <Avatar person={project.lead} />
              </span>
            </Rise>
          ))}
        </div>
        <div className="relative overflow-hidden">
          <div className="grid h-9 grid-cols-7 border-b border-(--linear-border-translucent)">
            {months.map((month) => (
              <span key={month} className="flex items-center border-l border-(--linear-line-tertiary) px-2 text-xs text-muted-foreground first:border-l-0">
                {month}
              </span>
            ))}
          </div>
          <div aria-hidden className="absolute inset-x-0 top-9 bottom-0 grid grid-cols-7">
            {months.map((month) => (
              <span key={month} className="border-l border-(--linear-line-tertiary) first:border-l-0" />
            ))}
          </div>
          <div className="absolute top-9 bottom-0 w-px bg-primary" style={{ left: pct(TODAY) }}>
            <span className="absolute -top-1 -left-[3px] size-[7px] rounded-full bg-primary" />
          </div>
          {projects.map((project, i) => (
            <div key={project.name} className="relative h-14">
              <motion.div
                style={{ ...tone(project.tone), left: pct(project.start), width: pct(project.end - project.start) }}
                className="absolute top-1/2 flex h-7 -translate-y-1/2 origin-left items-center overflow-hidden rounded-kit-sm border border-[color-mix(in_srgb,var(--tone)_40%,transparent)] bg-[color-mix(in_srgb,var(--tone)_12%,transparent)]"
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.08 + i * 0.05, ease: ENTRANCE }}
              >
                <span className="absolute inset-y-0 left-0 bg-[color-mix(in_srgb,var(--tone)_18%,transparent)]" style={{ width: `${project.progress}%` }} />
                <span className="relative truncate px-2.5 text-xs font-[510] text-foreground">{project.name}</span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Scene: Inbox
// ---------------------------------------------------------------------------

const notifications: { who: Person; title: string; detail: string; time: string; status: Status }[] = [
  { who: people.ines, title: "APP-451 Export stalls on large files", detail: "Ines assigned you", time: "5m", status: "todo" },
  { who: people.tomas, title: "APP-398 Offline banner while reconnecting", detail: "Tomas requested review", time: "18m", status: "review" },
  { who: people.lena, title: "Search revamp", detail: "New project update", time: "2h", status: "progress" },
  { who: people.kofi, title: "APP-377 Keep draft state on reload", detail: "Kofi replied to a comment", time: "4h", status: "review" },
  { who: people.mara, title: "APP-412 Cache workspace settings", detail: "Mara moved this to In Review", time: "1d", status: "review" },
  { who: people.lena, title: "APP-402 Clean up empty states", detail: "Marked as done", time: "2d", status: "done" },
]

function InboxScene() {
  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      <div className="flex min-h-0 flex-col border-r border-(--linear-border-translucent)">
        <SceneHeader actions={<Icon>{icons.sliders}</Icon>}>Inbox</SceneHeader>
        <div className="flex flex-col gap-0.5 p-2">
          {notifications.map((item, i) => (
            <Rise
              key={item.title}
              index={i}
              className={cn("flex items-start gap-3 rounded-kit px-3 py-2.5", i === 0 ? "bg-foreground/4" : "hover:bg-foreground/2")}
            >
              <span className="relative mt-0.5">
                <Avatar person={item.who} size={28} />
                {i < 2 && <span className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-primary ring-2 ring-(--linear-bg-level-1)" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-[510] text-foreground">{item.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{item.detail}</span>
              </span>
              <span className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                <StatusIcon status={item.status} />
                {item.time}
              </span>
            </Rise>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-col">
        <SceneHeader
          actions={
            <>
              <Icon>{icons.bell}</Icon>
              <span className="w-2" />
              <Icon>{icons.link}</Icon>
            </>
          }
        >
          <StatusIcon status="todo" />
          <span className="text-muted-foreground">APP-451</span>
          Export stalls on large files
        </SceneHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 px-14 pt-12">
          <Rise index={0}>
            <h3 className="text-xl leading-[1.33] font-[590] tracking-[-0.012em] text-foreground">Export stalls on large files</h3>
            <p className="mt-2 max-w-[520px] text-[15px] leading-[1.6] text-muted-foreground">
              Exports over a few thousand rows stop at the last step and never finish. The progress bar stays at the end with no error shown.
            </p>
          </Rise>
          <Rise index={1} className="flex flex-wrap items-center gap-2">
            <LabelChip label={{ name: "Todo", tone: "blue" }} />
            <LabelChip label={labels.bug} />
            <LabelChip label={labels.performance} />
            <span className="flex h-6 items-center gap-1.5 rounded-full border border-(--linear-line-primary) pr-2 pl-1 text-xs font-[510] text-muted-foreground">
              <Avatar person={people.ines} />
              Ines
            </span>
          </Rise>
          <Rise index={2} className="flex flex-col gap-3">
            <span className="text-[15px] font-[590] text-foreground">Activity</span>
            {[
              ["Ines", "created the issue from a support thread", "1h ago"],
              ["Auto triage", "added the labels Bug and Performance", "1h ago"],
              ["Ines", "assigned the issue to you", "5m ago"],
            ].map(([who, what, when]) => (
              <span key={what} className="flex items-center gap-2 text-[13px] text-(--linear-text-quaternary)">
                <span className="size-1.5 rounded-full bg-(--linear-line-primary)" />
                <span>
                  <span className="font-[510] text-muted-foreground">{who}</span> {what} · {when}
                </span>
              </span>
            ))}
          </Rise>
          <Rise index={3} className="max-w-[560px] rounded-kit border border-(--linear-border-translucent) bg-foreground/2 p-4">
            <span className="flex items-center gap-2 text-[13px]">
              <Avatar person={people.tomas} />
              <span className="font-[510] text-foreground">Tomas</span>
              <span className="text-(--linear-text-quaternary)">12 min ago</span>
            </span>
            <p className="mt-2 text-[13px] leading-[1.5] text-(--linear-text-secondary)">
              Looks like the worker times out before the file is written. Splitting the job into chunks should fix it.
            </p>
          </Rise>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sidebar and frame
// ---------------------------------------------------------------------------

const scenes: { id: ProductDemoHeroScene; label: string; icon: ReactNode; Scene: () => ReactNode }[] = [
  { id: "inbox", label: "Inbox", icon: icons.inbox, Scene: InboxScene },
  { id: "issues", label: "My issues", icon: icons.issues, Scene: IssuesScene },
  { id: "board", label: "Board", icon: icons.board, Scene: BoardScene },
  { id: "roadmap", label: "Roadmap", icon: icons.roadmap, Scene: RoadmapScene },
]

const navItem = "flex h-7 w-full items-center gap-2 rounded-kit px-[7px] text-[13px] font-[510] text-(--linear-text-secondary)"

function SceneTab({ id, label, icon }: { id: ProductDemoHeroScene; label: string; icon: ReactNode }) {
  return (
    <TabsTab
      value={id}
      className={cn(
        navItem,
        "cursor-pointer text-left outline-none transition-colors duration-150 ease-kit hover:bg-foreground/2 focus-visible:ring-1 focus-visible:ring-ring data-selected:bg-foreground/4 motion-reduce:transition-none"
      )}
    >
      <Icon className="text-muted-foreground">{icon}</Icon>
      {label}
    </TabsTab>
  )
}

function StaticItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div aria-hidden className={navItem}>
      {icon}
      {label}
    </div>
  )
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden className="mt-4 flex items-center py-1 pl-1.5 text-xs leading-[14px] font-[510] text-(--linear-text-quaternary)">
      {children}
      <span className="rotate-90">
        <Caret />
      </span>
    </div>
  )
}

function Sidebar({ workspace }: { workspace: string }) {
  const find = (id: ProductDemoHeroScene) => scenes.find((scene) => scene.id === id)!
  return (
    <motion.div
      className="relative w-full pt-2 pr-4 pb-4 pl-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.45 }}
    >
      <span aria-hidden className="pointer-events-none absolute -top-2 -left-2 size-60 -translate-1/2 rounded-full bg-foreground/3 blur-[80px]" />
      <div aria-hidden className="flex items-center justify-between">
        <span className="flex h-7 items-center gap-1.5 rounded-kit px-1">
          <span className="grid size-5 place-items-center rounded-[2px] bg-(--linear-bg-level-2)">
            <svg viewBox="0 0 16 16" width={13} height={13} fill="var(--linear-text-secondary)">
              <circle cx="6" cy="8" r="4.5" fillOpacity={0.55} />
              <circle cx="10" cy="8" r="4.5" />
            </svg>
          </span>
          <span className="text-sm font-[590] tracking-[-0.013em] text-(--linear-text-secondary)">{workspace}</span>
          <Icon className="text-(--linear-text-quaternary)">{icons.chevron}</Icon>
        </span>
        <span className="flex gap-1.5">
          <span className="grid size-7 place-items-center rounded-full text-(--linear-text-quaternary)">
            <Icon>{icons.search}</Icon>
          </span>
          <span className="grid size-7 place-items-center rounded-full border border-(--linear-border-translucent-strong) bg-foreground/2 text-foreground">
            <Icon>{icons.compose}</Icon>
          </span>
        </span>
      </div>
      <TabsList aria-label="Demo views" className="mt-4 flex flex-col gap-0.5 opacity-80">
        <SceneTab {...find("inbox")} />
        <SceneTab {...find("issues")} />
        <StaticItem icon={<Icon className="text-muted-foreground">{icons.review}</Icon>} label="Reviews" />
        <GroupLabel>Workspace</GroupLabel>
        <SceneTab {...find("board")} />
        <SceneTab {...find("roadmap")} />
        <StaticItem icon={<Icon className="text-muted-foreground">{icons.cycle}</Icon>} label="Cycles" />
        <StaticItem icon={<Icon className="text-muted-foreground">{icons.more}</Icon>} label="More" />
        <GroupLabel>Favorites</GroupLabel>
        <StaticItem icon={<StatusIcon status="progress" />} label="Search revamp" />
        <StaticItem icon={<StatusIcon status="review" />} label="Offline mode" />
        <StaticItem icon={<Icon className="text-(--linear-accent)">{icons.chart}</Icon>} label="Team insights" />
        <StaticItem icon={<Icon className="text-(--linear-orange)">{icons.board}</Icon>} label="Billing settings" />
      </TabsList>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Line({ children, delay, className }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <motion.span
      // Padding keeps the blur from clipping; the negative margin cancels it in layout.
      className={cn("-m-[30px] inline-block p-[30px] text-balance [transform-box:content-box]", className)}
      initial={{ opacity: 0, filter: "blur(10px)", y: "26%" }}
      animate={{ opacity: 1, filter: "blur(0px)", y: "0%" }}
      transition={{ duration: 0.75, delay, ease: ENTRANCE }}
    >
      {children}
    </motion.span>
  )
}

export function ProductDemoHero({
  titleLines = ["A calmer way to plan", "and ship software together"],
  description = "Issues, boards and roadmaps in one fast workspace. Built for teams who like to move quickly.",
  announcement = { label: "New", text: "Release timelines", href: "#" },
  workspace = "Fieldnote",
  defaultScene = "issues",
  className,
}: ProductDemoHeroProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section className={cn("overflow-x-clip bg-background pt-[68px] font-body text-foreground md:pt-[52px] xl:pt-32", className)}>
        <div className="mx-auto w-full max-w-kit px-gutter">
          <div className="px-(--linear-homepage-padding-inset)">
            <h1 className="max-w-[360px] text-[38px] leading-[1.05] font-[510] tracking-[-0.022em] md:max-w-none md:text-[56px] xl:text-[64px] xl:leading-none">
              <span aria-hidden>
                {titleLines.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br className="max-md:hidden" />}
                    {i > 0 && " "}
                    <Line delay={0.05 + i * 0.09}>{line}</Line>
                  </span>
                ))}
              </span>
              <span className="sr-only">{titleLines.join(" ")}</span>
            </h1>
            <div className="mt-5 flex flex-col items-start gap-5 md:flex-row md:items-baseline md:justify-between xl:mt-8">
              <p className="text-[15px] leading-6 tracking-[-0.011em] text-muted-foreground">
                <Line delay={0.3} className="max-w-[336px] md:max-w-[438px] xl:max-w-none">
                  {description}
                </Line>
              </p>
              {announcement && (
                <motion.a
                  href={announcement.href}
                  className="flex shrink-0 items-center gap-3 rounded-kit-sm text-[15px] leading-6 tracking-[-0.011em] outline-none transition-[filter] duration-150 ease-kit hover:brightness-130 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.75, delay: 0.39, ease: ENTRANCE }}
                >
                  <span className="font-[510] text-(--linear-text-secondary)">{announcement.label}</span>
                  <span className="text-muted-foreground">{announcement.text} →</span>
                </motion.a>
              )}
            </div>
          </div>
        </div>

        <motion.div
          className="relative mt-9 w-full md:mt-[70px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative mx-auto flex h-[400px] w-full items-end pb-[30px] md:block md:h-auto md:max-lg:pb-7 lg:max-[1599px]:pb-12 min-[1600px]:pb-28">
            {/* Backdrop: canvas fading into a soft light at the bottom edge. */}
            <div
              aria-hidden
              className="absolute inset-0 mx-auto w-full max-w-[1896px] overflow-hidden bg-[radial-gradient(52.53%_57.5%_at_50%_100%,transparent_0%,color-mix(in_srgb,var(--background)_50%,transparent)_100%),linear-gradient(180deg,var(--background)_10%,var(--linear-text-secondary)_100%)] md:inset-x-3 md:w-auto md:rounded-kit-sm"
            >
              <span className="absolute inset-0 bg-(--linear-bg-marketing)/50 mask-t-from-60% md:bg-(--linear-bg-marketing)/40" />
            </div>

            <div className="relative mx-auto h-[360px] w-full max-w-[1440px] overflow-hidden px-[18px] md:h-auto md:max-lg:px-7 lg:max-[1439px]:px-8 min-[1440px]:px-[60px]">
              <Tabs
                defaultValue={defaultScene}
                orientation="vertical"
                aria-label="Product preview"
                className="relative grid h-[720px] w-[1320px] origin-top-left scale-50 grid-cols-[232px_1fr] overflow-hidden rounded-[12px] bg-(--linear-bg-level-0) p-2 select-none md:scale-100"
              >
                <div aria-hidden className="absolute inset-0 rounded-[inherit] border border-(--linear-border-translucent-strong) bg-(--linear-bg-level-1)" />
                <Sidebar workspace={workspace} />
                <div className="relative grid h-full min-w-0 overflow-hidden rounded-kit border border-(--linear-border-translucent) bg-foreground/[0.012] shadow-[0_0_0_2px_color-mix(in_srgb,var(--linear-bg-marketing)_20%,transparent)]">
                  <span aria-hidden className="pointer-events-none absolute top-0 left-0 size-[400px] -translate-1/2 rounded-full bg-[radial-gradient(50%_50%,color-mix(in_srgb,var(--foreground)_4%,transparent)_0%,transparent_90%)]" />
                  {scenes.map((scene) => (
                    <TabsPanel
                      key={scene.id}
                      value={scene.id}
                      className="relative min-h-0 min-w-0 outline-none transition-[opacity,translate,filter] duration-300 ease-(--linear-ease-entrance) [grid-area:1/1] data-ending-style:opacity-0 data-starting-style:translate-y-1.5 data-starting-style:opacity-0 data-starting-style:blur-[2px] motion-reduce:transition-none"
                    >
                      <scene.Scene />
                    </TabsPanel>
                  ))}
                </div>
              </Tabs>
              {/* Fade the clipped right edge below the full frame width. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-full bg-linear-to-r from-transparent from-70% to-background/80 md:w-[360px] md:from-0% min-[1440px]:hidden"
              />
            </div>
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  )
}
