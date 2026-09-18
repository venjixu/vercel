create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('resume-pro','job-hunter','career-pack')),
  order_id text not null unique,
  payment_id text not null unique,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists entitlements_user_id_idx on public.entitlements(user_id);
alter table public.entitlements enable row level security;
