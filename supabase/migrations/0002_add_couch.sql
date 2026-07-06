alter table bookings drop constraint bookings_spot_check;

alter table bookings add constraint bookings_spot_check
  check (spot in ('big_bed', 'bunk_top', 'bunk_bottom', 'couch'));
