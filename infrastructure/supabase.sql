-- ORGANISATIONS (tenants)
create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- USERS are in auth.users; link them to organisations via memberships
create table public.memberships (
  org_id uuid references public.organisations(id) on delete cascade,
  user_id uuid not null,
  role text check (role in ('owner','admin','member')) not null default 'member',
  primary key (org_id, user_id)
);

-- JOB SITES / PROJECTS
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organisations(id) on delete cascade,
  name text not null,
  address text,
  geo geography(point, 4326), -- optional
  created_at timestamptz default now()
);

-- CLOCK EVENTS (atomic)
create table public.clock_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organisations(id) on delete cascade,
  user_id uuid not null,
  type text check (type in ('in','out','break_start','break_end')) not null,
  at timestamptz not null default now(),
  job_id uuid references public.jobs(id),
  lat double precision,
  lng double precision,
  accuracy double precision,
  device text,
  notes text
);

-- TIMESHEETS (summaries per day)
create table public.timesheets (
  org_id uuid references public.organisations(id) on delete cascade,
  user_id uuid not null,
  day date not null,
  seconds_worked integer not null default 0,
  seconds_break integer not null default 0,
  primary key (org_id, user_id, day)
);

-- PAY RATES (optional)
create table public.pay_rates (
  org_id uuid references public.organisations(id) on delete cascade,
  user_id uuid not null,
  hourly_rate numeric(10,2) not null default 0,
  currency text not null default 'GBP',
  effective_from date not null default current_date,
  primary key (org_id, user_id, effective_from)
);
