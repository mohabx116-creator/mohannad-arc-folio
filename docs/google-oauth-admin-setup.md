# Google OAuth Admin Setup

This portfolio uses Supabase Auth with Google OAuth for `/admin`. Public portfolio pages do not require login.

## Google Cloud / Google Auth Platform

1. Create an OAuth Client ID.
2. Application type: Web application.
3. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - your production domain when available
4. Add the Supabase Google callback URL as an authorized redirect URI. Supabase shows this URL in Authentication > Providers > Google.

## Supabase Dashboard

1. Go to Authentication > Providers.
2. Enable Google.
3. Add the Google Client ID.
4. Add the Google Client Secret.
5. Save.

## Supabase URL Configuration

1. Go to Authentication > URL Configuration.
2. Set the Site URL.
3. Add redirect URLs:
   - `http://localhost:5173/**`
   - your production domain with `/**`

## Admin Access

Only these Google accounts are allowed by the frontend guard and the database role-claim function:

- `mohabx116@gmail.com`
- `mohandelnady33@gmail.com`

The authenticated user must also have `role = admin` in `public.user_roles`. The app attempts to create that role automatically only for the allowed emails. If RLS or migration state blocks that setup, the admin page shows the current `user_id`, `email`, and `role` values to insert manually.

## Secrets

Never commit:

- Google Client Secret
- Supabase `service_role` key
- `.env` files

Only commit `.env.example` with public variable names:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```
