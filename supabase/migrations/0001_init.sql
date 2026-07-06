create table bookings (
  id            uuid primary key default gen_random_uuid(),
  spot          text not null check (spot in ('big_bed', 'bunk_top', 'bunk_bottom')),
  booking_date  date not null,
  name          text not null,
  email         text not null,
  cancel_token  uuid not null default gen_random_uuid(),
  cancelled_at  timestamptz,
  created_at    timestamptz not null default now(),

  constraint unique_spot_per_date unique (spot, booking_date)
);

create index idx_bookings_date on bookings (booking_date);

alter table bookings enable row level security;

grant all on table bookings to service_role;
