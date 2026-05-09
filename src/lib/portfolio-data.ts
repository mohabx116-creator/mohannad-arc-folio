// Static fallback content. Real data is loaded from Supabase by usePortfolioData.
import projectOutdoor from "@/assets/project-outdoor.jpg";
import projectFacade from "@/assets/project-facade.jpg";

export const fallback = {
  profile: {
    name: "Mohannad Mohamed El Nady",
    title: "Architectural Engineering Student & Interior Designer",
    location: "Egypt",
    bio: "Passionate architectural engineering student and interior designer based in Egypt, focused on creating refined residential and commercial spaces that blend functionality with timeless elegance. My practice explores the dialogue between materiality, light, and proportion across interiors, facades, and outdoor environments.",
  },
  experience: [
    { role: "Architectural Finishing Intern", company: "Private Finishing Office", location: "10th of Ramadan, Egypt" },
    { role: "Finishing & Contracting Trainee", company: "Al-Najjar General Contracting and Finishing", location: "Egypt" },
    { role: "Site Training / Construction Internship", company: "Protection Contracting Company", location: "Cairo, Egypt" },
  ],
  education: [
    { degree: "Bachelor of Architectural Engineering", institution: "Obour Institute of Engineering and Technology", end_date: "Expected July 2026", gpa: "2.9 / 4.0" },
  ],
  skills: [
    "Revit","AutoCAD","Photoshop","Enscape","D5 Render",
    "Technical Drawing","2D/3D Modeling","Rendering Presentation","Landscape Design","Site Coordination",
  ],
  services: [
    { title: "Interior Design", description: "Refined interior concepts blending materiality, light, and proportion." },
    { title: "Architectural Design", description: "Conceptual to detailed design for residential and commercial projects." },
    { title: "Residential Facade Design", description: "Distinctive facades balancing identity, climate, and craftsmanship." },
    { title: "3D Visualization", description: "Photorealistic visualization with Enscape and D5 Render." },
    { title: "Space Planning", description: "Functional and elegant space planning across program types." },
    { title: "Technical Drawings", description: "Construction-ready drawings in Revit and AutoCAD." },
    { title: "Landscape Concepts", description: "Outdoor environments designed as extensions of architectural identity." },
  ],
  projects: [
    {
      id: "1",
      title: "Modern Outdoor Space Design",
      category: "Landscape",
      location: "Egypt",
      year: "2024",
      cover_image: projectOutdoor,
      description: "A contemporary outdoor environment composed around natural materials, layered planting, and warm ambient lighting.",
      software: ["Revit","D5 Render","Photoshop"],
    },
    {
      id: "2",
      title: "Residential Building Facade Design",
      category: "Architecture",
      location: "Egypt",
      year: "2024",
      cover_image: projectFacade,
      description: "A residential facade study balancing modern proportions with warm Mediterranean materiality.",
      software: ["Revit","Enscape","AutoCAD"],
    },
  ],
  contact: {
    email: "mohannad.elnady@example.com",
    phone: "+20 100 000 0000",
    whatsapp: "+20 100 000 0000",
    linkedin: "https://www.linkedin.com/",
  },
};

export type PortfolioFallback = typeof fallback;
