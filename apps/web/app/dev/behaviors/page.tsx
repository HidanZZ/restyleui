import type { Metadata } from "next"
import { BehaviorsDemo } from "./demo"

export const metadata: Metadata = {
  title: "Behaviors (dev)",
  robots: { index: false },
}

export default function Page() {
  return <BehaviorsDemo />
}
