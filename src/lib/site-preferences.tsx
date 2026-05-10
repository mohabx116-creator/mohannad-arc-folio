/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "ar";
export type Theme = "dark" | "light";

type SitePreferencesContextValue = {
  language: Language;
  theme: Theme;
  isArabic: boolean;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (key: TranslationKey) => string;
};

const languageKey = "mohannad-portfolio-language";
const themeKey = "mohannad-portfolio-theme";

const SitePreferencesContext = createContext<SitePreferencesContextValue | null>(null);

export const translations = {
  en: {
    studio: "El Nady Studio",
    portfolioLabel: "Architectural Portfolio",
    heroKicker: "Architectural Engineering / Mixed-Use Design",
    heroTitleName: "Mohannad",
    heroTitlePortfolio: "Architectural Portfolio",
    heroDescription:
      "A focused architectural portfolio led by Al Se7r Tower, a mixed-use mall and tower development documented through planning, sections, elevations, renders, and final boards.",
    viewPortfolio: "View Portfolio",
    adminDashboard: "Admin Dashboard",
    egypt: "Egypt",
    caseStudyFooter: "Al Se7r Tower Case Study",
    home: "Home",
    contact: "Contact",
    portfolio: "Portfolio",
    noProjects: "No published projects",
    unavailablePortfolio: "The portfolio content is currently unavailable.",
    mohannadPortfolio: "Mohannad Portfolio",
    featuredCaseStudy: "Featured Architectural Case Study",
    viewCaseStudy: "View Case Study",
    projectInquiry: "Project Inquiry",
    inquiryCta: "Project Inquiry",
    projectOverview: "Project Overview",
    caseStudyUnavailable: "Case study not published",
    caseStudyUnavailableBody: "This project is currently unavailable.",
    returnPortfolio: "Return to Portfolio",
    discussProject: "Discuss a refined architectural project.",
    contactMohannad: "Contact Mohannad",
    contactTitle: "Start a project conversation.",
    contactInstagram: "Instagram",
    contactNote: "Architectural portfolio inquiries",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    sendInquiry: "Send Inquiry",
    sending: "Sending...",
    messageSent: "Message sent.",
    messageFailed: "Could not send message.",
    requiredFields: "Please complete the required fields.",
    pdfPreview: "PDF Preview",
    viewPdf: "View PDF",
    download: "Download",
    loadMoreVisuals: "Load more visuals",
    close: "Close",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    switchLanguage: "العربية",
  },
  ar: {
    studio: "استوديو النادي",
    portfolioLabel: "بورتفوليو معماري",
    heroKicker: "هندسة معمارية / تصميم متعدد الاستخدامات",
    heroTitleName: "مهند",
    heroTitlePortfolio: "بورتفوليو معماري",
    heroDescription:
      "بورتفوليو معماري مركز يقوده مشروع برج السحر، وهو تطوير يضم مول وبرج متعدد الاستخدامات موثق من خلال المخططات والقطاعات والواجهات والرندرات ولوحات العرض النهائية.",
    viewPortfolio: "عرض البورتفوليو",
    adminDashboard: "لوحة التحكم",
    egypt: "مصر",
    caseStudyFooter: "دراسة حالة برج السحر",
    home: "الرئيسية",
    contact: "تواصل",
    portfolio: "البورتفوليو",
    noProjects: "لا توجد مشاريع منشورة",
    unavailablePortfolio: "محتوى البورتفوليو غير متاح حاليا.",
    mohannadPortfolio: "بورتفوليو مهند",
    featuredCaseStudy: "دراسة حالة معمارية مميزة",
    viewCaseStudy: "عرض دراسة الحالة",
    projectInquiry: "استفسار عن مشروع",
    inquiryCta: "استفسار عن مشروع",
    projectOverview: "نظرة عامة على المشروع",
    caseStudyUnavailable: "دراسة الحالة غير منشورة",
    caseStudyUnavailableBody: "هذا المشروع غير متاح حاليا.",
    returnPortfolio: "العودة إلى البورتفوليو",
    discussProject: "ناقش مشروعا معماريا متقنا.",
    contactMohannad: "تواصل مع مهند",
    contactTitle: "ابدأ محادثة عن مشروعك.",
    contactInstagram: "إنستجرام",
    contactNote: "استفسارات البورتفوليو المعماري",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    message: "الرسالة",
    sendInquiry: "إرسال الاستفسار",
    sending: "جاري الإرسال...",
    messageSent: "تم إرسال الرسالة.",
    messageFailed: "تعذر إرسال الرسالة.",
    requiredFields: "يرجى استكمال الحقول المطلوبة.",
    pdfPreview: "معاينة PDF",
    viewPdf: "عرض PDF",
    download: "تحميل",
    loadMoreVisuals: "عرض المزيد من الصور",
    close: "إغلاق",
    themeLight: "الوضع الفاتح",
    themeDark: "الوضع الداكن",
    switchLanguage: "English",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function SitePreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(languageKey);
    const storedTheme = window.localStorage.getItem(themeKey);
    if (storedLanguage === "en" || storedLanguage === "ar") setLanguageState(storedLanguage);
    if (storedTheme === "dark" || storedTheme === "light") setThemeState(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.toggle("theme-light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [language, theme]);

  const value = useMemo<SitePreferencesContextValue>(() => {
    const setLanguage = (nextLanguage: Language) => {
      setLanguageState(nextLanguage);
      window.localStorage.setItem(languageKey, nextLanguage);
    };
    const setTheme = (nextTheme: Theme) => {
      setThemeState(nextTheme);
      window.localStorage.setItem(themeKey, nextTheme);
    };

    return {
      language,
      theme,
      isArabic: language === "ar",
      setLanguage,
      setTheme,
      toggleLanguage: () => setLanguage(language === "ar" ? "en" : "ar"),
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      t: (key) => translations[language][key],
    };
  }, [language, theme]);

  return (
    <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  const context = useContext(SitePreferencesContext);
  if (!context) throw new Error("useSitePreferences must be used within SitePreferencesProvider");
  return context;
}
