create extension if not exists pgcrypto;

alter table if exists public.user_roles add column if not exists email text;
alter table if exists public.user_roles add column if not exists created_at timestamptz not null default now();
alter table if exists public.user_roles add column if not exists updated_at timestamptz not null default now();

create unique index if not exists user_roles_email_unique_idx
on public.user_roles (lower(email))
where email is not null;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  slug text unique,
  category text,
  short_description text,
  long_description text,
  hero_asset_id uuid,
  cover_asset_id uuid,
  cover_image text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  published boolean not null default true,
  display_order int not null default 0,
  sort_order int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects add column if not exists subtitle text;
alter table public.projects add column if not exists short_description text;
alter table public.projects add column if not exists long_description text;
alter table public.projects add column if not exists hero_asset_id uuid;
alter table public.projects add column if not exists cover_asset_id uuid;
alter table public.projects add column if not exists cover_image text;
alter table public.projects add column if not exists is_featured boolean not null default false;
alter table public.projects add column if not exists is_published boolean not null default true;
alter table public.projects add column if not exists published boolean not null default true;
alter table public.projects add column if not exists display_order int not null default 0;
alter table public.projects add column if not exists sort_order int not null default 0;
alter table public.projects add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.projects add column if not exists created_at timestamptz not null default now();
alter table public.projects add column if not exists updated_at timestamptz not null default now();

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

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  type text not null default 'text',
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new'
);

alter table public.contact_messages add column if not exists phone text;
alter table public.contact_messages add column if not exists status text not null default 'new';

alter table public.projects enable row level security;
alter table public.portfolio_sections enable row level security;
alter table public.portfolio_assets enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role::text = 'admin'
  )
$$;

create or replace function public.claim_allowed_admin_role()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    return false;
  end if;

  if current_email not in ('mohabx116@gmail.com', 'mohandelnady33@gmail.com') then
    return false;
  end if;

  update public.user_roles
    set user_id = current_user_id,
        role = 'admin',
        updated_at = now()
  where lower(email) = current_email;

  update public.user_roles
    set email = current_email,
        role = 'admin',
        updated_at = now()
  where user_id = current_user_id;

  insert into public.user_roles (user_id, email, role)
  select current_user_id, current_email, 'admin'
  where not exists (
    select 1
    from public.user_roles
    where user_id = current_user_id
       or lower(email) = current_email
  );

  return true;
end;
$$;

revoke all on function public.claim_allowed_admin_role() from public;
grant execute on function public.claim_allowed_admin_role() to authenticated;

drop policy if exists "public read published projects" on public.projects;
drop policy if exists "admin write projects" on public.projects;
drop policy if exists "admin all projects" on public.projects;
create policy "public read published projects"
on public.projects for select
using (is_published = true);
create policy "admin all projects"
on public.projects for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public read published portfolio sections" on public.portfolio_sections;
drop policy if exists "admin write portfolio sections" on public.portfolio_sections;
drop policy if exists "admin all portfolio sections" on public.portfolio_sections;
create policy "public read published portfolio sections"
on public.portfolio_sections for select
using (
  is_published = true
  and exists (
    select 1
    from public.projects p
    where p.id = portfolio_sections.project_id
      and p.is_published = true
  )
);
create policy "admin all portfolio sections"
on public.portfolio_sections for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public read published portfolio assets" on public.portfolio_assets;
drop policy if exists "admin write portfolio assets" on public.portfolio_assets;
drop policy if exists "admin all portfolio assets" on public.portfolio_assets;
create policy "public read published portfolio assets"
on public.portfolio_assets for select
using (
  is_published = true
  and exists (
    select 1
    from public.projects p
    where p.id = portfolio_assets.project_id
      and p.is_published = true
  )
);
create policy "admin all portfolio assets"
on public.portfolio_assets for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public read site content" on public.site_content;
drop policy if exists "admin write site content" on public.site_content;
drop policy if exists "admin all site content" on public.site_content;
create policy "public read site content"
on public.site_content for select
using (true);
create policy "admin all site content"
on public.site_content for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "anyone can send message" on public.contact_messages;
drop policy if exists "admin reads messages" on public.contact_messages;
drop policy if exists "admin manage messages" on public.contact_messages;
create policy "anyone can send message"
on public.contact_messages for insert
with check (true);
create policy "admin manage messages"
on public.contact_messages for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "users view own roles" on public.user_roles;
drop policy if exists "admins manage roles" on public.user_roles;
create policy "users view own roles"
on public.user_roles for select
using (auth.uid() = user_id);
create policy "admins manage roles"
on public.user_roles for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public) values
  ('portfolio-assets', 'portfolio-assets', true),
  ('project-files', 'project-files', true),
  ('media-library', 'media-library', true)
on conflict do nothing;

drop policy if exists "public read portfolio-assets" on storage.objects;
drop policy if exists "admin upload portfolio-assets" on storage.objects;
drop policy if exists "admin update portfolio-assets" on storage.objects;
drop policy if exists "admin delete portfolio-assets" on storage.objects;
create policy "public read portfolio-assets"
on storage.objects for select
using (bucket_id = 'portfolio-assets');
create policy "admin upload portfolio-assets"
on storage.objects for insert
with check (bucket_id = 'portfolio-assets' and public.is_admin());
create policy "admin update portfolio-assets"
on storage.objects for update
using (bucket_id = 'portfolio-assets' and public.is_admin());
create policy "admin delete portfolio-assets"
on storage.objects for delete
using (bucket_id = 'portfolio-assets' and public.is_admin());

drop policy if exists "public read project-files" on storage.objects;
drop policy if exists "admin upload project-files" on storage.objects;
drop policy if exists "admin update project-files" on storage.objects;
drop policy if exists "admin delete project-files" on storage.objects;
create policy "public read project-files"
on storage.objects for select
using (bucket_id = 'project-files');
create policy "admin upload project-files"
on storage.objects for insert
with check (bucket_id = 'project-files' and public.is_admin());
create policy "admin update project-files"
on storage.objects for update
using (bucket_id = 'project-files' and public.is_admin());
create policy "admin delete project-files"
on storage.objects for delete
using (bucket_id = 'project-files' and public.is_admin());

drop policy if exists "admin read media-library" on storage.objects;
drop policy if exists "admin upload media-library" on storage.objects;
drop policy if exists "admin update media-library" on storage.objects;
drop policy if exists "admin delete media-library" on storage.objects;
create policy "admin read media-library"
on storage.objects for select
using (bucket_id = 'media-library' and public.is_admin());
create policy "admin upload media-library"
on storage.objects for insert
with check (bucket_id = 'media-library' and public.is_admin());
create policy "admin update media-library"
on storage.objects for update
using (bucket_id = 'media-library' and public.is_admin());
create policy "admin delete media-library"
on storage.objects for delete
using (bucket_id = 'media-library' and public.is_admin());

insert into public.site_content (key, value, type) values
  ('home.hero.title', 'Mohannad Architectural Portfolio', 'text'),
  ('home.hero.subtitle', 'Luxury architectural case studies, technical documentation, and refined visual presentation.', 'text'),
  ('home.about', 'Mohannad develops architectural work through planning clarity, technical control, and cinematic visual communication.', 'textarea'),
  ('contact.cta', 'Start a project conversation.', 'text')
on conflict (key) do update
set value = excluded.value,
    type = excluded.type,
    updated_at = now();

with upsert_project as (
  insert into public.projects (
    title,
    subtitle,
    slug,
    category,
    short_description,
    long_description,
    cover_image,
    is_featured,
    is_published,
    published,
    display_order,
    sort_order,
    metadata
  ) values (
    'Al Se7r Tower',
    'Mixed-Use Mall & Tower Development',
    'al-se7r-tower',
    'Mixed-Use Architecture / Commercial Design',
    'A complete mixed-use commercial and hospitality development presented through planning, technical documentation, elevations, sections, visualizations, and final presentation boards.',
    'Al Se7r Tower is a mixed-use architectural development combining retail, hospitality, office, business incubation, parking, and tower functions within a coordinated commercial complex. The project explores the relationship between public movement, commercial visibility, vertical circulation, workplace flexibility, and hospitality planning.',
    '/portfolio/alse7r/archive/poster/final-presentation-board.jpg',
    true,
    true,
    true,
    1,
    1,
    '{"project_type":"Mixed-Use Commercial Development","scope":"Planning, technical documentation, elevations, sections, visualization, and final presentation."}'::jsonb
  )
  on conflict (slug) do update
  set subtitle = excluded.subtitle,
      category = excluded.category,
      short_description = excluded.short_description,
      long_description = excluded.long_description,
      cover_image = excluded.cover_image,
      is_featured = true,
      is_published = true,
      published = true,
      display_order = 1,
      sort_order = 1,
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
    ('Overview', 'A coordinated commercial and hospitality complex', 'A complete mixed-use commercial and hospitality development presented through planning, technical documentation, elevations, sections, visualizations, and final presentation boards.', 'Overview', 1),
    ('Master Planning & Site Organization', 'Arrival, frontage, movement, and public access', 'This section presents the project''s site organization, ground-floor access, public movement, outdoor circulation, parking relationship, commercial frontage, and connection between exterior arrival zones and internal retail movement.', 'Mixed-Use', 2),
    ('Basement & Parking Strategy', 'Vehicular movement and service connectivity', 'This section presents the basement planning strategy, including parking organization, vehicular circulation, ramp access, service zones, and vertical core connectivity.', 'Technical Drawings', 3),
    ('Commercial Mall Planning', 'Retail distribution and commercial visibility', 'This section presents the mall planning system, including retail unit distribution, public circulation, vertical cores, commercial visibility, tenant flexibility, and shared facilities.', 'Retail', 4),
    ('Hospitality Planning', 'Hotel rooms, restaurant planning, and guest circulation', 'This section presents the hospitality layer of the project, including hotel planning, guest-room organization, restaurant layout, seating zones, kitchen/service relationships, and guest circulation.', 'Hospitality', 5),
    ('Workplace & Business Incubator Planning', 'Flexible office layouts and shared work environments', 'This section presents the workplace layer of the project, including business incubators, office units, shared workspaces, meeting areas, lounge spaces, service cores, and flexible workplace planning.', 'Workplace', 6),
    ('Elevations & Sections', 'Facade studies and sectional logic', 'This section presents the architectural expression, facade studies, vertical relationships, sectional logic, core organization, tower-to-mall relationship, and overall building composition.', 'Elevations & Sections', 7),
    ('Visualization & Final Presentation', 'Rendered views, rendered plans, and final boards', 'This section presents the project''s final visual communication, including rendered views, rendered plans, presentation boards, and selected atmospheric shots.', 'Visualization', 8)
  ) as s(title, subtitle, description, category, display_order)
)
insert into public.portfolio_sections (
  project_id,
  title,
  subtitle,
  description,
  category,
  is_published,
  display_order
)
select p.id,
       s.title,
       s.subtitle,
       s.description,
       s.category,
       true,
       s.display_order
from seed_sections s
cross join project_row p
where not exists (
  select 1
  from public.portfolio_sections existing
  where existing.project_id = p.id
    and existing.title = s.title
);
