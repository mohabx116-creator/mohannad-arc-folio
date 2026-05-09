# Supabase Email Admin Login

Use this fallback when Google OAuth is unavailable. This is Supabase Auth email/password login, not Gmail password login.

## 1. Enable Email Provider

In Supabase Dashboard:

1. Go to `Authentication > Providers`.
2. Open `Email`.
3. Enable the Email provider.
4. Save changes.

## 2. Create An Admin User

In Supabase Dashboard:

1. Go to `Authentication > Users`.
2. Click `Add user`.
3. Use one allowed admin email:
   - `mohabx116@gmail.com`
   - `mohandelnady33@gmail.com`
4. Set a strong password inside Supabase Auth.
5. Confirm the email manually if your project requires confirmed users.

Do not use or store a Gmail password. The password is only the Supabase Auth password for this app.

## 3. Add Admin Role

In Supabase Dashboard:

1. Go to `Table Editor > user_roles`.
2. Insert a row:
   - `user_id`: the Auth user id from `Authentication > Users`
   - `email`: the admin email
   - `role`: `admin`

Only these allowed admin emails should receive the `admin` role:

- `mohabx116@gmail.com`
- `mohandelnady33@gmail.com`

## 4. Login

Open `/admin`, enter the Supabase Auth email and password, then sign in. The CMS still checks both:

- the authenticated email is on the allowed admin email list
- `user_roles.role = 'admin'`

Google OAuth can remain enabled later. If Google is not enabled, email/password login still works.
