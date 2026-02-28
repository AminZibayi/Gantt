# Contributing to Gantt

Thank you for your interest in contributing! All contributions — bug reports, feature requests, documentation improvements, and code changes — are welcome.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Commit Convention](#commit-convention)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please treat everyone with respect and professionalism.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Gantt.git
   cd Gantt
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create** a branch for your changes:
   ```bash
   git checkout -b feat/my-feature
   ```

## Development Setup

### Requirements

- Node.js ≥ 18
- npm ≥ 9

### Available Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run format`       | Format all files with Prettier   |
| `npm run format:check` | Check formatting without writing |
| `npm run lint:css`     | Lint LESS/CSS source files       |
| `npm run lint:css:fix` | Auto-fix LESS/CSS lint errors    |

### Pre-commit Hooks

Husky is configured to run `lint-staged` before every commit, automatically formatting staged files with Prettier.

## Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Commitlint enforces this on every commit.

### Commit Message Format

```
<type>(<scope>): <short summary>
```

**Types:**

| Type       | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `feat`     | A new feature                                                   |
| `fix`      | A bug fix                                                       |
| `docs`     | Documentation only changes                                      |
| `style`    | Changes that do not affect the meaning of the code (formatting) |
| `refactor` | A code change that neither fixes a bug nor adds a feature       |
| `perf`     | A code change that improves performance                         |
| `test`     | Adding missing tests or correcting existing tests               |
| `chore`    | Changes to the build process or auxiliary tools                 |
| `revert`   | Reverts a previous commit                                       |

**Examples:**

```
feat(gantt): add resource panel support
fix(css): correct timeline header alignment
docs: update contributing guide
chore: upgrade Tailwind to v4
```

## Submitting a Pull Request

1. Ensure your branch is up to date with `main`.
2. Run `npm run format:check` and `npm run lint:css` and fix any issues.
3. Commit your changes following the [Commit Convention](#commit-convention).
4. Push your branch and open a Pull Request on GitHub.
5. Fill in the Pull Request template and describe your changes clearly.
6. Wait for a maintainer review — we aim to respond within 48 hours.

## Reporting Bugs

Please open an issue using the **Bug Report** template and include:

- A clear, descriptive title.
- Steps to reproduce the problem.
- Expected vs. actual behavior.
- Browser, OS, and library version information.
- A minimal reproduction (CodeSandbox link is ideal).

## Requesting Features

Open an issue using the **Feature Request** template and describe:

- The problem you are trying to solve.
- Your proposed solution.
- Alternatives you have considered.
