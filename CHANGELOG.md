# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-28

### Added

- Initial release of the Gantt chart library under the `@aminzibayi/gantt` package name.
- Tailwind CSS v4 integration with a demo page (`demo/index.html`).
- Prettier configuration for consistent code formatting.
- Stylelint configuration for LESS/CSS source linting.
- Commitlint with Conventional Commits convention.
- Husky git hooks: `pre-commit` (lint-staged) and `commit-msg` (commitlint).
- `CONTRIBUTING.md` guide for contributors.
- `SECURITY.md` vulnerability disclosure policy.
- `CHANGELOG.md` (this file).

### Changed

- Rebranded package from `dhtmlx-gantt` to `@aminzibayi/gantt`.
- Updated `package.json` metadata (name, author, repository, homepage).
- Replaced DHTMLX-centric `README.md` with a project-focused README.

### Removed

- `whatsnew.md` (DHTMLX-specific release notes replaced by this changelog).
