import type { CtaProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Button } from "@/registry/teamwork/components/button"
import { Input } from "@/registry/teamwork/components/input"
import { Reveal } from "@/registry/teamwork/components/reveal"

const arrow = (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.44 7.25 8.72 3.53l1.06-1.06 5 5a.75.75 0 0 1 0 1.06l-5 5-1.06-1.06 3.72-3.72H1v-1.5z" />
  </svg>
)

// Connectors of the side diagram, drawn one after another when it enters view.
const LINKS = ["M60 60H180", "M180 60V120", "M120 180H180V120", "M240 180V120H180", "M60 60V180H120"]
const NODES = [
  { cx: 60, cy: 60, tone: "stroke-(--teamwork-yellow)" },
  { cx: 180, cy: 60, tone: "stroke-(--teamwork-blue-strong)" },
  { cx: 120, cy: 180, tone: "stroke-(--teamwork-lilac)" },
  { cx: 240, cy: 180, tone: "stroke-(--teamwork-green)" },
]

// The source's benchmark band: hand-drawn marks at the edges, a two-line heading,
// reading copy and one outlined action, closed by a dashed rule.
export function Cta({ title, description, actions, input, className }: CtaProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden border-b border-dashed border-[color-mix(in_srgb,var(--input)_55%,transparent)] bg-background py-section font-body text-foreground max-sm:py-24",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg viewBox="0 0 120 50" fill="none" className="absolute top-10 left-[max(-14px,calc(50%-750px))] w-[120px] text-(--teamwork-yellow) max-md:top-4 max-md:-left-5">
          <path d="M2 30c20-22 44 10 66-6 16-12 4-26-8-12-12 14 4 34 30 24 10-4 18-12 26-20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 100 40" fill="none" className="absolute top-11 right-[max(70px,calc(50%-750px))] w-[96px] text-(--teamwork-blue) max-md:top-auto max-md:-right-4 max-md:bottom-14">
          <path d="M2 28c10-10 22-14 34-8 10 5 18 6 26-6 6-9-4-14-10-6-7 10 2 24 20 20 10-2 18-8 24-14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 24 28" fill="none" className="absolute top-[300px] left-[max(-44px,calc(50%-780px))] w-6 text-(--teamwork-blue) max-md:hidden">
          <path d="M12 2v24M2 8l20 12M2 20 22 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 24 28" fill="none" className="absolute top-[220px] right-[max(-22px,calc(50%-796px))] w-5 text-(--teamwork-yellow) max-md:hidden">
          <path d="M12 2v24M2 8l20 12M2 20 22 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 20 20" fill="none" className="absolute bottom-16 left-[max(46px,calc(50%-690px))] w-4 text-(--teamwork-green) max-md:bottom-5 max-md:left-9">
          <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative mx-auto grid w-full max-w-kit items-center gap-16 px-gutter lg:grid-cols-[minmax(0,1fr)_auto] lg:px-[calc(var(--kit-gutter)+48px)] xl:gap-32">
        <Reveal stagger className="flex max-w-[700px] flex-col gap-6">
          <h2 className="max-w-[30ch] font-display text-2xl leading-[1.5] font-normal tracking-[0.5px] text-balance text-foreground sm:text-(length:--teamwork-text-display)">
            {title}
          </h2>
          {description && (
            <p className="text-sm leading-5 text-(--teamwork-text-subtle) sm:text-(length:--teamwork-text-body) sm:leading-(--teamwork-leading-body)">
              {description}
            </p>
          )}
          {input && <Input {...input} />}
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  href={action.href}
                  size="lg"
                  variant={action.variant === "secondary" ? "ghost" : "secondary"}
                  icon={action.variant === "secondary" ? undefined : arrow}
                  className={action.variant === "secondary" ? "text-muted-foreground" : "gap-4 text-foreground"}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={200} className="group/diagram hidden lg:block">
          <svg aria-hidden viewBox="0 0 300 240" fill="none" className="w-[300px]">
            <path
              d="M0 60H300M0 120H300M0 180H300M60 0V240M120 0V240M180 0V240M240 0V240"
              strokeDasharray="1 3"
              className="stroke-[color-mix(in_srgb,var(--input)_45%,transparent)]"
            />
            {LINKS.map((d, i) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                strokeDasharray="1"
                strokeWidth="1.5"
                style={{ transitionDelay: `${300 + i * 180}ms` }}
                className="stroke-(--teamwork-blue) [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-800 ease-kit-in-out group-data-visible/diagram:[stroke-dashoffset:0] motion-reduce:transition-none"
              />
            ))}
            <rect x="160" y="100" width="40" height="40" rx="6" className="fill-card stroke-border" />
            <path d="M172 112l16 16M172 128l8-8" strokeWidth="1.5" className="stroke-(--teamwork-text-subtle)" />
            {NODES.map((node, i) => (
              <circle
                key={i}
                cx={node.cx}
                cy={node.cy}
                r="7"
                strokeWidth="3"
                style={{ transformOrigin: `${node.cx}px ${node.cy}px`, transitionDelay: `${150 + i * 120}ms` }}
                className={cn(
                  "fill-background scale-0 transition-[scale] duration-300 ease-[cubic-bezier(0.34,1.8,0.64,1)] group-data-visible/diagram:scale-100 motion-reduce:transition-none",
                  node.tone
                )}
              />
            ))}
          </svg>
        </Reveal>
      </div>
    </section>
  )
}
