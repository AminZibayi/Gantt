import jalaali from "jalaali-js";
import type { AppSettings } from "../../types";
import { JALALI_MONTHS, JALALI_MONTHS_SHORT, GREGORIAN_MONTHS } from "./ganttLocale";

// Jalali formatting helpers
const jYear = (d: Date) => String(jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jy);
const jMonthName = (d: Date) => JALALI_MONTHS[jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jm - 1];
const jMonthNameShort = (d: Date) =>
  JALALI_MONTHS_SHORT[jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jm - 1];
const jDayMonthFull = (d: Date) =>
  `${jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jd} ${jMonthName(d)}`;
const jDayMonthShort = (d: Date) =>
  `${jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jd} ${jMonthNameShort(d)}`;
const jMonthYearFull = (d: Date) => `${jMonthName(d)} ${jYear(d)}`;

const jWeekNum = (d: Date) => {
  const { jy } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const firstDay = jalaali.toGregorian(jy, 1, 1);
  const startOfYear = new Date(firstDay.gy, firstDay.gm - 1, firstDay.gd);
  const dayOffset = (startOfYear.getDay() + 1) % 7;
  const diff = Math.round(
    (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) -
      Date.UTC(startOfYear.getFullYear(), startOfYear.getMonth(), startOfYear.getDate())) /
      86400000,
  );
  return Math.floor((diff + dayOffset) / 7) + 1;
};

// Gregorian formatting helpers
const gMonthFull = (d: Date) => GREGORIAN_MONTHS[d.getMonth()];
const gMonthShort = (d: Date) => GREGORIAN_MONTHS[d.getMonth()].substring(0, 3);
const gDayFull = (d: Date) => `${d.getDate()} ${gMonthShort(d)}`;
const gMonthYearFull = (d: Date) => `${gMonthFull(d)} ${d.getFullYear()}`;
const gMonthYearShort = (d: Date) => `${gMonthShort(d)} ${d.getFullYear()}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildGanttConfig(gantt: any, settings: AppSettings): void {
  // Base config
  gantt.config.date_format = "%Y-%m-%d";
  gantt.config.xml_date = "%Y-%m-%d";
  gantt.config.order_branch = true;
  gantt.config.order_branch_free = true;
  gantt.config.show_progress = settings.showProgress;
  gantt.config.show_links = settings.showLinks;
  gantt.config.drag_links = true;
  gantt.config.drag_progress = true;
  gantt.config.drag_resize = true;
  gantt.config.drag_move = true;
  gantt.config.details_on_dblclick = true;
  gantt.config.fit_tasks = true;
  gantt.config.autofit = true;
  gantt.config.auto_scheduling = false;
  gantt.config.open_tree_initially = true;
  gantt.config.show_markers = settings.showToday;

  // Fix for RTL infinite scroll / blank canvas bug in dhtmlxgantt
  gantt.config.smart_rendering = false;
  gantt.config.smart_scales = false;

  // RTL for Persian
  if (settings.language === "fa") {
    gantt.config.rtl = true;
    gantt.config.layout = {
      css: "gantt_container",
      rows: [
        {
          cols: [
            { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
            { resizer: true, width: 1 },
            { view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" },
            { view: "scrollbar", id: "scrollVer" },
          ],
        },
        { view: "scrollbar", id: "scrollHor", height: 20 },
      ],
    };
  } else {
    gantt.config.rtl = false;
    gantt.config.layout = {
      css: "gantt_container",
      rows: [
        {
          cols: [
            { view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" },
            { resizer: true, width: 1 },
            { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
            { view: "scrollbar", id: "scrollVer" },
          ],
        },
        { view: "scrollbar", id: "scrollHor", height: 20 },
      ],
    };
  }

  // Grid columns
  gantt.config.columns = [
    {
      name: "text",
      label: settings.language === "fa" ? "نام فعالیت" : "Task Name",
      tree: true,
      width: 200,
      resize: true,
    },
    {
      name: "start_date",
      label: settings.language === "fa" ? "شروع" : "Start",
      align: "center",
      width: 100,
      resize: true,
    },
    {
      name: "duration",
      label: settings.language === "fa" ? "مدت" : "Duration",
      align: "center",
      width: 60,
      resize: true,
    },
    { name: "add", label: "", width: 36, align: "center" },
  ];

  const isJalali = settings.calendar === "jalali";

  // Scale config based on zoom
  switch (settings.zoomLevel) {
    case "day":
      gantt.config.scales = [
        { unit: "day", step: 1, format: isJalali ? jDayMonthFull : gDayFull },
        { unit: "hour", step: 6, format: "%H:%i" },
      ];
      gantt.config.min_column_width = 80;
      break;
    case "week":
      gantt.config.scales = [
        {
          unit: "week",
          step: 1,
          format: (date: Date) => {
            const num = isJalali ? jWeekNum(date) : gantt.date.date_to_str("%W")(date);
            return settings.language === "fa" ? `هفته ${num}` : `Week ${num}`;
          },
        },
        {
          unit: "day",
          step: 1,
          format: isJalali ? jDayMonthShort : (d: Date) => `${d.getDate()} ${gMonthShort(d)}`,
        },
      ];
      gantt.config.min_column_width = 40;
      break;
    case "month":
      gantt.config.scales = [
        { unit: "month", step: 1, format: isJalali ? jMonthYearFull : gMonthYearFull },
        {
          unit: "week",
          step: 1,
          format: (date: Date) => {
            const num = isJalali ? jWeekNum(date) : gantt.date.date_to_str("%W")(date);
            return settings.language === "fa" ? `هفته ${num}` : `W${num}`;
          },
        },
      ];
      gantt.config.min_column_width = 60;
      break;
    case "quarter":
      gantt.config.scales = [
        { unit: "quarter", step: 1, format: isJalali ? jMonthYearFull : gMonthYearShort },
        { unit: "month", step: 1, format: isJalali ? jMonthName : gMonthFull },
      ];
      gantt.config.min_column_width = 70;
      break;
    case "year":
      gantt.config.scales = [
        { unit: "year", step: 1, format: isJalali ? jYear : "%Y" },
        { unit: "month", step: 1, format: isJalali ? jMonthNameShort : gMonthShort },
      ];
      gantt.config.min_column_width = 50;
      break;
  }

  // Date templates
  if (isJalali) {
    gantt.templates.task_date = function (date: Date) {
      const { jy, jm, jd } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
    };

    gantt.templates.grid_date_format = function (date: Date) {
      const { jy, jm, jd } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
    };

    gantt.templates.tooltip_date_format = function (date: Date) {
      const { jy, jm, jd } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      return `${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`;
    };
  } else {
    const defaultFormat = gantt.date.date_to_str(gantt.config.date_format);
    gantt.templates.task_date = function (date: Date) {
      return defaultFormat(date);
    };
    gantt.templates.grid_date_format = function (date: Date) {
      return defaultFormat(date);
    };
    gantt.templates.tooltip_date_format = function (date: Date) {
      return defaultFormat(date);
    };
  }

  // Task text template
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gantt.templates.task_text = function (_start: Date, _end: Date, task: any) {
    return task.text;
  };

  // Tooltip template
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gantt.templates.tooltip_text = function (start: Date, end: Date, task: any) {
    const tStart = gantt.templates.tooltip_date_format(start);
    const tEnd = gantt.templates.tooltip_date_format(end);

    if (settings.language === "fa") {
      return [
        `<div><b>فعالیت:</b> ${task.text}</div>`,
        `<div><b>شروع:</b> ${tStart}</div>`,
        `<div><b>پایان:</b> ${tEnd}</div>`,
      ].join("");
    }
    return [
      `<div><b>Task:</b> ${task.text}</div>`,
      `<div><b>Start:</b> ${tStart}</div>`,
      `<div><b>End:</b> ${tEnd}</div>`,
    ].join("");
  };
}
