# Restyle UI

Design kits rebuilt from real websites. Install a kit's components into your React project, or let your agent compose them.

Website: [restyleui.dev](https://restyleui.dev) (not live yet). The v1 plan is in [docs/SCOPE.md](docs/SCOPE.md).

## Repository

| Path | Contents |
|---|---|
| `apps/web` | Next.js website. It also serves the registry from `public/r`. |
| `packages/behaviors` | Shared motion and interaction behaviors, built on `@ui-sdk/core` and `motion` |
| `registry.json` | shadcn registry manifest for all kits |
| `docs/` | Project documents |

## Development

Requires Node.js 20.9+ and pnpm 10.

```sh
pnpm install
pnpm dev             # website at http://localhost:3000
pnpm registry:build  # write registry JSON to apps/web/public/r
pnpm build           # registry, then website
pnpm lint
```

## License

[MIT](LICENSE) for the code in this repository. The original websites, brand names, fonts, and media belong to their owners.
