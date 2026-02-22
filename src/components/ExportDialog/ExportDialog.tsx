import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiX, FiDownload, FiFileText, FiImage, FiFile, FiCode, FiDatabase } from "react-icons/fi";
import { exportData } from "../../lib/exportEngine";
import type { GanttData, BrandingConfig, ExportFormat, ExportOptions } from "../../types";

interface ExportDialogProps {
  data: GanttData;
  branding: BrandingConfig;
  onClose: () => void;
}

const FORMAT_OPTIONS: { id: ExportFormat; icon: React.ReactNode }[] = [
  { id: "pdf", icon: <FiFileText /> },
  { id: "png", icon: <FiImage /> },
  { id: "excel", icon: <FiFile /> },
  { id: "csv", icon: <FiDatabase /> },
  { id: "json", icon: <FiCode /> },
  { id: "yaml", icon: <FiCode /> },
];

export default function ExportDialog({ data, branding, onClose }: ExportDialogProps) {
  const { t } = useTranslation();
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [includeBranding, setIncludeBranding] = useState(true);
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [pageSize, setPageSize] = useState<"A4" | "A3" | "Letter">("A4");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    const options: ExportOptions = {
      format,
      includeBranding,
      orientation,
      pageSize,
    };
    try {
      await exportData(format, data, branding, options);
    } catch (err) {
      console.error("Export failed:", err);
    }
    setExporting(false);
    onClose();
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' style={{ width: "520px" }} onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2 className='modal-title'>{t("export.title")}</h2>
          <button className='btn btn-ghost btn-icon' onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className='modal-body'>
          <div className='form-group'>
            <label className='form-label'>{t("export.format")}</label>
            <div className='export-options'>
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`export-option ${format === opt.id ? "selected" : ""}`}
                  onClick={() => setFormat(opt.id)}>
                  <span className='export-option-icon'>{opt.icon}</span>
                  <span className='export-option-label'>{t(`export.${opt.id}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {(format === "pdf" || format === "png") && (
            <>
              <div className='form-group'>
                <label className='form-checkbox'>
                  <input
                    type='checkbox'
                    checked={includeBranding}
                    onChange={(e) => setIncludeBranding(e.target.checked)}
                  />
                  {t("export.includeBranding")}
                </label>
              </div>

              {format === "pdf" && (
                <div style={{ display: "flex", gap: "var(--space-md)" }}>
                  <div className='form-group' style={{ flex: 1 }}>
                    <label className='form-label'>{t("export.pageSize")}</label>
                    <select
                      className='form-select'
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value as "A4" | "A3" | "Letter")}>
                      <option value='A4'>A4</option>
                      <option value='A3'>A3</option>
                      <option value='Letter'>Letter</option>
                    </select>
                  </div>
                  <div className='form-group' style={{ flex: 1 }}>
                    <label className='form-label'>{t("export.landscape")}</label>
                    <select
                      className='form-select'
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as "landscape" | "portrait")}>
                      <option value='landscape'>{t("export.landscape")}</option>
                      <option value='portrait'>{t("export.portrait")}</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className='modal-footer'>
          <button className='btn btn-secondary' onClick={onClose}>
            {t("export.cancel")}
          </button>
          <button className='btn btn-primary' onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <>
                <div className='spinner' style={{ width: 14, height: 14 }} /> {t("export.exporting")}
              </>
            ) : (
              <>
                <FiDownload /> {t("export.download")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
