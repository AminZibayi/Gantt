# Gantt

[![License: GPL v2](https://img.shields.io/badge/license-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
[![npm](https://img.shields.io/npm/v/@aminzibayi/gantt)](https://www.npmjs.com/package/@aminzibayi/gantt)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A powerful, enterprise-grade JavaScript Gantt chart library for visualizing and managing project schedules in the browser.

![Gantt chart demo](https://github.com/plazarev/media/blob/master/opensource-gantt-javascript.png)

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Demo](#demo)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Development](#development)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Features

- **Task linking** — finish-to-start, start-to-start, finish-to-finish, start-to-finish
- **Drag and drop** — move, resize, and update progress with the mouse
- **Multi-task selection** — select and move multiple tasks simultaneously
- **Smart rendering** — handles thousands of tasks with minimal DOM updates
- **Inline editing** — edit task fields directly in the grid
- **Keyboard navigation** — full keyboard support and accessibility
- **Tooltips** — configurable tooltips for tasks and links
- **Undo / Redo** — built-in history management
- **Configurable columns** — add, remove, and reorder grid columns
- **Customizable time scale** — day, week, month, quarter, and year scales
- **7 built-in skins** — including Material Design
- **32 locales** — internationalization out of the box
- **Export** — PDF, PNG, Excel, iCal, and MS Project
- **Cross-browser** — works in all modern browsers

---

## Getting Started

### CDN

```html
<script src="codebase/dhtmlxgantt.js"></script>
<link rel="stylesheet" href="codebase/dhtmlxgantt.css" />
```

### npm

```bash
npm install @aminzibayi/gantt
```

```js
import "/@aminzibayi/gantt/codebase/dhtmlxgantt.css";
import gantt from "@aminzibayi/gantt";
```

---

## Demo

Open `demo/index.html` in your browser for a working example with a Tailwind CSS UI wrapper:

```bash
open demo/index.html
```

---

## Usage

Add the container element to your HTML:

```html
<div id="gantt_here" style="width: 100%; height: 100vh;"></div>
```

Initialize and load data:

```js
gantt.config.date_format = "%Y-%m-%d %H:%i";
gantt.init("gantt_here");

gantt.parse({
  data: [
    {
      id: 1,
      text: "Project #1",
      start_date: null,
      duration: null,
      parent: 0,
      progress: 0,
      open: true,
    },
    { id: 2, text: "Task #1", start_date: "2024-01-01 00:00", duration: 5, parent: 1, progress: 1 },
    {
      id: 3,
      text: "Task #2",
      start_date: "2024-01-06 00:00",
      duration: 7,
      parent: 1,
      progress: 0.5,
    },
  ],
  links: [{ id: 1, source: 2, target: 3, type: "0" }],
});
```

### Framework integrations

- [Vue.js guide](https://dhtmlx.com/blog/use-dhtmlxgantt-vue-js-framework-demo/)
- [Angular guide](https://dhtmlx.com/blog/dhtmlx-gantt-chart-usage-angularjs-2-framework/)
- [React guide](https://dhtmlx.com/blog/create-react-gantt-chart-component-dhtmlxgantt/)
- [Node.js guide](https://docs.dhtmlx.com/gantt/desktop__howtostart_nodejs.html)

---

## API Overview

| Method                  | Description                               |
| ----------------------- | ----------------------------------------- |
| `gantt.init(container)` | Initialize the chart inside a DOM element |
| `gantt.parse(data)`     | Load tasks and links                      |
| `gantt.addTask(task)`   | Add a new task                            |
| `gantt.updateTask(id)`  | Refresh a task's display                  |
| `gantt.deleteTask(id)`  | Remove a task                             |
| `gantt.getTask(id)`     | Get a task object by id                   |
| `gantt.addLink(link)`   | Add a dependency link                     |
| `gantt.deleteLink(id)`  | Remove a dependency link                  |
| `gantt.serialize()`     | Export data as a plain object             |
| `gantt.clearAll()`      | Clear all tasks and links                 |

Full API reference: [https://docs.dhtmlx.com/gantt/](https://docs.dhtmlx.com/gantt/)

---

## Development

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
git clone https://github.com/AminZibayi/Gantt.git
cd Gantt
npm install
```

### Scripts

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm run format`       | Format all files with Prettier |
| `npm run format:check` | Check formatting (CI)          |
| `npm run lint:css`     | Lint LESS source files         |
| `npm run lint:css:fix` | Auto-fix LESS lint errors      |

### CSS / Skins

The skin sources live in `codebase/sources/less/`. To rebuild a skin:

```bash
cd codebase/sources/less
npm install
npm run build
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## Security

If you discover a security vulnerability, please follow the process described in [SECURITY.md](SECURITY.md) rather than opening a public issue.

---

## License

This project is licensed under the [GNU General Public License v2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html).
