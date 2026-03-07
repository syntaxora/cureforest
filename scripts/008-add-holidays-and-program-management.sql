-- Add holiday management and program/location management features

-- ============================================
-- 1. Holidays table - closed days management
-- ============================================
CREATE TABLE IF NOT EXISTS holidays (
  id            SERIAL PRIMARY KEY,
  holiday_date  DATE NOT NULL,
  name          VARCHAR(200),                       -- e.g. '추석', '설날', '임시휴무'
  description   TEXT,
  is_recurring  BOOLEAN DEFAULT FALSE,              -- For annual holidays like 설날
  location_id   INTEGER REFERENCES locations(id) ON DELETE CASCADE, -- NULL = all locations
  created_by    INTEGER REFERENCES admin_users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (holiday_date, location_id)
);

CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(holiday_date);

-- ============================================
-- 2. Add editable fields to programs table
-- ============================================
ALTER TABLE programs ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 20;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- ============================================
-- 3. Add editable fields to locations table
-- ============================================
ALTER TABLE locations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE locations ADD COLUMN IF NOT EXISTS operating_hours VARCHAR(100);
ALTER TABLE locations ADD COLUMN IF NOT EXISTS contact_email VARCHAR(200);

-- ============================================
-- 4. Function: Check if date is a holiday
-- ============================================
CREATE OR REPLACE FUNCTION is_holiday(p_date DATE, p_location_id INTEGER DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM holidays
    WHERE holiday_date = p_date
    AND (location_id IS NULL OR location_id = p_location_id)
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. Update available_schedules view to exclude holidays
-- ============================================
DROP VIEW IF EXISTS available_schedules;
CREATE OR REPLACE VIEW available_schedules AS
SELECT
  ps.id AS schedule_id,
  p.slug AS program_slug,
  p.title AS program_title,
  l.slug AS location_slug,
  l.name AS location_name,
  ps.schedule_date,
  ps.start_time,
  ps.end_time,
  ps.max_capacity,
  ps.booked_count,
  (ps.max_capacity - ps.booked_count) AS remaining_seats,
  ps.status
FROM program_schedules ps
JOIN programs p ON p.id = ps.program_id
JOIN locations l ON l.id = ps.location_id
WHERE ps.status = 'open'
  AND ps.schedule_date >= CURRENT_DATE
  AND NOT is_holiday(ps.schedule_date, ps.location_id)
ORDER BY ps.schedule_date ASC;

-- ============================================
-- 6. View for admin to see all programs with stats
-- ============================================
CREATE OR REPLACE VIEW admin_programs_view AS
SELECT
  p.id,
  p.slug,
  p.title,
  p.subtitle,
  p.number,
  p.description,
  p.short_description,
  p.duration,
  p.max_capacity,
  p.price,
  p.image_url,
  p.location_type,
  p.is_active,
  p.created_at,
  p.updated_at,
  COUNT(DISTINCT ps.id) AS schedule_count,
  COUNT(DISTINCT r.id) AS reservation_count,
  COALESCE(SUM(r.participants) FILTER (WHERE r.status IN ('confirmed', 'completed')), 0) AS total_participants
FROM programs p
LEFT JOIN program_schedules ps ON ps.program_id = p.id
LEFT JOIN reservations r ON r.schedule_id = ps.id
GROUP BY p.id
ORDER BY p.number ASC;

-- ============================================
-- 7. View for admin to see all locations with stats
-- ============================================
CREATE OR REPLACE VIEW admin_locations_view AS
SELECT
  l.id,
  l.slug,
  l.name,
  l.address,
  l.phone,
  l.description,
  l.image_url,
  l.operating_hours,
  l.contact_email,
  l.is_active,
  l.created_at,
  COUNT(DISTINCT ps.id) AS schedule_count,
  COUNT(DISTINCT r.id) AS reservation_count,
  COALESCE(SUM(r.participants) FILTER (WHERE r.status IN ('confirmed', 'completed')), 0) AS total_participants
FROM locations l
LEFT JOIN program_schedules ps ON ps.location_id = l.id
LEFT JOIN reservations r ON r.schedule_id = ps.id
GROUP BY l.id
ORDER BY l.name ASC;

-- ============================================
-- 8. Admin function: Create/update program
-- ============================================
CREATE OR REPLACE FUNCTION admin_upsert_program(
  p_admin_id        INTEGER,
  p_id              INTEGER DEFAULT NULL,
  p_slug            VARCHAR DEFAULT NULL,
  p_title           VARCHAR DEFAULT NULL,
  p_subtitle        VARCHAR DEFAULT NULL,
  p_number          VARCHAR DEFAULT NULL,
  p_description     TEXT DEFAULT NULL,
  p_short_description TEXT DEFAULT NULL,
  p_duration        VARCHAR DEFAULT NULL,
  p_max_capacity    INTEGER DEFAULT 20,
  p_price           INTEGER DEFAULT 0,
  p_image_url       VARCHAR DEFAULT NULL,
  p_location_type   VARCHAR DEFAULT 'indoor_outdoor',
  p_is_active       BOOLEAN DEFAULT TRUE
)
RETURNS INTEGER AS $$
DECLARE
  v_program_id INTEGER;
  v_action VARCHAR;
BEGIN
  IF p_id IS NOT NULL THEN
    -- Update existing
    UPDATE programs SET
      title = COALESCE(p_title, title),
      subtitle = COALESCE(p_subtitle, subtitle),
      description = COALESCE(p_description, description),
      short_description = COALESCE(p_short_description, short_description),
      duration = COALESCE(p_duration, duration),
      max_capacity = COALESCE(p_max_capacity, max_capacity),
      price = COALESCE(p_price, price),
      image_url = COALESCE(p_image_url, image_url),
      location_type = COALESCE(p_location_type, location_type),
      is_active = COALESCE(p_is_active, is_active),
      updated_at = NOW()
    WHERE id = p_id
    RETURNING id INTO v_program_id;
    v_action := 'program.update';
  ELSE
    -- Create new
    INSERT INTO programs (slug, title, subtitle, number, description, short_description, duration, max_capacity, price, image_url, location_type, is_active)
    VALUES (p_slug, p_title, p_subtitle, p_number, p_description, p_short_description, p_duration, p_max_capacity, p_price, p_image_url, p_location_type, p_is_active)
    RETURNING id INTO v_program_id;
    v_action := 'program.create';
  END IF;

  -- Audit log
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (p_admin_id, v_action, 'program', v_program_id, jsonb_build_object('title', p_title));

  RETURN v_program_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. Admin function: Create/update location
-- ============================================
CREATE OR REPLACE FUNCTION admin_upsert_location(
  p_admin_id        INTEGER,
  p_id              INTEGER DEFAULT NULL,
  p_slug            VARCHAR DEFAULT NULL,
  p_name            VARCHAR DEFAULT NULL,
  p_address         TEXT DEFAULT NULL,
  p_phone           VARCHAR DEFAULT NULL,
  p_description     TEXT DEFAULT NULL,
  p_image_url       VARCHAR DEFAULT NULL,
  p_operating_hours VARCHAR DEFAULT NULL,
  p_contact_email   VARCHAR DEFAULT NULL,
  p_is_active       BOOLEAN DEFAULT TRUE
)
RETURNS INTEGER AS $$
DECLARE
  v_location_id INTEGER;
  v_action VARCHAR;
BEGIN
  IF p_id IS NOT NULL THEN
    -- Update existing
    UPDATE locations SET
      name = COALESCE(p_name, name),
      address = COALESCE(p_address, address),
      phone = COALESCE(p_phone, phone),
      description = COALESCE(p_description, description),
      image_url = COALESCE(p_image_url, image_url),
      operating_hours = COALESCE(p_operating_hours, operating_hours),
      contact_email = COALESCE(p_contact_email, contact_email),
      is_active = COALESCE(p_is_active, is_active)
    WHERE id = p_id
    RETURNING id INTO v_location_id;
    v_action := 'location.update';
  ELSE
    -- Create new
    INSERT INTO locations (slug, name, address, phone, description, image_url, operating_hours, contact_email, is_active)
    VALUES (p_slug, p_name, p_address, p_phone, p_description, p_image_url, p_operating_hours, p_contact_email, p_is_active)
    RETURNING id INTO v_location_id;
    v_action := 'location.create';
  END IF;

  -- Audit log
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (p_admin_id, v_action, 'location', v_location_id, jsonb_build_object('name', p_name));

  RETURN v_location_id;
END;
$$ LANGUAGE plpgsql;
