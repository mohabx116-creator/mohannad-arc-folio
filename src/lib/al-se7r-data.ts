// Al Se7r Tower — case study asset map.
// Display names only. Raw file names are never shown to visitors.

export type AssetKind = "image" | "drawing";

export type Asset = {
  src: string;
  label: string;
  kind: AssetKind;
};

export type CaseStudySection = {
  id: string;
  index: string;
  category: string;
  title: string;
  description: string;
  assets: Asset[];
  layout?: "grid" | "wide" | "single";
};

const base = "/portfolio/alse7r";

export const alSe7r = {
  slug: "al-se7r-tower",
  title: "Al Se7r Tower",
  subtitle: "Mixed-Use Mall & Tower Development",
  category: "Mixed-Use Architecture / Commercial Design",
  hero: `${base}/renders/exterior-render-01.png`,
  heroAlt: `${base}/renders/exterior-render-02.png`,
  poster: `${base}/poster/final-presentation-board.jpg`,
  summary:
    "A mixed-use architectural development combining retail, hospitality, office, business incubation, parking, and tower functions within a coordinated commercial complex. The project explores the relationship between public movement, commercial visibility, vertical circulation, workplace flexibility, and hospitality planning.",
  metadata: [
    { label: "Project Type", value: "Mixed-Use Commercial Development" },
    { label: "Category", value: "Mixed-Use Architecture / Commercial Design" },
    {
      label: "Scope",
      value:
        "Architectural Planning · Commercial Layout · Hospitality · Workplace · Elevations · Sections · Visualization",
    },
    { label: "Status", value: "Portfolio Project" },
  ],
  sections: [
    {
      id: "overview",
      index: "01",
      category: "Overview",
      title: "A coherent mixed-use complex",
      description:
        "The presentation communicates a complete architectural workflow — from site organization and basement strategy through commercial, hospitality, and workplace planning, culminating in elevations, sections, and final visualization.",
      layout: "wide",
      assets: [
        { src: `${base}/renders/exterior-render-01.png`, label: "Exterior Render — Tower Composition", kind: "image" },
        { src: `${base}/renders/exterior-render-02.png`, label: "Exterior Render — Mall Frontage", kind: "image" },
      ],
    },
    {
      id: "elevations",
      index: "02",
      category: "Elevations & Sections",
      title: "Architectural expression and sectional logic",
      description:
        "Façade studies, vertical relationships, sectional logic, core organization, and the tower-to-mall composition expressed through elevations and sections.",
      layout: "grid",
      assets: [
        { src: `${base}/sections/main-elevation.png`, label: "Main Elevation", kind: "drawing" },
        { src: `${base}/sections/secondary-elevation.png`, label: "Secondary Elevation", kind: "drawing" },
        { src: `${base}/sections/mall-section.png`, label: "Mall Section", kind: "drawing" },
        { src: `${base}/sections/tower-mall-section.png`, label: "Tower & Mall Section", kind: "drawing" },
        { src: `${base}/sections/core-section.png`, label: "Core Section", kind: "drawing" },
      ],
    },
    {
      id: "elevation-studies",
      index: "03",
      category: "Elevations & Sections",
      title: "Elevation studies",
      description:
        "Iterative façade studies exploring proportion, fenestration rhythm, and the dialogue between the tower mass and the commercial podium.",
      layout: "grid",
      assets: [
        { src: `${base}/elevations/elevation-study-01.png`, label: "Elevation Study I", kind: "image" },
        { src: `${base}/elevations/elevation-study-02.png`, label: "Elevation Study II", kind: "image" },
        { src: `${base}/elevations/elevation-study-03.png`, label: "Elevation Study III", kind: "image" },
        { src: `${base}/elevations/elevation-study-04.png`, label: "Elevation Study IV", kind: "image" },
        { src: `${base}/elevations/elevation-study-05.png`, label: "Elevation Study V", kind: "image" },
        { src: `${base}/elevations/elevation-study-06.png`, label: "Elevation Study VI", kind: "image" },
      ],
    },
    {
      id: "rendered-plans",
      index: "04",
      category: "Visualization",
      title: "Rendered plans",
      description:
        "Plans rendered as atmospheric drawings — communicating program, circulation, and spatial hierarchy in a presentation-ready language.",
      layout: "grid",
      assets: [
        { src: `${base}/rendered-plans/rendered-plan-01.png`, label: "Rendered Plan I", kind: "image" },
        { src: `${base}/rendered-plans/rendered-plan-02.png`, label: "Rendered Plan II", kind: "image" },
        { src: `${base}/rendered-plans/rendered-plan-03.png`, label: "Rendered Plan III", kind: "image" },
        { src: `${base}/rendered-plans/rendered-plan-04.png`, label: "Rendered Plan IV", kind: "image" },
      ],
    },
    {
      id: "visualization",
      index: "05",
      category: "Visualization",
      title: "Exterior visualization",
      description:
        "Selected atmospheric shots and rendered views communicating the project's material identity, scale, and presence.",
      layout: "grid",
      assets: [
        { src: `${base}/renders/exterior-render-03.png`, label: "Exterior Render — Approach", kind: "image" },
        { src: `${base}/renders/exterior-render-04.png`, label: "Exterior Render — Plaza", kind: "image" },
        { src: `${base}/renders/exterior-render-05.png`, label: "Exterior Render — Evening", kind: "image" },
        { src: `${base}/renders/atmospheric-backdrop.png`, label: "Atmospheric Backdrop", kind: "image" },
      ],
    },
    {
      id: "final-presentation",
      index: "06",
      category: "Final Presentation",
      title: "Final presentation board",
      description:
        "The consolidated presentation board summarizing the project's architectural intent, planning, and visualization.",
      layout: "single",
      assets: [
        { src: `${base}/poster/final-presentation-board.jpg`, label: "Final Presentation Board", kind: "image" },
      ],
    },
  ] satisfies CaseStudySection[],
};

export const alSe7rFilters = [
  "Overview",
  "Elevations & Sections",
  "Visualization",
  "Final Presentation",
];
