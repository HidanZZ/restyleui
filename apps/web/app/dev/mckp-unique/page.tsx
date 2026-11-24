import type { Metadata } from "next"
import { CodeTypingDemo } from "@/registry/mckp/components/code-typing-demo"
import { LibraryPreview } from "@/registry/mckp/components/library-preview"

export const metadata: Metadata = {
  title: "mckp unique pieces (dev)",
  robots: { index: false },
}

export default function Page() {
  return (
    <div data-kit="mckp" className="min-h-svh">
      <LibraryPreview />
      <hr className="border-border" />
      <CodeTypingDemo />
    </div>
  )
}
