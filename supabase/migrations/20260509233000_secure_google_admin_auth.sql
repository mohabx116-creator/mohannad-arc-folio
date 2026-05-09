alter table public.user_roles add column if not exists email text;
alter table public.user_roles add column if not exists updated_at timestamptz not null default now();

create unique index if not exists user_roles_email_unique_idx
on public.user_roles (lower(email))
where email is not null;

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
      and role = 'admin'::public.app_role
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
        role = 'admin'::public.app_role,
        updated_at = now()
  where lower(email) = current_email;

  insert into public.user_roles (user_id, email, role)
  values (current_user_id, current_email, 'admin'::public.app_role)
  on conflict (user_id, role) do update
    set email = excluded.email,
        updated_at = now();

  return true;
end;
$$;

revoke all on function public.claim_allowed_admin_role() from public;
grant execute on function public.claim_allowed_admin_role() to authenticated;

drop policy if exists "public read published projects" on public.projects;
drop policy if exists "admin write projects" on public.projects;
create policy "public read published projects"
on public.projects for select
using (coalesce(is_published, published) = true);
create policy "admin write projects"
on public.projects for all
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

drop policy if exists "admin write portfolio sections" on public.portfolio_sections;
create policy "admin write portfolio sections"
on public.portfolio_sections for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin write portfolio assets" on public.portfolio_assets;
create policy "admin write portfolio assets"
on public.portfolio_assets for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin write site content" on public.site_content;
create policy "admin write site content"
on public.site_content for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public read project_images" on public.project_images;
drop policy if exists "admin write project_images" on public.project_images;
create policy "public read project_images"
on public.project_images for select
using (
  exists (
    select 1 from public.projects p
    where p.id = project_images.project_id
      and coalesce(p.is_published, p.published) = true
  )
);
create policy "admin write project_images"
on public.project_images for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public read project_files" on public.project_files;
drop policy if exists "admin write project_files" on public.project_files;
create policy "public read project_files"
on public.project_files for select
using (
  exists (
    select 1 from public.projects p
    where p.id = project_files.project_id
      and coalesce(p.is_published, p.published) = true
  )
);
create policy "admin write project_files"
on public.project_files for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin write contact" on public.contact_info;
create policy "admin write contact"
on public.contact_info for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin reads messages" on public.contact_messages;
drop policy if exists "admin manage messages" on public.contact_messages;
create policy "admin manage messages"
on public.contact_messages for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin all media" on public.media_library;
create policy "admin all media"
on public.media_library for all
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
create policy "public read portfolio-assets" on storage.objects
for select using (bucket_id = 'portfolio-assets');
create policy "admin upload portfolio-assets" on storage.objects
for insert with check (bucket_id = 'portfolio-assets' and public.is_admin());
create policy "admin update portfolio-assets" on storage.objects
for update using (bucket_id = 'portfolio-assets' and public.is_admin());
create policy "admin delete portfolio-assets" on storage.objects
for delete using (bucket_id = 'portfolio-assets' and public.is_admin());

drop policy if exists "public read project-files" on storage.objects;
drop policy if exists "admin upload project-files" on storage.objects;
drop policy if exists "admin update project-files" on storage.objects;
drop policy if exists "admin delete project-files" on storage.objects;
create policy "public read project-files" on storage.objects
for select using (bucket_id = 'project-files');
create policy "admin upload project-files" on storage.objects
for insert with check (bucket_id = 'project-files' and public.is_admin());
create policy "admin update project-files" on storage.objects
for update using (bucket_id = 'project-files' and public.is_admin());
create policy "admin delete project-files" on storage.objects
for delete using (bucket_id = 'project-files' and public.is_admin());

drop policy if exists "admin read media-library" on storage.objects;
drop policy if exists "admin upload media-library" on storage.objects;
drop policy if exists "admin update media-library" on storage.objects;
drop policy if exists "admin delete media-library" on storage.objects;
create policy "admin read media-library" on storage.objects
for select using (bucket_id = 'media-library' and public.is_admin());
create policy "admin upload media-library" on storage.objects
for insert with check (bucket_id = 'media-library' and public.is_admin());
create policy "admin update media-library" on storage.objects
for update using (bucket_id = 'media-library' and public.is_admin());
create policy "admin delete media-library" on storage.objects
for delete using (bucket_id = 'media-library' and public.is_admin());
