import { useTranslation } from "react-i18next";
import {
  FiPlus,
  FiUpload,
  FiDownload,
  FiPrinter,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiMinimize2,
  FiChevronsDown,
  FiChevronsUp,
  FiCalendar,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

interface ToolbarProps {
  onAddTask: () => void;
  onImport: () => void;
  onExport: () => void;
  onPrint: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onToday: () => void;
  zoomLevel: string;
  selectedTaskId: string | number | null;
  onDeleteTask: () => void;
  onMoveTaskUp: () => void;
  onMoveTaskDown: () => void;
  onIndentTask: () => void;
  onOutdentTask: () => void;
}
export default function Toolbar({
  onAddTask,
  onImport,
  onExport,
  onPrint,
  onZoomIn,
  onZoomOut,
  onExpandAll,
  onCollapseAll,
  onToday,
  zoomLevel,
  selectedTaskId,
  onDeleteTask,
  onMoveTaskUp,
  onMoveTaskDown,
  onIndentTask,
  onOutdentTask,
}: ToolbarProps) {
  const { t } = useTranslation();

  const zoomLabels: Record<string, string> = {
    day: t("settings.day"),
    week: t("settings.week"),
    month: t("settings.month"),
    quarter: t("settings.quarter"),
    year: t("settings.year"),
  };

  return (
    <div className='app-toolbar'>
      <div className='toolbar-group'>
        <button className='btn btn-primary btn-sm' onClick={onAddTask}>
          <FiPlus /> {t("toolbar.addTask")}
        </button>
      </div>

      <div className='toolbar-separator' />

      <div className='toolbar-group'>
        <button className='btn btn-secondary btn-sm' onClick={onImport}>
          <FiUpload /> {t("toolbar.import")}
        </button>
        <button className='btn btn-secondary btn-sm' onClick={onExport}>
          <FiDownload /> {t("toolbar.export")}
        </button>
        <button className='btn btn-secondary btn-sm' onClick={onPrint}>
          <FiPrinter /> {t("toolbar.print")}
        </button>
      </div>

      <div className='toolbar-separator' />

      <div className='toolbar-group'>
        <button
          className='btn btn-ghost btn-icon btn-sm tooltip'
          data-tooltip={t("toolbar.zoomOut")}
          onClick={onZoomOut}>
          <FiZoomOut />
        </button>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            padding: "0 4px",
            minWidth: "40px",
            textAlign: "center",
          }}>
          {zoomLabels[zoomLevel] || zoomLevel}
        </span>
        <button className='btn btn-ghost btn-icon btn-sm tooltip' data-tooltip={t("toolbar.zoomIn")} onClick={onZoomIn}>
          <FiZoomIn />
        </button>
      </div>

      <div className='toolbar-separator' />

      <div className='toolbar-group'>
        <button
          className='btn btn-ghost btn-icon btn-sm tooltip'
          data-tooltip={t("toolbar.expandAll")}
          onClick={onExpandAll}>
          <FiChevronsDown />
        </button>
        <button
          className='btn btn-ghost btn-icon btn-sm tooltip'
          data-tooltip={t("toolbar.collapseAll")}
          onClick={onCollapseAll}>
          <FiChevronsUp />
        </button>
        <button className='btn btn-ghost btn-sm' onClick={onToday}>
          <FiCalendar /> {t("toolbar.today")}
        </button>
      </div>

      <div className='toolbar-separator' />
      <div className='toolbar-group'>
        <button
          className='btn btn-ghost btn-icon btn-sm tooltip'
          data-tooltip={t("toolbar.moveUp")}
          disabled={!selectedTaskId}
          onClick={onMoveTaskUp}>
          <FiArrowUp />
        </button>
        <button
          className='btn btn-ghost btn-icon btn-sm tooltip'
          data-tooltip={t("toolbar.moveDown")}
          disabled={!selectedTaskId}
          onClick={onMoveTaskDown}>
          <FiArrowDown />
        </button>
        <button
          className='btn btn-ghost btn-icon btn-sm tooltip'
          data-tooltip={t("toolbar.indent")}
          disabled={!selectedTaskId}
          onClick={onIndentTask}>
          {t("dir") === "rtl" ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
        <button
          className='btn btn-ghost btn-icon btn-sm tooltip'
          data-tooltip={t("toolbar.outdent")}
          disabled={!selectedTaskId}
          onClick={onOutdentTask}>
          {t("dir") === "rtl" ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
        <button
          className='btn btn-ghost btn-icon btn-sm tooltip'
          data-tooltip={t("toolbar.deleteTask")}
          disabled={!selectedTaskId}
          onClick={onDeleteTask}
          style={{ color: !selectedTaskId ? "var(--text-muted)" : "var(--color-danger)" }}>
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}
