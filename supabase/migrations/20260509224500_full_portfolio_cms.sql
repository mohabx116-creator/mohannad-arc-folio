alter table public.projects add column if not exists subtitle text;
alter table public.projects add column if not exists short_description text;
alter table public.projects add column if not exists long_description text;
alter table public.projects add column if not exists hero_asset_id uuid;
alter table public.projects add column if not exists cover_asset_id uuid;
alter table public.projects add column if not exists is_featured boolean not null default false;
alter table public.projects add column if not exists is_published boolean not null default true;
alter table public.projects add column if not exists display_order int not null default 0;
alter table public.projects add column if not exists metadata jsonb not null default '{}'::jsonb;

update public.projects set
  short_description = coalesce(short_description, description),
  long_description = coalesce(long_description, description),
  is_published = coalesce(is_published, published),
  display_order = coalesce(display_order, sort_order)
where true;

create table if not exists public.portfolio_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  subtitle text,
  description text,
  category text,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_sections enable row level security;

create table if not exists public.portfolio_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  section_id uuid references public.portfolio_sections(id) on delete set null,
  storage_path text not null,
  file_url text not null,
  original_filename text,
  display_name text not null,
  caption text,
  asset_type text not null default 'image',
  mime_type text,
  file_size bigint,
  category text,
  is_hero boolean not null default false,
  is_cover boolean not null default false,
  is_published boolean not null default true,
  display_order int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_assets enable row level security;

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  type text not null default 'text',
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

alter table public.contact_messages add column if not exists phone text;
alter table public.contact_messages add column if not exists status text not null default 'new';

drop policy if exists "public read published portfolio sections" on public.portfolio_sections;
drop policy if exists "admin write portfolio sections" on public.portfolio_sections;
drop policy if exists "public read published portfolio assets" on public.portfolio_assets;
drop policy if exists "admin write portfolio assets" on public.portfolio_assets;
drop policy if exists "public read site content" on public.site_content;
drop policy if exists "admin write site content" on public.site_content;

create policy "public read published portfolio sections"
on public.portfolio_sections for select
using (
  is_published = true and exists (
    select 1 from public.projects p
    where p.id = portfolio_sections.project_id
      and coalesce(p.is_published, p.published) = true
  )
);

create policy "admin write portfolio sections"
on public.portfolio_sections for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "public read published portfolio assets"
on public.portfolio_assets for select
using (
  is_published = true and exists (
    select 1 from public.projects p
    where p.id = portfolio_assets.project_id
      and coalesce(p.is_published, p.published) = true
  )
);

create policy "admin write portfolio assets"
on public.portfolio_assets for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "public read site content" on public.site_content for select using (true);
create policy "admin write site content" on public.site_content for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

insert into storage.buckets (id, name, public) values
  ('portfolio-assets', 'portfolio-assets', true),
  ('media-library', 'media-library', true)
on conflict do nothing;

create policy "public read portfolio-assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "admin upload portfolio-assets" on storage.objects for insert with check (bucket_id = 'portfolio-assets' and public.has_role(auth.uid(), 'admin'));
create policy "admin update portfolio-assets" on storage.objects for update using (bucket_id = 'portfolio-assets' and public.has_role(auth.uid(), 'admin'));
create policy "admin delete portfolio-assets" on storage.objects for delete using (bucket_id = 'portfolio-assets' and public.has_role(auth.uid(), 'admin'));

create policy "admin read media-library" on storage.objects for select using (bucket_id = 'media-library' and public.has_role(auth.uid(), 'admin'));
create policy "admin upload media-library" on storage.objects for insert with check (bucket_id = 'media-library' and public.has_role(auth.uid(), 'admin'));
create policy "admin update media-library" on storage.objects for update using (bucket_id = 'media-library' and public.has_role(auth.uid(), 'admin'));
create policy "admin delete media-library" on storage.objects for delete using (bucket_id = 'media-library' and public.has_role(auth.uid(), 'admin'));

insert into public.site_content (key, value, type) values
  ('home.hero.title', 'Mohannad Architectural Portfolio', 'text'),
  ('home.hero.subtitle', 'Luxury architectural case studies, technical documentation, and refined visual presentation.', 'text'),
  ('home.about', 'Mohannad develops architectural work through planning clarity, technical control, and cinematic visual communication.', 'textarea'),
  ('contact.cta', 'Start a project conversation.', 'text')
on conflict (key) do update set value = excluded.value, type = excluded.type, updated_at = now();

with upsert_project as (
  insert into public.projects (
    title, subtitle, slug, category, short_description, long_description,
    cover_image, is_featured, is_published, published, display_order, sort_order, metadata
  ) values (
    'Al Se7r Tower',
    'Mixed-Use Mall & Tower Development',
    'al-se7r-tower',
    'Mixed-Use Architecture / Commercial Design',
    'A complete mixed-use commercial and hospitality development presented through planning, technical documentation, elevations, sections, visualizations, and final presentation boards.',
    'Al Se7r Tower is a mixed-use architectural development combining retail, hospitality, office, business incubation, parking, and tower functions within a coordinated commercial complex. The project explores the relationship between public movement, commercial visibility, vertical circulation, workplace flexibility, and hospitality planning.',
    '/portfolio/alse7r/archive/poster/final-presentation-board.jpg',
    true, true, true, 1, 1,
    '{"project_type":"Mixed-Use Commercial Development","scope":"Planning, technical documentation, elevations, sections, visualization, and final presentation.","content_source":"Imported ZIP archive"}'::jsonb
  )
  on conflict (slug) do update set
    subtitle = excluded.subtitle,
    category = excluded.category,
    short_description = excluded.short_description,
    long_description = excluded.long_description,
    cover_image = excluded.cover_image,
    is_featured = true,
    is_published = true,
    published = true,
    display_order = 1,
    metadata = excluded.metadata,
    updated_at = now()
  returning id
),
project_row as (
  select id from upsert_project
  union
  select id from public.projects where slug = 'al-se7r-tower'
  limit 1
),
seed_sections as (
  select * from (values
    ('overview','Overview','A coordinated commercial and hospitality complex','A complete mixed-use commercial and hospitality development presented through planning, technical documentation, elevations, sections, visualizations, and final presentation boards.','Overview',1),
    ('master-planning','Master Planning & Site Organization','Arrival, frontage, movement, and public access','This section presents the project''s site organization, ground-floor access, public movement, outdoor circulation, parking relationship, commercial frontage, and connection between exterior arrival zones and internal retail movement.','Mixed-Use',2),
    ('basement','Basement & Parking Strategy','Vehicular movement and service connectivity','This section presents the basement planning strategy, including parking organization, vehicular circulation, ramp access, service zones, and vertical core connectivity.','Technical Drawings',3),
    ('commercial-mall','Commercial Mall Planning','Retail distribution and commercial visibility','This section presents the mall planning system, including retail unit distribution, public circulation, vertical cores, commercial visibility, tenant flexibility, and shared facilities.','Retail',4),
    ('hospitality','Hospitality Planning','Hotel rooms, restaurant planning, and guest circulation','This section presents the hospitality layer of the project, including hotel planning, guest-room organization, restaurant layout, seating zones, kitchen/service relationships, and guest circulation.','Hospitality',5),
    ('workplace','Workplace & Business Incubator Planning','Flexible office layouts and shared work environments','This section presents the workplace layer of the project, including business incubators, office units, shared workspaces, meeting areas, lounge spaces, service cores, and flexible workplace planning.','Workplace',6),
    ('elevations-sections','Elevations & Sections','Facade studies and sectional logic','This section presents the architectural expression, facade studies, vertical relationships, sectional logic, core organization, tower-to-mall relationship, and overall building composition.','Elevations & Sections',7),
    ('visualization','Visualization & Final Presentation','Rendered views, rendered plans, and final boards','This section presents the project''s final visual communication, including rendered views, rendered plans, presentation boards, and selected atmospheric shots.','Visualization',8)
  ) as s(slug,title,subtitle,description,category,display_order)
)
insert into public.portfolio_sections (project_id, title, subtitle, description, category, display_order)
select p.id, s.title, s.subtitle, s.description, s.category, s.display_order
from seed_sections s cross join project_row p
where not exists (
  select 1 from public.portfolio_sections existing
  where existing.project_id = p.id and existing.title = s.title
);

with project_row as (
  select id from public.projects where slug = 'al-se7r-tower' limit 1
),
seed_assets as (
  select * from (values
    ('Overview','/portfolio/alse7r/archive/renders/exterior-render-01.png','portfolio/alse7r/archive/renders/exterior-render-01.png','New folder (2)/render shots/Gemini_Generated_Image_2r8r3b2r8r3b2r8r.png','Exterior Render','The tower and podium composition presented as the main project image.','image','image/png','render',true,false,1),
    ('Overview','/portfolio/alse7r/archive/poster/final-presentation-board.jpg','portfolio/alse7r/archive/poster/final-presentation-board.jpg','New folder (2)/poster/222بوستر هوندا الفاينال.jpg.jpeg','Final Presentation Board','Consolidated final board for the Al Se7r Tower case study.','image','image/jpeg','poster',false,true,2),
    ('Master Planning & Site Organization','/portfolio/alse7r/archive/technical-drawings/site-plan.pdf','portfolio/alse7r/archive/technical-drawings/site-plan.pdf','New folder (2)/basic plans/الموقع العام كامل.pdf','Site Plan','Site organization, outdoor circulation, parking relationship, and commercial frontage.','pdf','application/pdf','plan',false,false,1),
    ('Master Planning & Site Organization','/portfolio/alse7r/archive/technical-drawings/ground-floor-plan.pdf','portfolio/alse7r/archive/technical-drawings/ground-floor-plan.pdf','New folder (2)/basic plans/بلان الدور الارضي.pdf','Ground Floor Retail & Access Strategy','Ground-floor access, arrival sequence, and internal retail movement.','pdf','application/pdf','plan',false,false,2),
    ('Basement & Parking Strategy','/portfolio/alse7r/archive/technical-drawings/basement-parking-plan.pdf','portfolio/alse7r/archive/technical-drawings/basement-parking-plan.pdf','New folder (2)/basic plans/بلان البدروم.pdf','Basement Plan','Parking organization, vehicular circulation, ramp access, and service zones.','pdf','application/pdf','plan',false,false,1),
    ('Commercial Mall Planning','/portfolio/alse7r/archive/technical-drawings/mall-first-floor-plan.pdf','portfolio/alse7r/archive/technical-drawings/mall-first-floor-plan.pdf','New folder (2)/basic plans/الدور الاول مول.pdf','Mall First Floor Plan','Retail unit distribution and public circulation at the first mall level.','pdf','application/pdf','plan',false,false,1),
    ('Commercial Mall Planning','/portfolio/alse7r/archive/technical-drawings/mall-second-floor-plan.pdf','portfolio/alse7r/archive/technical-drawings/mall-second-floor-plan.pdf','New folder (2)/basic plans/الدور الثاني مول.pdf','Mall Second Floor Plan','Upper mall planning, tenant flexibility, and vertical core relationships.','pdf','application/pdf','plan',false,false,2),
    ('Hospitality Planning','/portfolio/alse7r/archive/technical-drawings/hotel-floor-plan.pdf','portfolio/alse7r/archive/technical-drawings/hotel-floor-plan.pdf','New folder (2)/basic plans/بلان الفندق.pdf','Hotel Floor Plan','Guest-room organization, service relationships, and hotel circulation.','pdf','application/pdf','plan',false,false,1),
    ('Hospitality Planning','/portfolio/alse7r/archive/technical-drawings/hotel-restaurant-plan.pdf','portfolio/alse7r/archive/technical-drawings/hotel-restaurant-plan.pdf','New folder (2)/basic plans/مطعم الفندق.pdf','Hotel Restaurant Plan','Restaurant seating zones, kitchen/service flow, and guest movement.','pdf','application/pdf','plan',false,false,2),
    ('Workplace & Business Incubator Planning','/portfolio/alse7r/archive/technical-drawings/business-incubator-floor-plan.pdf','portfolio/alse7r/archive/technical-drawings/business-incubator-floor-plan.pdf','New folder (2)/basic plans/حضانات الاعمال.pdf','Business Incubator Floor Plan','Flexible workspaces, shared facilities, meeting areas, and service core planning.','pdf','application/pdf','plan',false,false,1),
    ('Workplace & Business Incubator Planning','/portfolio/alse7r/archive/technical-drawings/large-companies-floor-plan.pdf','portfolio/alse7r/archive/technical-drawings/large-companies-floor-plan.pdf','New folder (2)/basic plans/الشركات الكبيرة.pdf','Large Companies Floor Plan','Office planning for larger company floor plates and shared workplace support.','pdf','application/pdf','plan',false,false,2),
    ('Elevations & Sections','/portfolio/alse7r/archive/technical-drawings/main-elevation.pdf','portfolio/alse7r/archive/technical-drawings/main-elevation.pdf','New folder (2)/basic elev/واجهة 1.pdf','Main Elevation','Primary facade composition and commercial podium expression.','pdf','application/pdf','elevation',false,false,1),
    ('Elevations & Sections','/portfolio/alse7r/archive/technical-drawings/secondary-elevation.pdf','portfolio/alse7r/archive/technical-drawings/secondary-elevation.pdf','New folder (2)/basic elev/واجهة 2.pdf','Secondary Elevation','Secondary facade rhythm, massing, and architectural articulation.','pdf','application/pdf','elevation',false,false,2),
    ('Elevations & Sections','/portfolio/alse7r/archive/technical-drawings/core-section.pdf','portfolio/alse7r/archive/technical-drawings/core-section.pdf','New folder (2)/basic elev/قطاع في الكور.pdf','Core Section','Vertical core organization and circulation relationships.','pdf','application/pdf','section',false,false,3),
    ('Elevations & Sections','/portfolio/alse7r/archive/technical-drawings/mall-section.pdf','portfolio/alse7r/archive/technical-drawings/mall-section.pdf','New folder (2)/basic elev/قطاع في المول.pdf','Mall Section','Sectional reading of the mall volume and public spaces.','pdf','application/pdf','section',false,false,4),
    ('Elevations & Sections','/portfolio/alse7r/archive/technical-drawings/tower-mall-section.pdf','portfolio/alse7r/archive/technical-drawings/tower-mall-section.pdf','New folder (2)/basic elev/قطاع في المول والبرج.pdf','Tower & Mall Section','Relationship between tower, mall, cores, and podium levels.','pdf','application/pdf','section',false,false,5),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/presentation-files/al-se7r-tower-final-presentation.pdf','portfolio/alse7r/archive/presentation-files/al-se7r-tower-final-presentation.pdf','New folder (2)/poster/Al Se7r Tower Final.pdf','Final Presentation PDF','Complete final presentation package.','pdf','application/pdf','poster',false,false,16)
  ) as a(section_title,file_url,storage_path,original_filename,display_name,caption,asset_type,mime_type,category,is_hero,is_cover,display_order)
),
image_assets as (
  select * from (values
    ('Elevations & Sections','/portfolio/alse7r/archive/elevations/elevation-study-01.png','portfolio/alse7r/archive/elevations/elevation-study-01.png','Facade Study I','elevation',6),
    ('Elevations & Sections','/portfolio/alse7r/archive/elevations/elevation-study-02.png','portfolio/alse7r/archive/elevations/elevation-study-02.png','Facade Study II','elevation',7),
    ('Elevations & Sections','/portfolio/alse7r/archive/elevations/elevation-study-03.png','portfolio/alse7r/archive/elevations/elevation-study-03.png','Facade Study III','elevation',8),
    ('Elevations & Sections','/portfolio/alse7r/archive/elevations/elevation-study-04.png','portfolio/alse7r/archive/elevations/elevation-study-04.png','Facade Study IV','elevation',9),
    ('Elevations & Sections','/portfolio/alse7r/archive/elevations/elevation-study-05.png','portfolio/alse7r/archive/elevations/elevation-study-05.png','Facade Study V','elevation',10),
    ('Elevations & Sections','/portfolio/alse7r/archive/elevations/elevation-study-06.png','portfolio/alse7r/archive/elevations/elevation-study-06.png','Facade Study VI','elevation',11),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/renders/exterior-render-02.png','portfolio/alse7r/archive/renders/exterior-render-02.png','Exterior Render I','render',1),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/renders/exterior-render-03.png','portfolio/alse7r/archive/renders/exterior-render-03.png','Exterior Render II','render',2),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/renders/exterior-render-04.png','portfolio/alse7r/archive/renders/exterior-render-04.png','Exterior Render III','render',3),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/renders/exterior-render-05.png','portfolio/alse7r/archive/renders/exterior-render-05.png','Exterior Render IV','render',4),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/renders/atmospheric-backdrop.png','portfolio/alse7r/archive/renders/atmospheric-backdrop.png','Atmospheric View','render',5),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/rendered-plans/rendered-plan-01.png','portfolio/alse7r/archive/rendered-plans/rendered-plan-01.png','Rendered Plan I','rendered-plan',6),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/rendered-plans/rendered-plan-02.png','portfolio/alse7r/archive/rendered-plans/rendered-plan-02.png','Rendered Plan II','rendered-plan',7),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/rendered-plans/rendered-plan-03.png','portfolio/alse7r/archive/rendered-plans/rendered-plan-03.png','Rendered Plan III','rendered-plan',8),
    ('Visualization & Final Presentation','/portfolio/alse7r/archive/rendered-plans/rendered-plan-04.png','portfolio/alse7r/archive/rendered-plans/rendered-plan-04.png','Rendered Plan IV','rendered-plan',9)
  ) as i(section_title,file_url,storage_path,display_name,category,display_order)
),
combined_assets as (
  select * from seed_assets
  union all
  select section_title, file_url, storage_path, storage_path, display_name, 'Selected project visual communication asset.', 'image', 'image/png', category, false, false, display_order
  from image_assets
)
insert into public.portfolio_assets (
  project_id, section_id, file_url, storage_path, original_filename, display_name,
  caption, asset_type, mime_type, category, is_hero, is_cover, display_order, metadata
)
select p.id, s.id, a.file_url, a.storage_path, a.original_filename, a.display_name,
  a.caption, a.asset_type, a.mime_type, a.category, a.is_hero, a.is_cover, a.display_order,
  jsonb_build_object('import_source', 'New folder (2).zip')
from combined_assets a
cross join project_row p
join public.portfolio_sections s on s.project_id = p.id and s.title = a.section_title
where not exists (
  select 1 from public.portfolio_assets existing
  where existing.project_id = p.id and existing.storage_path = a.storage_path
);
