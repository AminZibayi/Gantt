import type { GanttData } from "../../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeGanttData(gantt: any): GanttData {
  return {
    data: gantt.serialize().data,
    links: gantt.serialize().links,
  };
}

export function registerGanttEvents(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gantt: any,
  onDataChange: (data: GanttData) => void,
): void {
  gantt.attachEvent("onAfterTaskAdd", () => {
    onDataChange(serializeGanttData(gantt));
  });

  gantt.attachEvent("onAfterTaskUpdate", () => {
    onDataChange(serializeGanttData(gantt));
  });

  gantt.attachEvent("onAfterTaskDelete", () => {
    onDataChange(serializeGanttData(gantt));
  });

  gantt.attachEvent("onAfterLinkAdd", () => {
    onDataChange(serializeGanttData(gantt));
  });

  gantt.attachEvent("onAfterLinkDelete", () => {
    onDataChange(serializeGanttData(gantt));
  });
}
