# Supabase Setup

## 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project. Copy the **Project URL** and **anon key** from `Settings > API`.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

## 3. Apply the schema

In the Supabase Dashboard, go to **SQL Editor > New query** and paste the contents of:

1. `supabase/migrations/001_initial_schema.sql` — creates all tables, RLS policies, and indexes
2. `supabase/seed.sql` — inserts demo data (after creating your auth user)

## 4. Seed with demo data

After running the schema migration:

1. Go to `Authentication > Users` in Supabase Dashboard
2. Click **"Add user"** and create a user with your email
3. Copy the UUID shown for that user
4. In `supabase/seed.sql`, replace the placeholder UUID with your real user ID
5. Run the seed SQL in the SQL Editor

## 5. Database schema

```
professionals ←── patients ←── protocols ←── protocol_items ──→ products
                                    │
                                    └──→ subscriptions
                                    └──→ alerts
                                    └──→ events
```

### Table overview

| Table | Description |
|-------|-------------|
| `professionals` | Nutritionist accounts (linked to Supabase Auth) |
| `patients` | Patient records per professional |
| `products` | Supplement catalog |
| `protocols` | Treatment plans linking patient ↔ products |
| `protocol_items` | Individual products within a protocol |
| `subscriptions` | Monthly auto-renewal tracking |
| `alerts` | System alerts (adherence, expiry, etc.) |
| `events` | Timeline of purchases, renewals, milestones |

### Row Level Security

Every table has RLS enabled. Professionals only see their own data. The patient view (`/p/[token]`) uses the `short_token` column on protocols and is accessed via the service role key in a server-side API route — the patient never sees private data.
