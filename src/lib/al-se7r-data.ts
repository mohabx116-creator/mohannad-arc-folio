export type AssetType = "image" | "pdf" | "file";

export type PortfolioAsset = {
  id: string;
  src: string;
  originalUrl?: string;
  originalFilename: string;
  storagePath: string;
  displayName: string;
  caption: string;
  type: AssetType;
  mimeType: string;
  fileSize?: number;
  thumbnailUrl?: string;
  category: string;
  sectionId: string;
  isHero?: boolean;
  isCover?: boolean;
  published?: boolean;
  order: number;
};

export type CaseStudySection = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  order: number;
  published: boolean;
  assets: PortfolioAsset[];
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  hero: string;
  cover: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  metadata: { label: string; value: string }[];
  sections: CaseStudySection[];
};

const archive = "/portfolio/alse7r/archive";

const pdf = (sectionId: string, order: number, file: string, displayName: string, caption: string, category = "plan"): PortfolioAsset => ({
  id: `${sectionId}-${file.replace(".pdf", "")}`,
  src: `${archive}/technical-drawings/${file}`,
  originalUrl: `${archive}/technical-drawings/${file}`,
  originalFilename: file,
  storagePath: `portfolio/alse7r/archive/technical-drawings/${file}`,
  displayName,
  caption,
  type: "pdf",
  mimeType: "application/pdf",
  category,
  sectionId,
  order,
  published: true,
});

const image = (sectionId: string, order: number, path: string, displayName: string, caption: string, category = "render"): PortfolioAsset => ({
  id: `${sectionId}-${path.replace(/[/.]/g, "-")}`,
  src: `${archive}/${path}`,
  originalUrl: `${archive}/${path}`,
  originalFilename: path.split("/").pop() ?? path,
  storagePath: `portfolio/alse7r/archive/${path}`,
  displayName,
  caption,
  type: "image",
  mimeType: path.endsWith(".jpg") ? "image/jpeg" : "image/png",
  category,
  sectionId,
  order,
  published: true,
});

const finalPresentationPdf: PortfolioAsset = {
  id: "visualization-final-presentation-pdf",
  src: `${archive}/presentation-files/al-se7r-tower-final-presentation.pdf`,
  originalUrl: `${archive}/presentation-files/al-se7r-tower-final-presentation.pdf`,
  originalFilename: "Al Se7r Tower Final.pdf",
  storagePath: "portfolio/alse7r/archive/presentation-files/al-se7r-tower-final-presentation.pdf",
  displayName: "Final Presentation PDF",
  caption: "Complete final presentation package with the full board sequence.",
  type: "pdf",
  mimeType: "application/pdf",
  category: "poster",
  sectionId: "visualization",
  order: 16,
  published: true,
};

export const alSe7rFilters = [
  "Overview",
  "Mixed-Use",
  "Retail",
  "Hospitality",
  "Workplace",
  "Technical Drawings",
  "Elevations & Sections",
  "Visualization",
  "Final Presentation",
];

export const alSe7r: PortfolioProject = {
  id: "al-se7r-tower",
  slug: "al-se7r-tower",
  title: "Al Se7r Tower",
  subtitle: "Mixed-Use Mall & Tower Development",
  category: "Mixed-Use Architecture / Commercial Design",
  shortDescription:
    "A complete mixed-use commercial and hospitality development presented through planning, technical documentation, elevations, sections, visualizations, and final presentation boards.",
  longDescription:
    "Al Se7r Tower is a mixed-use architectural development combining retail, hospitality, office, business incubation, parking, and tower functions within a coordinated commercial complex. The project explores the relationship between public movement, commercial visibility, vertical circulation, workplace flexibility, and hospitality planning.",
  hero: `${archive}/renders/exterior-render-01.png`,
  cover: `${archive}/poster/final-presentation-board.jpg`,
  isFeatured: true,
  isPublished: true,
  displayOrder: 1,
  metadata: [
    { label: "Project Type", value: "Mixed-Use Commercial Development" },
    { label: "Category", value: "Mixed-Use Architecture / Commercial Design" },
    { label: "Scope", value: "Planning, technical documentation, elevations, sections, visualization, and final presentation." },
    { label: "Content Source", value: "Imported project archive" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      subtitle: "A coordinated commercial and hospitality complex",
      category: "Overview",
      order: 1,
      published: true,
      description:
        "A complete mixed-use commercial and hospitality development presented through planning, technical documentation, elevations, sections, visualizations, and final presentation boards.",
      assets: [
        { ...image("overview", 1, "renders/exterior-render-01.png", "Exterior Render", "The tower and podium composition presented as the main project image."), isHero: true },
        { ...image("overview", 2, "poster/final-presentation-board.jpg", "Final Presentation Board", "Consolidated final board for the Al Se7r Tower case study.", "poster"), isCover: true },
      ],
    },
    {
      id: "master-planning",
      title: "Master Planning & Site Organization",
      subtitle: "Arrival, frontage, movement, and public access",
      category: "Mixed-Use",
      order: 2,
      published: true,
      description:
        "This section presents the project's site organization, ground-floor access, public movement, outdoor circulation, parking relationship, commercial frontage, and connection between exterior arrival zones and internal retail movement.",
      assets: [
        pdf("master-planning", 1, "site-plan.pdf", "Site Plan", "Site organization, outdoor circulation, parking relationship, and commercial frontage."),
        pdf("master-planning", 2, "ground-floor-plan.pdf", "Ground Floor Retail & Access Strategy", "Ground-floor access, arrival sequence, and internal retail movement."),
      ],
    },
    {
      id: "basement",
      title: "Basement & Parking Strategy",
      subtitle: "Vehicular movement and service connectivity",
      category: "Technical Drawings",
      order: 3,
      published: true,
      description:
        "This section presents the basement planning strategy, including parking organization, vehicular circulation, ramp access, service zones, and vertical core connectivity.",
      assets: [
        pdf("basement", 1, "basement-parking-plan.pdf", "Basement Plan", "Parking organization, vehicular circulation, ramp access, and service zones.", "plan"),
      ],
    },
    {
      id: "commercial-mall",
      title: "Commercial Mall Planning",
      subtitle: "Retail distribution and commercial visibility",
      category: "Retail",
      order: 4,
      published: true,
      description:
        "This section presents the mall planning system, including retail unit distribution, public circulation, vertical cores, commercial visibility, tenant flexibility, and shared facilities.",
      assets: [
        pdf("commercial-mall", 1, "mall-first-floor-plan.pdf", "Mall First Floor Plan", "Retail unit distribution and public circulation at the first mall level."),
        pdf("commercial-mall", 2, "mall-second-floor-plan.pdf", "Mall Second Floor Plan", "Upper mall planning, tenant flexibility, and vertical core relationships."),
      ],
    },
    {
      id: "hospitality",
      title: "Hospitality Planning",
      subtitle: "Hotel rooms, restaurant planning, and guest circulation",
      category: "Hospitality",
      order: 5,
      published: true,
      description:
        "This section presents the hospitality layer of the project, including hotel planning, guest-room organization, restaurant layout, seating zones, kitchen/service relationships, and guest circulation.",
      assets: [
        pdf("hospitality", 1, "hotel-floor-plan.pdf", "Hotel Floor Plan", "Guest-room organization, service relationships, and hotel circulation."),
        pdf("hospitality", 2, "hotel-restaurant-plan.pdf", "Hotel Restaurant Plan", "Restaurant seating zones, kitchen/service flow, and guest movement."),
      ],
    },
    {
      id: "workplace",
      title: "Workplace & Business Incubator Planning",
      subtitle: "Flexible office layouts and shared work environments",
      category: "Workplace",
      order: 6,
      published: true,
      description:
        "This section presents the workplace layer of the project, including business incubators, office units, shared workspaces, meeting areas, lounge spaces, service cores, and flexible workplace planning.",
      assets: [
        pdf("workplace", 1, "business-incubator-floor-plan.pdf", "Business Incubator Floor Plan", "Flexible workspaces, shared facilities, meeting areas, and service core planning."),
        pdf("workplace", 2, "large-companies-floor-plan.pdf", "Large Companies Floor Plan", "Office planning for larger company floor plates and shared workplace support."),
      ],
    },
    {
      id: "elevations-sections",
      title: "Elevations & Sections",
      subtitle: "Facade studies and sectional logic",
      category: "Elevations & Sections",
      order: 7,
      published: true,
      description:
        "This section presents the architectural expression, facade studies, vertical relationships, sectional logic, core organization, tower-to-mall relationship, and overall building composition.",
      assets: [
        pdf("elevations-sections", 1, "main-elevation.pdf", "Main Elevation", "Primary facade composition and commercial podium expression.", "elevation"),
        pdf("elevations-sections", 2, "secondary-elevation.pdf", "Secondary Elevation", "Secondary facade rhythm, massing, and architectural articulation.", "elevation"),
        pdf("elevations-sections", 3, "core-section.pdf", "Core Section", "Vertical core organization and circulation relationships.", "section"),
        pdf("elevations-sections", 4, "mall-section.pdf", "Mall Section", "Sectional reading of the mall volume and public spaces.", "section"),
        pdf("elevations-sections", 5, "tower-mall-section.pdf", "Tower & Mall Section", "Relationship between tower, mall, cores, and podium levels.", "section"),
        image("elevations-sections", 6, "elevations/elevation-study-01.png", "Facade Study I", "Facade proportion and commercial frontage study.", "elevation"),
        image("elevations-sections", 7, "elevations/elevation-study-02.png", "Facade Study II", "Tower elevation rhythm and facade massing study.", "elevation"),
        image("elevations-sections", 8, "elevations/elevation-study-03.png", "Facade Study III", "Podium-to-tower visual relationship study.", "elevation"),
        image("elevations-sections", 9, "elevations/elevation-study-04.png", "Facade Study IV", "Facade articulation and vertical composition study.", "elevation"),
        image("elevations-sections", 10, "elevations/elevation-study-05.png", "Facade Study V", "Commercial identity and tower expression study.", "elevation"),
        image("elevations-sections", 11, "elevations/elevation-study-06.png", "Facade Study VI", "Final facade atmosphere and massing study.", "elevation"),
      ],
    },
    {
      id: "visualization",
      title: "Visualization & Final Presentation",
      subtitle: "Rendered views, rendered plans, and final boards",
      category: "Visualization",
      order: 8,
      published: true,
      description:
        "This section presents the project's final visual communication, including rendered views, rendered plans, presentation boards, and selected atmospheric shots.",
      assets: [
        image("visualization", 1, "renders/exterior-render-02.png", "Exterior Render I", "Exterior view emphasizing the tower and commercial podium.", "render"),
        image("visualization", 2, "renders/exterior-render-03.png", "Exterior Render II", "Arrival and frontage atmosphere.", "render"),
        image("visualization", 3, "renders/exterior-render-04.png", "Exterior Render III", "Commercial frontage and public realm view.", "render"),
        image("visualization", 4, "renders/exterior-render-05.png", "Exterior Render IV", "Evening view and tower presence.", "render"),
        image("visualization", 5, "renders/atmospheric-backdrop.png", "Atmospheric View", "Selected atmosphere image used for presentation context.", "render"),
        image("visualization", 6, "rendered-plans/rendered-plan-01.png", "Rendered Plan I", "Rendered planning sheet for spatial communication.", "rendered-plan"),
        image("visualization", 7, "rendered-plans/rendered-plan-02.png", "Rendered Plan II", "Rendered planning sheet showing program and movement.", "rendered-plan"),
        image("visualization", 8, "rendered-plans/rendered-plan-03.png", "Rendered Plan III", "Rendered planning sheet for presentation sequence.", "rendered-plan"),
        image("visualization", 9, "rendered-plans/rendered-plan-04.png", "Rendered Plan IV", "Rendered planning sheet emphasizing program hierarchy.", "rendered-plan"),
        image("visualization", 10, "poster/final-presentation-board.jpg", "Final Presentation Board", "Final presentation board imported from the project archive.", "poster"),
        finalPresentationPdf,
      ],
    },
  ],
};

export const allAlSe7rAssets = alSe7r.sections.flatMap((section) => section.assets);
