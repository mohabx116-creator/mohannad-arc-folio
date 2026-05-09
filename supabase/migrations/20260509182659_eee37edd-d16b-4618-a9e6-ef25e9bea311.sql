
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users view own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Profile
create table public.profile (
  id int primary key default 1,
  name text not null default 'Mohannad Mohamed El Nady',
  title text not null default 'Architectural Engineering Student & Interior Designer',
  location text not null default 'Egypt',
  bio text default 'Passionate architectural engineering student and interior designer based in Egypt, focused on creating refined residential and commercial spaces that blend functionality with timeless elegance.',
  avatar_url text,
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id = 1)
);
alter table public.profile enable row level security;
insert into public.profile (id) values (1) on conflict do nothing;
create policy "public read profile" on public.profile for select using (true);
create policy "admin write profile" on public.profile for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Sections (generic editable text blocks)
create table public.sections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  title text,
  content text,
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.sections enable row level security;
create policy "public read sections" on public.sections for select using (visible = true);
create policy "admin write sections" on public.sections for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Skills
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  level int default 80,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.skills enable row level security;
create policy "public read skills" on public.skills for select using (true);
create policy "admin write skills" on public.skills for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.skills (name, category, sort_order) values
('Revit','Software',1),('AutoCAD','Software',2),('Photoshop','Software',3),
('Enscape','Software',4),('D5 Render','Software',5),
('Technical Drawing','Discipline',6),('2D/3D Modeling','Discipline',7),
('Rendering Presentation','Discipline',8),('Landscape Design','Discipline',9),
('Site Coordination','Discipline',10);

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  sort_order int not null default 0
);
alter table public.services enable row level security;
create policy "public read services" on public.services for select using (true);
create policy "admin write services" on public.services for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.services (title, description, sort_order) values
('Interior Design', 'Refined interior concepts blending materiality, light, and proportion.', 1),
('Architectural Design', 'Conceptual to detailed architectural design for residential and commercial projects.', 2),
('Residential Facade Design', 'Distinctive facades balancing identity, climate, and craftsmanship.', 3),
('3D Visualization', 'Photorealistic visualization with Enscape and D5 Render.', 4),
('Space Planning', 'Functional and elegant space planning across program types.', 5),
('Technical Drawings', 'Construction-ready drawings using Revit and AutoCAD.', 6),
('Landscape Concepts', 'Outdoor environments designed as extensions of architectural identity.', 7);

-- Experience
create table public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  location text,
  start_date text,
  end_date text,
  description text,
  sort_order int not null default 0
);
alter table public.experience enable row level security;
create policy "public read experience" on public.experience for select using (true);
create policy "admin write experience" on public.experience for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.experience (role, company, location, sort_order) values
('Architectural Finishing Intern', 'Private Finishing Office', '10th of Ramadan, Egypt', 1),
('Finishing & Contracting Trainee', 'Al-Najjar General Contracting and Finishing', 'Egypt', 2),
('Site Training / Construction Internship', 'Protection Contracting Company', 'Cairo, Egypt', 3);

-- Education
create table public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  start_date text,
  end_date text,
  gpa text,
  description text,
  sort_order int not null default 0
);
alter table public.education enable row level security;
create policy "public read education" on public.education for select using (true);
create policy "admin write education" on public.education for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.education (degree, institution, end_date, gpa, sort_order) values
('Bachelor of Architectural Engineering', 'Obour Institute of Engineering and Technology', 'Expected July 2026', '2.9 / 4.0', 1);

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  category text,
  location text,
  year text,
  description text,
  software text[],
  cover_image text,
  qr_code text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "public read published projects" on public.projects for select using (published = true);
create policy "admin write projects" on public.projects for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.projects (title, slug, category, location, year, description, software, sort_order) values
('Modern Outdoor Space Design', 'modern-outdoor-space', 'Landscape', 'Egypt', '2024', 'A contemporary outdoor environment composed around natural materials, layered planting, and warm ambient lighting.', array['Revit','D5 Render','Photoshop'], 1),
('Residential Building Facade Design', 'residential-facade', 'Architecture', 'Egypt', '2024', 'A residential facade study balancing modern proportions with warm Mediterranean materiality.', array['Revit','Enscape','AutoCAD'], 2);

-- Project images and files
create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  url text not null,
  caption text,
  sort_order int not null default 0
);
alter table public.project_images enable row level security;
create policy "public read project_images" on public.project_images for select using (true);
create policy "admin write project_images" on public.project_images for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  url text not null,
  filename text not null,
  file_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);
alter table public.project_files enable row level security;
create policy "public read project_files" on public.project_files for select using (true);
create policy "admin write project_files" on public.project_files for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Contact
create table public.contact_info (
  id int primary key default 1,
  email text,
  phone text,
  whatsapp text,
  linkedin text,
  updated_at timestamptz not null default now(),
  constraint contact_singleton check (id = 1)
);
alter table public.contact_info enable row level security;
insert into public.contact_info (id) values (1) on conflict do nothing;
create policy "public read contact" on public.contact_info for select using (true);
create policy "admin write contact" on public.contact_info for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "anyone can send message" on public.contact_messages for insert with check (true);
create policy "admin reads messages" on public.contact_messages for select using (public.has_role(auth.uid(), 'admin'));

-- Testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  avatar_url text,
  sort_order int not null default 0
);
alter table public.testimonials enable row level security;
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "admin write testimonials" on public.testimonials for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- AI knowledge base
create table public.ai_knowledge_base (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.ai_knowledge_base enable row level security;
create policy "public read kb" on public.ai_knowledge_base for select using (true);
create policy "admin write kb" on public.ai_knowledge_base for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Media library
create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  filename text not null,
  file_type text,
  size_bytes bigint,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.media_library enable row level security;
create policy "admin all media" on public.media_library for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Storage buckets
insert into storage.buckets (id, name, public) values ('project-media', 'project-media', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('project-files', 'project-files', true) on conflict do nothing;

create policy "public read project-media" on storage.objects for select using (bucket_id = 'project-media');
create policy "admin upload project-media" on storage.objects for insert with check (bucket_id = 'project-media' and public.has_role(auth.uid(), 'admin'));
create policy "admin update project-media" on storage.objects for update using (bucket_id = 'project-media' and public.has_role(auth.uid(), 'admin'));
create policy "admin delete project-media" on storage.objects for delete using (bucket_id = 'project-media' and public.has_role(auth.uid(), 'admin'));

create policy "public read project-files" on storage.objects for select using (bucket_id = 'project-files');
create policy "admin upload project-files" on storage.objects for insert with check (bucket_id = 'project-files' and public.has_role(auth.uid(), 'admin'));
create policy "admin update project-files" on storage.objects for update using (bucket_id = 'project-files' and public.has_role(auth.uid(), 'admin'));
create policy "admin delete project-files" on storage.objects for delete using (bucket_id = 'project-files' and public.has_role(auth.uid(), 'admin'));
