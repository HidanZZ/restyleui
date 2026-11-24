import type { FooterSectionProps } from "@/registry/restyle/lib/contract"
import { cn } from "@/registry/restyle/lib/utils"
import { Footer } from "@/registry/teamwork/components/footer"
import { Input } from "@/registry/teamwork/components/input"

// The source's sunken footer, with the newsletter as its own band above the link grid.
export function FooterSection({ newsletter, className, ...footer }: FooterSectionProps) {
  return (
    <div className={cn("w-full bg-(--teamwork-surface-sunken) font-body", className)}>
      {newsletter && (
        <div className="border-t border-dashed border-[color-mix(in_srgb,var(--input)_45%,transparent)]">
          <div className="mx-auto flex max-w-[calc(var(--kit-container)+6rem)] flex-col gap-6 px-8 py-12 md:px-12 md:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <h2 className="max-w-[22ch] font-display text-xl leading-[30px] tracking-[0.5px] text-foreground sm:text-(length:--teamwork-text-title) sm:leading-(--teamwork-leading-title)">
              {newsletter.title}
            </h2>
            <Input {...newsletter.input} className={cn("lg:w-[440px] lg:max-w-none", newsletter.input.className)} />
          </div>
        </div>
      )}
      <Footer {...footer} />
    </div>
  )
}
