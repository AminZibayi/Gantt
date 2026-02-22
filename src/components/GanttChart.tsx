import { FC, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { setupJalali, restoreGregorian } from '../utils/jalali';
import { gantt } from '../vendor/dhtmlxgantt/dhtmlxgantt.es';
import '../vendor/dhtmlxgantt/dhtmlxgantt.css';
import '../index.css';

const GanttChart: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { tasks, links, settings, setTasks, setLinks, updateTask, updateLink } = useStore();
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    gantt.init(containerRef.current);

    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.config.autosize = "xy";
    gantt.config.fit_tasks = true;

    // Events
    gantt.attachEvent("onAfterTaskAdd", (_: string, task: any) => {
      isInternalUpdate.current = true;
      setTasks([...useStore.getState().tasks, task]);
      isInternalUpdate.current = false;
    });
    gantt.attachEvent("onAfterTaskUpdate", (_: string, task: any) => {
      isInternalUpdate.current = true;
      updateTask(task);
      isInternalUpdate.current = false;
    });
    gantt.attachEvent("onAfterTaskDelete", (id: string | number) => {
      isInternalUpdate.current = true;
      setTasks(useStore.getState().tasks.filter(t => t.id !== id));
      isInternalUpdate.current = false;
    });
    gantt.attachEvent("onAfterLinkAdd", (_: string, link: any) => {
      isInternalUpdate.current = true;
      setLinks([...useStore.getState().links, link]);
      isInternalUpdate.current = false;
    });
    gantt.attachEvent("onAfterLinkUpdate", (_: string, link: any) => {
      isInternalUpdate.current = true;
      updateLink(link);
      isInternalUpdate.current = false;
    });
    gantt.attachEvent("onAfterLinkDelete", (id: string | number) => {
      isInternalUpdate.current = true;
      setLinks(useStore.getState().links.filter(l => l.id !== id));
      isInternalUpdate.current = false;
    });

    gantt.parse({ data: tasks, links: links });

    return () => {
      gantt.clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (settings.locale === 'fa') {
      setupJalali(gantt);
    } else {
      restoreGregorian(gantt);
    }
    gantt.render();
  }, [settings.locale]);

  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.style.direction = settings.direction;
    }
    gantt.render();
  }, [settings.direction, settings.theme]);

  useEffect(() => {
    if (isInternalUpdate.current) return;
    gantt.clearAll();
    gantt.parse({ data: tasks, links: links });
  }, [tasks, links]);

  return (
    <div
      id="gantt-chart-container" ref={containerRef}
      className="w-full h-full min-h-[500px] border border-gray-200 rounded-lg shadow-sm"
    />
  );
};

export default GanttChart;
