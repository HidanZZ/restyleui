import type { LogoStripProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { LogoRow } from "@/registry/teamwork/components/logo-row"
import { Reveal } from "@/registry/teamwork/components/reveal"

// The source's "Works with" band: a dotted cell on a faint 60px graph grid, label above a chip row.
export function LogoStrip({ title, logos, className }: LogoStripProps) {
  return (
    <section className={cn("relative w-full overflow-hidden bg-background py-20 font-body text-foreground sm:py-24", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--teamwork-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--teamwork-grid)_1px,transparent_1px)] bg-size-[60px_60px] bg-center opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <Reveal className="relative mx-auto w-full max-w-kit px-gutter">
        <div className="border border-dotted border-[color-mix(in_srgb,var(--input)_60%,transparent)] bg-background px-6 py-8 sm:px-12 sm:py-10">
          <LogoRow
            logos={logos}
            label={title}
            className="items-center text-center [&_p]:text-base [&_p]:leading-7 [&_p]:text-muted-foreground [&_ul]:justify-center"
          />
        </div>
      </Reveal>
    </section>
  )
}
