# Gantt Chart

<p align="center">
  <strong>Gantt Chart</strong>
</p>
<p align="center">
  Bilingual project scheduling — Jalali & Gregorian calendars, keyboard-first, offline-capable
</p>

<p align="center">
  <a href="https://aminzibayi.github.io/Gantt/">Live Demo</a>
</p>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev)
[![TypeScript 5.7](https://img.shields.io/badge/typescript-5.7-blue.svg)](https://www.typescriptlang.org)
[![Vite 6](https://img.shields.io/badge/vite-6-blue.svg)](https://vitejs.dev)
[![dhtmlxGantt 9.1](https://img.shields.io/badge/dhtmlxgantt-9.1-blue.svg)](https://dhtmlx.com/docs/products/dhtmlxGantt/)

## Table of Contents

- [What it is](#what-it-is)
- [Screenshots](#screenshots)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Configuration & data schema](#configuration--data-schema)
- [Keyboard reference](#keyboard-reference)
- [Architecture](#architecture)
- [Building for production](#building-for-production)
- [License](#license)
- [Contributing](#contributing)

---

## What it is

A React-based project-scheduling application.
It wraps **dhtmlxGantt** (JavaScript Gantt library, GPLv3) inside a purpose-built React+TypeScript shell that adds:

- Jalali (Shamsi) / Gregorian calendar switching
- Persian / English bilingual UI with automatic RTL/LTR
- Structured import (CSV, XLSX) and multi-format export (PDF, PNG, Excel, CSV, JSON, YAML)
- Branding layer for organization-specific appearance

Data never leaves the browser unless explicitly exported. All edits are persisted to `localStorage` automatically.

---

## Screenshots

| View            | Description                                  |
| --------------- | -------------------------------------------- |
| Light, grouped  | Default daily zoom with progress bars        |
| Dark, quarterly | Year-level planning with tasks collapsed     |
| Settings panel  | General / Branding / Data / Colors tabs      |
| Import dialog   | CSV or Excel with Jalali date auto-detection |
| Export dialog   | Choose format, page size and orientation     |

> Add screenshots under `/docs/screenshots/` and drop the path here.

---

## Key features

### Calendar & localisation

|           |                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| Calendars | Jalali (Shamsi) and its equivalent Gregorian dates (via `jalaali-js`)                                        |
| UI locale | Persian (`fa`) and English (`en`), detected from browser, persisted to `localStorage` (`gantt-app-settings`) |
| Direction | RTL when Persian is active; LTR when English is active                                                       |

### Import & export

- **Import** — CSV or XLSX. Column headers are fuzzy-matched (including Persian aliases: `نام فعالیت`, `شروع`, `پایان`, `پیشرفت`, …). Dates accept ISO, `yyyy/mm/dd`, `yyyy-mm-dd`, Excel serials, or bare numbers.
- **Export** — PDF (landscape/portrait, A4/A3/Letter, branding baked in), PNG (full-timeline render via `@zumer/snapdom`), Excel, CSV, JSON, YAML. All saved via `blob:` URLs; no server required.

### Editing & undo

- Command-pattern undo/redo (up to 100 levels) wrapping every data mutation.
- Bulk operations: delete selected tasks, multi-task indent/outdent, move up/down in level.
- Full-diff serialization — every undo-able action records `before` and `after` snapshots.

### Appearance

- 7 dhtmlxGantt skins (material, broadway, meadow, skyblue, terrace, contrast_black, contrast_white).
- 12 curated activity colours with matching text/progress colours.
- Light/dark overlay that coexists with any skin.
- Branding: company name, primary/secondary/accent colours (consumed by PDF export), logo image (base64 in `localStorage`).

### Data management

- Raw JSON or YAML live editor with CodeMirror highlighting and **real-time linting** (`js-yaml` parser in the linter). Tabs in Settings > Data.
- Import / export the raw project configuration as JSON or YAML; round-trip safe.
- Task model: `id`, `text`, `start_date`, `duration`, `progress`, `parent`, `open`, `color`, `textColor`, `progressColor`, `type`, `priority`, `description`. Extend as needed — the importer preserves unknown columns as generic task properties.

### Zoom & navigation

- Day, Week, Month, Quarter, Year time scales.
- "Today" button: pans and centers the timescale to the current date.
- Expand / Collapse all + per-node toggle via keyboard.

---

## Tech stack

| Layer      | Choice                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Runtime    | React 19, TypeScript 5.7                                                                       |
| Bundler    | Vite 6                                                                                         |
| Gantt core | dhtmlxGantt 9.1 (vendored at `codebase/dhtmlxgantt.es.js`)                                     |
| Import     | `papaparse` (CSV), `xlsx` (Excel)                                                              |
| Export     | `jsPDF`, `@zumer/snapdom`, `html2canvas`, `xlsx`                                               |
| i18n       | `i18next`, `react-i18next`, `i18next-browser-languagedetector`                                 |
| Calendars  | `jalaali-js`, `moment-jalaali`                                                                 |
| Editor     | CodeMirror 6 (`commands`, `lang-yaml`, `language`, `lint`, `state`, `view`, `lezer/highlight`) |
| Icons      | `react-icons`                                                                                  |

Aliased paths (`vite.config.ts`, `tsconfig.json`):

| Alias             | Maps to                             |
| ----------------- | ----------------------------------- |
| `@/`              | `src/`                              |
| `@gantt/`         | `codebase/`                         |
| `@persian-gantt/` | `persian-dhtmlxgantt-ref/codebase/` |

---

## Quick start

```bash
# install — node >= 18 (Vite 6 requires Node 18.17+ / 20+ recommended)
npm install

# dev server (Vite HMR on http://localhost:5173)
npm run dev

# type-check + production build → dist/
npm run build

# preview the production bundle locally
npm run preview
```

Default port: `5173`. Set `PORT=3000 npm run dev` to override.  
No `.env` file is required for the application itself; `localStorage` stores all runtime state.

---

## Configuration & data schema

The canonical data shape lives in `src/types/index.ts`.

```ts
interface GanttData {
  data: Array<{
    id: number | string;
    text: string;
    start_date: string; // "YYYY-MM-DD" for Gregorian
    end_date?: string;
    duration?: number;
    progress?: number; // 0–1
    parent?: number | string;
    open?: boolean;
    color?: string;
    textColor?: string;
    progressColor?: string;
    type?: string;
    readonly?: boolean;
    editable?: boolean;
    priority?: string;
    description?: string;
  }>;
  links: Array<{
    id: number | string;
    source: number | string;
    target: number | string;
    type: string;
  }>;
}
```

The default seed data is in `src/config/defaultData.ts`.  
Global keyboard bindings live in `src/App.tsx` (capture-phase `keydown` listener, cleaned up on unmount).  
State mutation is mediated by `src/hooks/useGanttData.ts` via the `Command` implementations in `src/lib/commands.ts`.

---

## Keyboard reference

| Shortcut                                  | Action                                                    |
| ----------------------------------------- | --------------------------------------------------------- |
| `↑` / `↓`                                 | Focus next / previous task row                            |
| `Space`                                   | Toggle selection on focused task                          |
| `Ctrl` / `Cmd` + click or `Shift` + click | Multi-select                                              |
| `Delete` / `Backspace`                    | Delete selected tasks and links                           |
| `Enter`                                   | Open task detail (Lightbox)                               |
| `Ctrl` + `Enter`                          | Create subtask under selected task                        |
| `Shift` + `→` / `Tab`                     | **Indent** — move selected task(s) under previous sibling |
| `Shift` + `←` / `Shift` + `Tab`           | **Outdent** — promote selected task(s) one level          |
| `Shift` + `↓`                             | Expand branch of focused task                             |
| `Shift` + `↑`                             | Collapse branch of focused task                           |
| `Ctrl` + `→`                              | Expand selected task                                      |
| `Ctrl` + `←`                              | Collapse selected task                                    |
| `Ctrl` + `Z`                              | Undo                                                      |
| `Ctrl` + `Y` or `Ctrl` + `Shift` + `Z`    | Redo                                                      |

---

## Architecture

```
src/
  App.tsx                    # root; wires hooks, registers global keydown
  components/
    Header/Header.tsx        # brand bar, gear (Settings), language toggle
    Toolbar/Toolbar.tsx      # all action buttons; controlled by App state
    GanttChart/GanttChart.tsx
 # dhtmlxGantt init; Jalali↔Gregorian label generators,
 # exports imperative API via ref, owns export engine
    ExportDialog/ExportDialog.tsx
    SettingsPanel/
      SettingsPanel.tsx      # 4 tab panel (General / Branding / Data / Colors)
      YamlEditor.tsx         # CodeMirror 6 YAML editor with live lint
  hooks/
    useGanttData.ts          # central data store + undo/redo history
    useSettings.ts           # UI prefs (theme, zoom, calendar, …)
    useBranding.ts           # companyName, colours, logo
    useLocalStorage.ts       # generic typed localStorage hook
  lib/
    commands.ts              # Command pattern: Add Task, Delete, Update, Indent, Outdent, …
    importEngine.ts          # CSV/XLSX → GanttData; Jalali date parsing; column alias map
    exportEngine.ts          # PDF/PNG/Excel/CSV/JSON/YAML writers
  i18n/
    locales/en.json          # English strings
    locales/fa.json          # Persian strings
  config/defaultData.ts      # seed project; activity colour palette
```

`codebase/` holds the vendored dhtmlxGantt build (`.es.js`, `.js`, `.css`, `.d.ts`) and `persian-dhtmlxgantt-ref/` is the reference Persian fork; they are **not** updated automatically — bump them with `npm update` and commit the build artefacts yourself if the upstream library changes.

---

## Building for production

```bash
npm run build
```

Output (`dist/`): static assets, no server required. Deploy to any static host — Nginx, Apache, S3 + CloudFront, GitHub Pages, Vercel, Netlify. The PDF and PNG renderers use `blob:` URLs only; there are no network calls at runtime beyond font loading from `fonts.googleapis.com`. Set an offline font strategy if air-gapped deployment is needed.

`typescript -b` (reaction to `tsconfig.app.json` + `tsconfig.json`) runs before Vite in the `build` script, so type errors surface in CI without starting the dev server.

**Linting / formatting / tests**: no script is currently defined. Add your preferred toolchain:

```bash
# examples — choose whatever fits your process
npx eslint src --ext ts,tsx
npx prettier --write src/
```

No database or backend is required or used by this application.

---

## License

Application code (everything under `src/`, `LICENSE`) — **MIT License** — Copyright (c) 2026 Amin Zibayi.

The vendored Gantt library in `codebase/` and `persian-dhtmlxgantt-ref/codebase/` is provided under the terms of the **GNU General Public License v2**. See the upstream [dhtmlxGantt license page](https://dhtmlx.com/docs/products/dhtmlxGantt/license.shtml) for details. Redistribution of the vendored library outside this project must comply with GPLv2; your own contributions to the app code remain MIT unless you agree otherwise.

---

## Contributing

1. Fork and create a feature branch.
2. Run `npm run build` and confirm the bundle passes locally.
3. Open a PR describing the change, the affected components, and any data-shape or i18n impact.
4. One approval required before merge; maintain sole release authority.

Issues welcome — use the template for bug reports (include browser, locale, zoom level, and reproduction steps).
