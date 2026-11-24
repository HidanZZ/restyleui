import { docsMarkdown, docsMarkdownParams } from "@/lib/llms-content"

export function generateStaticParams() {
  return docsMarkdownParams()
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const markdown = await docsMarkdown(params.then((p) => p.slug))
  if (markdown === null) {
    return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } })
  }
  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
