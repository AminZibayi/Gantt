'use client';
import { useEffect, useRef } from 'react';
import { GanttData, AppSettings, GanttTask } from '@/types';

interface GanttChartInnerProps {
  data: GanttData;
  settings: AppSettings;
  locale: string;
  onDataChange: (data: GanttData) => void;
  onTaskColorChange: (taskId: string | number, color: string) => void;
}

export default function GanttChartInner({
  data,
  settings,
  locale,
  onDataChange,
}: GanttChartInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  /* Using any for the dhtmlxgantt instance which has no TS types in this project */
  // biome-ignore lint: gantt has no TS types
  const ganttRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  // Load CSS once
  useEffect(() => {
    if (document.querySelector('link[data-gantt-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/dhtmlxgantt.css';
    link.setAttribute('data-gantt-css', 'true');
    document.head.appendChild(link);
  }, []);

  // Initialize gantt once
  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;

    const init = async () => {
      try {
        // biome-ignore lint: dynamic import with any
        const mod = await import('dhtmlxgantt' as any);
        const gantt = mod.default || mod.gantt;
        if (!gantt || !containerRef.current) return;

        ganttRef.current = gantt;
        initializedRef.current = true;

        // Base config
        gantt.config.date_format = '%Y-%m-%d';
        gantt.config.drag_progress = true;
        gantt.config.drag_resize = true;
        gantt.config.drag_move = true;
        gantt.config.show_progress = true;
        gantt.config.open_tree_initially = true;
        gantt.config.fit_tasks = true;
        gantt.config.work_time = false;
        gantt.config.skip_off_time = false;

        if (locale === 'fa') {
          gantt.config.rtl = true;
        }

        gantt.config.columns = [
          {
            name: 'text',
            label: locale === 'fa' ? 'وظیفه' : 'Task',
            tree: true,
            width: 200,
          },
          {
            name: 'start_date',
            label: locale === 'fa' ? 'تاریخ شروع' : 'Start Date',
            align: 'center',
            width: 100,
          },
          {
            name: 'duration',
            label: locale === 'fa' ? 'مدت' : 'Duration',
            align: 'center',
            width: 70,
          },
          {
            name: 'progress',
            label: locale === 'fa' ? 'پیشرفت' : 'Progress',
            align: 'center',
            width: 80,
            template: (task: GanttTask) =>
              `${Math.round((task.progress || 0) * 100)}%`,
          },
          { name: 'add', label: '', width: 44 },
        ];

        gantt.templates.rightside_text = (
          _start: Date,
          _end: Date,
          task: GanttTask
        ) => `${Math.round((task.progress || 0) * 100)}%`;

        // Attach events after init
        gantt.attachEvent(
          'onAfterTaskAdd',
          (_id: string | number, _task: GanttTask) => {
            const s = gantt.serialize();
            onDataChangeRef.current({ data: s.data, links: s.links });
          }
        );
        gantt.attachEvent(
          'onAfterTaskUpdate',
          (_id: string | number, _task: GanttTask) => {
            const s = gantt.serialize();
            onDataChangeRef.current({ data: s.data, links: s.links });
          }
        );
        gantt.attachEvent('onAfterTaskDelete', (_id: string | number) => {
          const s = gantt.serialize();
          onDataChangeRef.current({ data: s.data, links: s.links });
        });
        gantt.attachEvent(
          'onAfterLinkAdd',
          (_id: string | number) => {
            const s = gantt.serialize();
            onDataChangeRef.current({ data: s.data, links: s.links });
          }
        );
        gantt.attachEvent('onAfterLinkDelete', (_id: string | number) => {
          const s = gantt.serialize();
          onDataChangeRef.current({ data: s.data, links: s.links });
        });

        gantt.init(containerRef.current);
        loadData(gantt, data, settings);
      } catch (err) {
        console.error('Failed to initialize gantt:', err);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload data when data or color settings change
  useEffect(() => {
    const gantt = ganttRef.current;
    if (!gantt || !initializedRef.current) return;
    loadData(gantt, data, settings);
  }, [data, settings]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: 400 }}
    />
  );
}

// biome-ignore lint: gantt has no TS types
function loadData(gantt: any, data: GanttData, settings: AppSettings) {
  try {
    gantt.clearAll();
    const processedData = {
      data: data.data.map((task) => ({
        ...task,
        color:
          settings.taskColors[task.id] ||
          task.color ||
          settings.branding.primaryColor,
      })),
      links: data.links,
    };
    gantt.parse(processedData);
  } catch (e) {
    console.error('Error loading gantt data:', e);
  }
}
