# Contributing

Thanks for your interest in improving this project.

1. **Fork** the repository and create a branch from `main`.
2. **Install**: `npm ci` (use Node 20; see `.nvmrc`).
3. **Configure**: copy `.env.example` to `.env.local` and add your Firebase web app keys.
4. **Check** before opening a PR: `npm run lint`, `npm run typecheck`, and `npm run build` (build works with placeholder `NEXT_PUBLIC_*` values for CI; use real keys locally for a full smoke test).
5. **Describe** your change clearly in the pull request.

Licensed under the MIT License — see [LICENSE](LICENSE).
