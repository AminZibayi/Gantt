import { useLocalStorage } from "./useLocalStorage";
import type { BrandingConfig } from "../types";

const defaultBranding: BrandingConfig = {
  companyName: "",
  logoUrl: "",
  primaryColor: "#4361ee",
  secondaryColor: "#3a0ca3",
  accentColor: "#f72585",
};

export function useBranding() {
  const [branding, setBranding] = useLocalStorage<BrandingConfig>("branding", defaultBranding);

  const updateBranding = <K extends keyof BrandingConfig>(key: K, value: BrandingConfig[K]) => {
    setBranding((prev) => ({ ...prev, [key]: value }));
  };

  const setLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateBranding("logoUrl", e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    updateBranding("logoUrl", "");
  };

  const resetBranding = () => {
    setBranding(defaultBranding);
  };

  return { branding, setBranding, updateBranding, setLogo, removeLogo, resetBranding };
}
