/** "Restyle UI" wordmark: one solid tile over its outlined twin, the same piece in two styles. */
export function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-foreground">
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true" focusable="false">
        <rect x="1.75" y="1.75" width="11" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="7" width="11.5" height="11.5" rx="2.75" fill="currentColor" />
      </svg>
      Restyle UI
    </span>
  )
}
