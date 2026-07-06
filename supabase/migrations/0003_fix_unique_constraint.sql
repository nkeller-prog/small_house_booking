-- The original unique constraint blocked rebooking a spot/date forever once
-- it had ever been cancelled, since it didn't exclude cancelled rows.
-- Replace it with a partial unique index that only applies to active bookings.
alter table bookings drop constraint unique_spot_per_date;

create unique index unique_spot_per_date on bookings (spot, booking_date)
  where cancelled_at is null;
