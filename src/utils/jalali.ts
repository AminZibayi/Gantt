import moment from 'moment-jalaali';
import { GanttStatic } from '../vendor/dhtmlxgantt/dhtmlxgantt';

// Ensure moment-jalaali uses Persian locale correctly when needed
moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });

export const setupJalali = (gantt: GanttStatic) => {
  // Override date helper methods



  // We need to redefine scale steps for Jalali
  // Usually this involves overriding date_part and add

  // Simple override for formatting dates
  gantt.templates.date_scale = (date: Date) => {
    return moment(date).format('jYYYY/jMM/jDD');
  };

  gantt.templates.task_date = (date: Date) => {
     return moment(date).format('jYYYY/jMM/jDD HH:mm');
  };

  // Override config.scales if needed
  // This is a minimal implementation.
  // For full Jalali support (including correct week starts, month lengths),
  // we would need to override gantt.date.add and gantt.date.date_part deeply.

  // For now, let's just override the display format.
  // The internal logic will still run on Gregorian dates, but display Jalali.
  // This is often sufficient for visualization if start/end dates are stored as Gregorian.

  // However, for "Jalali Calendar Support", the grid must align with Jalali months.
  // This requires setting up custom scales.

  gantt.config.scales = [
    { unit: "month", step: 1, format: (date: Date) => moment(date).format('jMMMM jYYYY') },
    { unit: "day", step: 1, format: (date: Date) => moment(date).format('jD') }
  ];

  // Set locale for month names etc
  // We can also inject Persian locale strings directly into gantt.locale
  gantt.i18n.setLocale({
    date: {
      month_full: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
      month_short: ["فرو", "ارد", "خرد", "تیر", "مرد", "شهر", "مهر", "آبا", "آذر", "دی", "بهم", "اسف"],
      day_full: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"],
      day_short: ["۱ش", "۲ش", "۳ش", "۴ش", "۵ش", "ج", "ش"]
    },
    labels: {
      new_task: "وظیفه جدید",
      icon_save: "ذخیره",
      icon_cancel: "لغو",
      icon_details: "جزئیات",
      icon_edit: "ویرایش",
      icon_delete: "حذف",
      gantt_save_btn: "ذخیره",
      gantt_cancel_btn: "لغو",
      gantt_delete_btn: "حذف",
      confirm_closing: "", //Your changes will be lost, are you sure?
      confirm_deleting: "آیا مطمئن هستید که می‌خواهید حذف کنید؟",
      section_description: "توضیحات",
      section_time: "بازه زمانی",
      section_type: "نوع",
      column_wbs: "WBS",
      column_text: "نام وظیفه",
      column_start_date: "شروع",
      column_duration: "مدت",
      column_add: "",
      link: "لینک",
      confirm_link_deleting: "حذف خواهد شد",
      link_start: "شروع",
      link_end: "پایان",
      type_task: "وظیفه",
      type_project: "پروژه",
      type_milestone: "نگارش",
      minutes: "دقیقه",
      hours: "ساعت",
      days: "روز",
      weeks: "هفته",
      months: "ماه",
      years: "سال"
    }
  });
};

export const restoreGregorian = (gantt: GanttStatic) => {
  // Reset scales to default
  gantt.config.scales = [
    { unit: "month", step: 1, format: "%F, %Y" },
    { unit: "day", step: 1, format: "%j, %D" }
  ];

  // Reset locale
  gantt.i18n.setLocale("en"); // Assuming 'en' is default or loaded
};
