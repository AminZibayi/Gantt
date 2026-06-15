import type { GanttData, GanttTask, GanttLink } from "../types";

// ── Command interface ──────────────────────────────────────────────

export interface Command {
  readonly description: string;
  execute(data: GanttData): GanttData;
  undo(data: GanttData): GanttData;
}

// ── Concrete commands ──────────────────────────────────────────────

export class AddTaskCommand implements Command {
  readonly description = "Add Task";
  constructor(private task: GanttTask) {}
  execute(data: GanttData): GanttData {
    return { ...data, data: [...data.data, this.task] };
  }
  undo(data: GanttData): GanttData {
    return { ...data, data: data.data.filter(t => t.id !== this.task.id) };
  }
}

export class DeleteTaskCommand implements Command {
  readonly description = "Delete Task";
  constructor(private task: GanttTask, private links: GanttLink[]) {}
  execute(data: GanttData): GanttData {
    return {
      ...data,
      data: data.data.filter(t => t.id !== this.task.id),
      links: data.links.filter(l => l.source !== this.task.id && l.target !== this.task.id),
    };
  }
  undo(data: GanttData): GanttData {
    return {
      ...data,
      data: [...data.data, this.task],
      links: [...data.links, ...this.links],
    };
  }
}

export class UpdateTaskCommand implements Command {
  readonly description = "Update Task";
  constructor(
    private id: number | string,
    private oldTask: GanttTask,
    private newTask: GanttTask,
  ) {}
  execute(data: GanttData): GanttData {
    return { ...data, data: data.data.map(t => (t.id === this.id ? { ...this.newTask } : t)) };
  }
  undo(data: GanttData): GanttData {
    return { ...data, data: data.data.map(t => (t.id === this.id ? { ...this.oldTask } : t)) };
  }
}

export class AddLinkCommand implements Command {
  readonly description = "Add Link";
  constructor(private link: GanttLink) {}
  execute(data: GanttData): GanttData {
    return { ...data, links: [...data.links, this.link] };
  }
  undo(data: GanttData): GanttData {
    return { ...data, links: data.links.filter(l => l.id !== this.link.id) };
  }
}

export class DeleteLinkCommand implements Command {
  readonly description = "Delete Link";
  constructor(private link: GanttLink) {}
  execute(data: GanttData): GanttData {
    return { ...data, links: data.links.filter(l => l.id !== this.link.id) };
  }
  undo(data: GanttData): GanttData {
    return { ...data, links: [...data.links, this.link] };
  }
}

export class UpdateLinkCommand implements Command {
  readonly description = "Update Link";
  constructor(
    private id: number | string,
    private oldLink: GanttLink,
    private newLink: GanttLink,
  ) {}
  execute(data: GanttData): GanttData {
    return { ...data, links: data.links.map(l => (l.id === this.id ? { ...this.newLink } : l)) };
  }
  undo(data: GanttData): GanttData {
    return { ...data, links: data.links.map(l => (l.id === this.id ? { ...this.oldLink } : l)) };
  }
}
export class BatchCommand implements Command {
  readonly description: string;
  constructor(private commands: Command[]) {
    this.description = commands.length === 1 ? commands[0].description : "Batch Update";
  }
  execute(data: GanttData): GanttData {
    return this.commands.reduce((d, cmd) => cmd.execute(d), data);
  }
  undo(data: GanttData): GanttData {
    return [...this.commands].reverse().reduce((d, cmd) => cmd.undo(d), data);
  }
}

// ── Normalization helpers ──────────────────────────────────────────

interface NormalizedTask {
  id: string;
  text: string;
  start_date: string;
  duration: number;
  progress: number;
  parent: string | undefined;
  open: boolean;
  color: string | undefined;
  textColor: string | undefined;
  progressColor: string | undefined;
  type: string | undefined;
  readonly: boolean;
  editable: boolean;
  priority: string | undefined;
  description: string | undefined;
}

function normalizeTask(t: GanttTask): NormalizedTask {
  let startDateStr = "";
  if (t.start_date) {
    const sd = t.start_date as unknown;
    if (sd instanceof Date) {
      const year = sd.getFullYear();
      const month = String(sd.getMonth() + 1).padStart(2, "0");
      const day = String(sd.getDate()).padStart(2, "0");
      startDateStr = `${year}-${month}-${day}`;
    } else {
      const parts = String(t.start_date).split(" ");
      startDateStr = parts[0];
    }
  }

  let progressNum = 0;
  if (t.progress !== undefined) {
    progressNum = Math.round(Number(t.progress) * 10000) / 10000;
  }

  let parentStr: string | undefined;
  if (t.parent !== undefined && t.parent !== null && t.parent !== 0 && t.parent !== "0" && t.parent !== "") {
    parentStr = String(t.parent);
  }

  const typeStr = t.type === "task" || !t.type ? "task" : t.type;

  return {
    id: String(t.id),
    text: t.text || "",
    start_date: startDateStr,
    duration: t.duration !== undefined ? Number(t.duration) : 0,
    progress: progressNum,
    parent: parentStr,
    open: !!t.open,
    color: t.color || undefined,
    textColor: t.textColor || undefined,
    progressColor: t.progressColor || undefined,
    type: typeStr,
    readonly: !!t.readonly,
    editable: t.editable !== undefined ? !!t.editable : true,
    priority: t.priority || undefined,
    description: t.description || undefined,
  };
}

export function areTasksEqual(a: GanttTask, b: GanttTask): boolean {
  const normA = normalizeTask(a);
  const normB = normalizeTask(b);
  return JSON.stringify(normA) === JSON.stringify(normB);
}

interface NormalizedLink {
  id: string;
  source: string;
  target: string;
  type: string;
}

function normalizeLink(l: GanttLink): NormalizedLink {
  return {
    id: String(l.id),
    source: String(l.source),
    target: String(l.target),
    type: String(l.type),
  };
}

export function areLinksEqual(a: GanttLink, b: GanttLink): boolean {
  const normA = normalizeLink(a);
  const normB = normalizeLink(b);
  return JSON.stringify(normA) === JSON.stringify(normB);
}

// ── Diff: compare two GanttData snapshots, produce a Command ────────

export function diffToCommands(prev: GanttData, next: GanttData): Command | null {
  const commands: Command[] = [];

  const nextTaskMap = new Map<string, GanttTask>();
  for (const t of next.data) nextTaskMap.set(String(t.id), t);

  const nextLinkMap = new Map<string, GanttLink>();
  for (const l of next.links) nextLinkMap.set(String(l.id), l);

  // Deleted tasks
  for (const pTask of prev.data) {
    if (!nextTaskMap.has(String(pTask.id))) {
      const affectedLinks = prev.links.filter(
        l => String(l.source) === String(pTask.id) || String(l.target) === String(pTask.id),
      );
      commands.push(new DeleteTaskCommand(pTask, affectedLinks));
    }
  }

  // Added tasks
  for (const nTask of next.data) {
    if (!prev.data.some(t => String(t.id) === String(nTask.id))) {
      commands.push(new AddTaskCommand(nTask));
    }
  }

  // Updated tasks
  for (const nTask of next.data) {
    const pTask = prev.data.find(t => String(t.id) === String(nTask.id));
    if (pTask && !areTasksEqual(pTask, nTask)) {
      commands.push(new UpdateTaskCommand(nTask.id, pTask, nTask));
    }
  }

  // Deleted links
  for (const pLink of prev.links) {
    if (!nextLinkMap.has(String(pLink.id))) {
      commands.push(new DeleteLinkCommand(pLink));
    }
  }

  // Added links
  for (const nLink of next.links) {
    if (!prev.links.some(l => String(l.id) === String(nLink.id))) {
      commands.push(new AddLinkCommand(nLink));
    }
  }

  // Updated links
  for (const nLink of next.links) {
    const pLink = prev.links.find(l => String(l.id) === String(nLink.id));
    if (pLink && !areLinksEqual(pLink, nLink)) {
      commands.push(new UpdateLinkCommand(nLink.id, pLink, nLink));
    }
  }

  if (commands.length === 0) return null;
  if (commands.length === 1) return commands[0];
  return new BatchCommand(commands);
}
