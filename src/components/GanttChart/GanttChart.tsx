import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import jalaali from "jalaali-js";
import type { GanttData, AppSettings } from "../../types";

// Import local gantt library CSS
import "../../../codebase/dhtmlxgantt.css";
import "../../styles/gantt-overrides.css";

export interface GanttChartRef {
  scrollToToday: () => void;
}

// Persian month names for Jalali calendar
const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const JALALI_MONTHS_SHORT = ["فرو", "ارد", "خرد", "تیر", "مرد", "شهر", "مهر", "آبا", "آذر", "دی", "بهم", "اسف"];

const PERSIAN_DAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
const PERSIAN_DAYS_SHORT = ["یک", "دو", "سه", "چهار", "پنج", "جمعه", "شنبه"];

const GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Using jalaali-js for robust conversion instead of custom math

interface GanttChartProps {
  data: GanttData;
  settings: AppSettings;
  onDataChange: (data: GanttData) => void;
}

const GanttChart = forwardRef<GanttChartRef, GanttChartProps>(function GanttChart(
  { data, settings, onDataChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ganttRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      scrollToToday: () => {
        if (ganttRef.current && initializedRef.current) {
          ganttRef.current.showDate(new Date(), "month");
        }
      },
    }),
    []
  );

  const configureGantt = useCallback(
    (gantt: any) => {
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
      } else {
        gantt.config.rtl = false;
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

      // Jalali formatting helpers
      const jYear = (d: Date) => String(jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jy);
      const jMonthName = (d: Date) =>
        JALALI_MONTHS[jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jm - 1];
      const jMonthNameShort = (d: Date) =>
        JALALI_MONTHS_SHORT[jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jm - 1];
      const jDayMonthFull = (d: Date) =>
        `${jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jd} ${jMonthName(d)}`;
      const jDayMonthShort = (d: Date) =>
        `${jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate()).jd} ${jMonthNameShort(d)}`;
      const jMonthYearFull = (d: Date) => `${jMonthName(d)} ${jYear(d)}`;
      const jMonthYearShort = (d: Date) => `${jMonthNameShort(d)} ${jYear(d)}`;

      // Gregorian formatting helpers – always English months regardless of active locale
      const gMonthFull = (d: Date) => GREGORIAN_MONTHS[d.getMonth()];
      const gMonthShort = (d: Date) => GREGORIAN_MONTHS[d.getMonth()].substring(0, 3);
      const gDayFull = (d: Date) => `${d.getDate()} ${gMonthShort(d)}`;
      const gMonthYearFull = (d: Date) => `${gMonthFull(d)} ${d.getFullYear()}`;
      const gMonthYearShort = (d: Date) => `${gMonthShort(d)} ${d.getFullYear()}`;

      // Scale config based on zoom
      // Abbreviate texts specifically for tight width columns ("week" and "year" zooms)
      switch (settings.zoomLevel) {
        case "day":
          // Plenty of space (80px), use FULL names
          gantt.config.scales = [
            { unit: "day", step: 1, format: isJalali ? jDayMonthFull : gDayFull },
            { unit: "hour", step: 6, format: "%H:%i" },
          ];
          gantt.config.min_column_width = 80;
          break;
        case "week":
          // Tight width (40px)
          gantt.config.scales = [
            { unit: "week", step: 1, format: settings.language === "fa" ? "هفته %W" : "Week %W" },
            {
              unit: "day",
              step: 1,
              format: isJalali ? jDayMonthShort : (d: Date) => `${d.getDate()} ${gMonthShort(d)}`,
            },
          ];
          gantt.config.min_column_width = 40;
          break;
        case "month":
          // Normal width (60px)
          gantt.config.scales = [
            { unit: "month", step: 1, format: isJalali ? jMonthYearFull : gMonthYearFull },
            { unit: "week", step: 1, format: settings.language === "fa" ? "هفته %W" : "W%W" },
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
          // Tight width (50px)
          gantt.config.scales = [
            { unit: "year", step: 1, format: isJalali ? jYear : "%Y" },
            { unit: "month", step: 1, format: isJalali ? jMonthNameShort : gMonthShort },
          ];
          gantt.config.min_column_width = 50;
          break;
      }

      // Jalali calendar text formatting for grids and tooltips
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
      gantt.templates.task_text = function (start: Date, end: Date, task: any) {
        return task.text;
      };

      // Tooltip localization template
      // Note: .gantt_tooltip uses display:flex flex-direction:column, so use <div> per row (not <br>)
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

      // Locale labels
      if (settings.language === "fa") {
        gantt.i18n.setLocale({
          date: {
            month_full: JALALI_MONTHS,
            month_short: JALALI_MONTHS_SHORT,
            day_full: PERSIAN_DAYS,
            day_short: PERSIAN_DAYS_SHORT,
          },
          labels: {
            new_task: "فعالیت جدید",
            icon_save: "ذخیره",
            icon_cancel: "لغو",
            icon_details: "جزئیات",
            icon_edit: "ویرایش",
            icon_delete: "حذف",
            gantt_save_btn: "ذخیره",
            gantt_cancel_btn: "لغو",
            gantt_delete_btn: "حذف",
            confirm_closing: "",
            confirm_deleting: "آیا از حذف این فعالیت مطمئن هستید؟",
            section_description: "عنوان",
            section_time: "بازه زمانی",
            section_type: "نوع",
            column_wbs: "WBS",
            column_text: "نام فعالیت",
            column_start_date: "تاریخ شروع",
            column_duration: "مدت",
            column_add: "",
            link: "ارتباط",
            confirm_link_deleting: "حذف خواهد شد",
            link_start: " (شروع)",
            link_end: " (پایان)",
            type_task: "فعالیت",
            type_project: "پروژه",
            type_milestone: "نقطه عطف",
            minutes: "دقیقه",
            hours: "ساعت",
            days: "روز",
            weeks: "هفته",
            months: "ماه",
            years: "سال",
            message_ok: "باشه",
            message_cancel: "لغو",
            section_constraint: "محدودیت",
            constraint_type: "نوع محدودیت",
            constraint_date: "تاریخ محدودیت",
            asap: "در اولین فرصت",
            alap: "در آخرین فرصت",
            snet: "شروع نه زودتر از",
            snlt: "شروع نه دیرتر از",
            fnet: "پایان نه زودتر از",
            fnlt: "پایان نه دیرتر از",
            mso: "باید شروع شود در",
            mfo: "باید پایان یابد در",
            resources_filter_placeholder: "جستجو...",
            resources_filter_label: "مخفی کردن خالی‌ها",
          },
        });
      } else {
        gantt.i18n.setLocale("en");
      }

      // Today marker
      if (settings.showToday) {
        gantt.addMarker({
          start_date: new Date(),
          css: "today-marker",
          text: settings.language === "fa" ? "امروز" : "Today",
        });
      }
    },
    [settings]
  );

  // Initialize gantt
  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import gantt from local codebase
    const initGantt = async () => {
      const ganttModule = await import("../../../codebase/dhtmlxgantt.es.js");
      const gantt = ganttModule.default || ganttModule.gantt || (window as any).gantt;

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

      // Initialize
      gantt.init(containerRef.current!);
      gantt.parse(data);
      initializedRef.current = true;

      // Event handlers
      gantt.attachEvent("onAfterTaskAdd", (_id: string, task: any) => {
        const currentData = {
          data: gantt.serialize().data,
          links: gantt.serialize().links,
        };
        onDataChange(currentData);
      });

      gantt.attachEvent("onAfterTaskUpdate", (_id: string, task: any) => {
        const currentData = {
          data: gantt.serialize().data,
          links: gantt.serialize().links,
        };
        onDataChange(currentData);
      });

      gantt.attachEvent("onAfterTaskDelete", (_id: string) => {
        const currentData = {
          data: gantt.serialize().data,
          links: gantt.serialize().links,
        };
        onDataChange(currentData);
      });

      gantt.attachEvent("onAfterLinkAdd", (_id: string, link: any) => {
        const currentData = {
          data: gantt.serialize().data,
          links: gantt.serialize().links,
        };
        onDataChange(currentData);
      });

      gantt.attachEvent("onAfterLinkDelete", (_id: string) => {
        const currentData = {
          data: gantt.serialize().data,
          links: gantt.serialize().links,
        };
        onDataChange(currentData);
      });
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
    <div className='gantt-container' id='gantt-area'>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
});

export default GanttChart;
