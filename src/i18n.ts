import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define translations
const resources = {
  en: {
    translation: {
      "gantt": "Gantt Chart",
      "project": "Project",
      "task": "Task",
      "import": "Import",
      "export": "Export",
      "settings": "Settings",
      "branding": "Branding",
      "logo": "Logo URL",
      "title": "Title",
      "save": "Save",
      "cancel": "Cancel",
      "add_task": "Add Task",
      "delete_task": "Delete Task",
      "edit_task": "Edit Task",
      "persian": "Persian",
      "english": "English",
      "jalali": "Jalali",
      "gregorian": "Gregorian",
      "export_pdf": "Export PDF",
      "export_excel": "Export Excel",
      "print": "Print",
      "theme": "Theme",
      "direction": "Direction",
      "ltr": "LTR",
      "rtl": "RTL",
    }
  },
  fa: {
    translation: {
      "gantt": "نمودار گانت",
      "project": "پروژه",
      "task": "وظیفه",
      "import": "وارد کردن",
      "export": "خروجی",
      "settings": "تنظیمات",
      "branding": "برندینگ",
      "logo": "آدرس لوگو",
      "title": "عنوان",
      "save": "ذخیره",
      "cancel": "لغو",
      "add_task": "افزودن وظیفه",
      "delete_task": "حذف وظیفه",
      "edit_task": "ویرایش وظیفه",
      "persian": "فارسی",
      "english": "انگلیسی",
      "jalali": "شمسی",
      "gregorian": "میلادی",
      "export_pdf": "خروجی PDF",
      "export_excel": "خروجی اکسل",
      "print": "چاپ",
      "theme": "تم",
      "direction": "جهت",
      "ltr": "چپ‌چین",
      "rtl": "راست‌چین",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
