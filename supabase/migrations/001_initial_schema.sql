-- NutriLink MVP — Initial Schema
-- Run in Supabase SQL Editor: Dashboard > SQL Editor > New query

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFESSIONALS
-- ============================================================
create table public.professionals (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  first_name    text,
  specialty     text,
  focus         text,
  email         text not null,
  phone         text,
  initials      text,
  college_reg   text,
  verified      boolean default false,
  margin_mode   text default 'transfer_to_patient' check (margin_mode in ('transfer_to_patient', 'absorb')),
  margin_pct    integer default 15 check (margin_pct between 0 and 100),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table public.products (
  id              uuid primary key default uuid_generate_v4(),
  professional_id uuid references public.professionals(id) on delete set null,
  sku             text unique not null,
  name            text not null,
  compound        text,
  dosage          text,
  brand           text,
  category        text check (category in ('metabolico', 'femenino', 'digestivo', 'deportivo')),
  price           integer not null,        -- CLP cents
  wholesale_price integer,                 -- CLP cents
  units           integer,
  per_day         text,
  certifications  text[] default '{}',
  in_stock        boolean default true,
  stock_qty       integer default 0,
  stock_days      integer,
  evidence_level  text check (evidence_level in ('high', 'moderate', 'limited')),
  conditions      text[] default '{}',
  description     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- PATIENTS
-- ============================================================
create table public.patients (
  id              uuid primary key default uuid_generate_v4(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  name            text not null,
  email           text,
  phone           text,
  age             integer,
  condition       text,
  status          text default 'active' check (status in ('active', 'risk', 'paused', 'inactive')),
  adherence       integer default 0 check (adherence between 0 and 100),
  health_score    integer default 0 check (health_score between 0 and 100),
  months_active   integer default 0,
  total_spent     integer default 0,       -- CLP cents
  since           date,
  last_order      date,
  last_contact    text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- PROTOCOLS
-- ============================================================
create table public.protocols (
  id              uuid primary key default uuid_generate_v4(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  patient_id      uuid not null references public.patients(id) on delete cascade,
  name            text not null,
  status          text default 'active' check (status in ('active', 'risk', 'paused', 'expired', 'draft')),
  health_score    integer default 0,
  short_token     text unique not null default encode(gen_random_bytes(6), 'hex'),
  subscription    boolean default false,
  monthly_value   integer default 0,
  total_generated integer default 0,
  renewal_date    date,
  renewal_days    integer,
  last_purchase   text,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- PROTOCOL ITEMS
-- ============================================================
create table public.protocol_items (
  id          uuid primary key default uuid_generate_v4(),
  protocol_id uuid not null references public.protocols(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete restrict,
  qty         integer default 1,
  instruction text,
  days        integer,
  status      text default 'active' check (status in ('active', 'warning', 'expired')),
  days_left   integer,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id              uuid primary key default uuid_generate_v4(),
  protocol_id     uuid not null references public.protocols(id) on delete cascade,
  patient_id      uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  status          text default 'active' check (status in ('active', 'paused', 'cancelled')),
  monthly_value   integer default 0,
  renewal_date    date,
  months_count    integer default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- ALERTS
-- ============================================================
create table public.alerts (
  id              uuid primary key default uuid_generate_v4(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  patient_id      uuid references public.patients(id) on delete set null,
  protocol_id     uuid references public.protocols(id) on delete set null,
  type            text check (type in ('warning', 'danger', 'info', 'success')),
  icon            text,
  text            text not null,
  action_label    text,
  resolved        boolean default false,
  created_at      timestamptz default now()
);

-- ============================================================
-- TIMELINE EVENTS
-- ============================================================
create table public.events (
  id              uuid primary key default uuid_generate_v4(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  patient_id      uuid references public.patients(id) on delete set null,
  protocol_id     uuid references public.protocols(id) on delete set null,
  type            text,                    -- 'purchase', 'subscription', 'delivery', 'view', 'milestone', etc.
  icon            text,
  color           text,
  text            text not null,
  detail          text,
  amount          integer,                 -- CLP, if monetary event
  event_date      timestamptz default now(),
  created_at      timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.professionals  enable row level security;
alter table public.products        enable row level security;
alter table public.patients        enable row level security;
alter table public.protocols       enable row level security;
alter table public.protocol_items  enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.alerts          enable row level security;
alter table public.events          enable row level security;

-- Helper: get professional_id for current user
create or replace function public.my_professional_id()
returns uuid language sql stable security definer as $$
  select id from public.professionals where user_id = auth.uid() limit 1;
$$;

-- PROFESSIONALS: user sees only their own profile
create policy "professionals_select_own" on public.professionals
  for select using (user_id = auth.uid());

create policy "professionals_insert_own" on public.professionals
  for insert with check (user_id = auth.uid());

create policy "professionals_update_own" on public.professionals
  for update using (user_id = auth.uid());

-- PRODUCTS: professional sees only their own + shared catalog
create policy "products_select" on public.products
  for select using (
    professional_id = public.my_professional_id()
    or professional_id is null
  );

create policy "products_insert" on public.products
  for insert with check (professional_id = public.my_professional_id());

create policy "products_update" on public.products
  for update using (professional_id = public.my_professional_id());

-- PATIENTS: professional sees only their patients
create policy "patients_select" on public.patients
  for select using (professional_id = public.my_professional_id());

create policy "patients_insert" on public.patients
  for insert with check (professional_id = public.my_professional_id());

create policy "patients_update" on public.patients
  for update using (professional_id = public.my_professional_id());

-- PROTOCOLS: professional sees their own; public access by short_token (for patient view)
create policy "protocols_select_professional" on public.protocols
  for select using (professional_id = public.my_professional_id());

create policy "protocols_select_public_token" on public.protocols
  for select using (true);  -- short_token lookup handled in API route with service role

create policy "protocols_insert" on public.protocols
  for insert with check (professional_id = public.my_professional_id());

create policy "protocols_update" on public.protocols
  for update using (professional_id = public.my_professional_id());

-- PROTOCOL ITEMS: follow protocol access
create policy "protocol_items_select" on public.protocol_items
  for select using (
    protocol_id in (
      select id from public.protocols
      where professional_id = public.my_professional_id()
    )
  );

create policy "protocol_items_insert" on public.protocol_items
  for insert with check (
    protocol_id in (
      select id from public.protocols
      where professional_id = public.my_professional_id()
    )
  );

create policy "protocol_items_update" on public.protocol_items
  for update using (
    protocol_id in (
      select id from public.protocols
      where professional_id = public.my_professional_id()
    )
  );

-- SUBSCRIPTIONS
create policy "subscriptions_select" on public.subscriptions
  for select using (professional_id = public.my_professional_id());

create policy "subscriptions_insert" on public.subscriptions
  for insert with check (professional_id = public.my_professional_id());

-- ALERTS
create policy "alerts_select" on public.alerts
  for select using (professional_id = public.my_professional_id());

create policy "alerts_insert" on public.alerts
  for insert with check (professional_id = public.my_professional_id());

create policy "alerts_update" on public.alerts
  for update using (professional_id = public.my_professional_id());

-- EVENTS
create policy "events_select" on public.events
  for select using (professional_id = public.my_professional_id());

create policy "events_insert" on public.events
  for insert with check (professional_id = public.my_professional_id());

-- ============================================================
-- INDEXES
-- ============================================================
create index on public.patients (professional_id);
create index on public.protocols (professional_id);
create index on public.protocols (patient_id);
create index on public.protocols (short_token);
create index on public.protocol_items (protocol_id);
create index on public.alerts (professional_id, resolved);
create index on public.events (professional_id, event_date desc);
create index on public.subscriptions (professional_id, status);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.professionals
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.patients
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.protocols
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
