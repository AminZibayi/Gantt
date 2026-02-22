'use client';
import { TASK_COLORS } from '@/constants/defaults';

interface TaskColorPickerProps {
  taskId: string | number;
  currentColor?: string;
  onColorChange: (taskId: string | number, color: string) => void;
}

export default function TaskColorPicker({
  taskId,
  currentColor,
  onColorChange,
}: TaskColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5 p-2">
      {TASK_COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(taskId, color)}
          className={`w-6 h-6 rounded-md transition-transform hover:scale-110 ${
            currentColor === color ? 'ring-2 ring-offset-1 ring-slate-600 scale-110' : ''
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
      <input
        type="color"
        value={currentColor || '#4f46e5'}
        onChange={(e) => onColorChange(taskId, e.target.value)}
        className="w-6 h-6 rounded-md cursor-pointer border-0 p-0"
        title="Custom color"
      />
    </div>
  );
}
