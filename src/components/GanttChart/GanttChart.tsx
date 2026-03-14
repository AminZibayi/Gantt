import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import type { GanttData, AppSettings } from "../../types";
import { buildGanttConfig } from "./ganttConfig";
import { applyLocale } from "./ganttLocale";
import { registerGanttEvents } from "./ganttEvents";

// Import local gantt library CSS
import "@gantt/dist/dhtmlxgantt.css";
import "../../styles/gantt-overrides.css";

export interface GanttChartRef {
  scrollToToday: () => void;
}

interface GanttChartProps {
  data: GanttData;
  settings: AppSettings;
  onDataChange: (data: GanttData) => void;
}

const GanttChart = forwardRef<GanttChartRef, GanttChartProps>(function GanttChart(
  { data, settings, onDataChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ganttRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      scrollToToday: () => {
        if (ganttRef.current && initializedRef.current) {
          ganttRef.current.showDate(new Date());
        }
      },
    }),
    [],
  );

  const configureGantt = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (gantt: any) => {
      buildGanttConfig(gantt, settings);
      applyLocale(gantt, settings.language);

      // Today marker
      if (settings.showToday) {
        gantt.addMarker({
          start_date: new Date(),
          css: "today-marker",
          text: settings.language === "fa" ? "امروز" : "Today",
        });
      }
    },
    [settings],
  );

  // Initialize gantt
  useEffect(() => {
    if (!containerRef.current) return;

    const initGantt = async () => {
      const ganttModule = await import("@gantt/dist/dhtmlxgantt.es.js");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gantt: any = ganttModule.default || ganttModule.gantt || (window as any).gantt;

      if (!gantt) {
        console.error("Failed to load dhtmlxgantt");
        return;
      }

      ganttRef.current = gantt;

      gantt.plugins({
        marker: true,
        tooltip: true,
        export_api: true,
      });

      configureGantt(gantt);
      gantt.init(containerRef.current!);
      gantt.parse(data);
      initializedRef.current = true;

      registerGanttEvents(gantt, onDataChange);
    };

    initGantt();

    return () => {
      if (ganttRef.current) {
        ganttRef.current.clearAll();
      }
    };
  }, []); // Only init once

  // Update when settings change
  useEffect(() => {
    if (!ganttRef.current || !initializedRef.current) return;
    const gantt = ganttRef.current;
    configureGantt(gantt);
    gantt.render();
  }, [settings, configureGantt]);

  // Update data when it changes externally
  useEffect(() => {
    if (!ganttRef.current || !initializedRef.current) return;
    const gantt = ganttRef.current;
    gantt.clearAll();
    gantt.parse(data);
  }, [data]);

  return (
    <div className="gantt-container" id="gantt-area">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
});

export default GanttChart;
