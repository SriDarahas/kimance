create table if not exists public.integration_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_account_id text not null,
  status text not null default 'pending',
  capabilities jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider),
  unique (provider, provider_account_id)
);

alter table public.integration_accounts enable row level security;

create policy "Users can view their own integration accounts"
  on public.integration_accounts
  for select
  using (auth.uid() = user_id);

create policy "Users can create their own integration accounts"
  on public.integration_accounts
  for insert
  with check (auth.uid() = user_id);

create index if not exists integration_accounts_user_provider_idx
  on public.integration_accounts (user_id, provider);
