# Contributing

Thank you for considering contributing to this project!

## Prerequisites

- Node.js >= 20
- pnpm >= 9

## Local Setup

```bash
git clone <repo-url>
cd Gantt
pnpm install
pnpm dev
```

## Branch Naming

- `feat/` — new features
- `fix/` — bug fixes
- `chore/` — maintenance, tooling, dependencies

## Commit Messages

This project enforces [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add export to YAML
fix: correct RTL layout for Jalali calendar
chore: update ESLint config
```

## PR Checklist

Before submitting a pull request, ensure:

- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm lint` passes with zero violations
- [ ] `pnpm test` passes with all tests green
- [ ] `pnpm build` produces a clean production bundle
- [ ] New features include appropriate tests
- [ ] Documentation is updated if needed

## Code Review

- All PRs require at least one review before merging
- Reviewers should check for correctness, readability, and adherence to conventions
- Use constructive feedback and suggest improvements
