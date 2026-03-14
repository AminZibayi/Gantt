import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiUploadCloud, FiX, FiAlertCircle, FiAlertTriangle, FiCheck } from "react-icons/fi";
import { useFileImport } from "../../lib/importEngine";
import type { ImportResult, GanttData } from "../../types";

interface ImportDialogProps {
  onClose: () => void;
  onImport: (data: GanttData) => void;
}

export default function ImportDialog({ onClose, onImport }: ImportDialogProps) {
  const { t } = useTranslation();
  const { importFile } = useFileImport();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setLoading(true);
      try {
        const res = await importFile(file);
        setResult(res);
      } catch {
        setResult({
          data: [],
          links: [],
          errors: [{ message: t("import.error"), severity: "error" }],
          warnings: [],
        });
      }
      setLoading(false);
    },
    [importFile, t],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleConfirm = () => {
    if (result && result.data.length > 0) {
      onImport({ data: result.data, links: result.links });
      onClose();
    }
  };

  const hasErrors = result && result.errors.length > 0;
  const hasWarnings = result && result.warnings.length > 0;
  const canImport = result && result.data.length > 0 && result.errors.length === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: "640px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("import.title")}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {!result && !loading && (
            <>
              <div
                className={`dropzone ${dragOver ? "dragover" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropzone-icon">
                  <FiUploadCloud />
                </div>
                <div className="dropzone-text">{t("import.dropzone")}</div>
                <div className="dropzone-hint">{t("import.supportedFormats")}</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "var(--space-2xl)" }}>
              <div className="spinner" style={{ margin: "0 auto var(--space-md)" }} />
              <div style={{ color: "var(--text-secondary)" }}>{t("import.importing")}</div>
            </div>
          )}

          {result && (
            <>
              <div style={{ marginBottom: "var(--space-md)" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  📄 {fileName} — {t("import.rowCount")}: <strong>{result.data.length}</strong>
                </div>
              </div>

              {hasErrors && (
                <div style={{ marginBottom: "var(--space-md)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--color-danger)",
                      marginBottom: "8px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    <FiAlertCircle /> {t("import.validationErrors")} ({result.errors.length})
                  </div>
                  <table className="validation-table">
                    <thead>
                      <tr>
                        <th>{t("validation.severity")}</th>
                        <th>{t("validation.row")}</th>
                        <th>{t("validation.column")}</th>
                        <th>{t("validation.error")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.map((err, i) => (
                        <tr key={i}>
                          <td>
                            <span className="error-badge error">{t("validation.error")}</span>
                          </td>
                          <td>{err.row || "-"}</td>
                          <td>{err.column || "-"}</td>
                          <td className="validation-error">
                            {t(`validation.${err.message}`, {
                              column: err.column,
                              row: err.row,
                              value: err.value,
                              id: err.value,
                              parent: err.value,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {hasWarnings && (
                <div style={{ marginBottom: "var(--space-md)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--color-warning)",
                      marginBottom: "8px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    <FiAlertTriangle /> {t("validation.warning")} ({result.warnings.length})
                  </div>
                  <table className="validation-table">
                    <thead>
                      <tr>
                        <th>{t("validation.severity")}</th>
                        <th>{t("validation.row")}</th>
                        <th>{t("validation.column")}</th>
                        <th>{t("validation.error")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.warnings.map((w, i) => (
                        <tr key={i}>
                          <td>
                            <span className="error-badge warning">{t("validation.warning")}</span>
                          </td>
                          <td>{w.row || "-"}</td>
                          <td>{w.column || "-"}</td>
                          <td className="validation-warning">
                            {t(`validation.${w.message}`, {
                              column: w.column,
                              row: w.row,
                              value: w.value,
                              id: w.value,
                              parent: w.value,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {canImport && result.data.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginBottom: "8px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {t("import.preview")}
                  </div>
                  <div className="preview-table-wrapper">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>{t("gantt.taskName")}</th>
                          <th>{t("gantt.startDate")}</th>
                          <th>{t("gantt.duration")}</th>
                          <th>{t("gantt.progress")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.data.slice(0, 20).map((task) => (
                          <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor: task.color || "#4361ee",
                                  marginInlineEnd: 6,
                                }}
                              />
                              {task.text}
                            </td>
                            <td>{task.start_date}</td>
                            <td>{task.duration}</td>
                            <td>{task.progress ? `${Math.round(task.progress * 100)}%` : "0%"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {result.data.length > 20 && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: "8px",
                        textAlign: "center",
                      }}
                    >
                      ... و {result.data.length - 20} مورد دیگر
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={result ? () => setResult(null) : onClose}>
            {result ? t("common.back") : t("import.cancel")}
          </button>
          {canImport && (
            <button className="btn btn-primary" onClick={handleConfirm}>
              <FiCheck /> {t("import.confirm")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
