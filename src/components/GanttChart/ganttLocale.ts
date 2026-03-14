import { faLocale } from "@gantt/locales/fa";
import { enLocale } from "@gantt/locales/en";

export const JALALI_MONTHS = faLocale.date.month_full;
export const JALALI_MONTHS_SHORT = faLocale.date.month_short;
export const PERSIAN_DAYS = faLocale.date.day_full;
export const PERSIAN_DAYS_SHORT = faLocale.date.day_short;

export const GREGORIAN_MONTHS = enLocale.date.month_full;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyLocale(gantt: any, language: string): void {
  if (language === "fa") {
    gantt.i18n.setLocale(faLocale);
  } else {
    gantt.i18n.setLocale("en");
  }
}
