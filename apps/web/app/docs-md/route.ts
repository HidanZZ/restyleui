import { docsIntroduction } from "@/lib/llms-content"

export async function GET() {
  return new Response(await docsIntroduction(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
