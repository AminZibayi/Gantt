import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string | number;
  text: string;
  start_date: string;
  duration: number;
  progress: number;
  parent: string | number;
  type?: string;
  color?: string;
  open?: boolean;
  [key: string]: any;
}

export interface Link {
  id: string | number;
  source: string | number;
  target: string | number;
  type: string;
}

export interface GanttData {
  data: Task[];
  links: Link[];
}

export interface AppSettings {
  locale: 'en' | 'fa';
  direction: 'ltr' | 'rtl';
  theme: 'default' | 'material' | 'skyblue';
  branding: {
    logoUrl: string;
    title: string;
    primaryColor: string;
  };
}

interface AppState {
  tasks: Task[];
  links: Link[];
  settings: AppSettings;
  setTasks: (tasks: Task[]) => void;
  setLinks: (links: Link[]) => void;
  setGanttData: (data: GanttData) => void;
  updateTask: (task: Task) => void;
  updateLink: (link: Link) => void;
  setSettings: (settings: Partial<AppSettings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: [
        { id: 1, text: "Project #1", start_date: "2023-04-01", duration: 5, progress: 0.6, parent: 0, open: true },
        { id: 2, text: "Task #1", start_date: "2023-04-02", duration: 2, progress: 0.4, parent: 1 },
      ],
      links: [
        { id: 1, source: 1, target: 2, type: "1" }
      ],
      settings: {
        locale: 'en',
        direction: 'ltr',
        theme: 'material',
        branding: {
          logoUrl: '',
          title: 'Gantt Chart',
          primaryColor: '#3b82f6',
        },
      },
      setTasks: (tasks) => set({ tasks }),
      setLinks: (links) => set({ links }),
      setGanttData: (data) => set({ tasks: data.data, links: data.links }),
      updateTask: (task) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
      })),
      updateLink: (link) => set((state) => ({
        links: state.links.map((l) => (l.id === link.id ? { ...l, ...link } : l)),
      })),
      setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
    }),
    {
      name: 'gantt-storage',
    }
  )
);
