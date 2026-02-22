export interface GanttTask {
  id: number | string;
  text: string;
  start_date: string;
  duration: number;
  progress?: number;
  parent?: number | string;
  color?: string;
  open?: boolean;
  type?: string;
}

export interface GanttLink {
  id: number | string;
  source: number | string;
  target: number | string;
  type: string;
}

export interface GanttData {
  data: GanttTask[];
  links: GanttLink[];
}

export interface BrandingSettings {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
}

export interface AppSettings {
  locale: 'en' | 'fa';
  calendarType: 'gregorian' | 'jalali';
  branding: BrandingSettings;
  taskColors: Record<string | number, string>;
}

export interface ImportError {
  type: 'error' | 'warning';
  message: string;
  row?: number;
  column?: string;
}

export interface ImportResult {
  data: GanttTask[];
  links: GanttLink[];
  errors: ImportError[];
  warnings: ImportError[];
}
