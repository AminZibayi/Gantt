import { useTranslation } from "react-i18next";
import { FiSettings, FiGlobe } from "react-icons/fi";
import type { BrandingConfig } from "../../types";

interface HeaderProps {
  branding: BrandingConfig;
  language: string;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
}

export default function Header({ branding, language, onToggleLanguage, onOpenSettings }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className='app-header'>
      <div className='header-brand'>
        {branding.logoUrl && <img src={branding.logoUrl} alt='Logo' className='header-logo' />}
        <div>
          <div className='header-title'>{branding.companyName || t("header.brand")}</div>
          {branding.companyName && <div className='header-company'>{t("app.subtitle")}</div>}
        </div>
      </div>

      <div className='header-actions'>
        <div className='lang-toggle'>
          <button
            className={`lang-option ${language === "fa" ? "active" : ""}`}
            onClick={() => language !== "fa" && onToggleLanguage()}>
            فارسی
          </button>
          <button
            className={`lang-option ${language === "en" ? "active" : ""}`}
            onClick={() => language !== "en" && onToggleLanguage()}>
            English
          </button>
        </div>

        <button className='btn btn-ghost btn-icon tooltip' data-tooltip={t("header.settings")} onClick={onOpenSettings}>
          <FiSettings />
        </button>
      </div>
    </header>
  );
}
