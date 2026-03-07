-- Add gender and age_group columns to reservations table

ALTER TABLE reservations ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS age_group VARCHAR(10);

-- Update the admin_reservations_view to include new columns
CREATE OR REPLACE VIEW admin_reservations_view AS
SELECT
  r.id AS reservation_id,
  r.name AS booker_name,
  r.phone AS booker_phone,
  r.email AS booker_email,
  r.participants,
  r.gender,
  r.age_group,
  r.message,
  r.status AS reservation_status,
  r.created_at AS reserved_at,
  ps.schedule_date,
  ps.start_time,
  ps.end_time,
  ps.max_capacity,
  ps.booked_count,
  ps.status AS schedule_status,
  p.title AS program_title,
  p.slug AS program_slug,
  p.number AS program_number,
  l.name AS location_name,
  l.slug AS location_slug
FROM reservations r
JOIN program_schedules ps ON ps.id = r.schedule_id
JOIN programs p ON p.id = ps.program_id
JOIN locations l ON l.id = ps.location_id
ORDER BY ps.schedule_date ASC, r.created_at DESC;
