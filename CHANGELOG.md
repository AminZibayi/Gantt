# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-03-14

### Added

- Enterprise-grade monorepo structure with pnpm workspaces
- `packages/dhtmlxgantt` workspace package with typed declarations and locale files
- Tailwind CSS v4 integration with CSS-first `@theme` configuration
- Full bilingual support (Persian/English) with Jalali and Gregorian calendars
- Import engine supporting Excel (.xlsx) and CSV with auto-detection of Jalali dates
- Export engine for PDF, PNG, Excel, CSV, JSON, and YAML formats
- Dark and light theme support via `data-color-scheme` attribute
- RTL layout support for Persian language
- Interactive Gantt chart with drag-and-drop, progress tracking, and link management
- Settings panel with YAML configuration import/export
- Custom branding (company name, logo, colors)
- Print-ready layout with branding header
- ESLint, Prettier, and Stylelint configurations
- Vitest + React Testing Library test infrastructure
- Commitlint with Conventional Commits support
- Comprehensive documentation (README, CONTRIBUTING, SECURITY)

### Changed

- Decomposed GanttChart.tsx into ganttConfig, ganttEvents, and ganttLocale modules
- Moved document attribute side-effects into `useEffect` hooks
- Replaced hardcoded i18n strings with translation keys
- Removed unused imports (FiMaximize2, FiMinimize2)
- Set default company name to "Gantt" in branding config

### Removed

- Deleted upstream dhtmlxGantt files (whatsnew.md, README.md)
- Deleted unused persian-dhtmlxgantt-ref directory
- Removed duplicate JS builds (UMD, source copies)
- Removed dead `@persian-gantt` path alias
