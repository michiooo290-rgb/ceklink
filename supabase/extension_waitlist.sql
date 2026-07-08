-- Jalankan query ini di Supabase Dashboard → SQL Editor
-- Tabel buat nyimpen email waitlist "Urlveil Extension" dari CTA di homepage.

create table if not exists public.extension_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'cta_homepage',
  created_at timestamptz not null default now()
);

-- Aktifkan Row Level Security
alter table public.extension_waitlist enable row level security;

-- Siapa saja (termasuk yang belum login) boleh INSERT (daftar waitlist),
-- tapi TIDAK boleh SELECT/UPDATE/DELETE — jadi daftar email nggak bisa
-- diintip atau diubah orang lain lewat API publik. Untuk lihat daftarnya,
-- buka langsung dari Supabase Dashboard (pakai service role / owner akses).
create policy "Siapa saja boleh daftar waitlist"
  on public.extension_waitlist
  for insert
  to anon, authenticated
  with check (true);
