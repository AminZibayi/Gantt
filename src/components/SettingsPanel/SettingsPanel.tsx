import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi";
import * as yaml from "js-yaml";
import type { AppSettings, BrandingConfig, GanttData } from "../../types";
import { ACTIVITY_COLORS } from "../../config/defaultData";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  branding: BrandingConfig;
  data: GanttData;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onUpdateBranding: <K extends keyof BrandingConfig>(key: K, value: BrandingConfig[K]) => void;
  onSetLogo: (file: File) => void;
  onRemoveLogo: () => void;
  onImportData: (data: GanttData) => void;
}

export default function SettingsPanel({
  open,
  onClose,
  settings,
  branding,
  data,
  onUpdateSetting,
  onUpdateBranding,
  onSetLogo,
  onRemoveLogo,
  onImportData,
}: SettingsPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"general" | "branding" | "data" | "colors">("general");
  const [yamlContent, setYamlContent] = useState("");
  const [yamlError, setYamlError] = useState("");

  const tabs = [
    { id: "general" as const, label: t("settings.general") },
    { id: "branding" as const, label: t("settings.branding") },
    { id: "data" as const, label: t("settings.data") },
    { id: "colors" as const, label: t("settings.colors") },
  ];

  const handleTabClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    if (tabId === "data") {
      setYamlContent(yaml.dump(data, { indent: 2, lineWidth: 120, noRefs: true }));
      setYamlError("");
    }
  };

  const handleYamlApply = () => {
    try {
      const parsed = yaml.load(yamlContent) as GanttData;
      if (parsed && parsed.data && Array.isArray(parsed.data)) {
        onImportData(parsed);
        setYamlError("");
      } else {
        setYamlError("Invalid data structure. Expected { data: [...], links: [...] }");
      }
    } catch (err) {
      setYamlError(String(err));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSetLogo(file);
  };

  const handleConfigExport = () => {
    const config = { settings, branding };
    const yamlStr = yaml.dump(config, { indent: 2, noRefs: true });
    const blob = new Blob([yamlStr], { type: "text/yaml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gantt-config.yaml";
    link.click();
  };

  const handleConfigImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const config = yaml.load(ev.target!.result as string) as any;
        if (config.settings) {
          Object.entries(config.settings).forEach(([key, val]) => {
            onUpdateSetting(key as keyof AppSettings, val as any);
          });
        }
        if (config.branding) {
          Object.entries(config.branding).forEach(([key, val]) => {
            onUpdateBranding(key as keyof BrandingConfig, val as any);
          });
        }
      } catch (err) {
        console.error("Config import error:", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {open && <div className='modal-overlay' style={{ background: "transparent" }} onClick={onClose} />}
      <div className={`settings-panel ${open ? "open" : ""}`}>
        <div className='settings-header'>
          <h3 className='settings-title'>{t("settings.title")}</h3>
          <button className='btn btn-ghost btn-icon' onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className='settings-tabs'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className='settings-body'>
          {/* ===== General Tab ===== */}
          {activeTab === "general" && (
            <>
              <div className='form-group'>
                <label className='form-label'>{t("settings.calendar")}</label>
                <select
                  className='form-select'
                  value={settings.calendar}
                  onChange={(e) => onUpdateSetting("calendar", e.target.value as any)}>
                  <option value='jalali'>{t("settings.calendarJalali")}</option>
                  <option value='gregorian'>{t("settings.calendarGregorian")}</option>
                </select>
              </div>

              <div className='form-group'>
                <label className='form-label'>{t("settings.zoomLevel")}</label>
                <select
                  className='form-select'
                  value={settings.zoomLevel}
                  onChange={(e) => onUpdateSetting("zoomLevel", e.target.value as any)}>
                  <option value='day'>{t("settings.day")}</option>
                  <option value='week'>{t("settings.week")}</option>
                  <option value='month'>{t("settings.month")}</option>
                  <option value='quarter'>{t("settings.quarter")}</option>
                  <option value='year'>{t("settings.year")}</option>
                </select>
              </div>

              <div className='form-group'>
                <label className='form-checkbox'>
                  <input
                    type='checkbox'
                    checked={settings.showProgress}
                    onChange={(e) => onUpdateSetting("showProgress", e.target.checked)}
                  />
                  {t("gantt.progress")}
                </label>
              </div>

              <div className='form-group'>
                <label className='form-checkbox'>
                  <input
                    type='checkbox'
                    checked={settings.showLinks}
                    onChange={(e) => onUpdateSetting("showLinks", e.target.checked)}
                  />
                  Link
                </label>
              </div>

              <div className='form-group'>
                <label className='form-checkbox'>
                  <input
                    type='checkbox'
                    checked={settings.showToday}
                    onChange={(e) => onUpdateSetting("showToday", e.target.checked)}
                  />
                  {t("toolbar.today")}
                </label>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--surface-border)",
                  paddingTop: "var(--space-md)",
                  marginTop: "var(--space-md)",
                }}>
                <div className='form-group'>
                  <label className='form-label'>{t("settings.saveConfig")}</label>
                  <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                    <button className='btn btn-secondary btn-sm' onClick={handleConfigExport}>
                      {t("settings.saveConfig")} (YAML)
                    </button>
                    <label className='btn btn-secondary btn-sm' style={{ cursor: "pointer" }}>
                      {t("settings.loadConfig")}
                      <input
                        type='file'
                        accept='.yaml,.yml,.json'
                        style={{ display: "none" }}
                        onChange={handleConfigImport}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===== Branding Tab ===== */}
          {activeTab === "branding" && (
            <>
              <div className='form-group'>
                <label className='form-label'>{t("settings.companyName")}</label>
                <input
                  type='text'
                  className='form-input'
                  value={branding.companyName}
                  onChange={(e) => onUpdateBranding("companyName", e.target.value)}
                  placeholder={t("settings.companyName")}
                />
              </div>

              <div className='form-group'>
                <label className='form-label'>{t("settings.companyLogo")}</label>
                {branding.logoUrl ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <img
                      src={branding.logoUrl}
                      alt='Logo'
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "contain",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--surface-elevated)",
                        padding: 4,
                      }}
                    />
                    <button className='btn btn-danger btn-sm' onClick={onRemoveLogo}>
                      <FiTrash2 /> {t("settings.removeLogo")}
                    </button>
                  </div>
                ) : (
                  <label className='btn btn-secondary btn-sm' style={{ cursor: "pointer" }}>
                    <FiUpload /> {t("settings.uploadLogo")}
                    <input type='file' accept='image/*' style={{ display: "none" }} onChange={handleLogoUpload} />
                  </label>
                )}
              </div>

              <div className='form-group'>
                <label className='form-label'>{t("settings.primaryColor")}</label>
                <div className='color-input-wrapper'>
                  <input
                    type='color'
                    value={branding.primaryColor}
                    onChange={(e) => onUpdateBranding("primaryColor", e.target.value)}
                  />
                  <span>{branding.primaryColor}</span>
                </div>
              </div>

              <div className='form-group'>
                <label className='form-label'>{t("settings.secondaryColor")}</label>
                <div className='color-input-wrapper'>
                  <input
                    type='color'
                    value={branding.secondaryColor}
                    onChange={(e) => onUpdateBranding("secondaryColor", e.target.value)}
                  />
                  <span>{branding.secondaryColor}</span>
                </div>
              </div>
            </>
          )}

          {/* ===== Data Tab (YAML Editor) ===== */}
          {activeTab === "data" && (
            <>
              <div className='form-group'>
                <label className='form-label'>{t("settings.editYaml")}</label>
                <textarea
                  className='code-editor'
                  value={yamlContent}
                  onChange={(e) => setYamlContent(e.target.value)}
                  dir='ltr'
                  style={{ fontFamily: "var(--font-mono)" }}
                />
              </div>
              {yamlError && (
                <div
                  style={{
                    color: "var(--color-danger)",
                    fontSize: "0.8rem",
                    marginBottom: "var(--space-md)",
                    padding: "var(--space-sm)",
                    background: "rgba(239,71,111,0.1)",
                    borderRadius: "var(--radius-sm)",
                  }}>
                  {yamlError}
                </div>
              )}
              <button className='btn btn-primary btn-sm' onClick={handleYamlApply}>
                {t("settings.save")}
              </button>
            </>
          )}

          {/* ===== Colors Tab ===== */}
          {activeTab === "colors" && (
            <>
              <div className='form-group'>
                <label className='form-label'>{t("settings.colors")}</label>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "var(--space-md)" }}>
                  {settings.language === "fa"
                    ? "پالت رنگ‌های موجود برای فعالیت‌ها:"
                    : "Available color palette for activities:"}
                </p>
                <div className='color-palette'>
                  {ACTIVITY_COLORS.map((c) => (
                    <div key={c.id} className='color-swatch' style={{ backgroundColor: c.color }} title={c.id} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
