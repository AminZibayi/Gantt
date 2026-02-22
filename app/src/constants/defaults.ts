import { GanttData, AppSettings } from '@/types';

export const DEFAULT_TASKS: GanttData = {
  data: [
    {
      id: 1,
      text: 'Project Planning',
      start_date: '2024-01-15',
      duration: 5,
      progress: 0.8,
      color: '#4f46e5',
      open: true,
    },
    {
      id: 2,
      text: 'Requirements Analysis',
      start_date: '2024-01-15',
      duration: 3,
      progress: 1,
      parent: 1,
      color: '#7c3aed',
    },
    {
      id: 3,
      text: 'System Design',
      start_date: '2024-01-18',
      duration: 2,
      progress: 0.6,
      parent: 1,
      color: '#2563eb',
    },
    {
      id: 4,
      text: 'Development',
      start_date: '2024-01-22',
      duration: 14,
      progress: 0.4,
      color: '#059669',
      open: true,
    },
    {
      id: 5,
      text: 'Backend Development',
      start_date: '2024-01-22',
      duration: 10,
      progress: 0.5,
      parent: 4,
      color: '#0891b2',
    },
    {
      id: 6,
      text: 'Frontend Development',
      start_date: '2024-01-25',
      duration: 11,
      progress: 0.3,
      parent: 4,
      color: '#d97706',
    },
    {
      id: 7,
      text: 'Testing & QA',
      start_date: '2024-02-05',
      duration: 7,
      progress: 0.1,
      color: '#dc2626',
    },
    {
      id: 8,
      text: 'Deployment',
      start_date: '2024-02-12',
      duration: 3,
      progress: 0,
      color: '#7c3aed',
    },
  ],
  links: [
    { id: 1, source: 1, target: 4, type: '0' },
    { id: 2, source: 4, target: 7, type: '0' },
    { id: 3, source: 7, target: 8, type: '0' },
  ],
};

export const DEFAULT_SETTINGS: AppSettings = {
  locale: 'en',
  calendarType: 'gregorian',
  branding: {
    companyName: 'My Company',
    logo: null,
    primaryColor: '#4f46e5',
    secondaryColor: '#7c3aed',
  },
  taskColors: {},
};

export const TASK_COLORS = [
  '#4f46e5', '#7c3aed', '#2563eb', '#0891b2',
  '#059669', '#d97706', '#dc2626', '#db2777',
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#6366f1', '#14b8a6',
];
