/**
 * Reads prop tables from `registry/restyle/lib/contract.ts` at build time, so the
 * docs always match the contract. Server only.
 */
import fs from "node:fs"
import path from "node:path"

export type PropDoc = {
  name: string
  type: string
  required: boolean
  description?: string
}

const CONTRACT_PATH = path.join(process.cwd(), "registry/restyle/lib/contract.ts")

type ParsedType = { base?: string; props: PropDoc[] }

function parseBody(body: string): PropDoc[] {
  const props: PropDoc[] = []
  let comment: string | undefined
  let current: PropDoc | null = null
  let depth = 0

  for (const raw of body.split("\n")) {
    const line = raw.trim()
    if (!line) continue

    if (current && depth > 0) {
      current.type += ` ${line}`
    } else if (line.startsWith("/**") || line.startsWith("*")) {
      // Doc comment line: "/** text */", "/**", "* text" or "*/".
      const text = line.replace(/^\/\*\*|^\*\/?|\*\/$/g, "").trim()
      if (line.startsWith("/**")) comment = text || undefined
      else if (text) comment = `${comment ?? ""} ${text}`.trim()
      continue
    } else {
      const match = /^(\w+)(\?)?:\s*(.*)$/.exec(line)
      if (match) {
        current = { name: match[1], required: !match[2], type: match[3], description: comment }
        props.push(current)
        comment = undefined
      }
    }

    for (const char of line) {
      if (char === "{" || char === "(" || char === "[") depth++
      if (char === "}" || char === ")" || char === "]") depth--
    }
  }

  for (const prop of props) prop.type = prop.type.replace(/\s+/g, " ").replace(/;\s*}/g, " }").replace(/;$/, "").trim()
  return props
}

function parseContract(): Map<string, ParsedType> {
  const source = fs.readFileSync(CONTRACT_PATH, "utf8")
  const types = new Map<string, ParsedType>()
  const header = /export type (\w+) = (?:(\w+) & )?\{/g
  let match: RegExpExecArray | null

  while ((match = header.exec(source))) {
    let depth = 1
    let index = header.lastIndex
    while (index < source.length && depth > 0) {
      if (source[index] === "{") depth++
      if (source[index] === "}") depth--
      index++
    }
    types.set(match[1], { base: match[2], props: parseBody(source.slice(header.lastIndex, index - 1)) })
  }
  return types
}

/** Props of a contract type, for example `getProps("ButtonProps")`. Includes props of an intersected base type. */
export function getProps(typeName: string): PropDoc[] {
  const types = parseContract()
  const resolve = (name: string): PropDoc[] => {
    const parsed = types.get(name)
    if (!parsed) return []
    return [...(parsed.base ? resolve(parsed.base) : []), ...parsed.props]
  }
  return resolve(typeName)
}
