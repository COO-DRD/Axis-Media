-- ─────────────────────────────────────────────
-- AXIS — Availability System
-- Run this in Supabase → SQL Editor → New Query
-- ─────────────────────────────────────────────

-- Slot config table — you update slots_taken here directly
create table if not exists availability_slots (
  id          uuid primary key default gen_random_uuid(),
  month_key   text not null unique,  -- e.g. "2025-06"
  slots_total int  not null default 2,
  slots_taken int  not null default 0,
  notes       text,
  updated_at  timestamptz default now()
);

-- Bookings + waitlist table
create table if not exists availability_bookings (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  phone          text,
  business       text,
  preferred_time text,
  note           text,
  entry_type     text default 'booking',  -- 'booking' or 'waitlist'
  status         text default 'pending',  -- 'pending', 'confirmed', 'declined'
  created_at     timestamptz default now()
);

-- Seed current month (update month_key to current month e.g. 2025-06)
insert into availability_slots (month_key, slots_total, slots_taken, notes)
values
  ('2025-06', 2, 0, 'June 2025 — open'),
  ('2025-07', 2, 0, 'July 2025 — open')
on conflict (month_key) do nothing;

-- ─────────────────────────────────────────────
-- HOW TO UPDATE SLOTS (takes 10 seconds):
-- When a client confirms, run this in Supabase SQL Editor:
--
-- update availability_slots
-- set slots_taken = 1, updated_at = now()
-- where month_key = '2025-06';
--
-- To mark fully booked:
-- update availability_slots
-- set slots_taken = 2, updated_at = now()
-- where month_key = '2025-06';
-- ─────────────────────────────────────────────
