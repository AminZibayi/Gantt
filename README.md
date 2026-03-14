# Gantt | نمودار گانت

A production-ready, bilingual (Persian / English) Gantt chart application with full Jalali calendar support.

## Features

- 📊 Interactive Gantt chart powered by dhtmlxGantt
- 🗓️ Jalali (Shamsi) & Gregorian calendar support
- 🌐 Full RTL / LTR support (Persian & English)
- 🌗 Dark & Light theme
- 📥 Import from Excel (.xlsx) and CSV
- 📤 Export to PDF, PNG, Excel, CSV, JSON, YAML
- ⚙️ Configurable settings panel with YAML config
- 🏢 Custom branding (logo & company name)
- 🖨️ Print-ready layout

## Tech Stack

| Layer        | Technology                           |
| ------------ | ------------------------------------ |
| Framework    | React 19 + TypeScript                |
| Build        | Vite                                 |
| Styling      | Tailwind CSS v4                      |
| Gantt Engine | dhtmlxGantt (GPL, workspace package) |
| Calendar     | jalaali-js                           |
| i18n         | react-i18next                        |
| Testing      | Vitest + React Testing Library       |
| Lint         | ESLint + Prettier + Stylelint        |
| Monorepo     | pnpm workspaces                      |

## Quick Start

```bash
# Prerequisites: Node.js >= 20, pnpm >= 9
pnpm install
pnpm dev
```

## Scripts

| Script           | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start dev server         |
| `pnpm build`     | Production build         |
| `pnpm preview`   | Preview production build |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm lint`      | Run ESLint               |
| `pnpm lint:fix`  | Fix ESLint errors        |
| `pnpm format`    | Format with Prettier     |
| `pnpm test`      | Run tests                |

## Architecture

```
.
├── packages/
│   └── dhtmlxgantt/          # Workspace package wrapping dhtmlxGantt
│       ├── dist/             # Pre-built ES module + CSS
│       ├── locales/          # fa.ts, en.ts locale data
│       └── index.d.ts        # TypeScript declarations
├── src/
│   ├── components/           # React components
│   │   ├── GanttChart/       # Core chart (config, events, locale modules)
│   │   ├── Header/
│   │   ├── Toolbar/
│   │   ├── ImportDialog/
│   │   ├── ExportDialog/
│   │   └── SettingsPanel/
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # importEngine, exportEngine
│   ├── i18n/                 # Internationalization (en.json, fa.json)
│   ├── styles/               # Tailwind CSS + gantt overrides
│   ├── config/               # Default data & constants
│   └── types/                # TypeScript type definitions
├── public/
│   └── fixtures/             # Sample import files
├── pnpm-workspace.yaml
└── vite.config.ts
```

## License

This project's application code is proprietary. The dhtmlxGantt library is licensed under GPL-2.0.
