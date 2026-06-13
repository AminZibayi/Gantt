# dhtmlxGantt

[![dhtmlx.com](https://img.shields.io/badge/made%20by-DHTMLX-blue)](https://dhtmlx.com/)
[![npm: v.9.1.1](https://img.shields.io/badge/npm-v.9.1.1-blue.svg)](https://www.npmjs.com/package/dhtmlx-gantt)
[![License: GPL v2](https://img.shields.io/badge/license-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

[Getting started](#getting-started) | [Features](#features) | [License](#license) | [Useful links](#links) | [Follow us](#followus)

[DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt) is an open source JavaScript Gantt chart library that helps you illustrate and manage a project schedule in a nice-looking diagram.

<a href="https://dhtmlx.com/docs/products/dhtmlxGantt/">
        <img src="https://github.com/plazarev/media/blob/master/opensource-gantt-javascript.png">
</a>

It can show the dependencies between tasks as lines and allows you to set up different relationships between tasks (finish-to-start, start-to-start, finish-to-finish, start-to-finish). The Standard edition also inludes intuituve drag-n-drop interface and smart rendering which considerably boost performance while working with a large amount of tasks.

DHTMLX Gantt provides a flexible API and a large number of event handlers, which gives you the freedom to customize it for your needs. Moreover, the library comes with a comprehensive documentation and step-by-step video tutorials thus simplifying learning.

<a name="getting-started"></a>

## Getting started

Add files:

```html
<script src="dhtmlxgantt.js"></script>
<link rel="stylesheet" href="dhtmlxgantt.css" type="text/css" />
```

Add markup:

```html
<div id="gantt_here" style="width:100%; height:100vh;"></div>
```

And initialize:

```js
gantt.config.date_format = "%Y-%m-%d %H:%i";
gantt.init("gantt_here");
gantt.parse({
  data: [
    { id: 1, text: "Project #1", start_date: null, duration: null, parent: 0, progress: 0, open: true },
    { id: 2, text: "Task #1", start_date: "2019-08-01 00:00", duration: 5, parent: 1, progress: 1 },
    { id: 3, text: "Task #2", start_date: "2019-08-06 00:00", duration: 2, parent: 1, progress: 0.5 },
    { id: 4, text: "Task #3", start_date: null, duration: null, parent: 1, progress: 0.8, open: true },
    { id: 5, text: "Task #3.1", start_date: "2019-08-09 00:00", duration: 2, parent: 4, progress: 0.2 },
    { id: 6, text: "Task #3.2", start_date: "2019-08-11 00:00", duration: 1, parent: 4, progress: 0 },
  ],
  links: [
    { id: 1, source: 2, target: 3, type: "0" },
    { id: 2, source: 3, target: 4, type: "0" },
    { id: 3, source: 5, target: 6, type: "0" },
  ],
});
```

==> [Check the live demo](https://snippet.dhtmlx.com/a69d7378a)

### Complete guides

- [Vue.js](https://dhtmlx.com/blog/use-dhtmlxgantt-vue-js-framework-demo/)
- [Angular](https://dhtmlx.com/blog/dhtmlx-gantt-chart-usage-angularjs-2-framework/)
- [React](https://dhtmlx.com/blog/create-react-gantt-chart-component-dhtmlxgantt/)
- [Node](https://docs.dhtmlx.com/gantt/desktop__howtostart_nodejs.html)
- ASP.NET
  - [ASP.NET MVC 5](https://docs.dhtmlx.com/gantt/desktop__howtostart_dotnet.html)
  - [ASP.NET Core](https://docs.dhtmlx.com/gantt/desktop__howtostart_dotnet_core.html)
- PHP
  - [Laravel](https://docs.dhtmlx.com/gantt/desktop__howtostart_php_laravel.html)
  - [Slim framework](https://docs.dhtmlx.com/gantt/desktop__howtostart_php_laravel.html)
- [Ruby on Rails](https://docs.dhtmlx.com/gantt/desktop__howtostart_ruby.html)
- [Python](https://docs.dhtmlx.com/gantt/desktop__howtostart_python.html)
- [Meteor](https://dhtmlx.com/blog/using-dhtmlx-gantt-chart-meteorjs-framework/)

#### All tutorials

[https://docs.dhtmlx.com/gantt/desktop\_\_howtostart_guides.html](https://docs.dhtmlx.com/gantt/desktop__howtostart_guides.html)

#### Video guides

[https://www.youtube.com/user/dhtmlx/videos](https://www.youtube.com/user/dhtmlx/videos)

<a name="features"></a>

## Features of the Standard Edition

- 4 types of tasks linking: finish-to-start, start-to-start, finish-to-finish, start-to-finish
- dragging and dropping multiple tasks horizontally
- multi-task selection

<img src="https://github.com/plazarev/media/blob/master/drag-and-drop.gif" alt= "multitask-drag-n-drop" height="350">

- backward planning
- tasks filtering
- smart rendering
- inline editing

<img src="https://github.com/plazarev/media/blob/master/inline-editing.gif" alt= "inline-editing" height="350">

- managing editability/readonly modes of individual tasks
- tooltips
- undo/redo functionality
- configurable columns in the grid
- customizable time scale and task edit form
- progress percent coloring for tasks
- 7 different skins

![gantt-material](https://github.com/plazarev/media/blob/master/gantt-chart-material.png)

- online export to PDF, PNG, Excel, iCal, and MS Project
- cross-browser compatibility
- 32 locales
- keyboard navigation
- accessibility

Resource management, critical path calculation, auto scheduling, and other enhanced features are available with the PRO edition. You can see the full list of features and compare the two DHTMLX Gantt editions [in the documentation](https://docs.dhtmlx.com/gantt/desktop__editions_comparison.html).

(c) XB Software

<a name="links"></a>

## Useful links

- [DHTMLX Gantt product page](https://dhtmlx.com/docs/products/dhtmlxGantt/)
- [Official documentation](https://docs.dhtmlx.com/gantt/)
- [Online samples](https://docs.dhtmlx.com/gantt/samples/)
- [Video tutorials](https://www.youtube.com/watch?v=cCvULTQxPfg&list=PLKS_XdyIGP4MEW6yvvQUZT8vJKHVOq2S0)
- [Export services](https://dhtmlx.com/docs/products/dhtmlxGantt/export.shtml)
- [List of available integrations](https://dhtmlx.com/docs/products/integrations/)
- [Support forum](https://forum.dhtmlx.com/c/gantt)

<a name="followus"></a>

## Follow us

Star our GitHub repo :star:

Check our [roadmap](https://trello.com/b/fhOySHPj/gantt-roadmap) for future updates :wrench:

Read us on [Medium](https://medium.com/@dhtmlx) :newspaper:

Follow us on [Twitter](https://twitter.com/dhtmlx) :bird:

Like our page on [Facebook](https://www.facebook.com/dhtmlx/) :thumbsup:

---

## 🚀 Application Options & Usage Guide

This customized Gantt Chart application includes advanced features for task management, view configuration, keyboard navigation, and file exports.

### ⌨️ Keyboard Shortcuts & Options
The application has built-in keyboard navigation support. Select a task and use the following shortcuts:

| Shortcut | Description |
| --- | --- |
| `Arrow Up` / `Arrow Down` | Navigate focus through task rows |
| `Space` | Select or deselect the currently focused task |
| `Ctrl + Click` / `Shift + Click` | Hold `Ctrl` (or `Cmd` on macOS) / `Shift` to select multiple tasks |
| `Delete` / `Backspace` | Delete all selected tasks |
| `Enter` | Open the task detail/edit modal (Lightbox) |
| `Ctrl + Enter` | Create a new subtask under the selected task |
| `Shift + Right` / `Tab` | **Indent**: Demote selected task(s) to be a child of their predecessor sibling |
| `Shift + Left` / `Shift + Tab` | **Outdent**: Promote selected task(s) to a parent level |
| `Shift + Down` | Expand the selected task's branch |
| `Shift + Up` | Collapse the selected task's branch |
| `Ctrl + Right` | Expand selected task |
| `Ctrl + Left` | Collapse selected task |
| `Ctrl + Z` | Undo the last action |
| `Ctrl + Y` | Redo the last action |

---

### 🛠️ Toolbar Options
The main toolbar offers visual control over the project chart:

* **Add Task (`+`)**: Inserts a new task at the project root level.
* **Import**: Import project schedule data from CSV or Excel formats.
* **Export**: Export the chart layout to PNG (Recommended) or PDF files (fully captures off-screen timeline layout).
* **Print**: Initiates the browser print dialog optimized for Gantt scales.
* **Zoom Out / Zoom In**: Adjust scale units (`Day`, `Week`, `Month`, `Quarter`, `Year`).
* **Expand All / Collapse All**: Batch expand/collapse all hierarchy branches.
* **Today**: Automatically scroll and center the timescale to the current date.
* **Move Up / Move Down**: Move the selected task(s) vertically within their level.
* **Indent / Outdent**: Alter task hierarchy level visually.
* **Delete Task**: Permanently remove all selected tasks.

---

### ⚙️ View & Settings Panel Options
Click the **Gear Icon** in the top right to customize:
* **Progress**: Toggle visibility of progress completion percentages on task bars.
* **Links**: Toggle task dependency line rendering.
* **Today**: Show or hide the red "Today" vertical marker.
* **Language/Locale**: Toggle between English (Gregorian Calendar / LTR) and Persian (Jalali Calendar / RTL).
* **Color Scheme**: Toggle between Light Mode and Dark Mode.
* **Branding**: Customize company logo, colors, and header titles.
* **Data Management**: View and modify raw YAML configuration and data structures.
