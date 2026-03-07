-- CureForest Admin Schema
-- Admin users, roles, audit logging, and management functions

-- ============================================
-- 1. Admin users table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(200) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,            -- bcrypt hashed password
  name            VARCHAR(100) NOT NULL,
  phone           VARCHAR(50),
  role            VARCHAR(30) NOT NULL DEFAULT 'staff',  -- 'super_admin', 'admin', 'staff'
  is_active       BOOLEAN DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- ============================================
-- 2. Admin sessions table (cookie-based auth)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_sessions (
  id              VARCHAR(128) PRIMARY KEY,         -- Session token (crypto random)
  admin_id        INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  ip_address      INET,
  user_agent      TEXT,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- ============================================
-- 3. Audit log - tracks all admin actions
-- ============================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id              SERIAL PRIMARY KEY,
  admin_id        INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  action          VARCHAR(100) NOT NULL,            -- e.g. 'reservation.confirm', 'schedule.create'
  target_type     VARCHAR(50),                      -- e.g. 'reservation', 'schedule', 'program'
  target_id       INTEGER,                          -- ID of the affected row
  details         JSONB,                            -- Additional context (old/new values, notes)
  ip_address      INET,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_target ON admin_audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at);

-- ============================================
-- 4. Admin function: bulk create schedules
--    Creates schedules for a date range at once.
-- ============================================
CREATE OR REPLACE FUNCTION admin_create_schedules(
  p_admin_id      INTEGER,
  p_program_id    INTEGER,
  p_location_id   INTEGER,
  p_start_date    DATE,
  p_end_date      DATE,
  p_start_time    TIME DEFAULT '10:00',
  p_end_time      TIME DEFAULT '12:00',
  p_max_capacity  INTEGER DEFAULT 20,
  p_weekdays_only BOOLEAN DEFAULT FALSE
)
RETURNS INTEGER AS $$
DECLARE
  v_date DATE;
  v_count INTEGER := 0;
BEGIN
  v_date := p_start_date;

  WHILE v_date <= p_end_date LOOP
    -- Skip weekends if weekdays_only
    IF p_weekdays_only AND EXTRACT(DOW FROM v_date) IN (0, 6) THEN
      v_date := v_date + 1;
      CONTINUE;
    END IF;

    INSERT INTO program_schedules (program_id, location_id, schedule_date, start_time, end_time, max_capacity)
    VALUES (p_program_id, p_location_id, v_date, p_start_time, p_end_time, p_max_capacity)
    ON CONFLICT (program_id, location_id, schedule_date) DO NOTHING;

    v_count := v_count + 1;
    v_date := v_date + 1;
  END LOOP;

  -- Audit log
  INSERT INTO admin_audit_log (admin_id, action, target_type, details)
  VALUES (
    p_admin_id,
    'schedule.bulk_create',
    'schedule',
    jsonb_build_object(
      'program_id', p_program_id,
      'location_id', p_location_id,
      'start_date', p_start_date,
      'end_date', p_end_date,
      'capacity', p_max_capacity,
      'count', v_count
    )
  );

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. Admin function: update schedule capacity
-- ============================================
CREATE OR REPLACE FUNCTION admin_update_capacity(
  p_admin_id      INTEGER,
  p_schedule_id   INTEGER,
  p_new_capacity  INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_old_capacity INTEGER;
  v_booked INTEGER;
BEGIN
  SELECT max_capacity, booked_count INTO v_old_capacity, v_booked
  FROM program_schedules
  WHERE id = p_schedule_id
  FOR UPDATE;

  IF v_old_capacity IS NULL THEN
    RETURN FALSE;
  END IF;

  -- New capacity must be >= current bookings
  IF p_new_capacity < v_booked THEN
    RETURN FALSE;
  END IF;

  UPDATE program_schedules
  SET max_capacity = p_new_capacity,
      status = CASE
        WHEN v_booked >= p_new_capacity THEN 'full'
        ELSE 'open'
      END,
      updated_at = NOW()
  WHERE id = p_schedule_id;

  -- Audit log
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (
    p_admin_id,
    'schedule.update_capacity',
    'schedule',
    p_schedule_id,
    jsonb_build_object('old_capacity', v_old_capacity, 'new_capacity', p_new_capacity)
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. Admin function: confirm / cancel reservation with audit
-- ============================================
CREATE OR REPLACE FUNCTION admin_update_reservation_status(
  p_admin_id        INTEGER,
  p_reservation_id  INTEGER,
  p_new_status      VARCHAR,    -- 'confirmed', 'cancelled', 'completed'
  p_note            TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_old_status VARCHAR;
  v_schedule_id INTEGER;
  v_participants INTEGER;
BEGIN
  SELECT status, schedule_id, participants INTO v_old_status, v_schedule_id, v_participants
  FROM reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF v_old_status IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Prevent invalid transitions
  IF v_old_status = 'cancelled' AND p_new_status != 'cancelled' THEN
    RETURN FALSE;
  END IF;

  -- Update reservation status
  UPDATE reservations
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_reservation_id;

  -- If cancelling, free the seats
  IF p_new_status = 'cancelled' AND v_old_status != 'cancelled' THEN
    UPDATE program_schedules
    SET booked_count = GREATEST(booked_count - v_participants, 0),
        status = 'open',
        updated_at = NOW()
    WHERE id = v_schedule_id;
  END IF;

  -- Audit log
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (
    p_admin_id,
    'reservation.status_change',
    'reservation',
    p_reservation_id,
    jsonb_build_object(
      'old_status', v_old_status,
      'new_status', p_new_status,
      'note', p_note
    )
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. Admin view: reservation dashboard
-- ============================================
CREATE OR REPLACE VIEW admin_reservations_view AS
SELECT
  r.id AS reservation_id,
  r.name AS booker_name,
  r.phone AS booker_phone,
  r.email AS booker_email,
  r.participants,
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

-- ============================================
-- 8. Admin view: daily schedule summary
-- ============================================
CREATE OR REPLACE VIEW admin_schedule_summary AS
SELECT
  ps.id AS schedule_id,
  ps.schedule_date,
  ps.start_time,
  ps.end_time,
  p.title AS program_title,
  p.number AS program_number,
  l.name AS location_name,
  ps.max_capacity,
  ps.booked_count,
  (ps.max_capacity - ps.booked_count) AS remaining_seats,
  ps.status,
  COUNT(r.id) FILTER (WHERE r.status = 'pending') AS pending_count,
  COUNT(r.id) FILTER (WHERE r.status = 'confirmed') AS confirmed_count,
  COUNT(r.id) FILTER (WHERE r.status = 'cancelled') AS cancelled_count
FROM program_schedules ps
JOIN programs p ON p.id = ps.program_id
JOIN locations l ON l.id = ps.location_id
LEFT JOIN reservations r ON r.schedule_id = ps.id
GROUP BY ps.id, p.title, p.number, l.name
ORDER BY ps.schedule_date ASC, ps.start_time ASC;

-- ============================================
-- 9. Cleanup: expired sessions
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;
