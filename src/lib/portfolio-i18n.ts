import type { CaseStudySection, PortfolioAsset, PortfolioProject } from "@/lib/al-se7r-data";
import type { Language } from "@/lib/site-preferences";

const filterLabels: Record<Language, Record<string, string>> = {
  en: {},
  ar: {
    Overview: "نظرة عامة",
    "Mixed-Use": "متعدد الاستخدامات",
    Retail: "تجاري",
    Hospitality: "ضيافة",
    Workplace: "مساحات عمل",
    "Technical Drawings": "رسومات تنفيذية",
    "Elevations & Sections": "واجهات وقطاعات",
    Visualization: "رندرات وعرض",
    "Final Presentation": "العرض النهائي",
  },
};

const projectCopy = {
  ar: {
    title: "برج السحر",
    subtitle: "مول وبرج متعدد الاستخدامات",
    category: "عمارة متعددة الاستخدامات / تصميم تجاري",
    shortDescription:
      "مشروع تجاري وفندقي متعدد الاستخدامات مقدم من خلال التخطيط والتوثيق الفني والواجهات والقطاعات والرندرات ولوحات العرض النهائية.",
    longDescription:
      "برج السحر مشروع معماري متعدد الاستخدامات يجمع بين التجزئة والضيافة والمكاتب وحاضنات الأعمال ومواقف السيارات ووظائف البرج داخل مجمع تجاري منسق. يستكشف المشروع العلاقة بين حركة الجمهور والوضوح التجاري والحركة الرأسية ومرونة مساحات العمل والتخطيط الفندقي.",
  },
} as const;

const metadataLabels: Record<Language, Record<string, string>> = {
  en: {},
  ar: {
    "Project Type": "نوع المشروع",
    Category: "التصنيف",
    Scope: "نطاق العمل",
    "Content Source": "مصدر المحتوى",
  },
};

const metadataValues: Record<Language, Record<string, string>> = {
  en: {},
  ar: {
    "Mixed-Use Commercial Development": "تطوير تجاري متعدد الاستخدامات",
    "Mixed-Use Architecture / Commercial Design": "عمارة متعددة الاستخدامات / تصميم تجاري",
    "Planning, technical documentation, elevations, sections, visualization, and final presentation.":
      "تخطيط، توثيق فني، واجهات، قطاعات، رندرات، وعرض نهائي.",
    "Imported project archive": "أرشيف المشروع المستورد",
  },
};

const sections: Record<string, Partial<CaseStudySection>> = {
  overview: {
    title: "نظرة عامة",
    subtitle: "مجمع تجاري وفندقي منسق",
    category: "نظرة عامة",
    description:
      "مشروع تجاري وفندقي متعدد الاستخدامات مقدم من خلال التخطيط والتوثيق الفني والواجهات والقطاعات والرندرات ولوحات العرض النهائية.",
  },
  "master-planning": {
    title: "التخطيط العام وتنظيم الموقع",
    subtitle: "الوصول والواجهة والحركة والإتاحة العامة",
    category: "متعدد الاستخدامات",
    description:
      "يعرض هذا الجزء تنظيم الموقع والدخول من الدور الأرضي وحركة الجمهور وعلاقة مواقف السيارات بالواجهة التجارية والربط بين مناطق الوصول الخارجية والحركة الداخلية للمول.",
  },
  basement: {
    title: "استراتيجية البدروم ومواقف السيارات",
    subtitle: "حركة السيارات والربط الخدمي",
    category: "رسومات تنفيذية",
    description:
      "يعرض هذا الجزء استراتيجية تخطيط البدروم، بما يشمل تنظيم مواقف السيارات وحركة المركبات ومداخل المنحدرات ومناطق الخدمات والاتصال بالنواة الرأسية.",
  },
  "commercial-mall": {
    title: "تخطيط المول التجاري",
    subtitle: "توزيع المحلات والوضوح التجاري",
    category: "تجاري",
    description:
      "يعرض هذا الجزء نظام تخطيط المول، بما يشمل توزيع الوحدات التجارية وحركة الجمهور والنوى الرأسية والوضوح التجاري ومرونة المستأجرين والخدمات المشتركة.",
  },
  hospitality: {
    title: "تخطيط الضيافة",
    subtitle: "غرف الفندق والمطعم وحركة النزلاء",
    category: "ضيافة",
    description:
      "يعرض هذا الجزء طبقة الضيافة في المشروع، بما يشمل تخطيط الفندق وتنظيم غرف النزلاء وتخطيط المطعم ومناطق الجلوس وعلاقات المطبخ والخدمات وحركة النزلاء.",
  },
  workplace: {
    title: "تخطيط مساحات العمل وحاضنة الأعمال",
    subtitle: "مكاتب مرنة وبيئات عمل مشتركة",
    category: "مساحات عمل",
    description:
      "يعرض هذا الجزء طبقة العمل في المشروع، بما يشمل حاضنات الأعمال والوحدات المكتبية ومساحات العمل المشتركة وغرف الاجتماعات ومناطق الاستراحة ونوى الخدمات ومرونة التخطيط.",
  },
  "elevations-sections": {
    title: "الواجهات والقطاعات",
    subtitle: "دراسات الواجهة والمنطق القطاعي",
    category: "واجهات وقطاعات",
    description:
      "يعرض هذا الجزء التعبير المعماري ودراسات الواجهة والعلاقات الرأسية والمنطق القطاعي وتنظيم النواة وعلاقة البرج بالمول والتكوين العام للمبنى.",
  },
  visualization: {
    title: "الرندرات والعرض النهائي",
    subtitle: "مشاهد منظورة ومخططات ملونة ولوحات نهائية",
    category: "رندرات وعرض",
    description:
      "يعرض هذا الجزء الاتصال البصري النهائي للمشروع، بما يشمل الرندرات والمخططات الملونة ولوحات العرض ولقطات مختارة للأجواء.",
  },
};

const assetCopy: Record<string, Partial<PortfolioAsset>> = {
  "Exterior Render": {
    displayName: "رندر خارجي",
    caption: "تكوين البرج والقاعدة التجارية كصورة رئيسية للمشروع.",
  },
  "Final Presentation Board": {
    displayName: "لوحة العرض النهائية",
    caption: "لوحة نهائية مجمعة لدراسة حالة برج السحر.",
  },
  "Site Plan": {
    displayName: "مخطط الموقع",
    caption: "تنظيم الموقع والحركة الخارجية وعلاقة مواقف السيارات بالواجهة التجارية.",
  },
  "Ground Floor Retail & Access Strategy": {
    displayName: "استراتيجية الدور الأرضي والدخول التجاري",
    caption: "الدخول من الدور الأرضي وتسلسل الوصول والحركة الداخلية للتجزئة.",
  },
  "Basement Plan": {
    displayName: "مخطط البدروم",
    caption: "تنظيم مواقف السيارات وحركة المركبات ومداخل المنحدرات ومناطق الخدمة.",
  },
  "Mall First Floor Plan": {
    displayName: "مخطط الدور الأول للمول",
    caption: "توزيع الوحدات التجارية وحركة الجمهور في مستوى المول الأول.",
  },
  "Mall Second Floor Plan": {
    displayName: "مخطط الدور الثاني للمول",
    caption: "تخطيط المستوى العلوي للمول ومرونة المستأجرين وعلاقات النوى الرأسية.",
  },
  "Hotel Floor Plan": {
    displayName: "مخطط دور الفندق",
    caption: "تنظيم غرف النزلاء وعلاقات الخدمة وحركة الفندق.",
  },
  "Hotel Restaurant Plan": {
    displayName: "مخطط مطعم الفندق",
    caption: "مناطق الجلوس وتدفق المطبخ والخدمة وحركة النزلاء.",
  },
  "Business Incubator Floor Plan": {
    displayName: "مخطط دور حاضنة الأعمال",
    caption: "مساحات عمل مرنة وخدمات مشتركة وغرف اجتماعات ونواة خدمات.",
  },
  "Large Companies Floor Plan": {
    displayName: "مخطط دور الشركات الكبرى",
    caption: "تخطيط مكتبي للشركات الأكبر مع دعم مساحات العمل المشتركة.",
  },
  "Main Elevation": {
    displayName: "الواجهة الرئيسية",
    caption: "تكوين الواجهة الأساسية وتعبير القاعدة التجارية.",
  },
  "Secondary Elevation": {
    displayName: "الواجهة الثانوية",
    caption: "إيقاع الواجهة الثانوية والتشكيل المعماري.",
  },
  "Core Section": { displayName: "قطاع النواة", caption: "تنظيم النواة الرأسية وعلاقات الحركة." },
  "Mall Section": {
    displayName: "قطاع المول",
    caption: "قراءة قطاعية لحجم المول والفراغات العامة.",
  },
  "Tower & Mall Section": {
    displayName: "قطاع البرج والمول",
    caption: "العلاقة بين البرج والمول والنوى ومستويات القاعدة.",
  },
  "Final Presentation PDF": {
    displayName: "ملف العرض النهائي PDF",
    caption: "حزمة العرض النهائية الكاملة بتسلسل اللوحات.",
  },
};

export function translateFilter(filter: string, language: Language) {
  return filterLabels[language][filter] ?? filter;
}

export function localizeProject(project: PortfolioProject, language: Language): PortfolioProject {
  if (language === "en") return project;

  return {
    ...project,
    ...projectCopy.ar,
    metadata: project.metadata.map((item) => ({
      label: metadataLabels.ar[item.label] ?? item.label,
      value: metadataValues.ar[item.value] ?? item.value,
    })),
    sections: project.sections.map((section) => ({
      ...section,
      ...(sections[section.id] ?? {}),
      assets: section.assets.map((asset) => ({
        ...asset,
        ...(assetCopy[asset.displayName] ?? {}),
      })),
    })),
  };
}
