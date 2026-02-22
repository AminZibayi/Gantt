'use client';
import dynamic from 'next/dynamic';
import { GanttData, AppSettings } from '@/types';

const GanttChartInner = dynamic(() => import('./GanttChartInner'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
    </div>
  ),
});

interface GanttChartProps {
  data: GanttData;
  settings: AppSettings;
  locale: string;
  onDataChange: (data: GanttData) => void;
  onTaskColorChange: (taskId: string | number, color: string) => void;
}

export default function GanttChart(props: GanttChartProps) {
  return <GanttChartInner {...props} />;
}
