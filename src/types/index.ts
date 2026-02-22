export interface GanttTask {
  id: number | string;
  text: string;
  start_date: string;
  end_date?: string;
  duration?: number;
  progress?: number;
  parent?: number | string;
  open?: boolean;
  color?: string;
  textColor?: string;
  progressColor?: string;
  type?: string;
  readonly?: boolean;
  editable?: boolean;
  priority?: string;
  description?: string;
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

export interface BrandingConfig {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface AppSettings {
  language: "fa" | "en";
  calendar: "jalali" | "gregorian";
  theme: "material" | "broadway" | "meadow" | "skyblue" | "terrace" | "contrast_black" | "contrast_white";
  colorScheme: "dark" | "light";
  zoomLevel: "day" | "week" | "month" | "quarter" | "year";
  showGrid: boolean;
  showLinks: boolean;
  showProgress: boolean;
  showToday: boolean;
}

export interface ActivityColor {
  id: string;
  name: string;
  color: string;
  textColor: string;
  progressColor: string;
}

export interface ValidationError {
  row?: number;
  column?: string;
  message: string;
  severity: "error" | "warning";
  value?: string;
}

export interface ImportResult {
  data: GanttTask[];
  links: GanttLink[];
  errors: ValidationError[];
  warnings: ValidationError[];
}

export type ExportFormat = "pdf" | "png" | "excel" | "csv" | "json" | "yaml";

export interface ExportOptions {
  format: ExportFormat;
  includeBranding: boolean;
  orientation: "landscape" | "portrait";
  pageSize: "A4" | "A3" | "Letter";
  fileName?: string;
}
