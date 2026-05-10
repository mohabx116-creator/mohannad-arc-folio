import { Languages, Moon, Sun } from "lucide-react";
import { useSitePreferences } from "@/lib/site-preferences";

export function PreferenceControls({ className = "" }: { className?: string }) {
  const { isArabic, theme, t, toggleLanguage, toggleTheme } = useSitePreferences();
  const themeLabel = theme === "dark" ? t("themeLight") : t("themeDark");

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
        className="flex h-10 w-10 items-center justify-center border border-ivory/20 bg-onyx/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={toggleLanguage}
        className="inline-flex h-10 items-center justify-center gap-2 border border-ivory/20 bg-onyx/20 px-3 text-[10px] uppercase tracking-[0.22em] text-ivory/80 transition-colors hover:border-gold hover:text-gold"
        aria-label={t("switchLanguage")}
      >
        <Languages className="h-4 w-4" />
        <span>{isArabic ? "EN" : "AR"}</span>
      </button>
    </div>
  );
}
