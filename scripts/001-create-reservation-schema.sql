-- CureForest Reservation Schema
-- Designed for PostgreSQL with date-specific seat availability

-- ============================================
-- 1. Programs table - stores the 9 therapy programs
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(100) UNIQUE NOT NULL,       -- URL-friendly identifier (e.g. 'five-senses')
  title         VARCHAR(200) NOT NULL,              -- Korean title (e.g. '오감 열기')
  subtitle      VARCHAR(200),                       -- Short descriptor
  number        VARCHAR(10) NOT NULL,               -- Display number (e.g. '01')
  description   TEXT,                               -- Full program description
  duration      VARCHAR(50),                        -- e.g. '60분', '90분'
  location_type VARCHAR(50) DEFAULT 'indoor_outdoor', -- 'indoor', 'outdoor', 'indoor_outdoor'
  is_active     BOOLEAN DEFAULT TRUE,               -- Soft-delete / enable-disable
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Locations table - healing forest venues
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(100) UNIQUE NOT NULL,       -- e.g. 'pocheon'
  name          VARCHAR(200) NOT NULL,              -- e.g. '포천 국립치유의 숲'
  address       TEXT,
  phone         VARCHAR(50),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. Program schedules - date-specific seat capacity
--    This is the core table for availability tracking.
--    Each row = one program at one location on one date.
-- ============================================
CREATE TABLE IF NOT EXISTS program_schedules (
  id            SERIAL PRIMARY KEY,
  program_id    INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  location_id   INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,                      -- The specific date of the session
  start_time    TIME,                               -- Optional: session start time
  end_time      TIME,                               -- Optional: session end time
  max_capacity  INTEGER NOT NULL DEFAULT 20,        -- Maximum seats for this date
  booked_count  INTEGER NOT NULL DEFAULT 0,         -- Current number of confirmed bookings
  status        VARCHAR(20) DEFAULT 'open',         -- 'open', 'full', 'cancelled'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate schedule entries
  UNIQUE (program_id, location_id, schedule_date),

  -- Ensure booked_count never exceeds max_capacity
  CHECK (booked_count >= 0),
  CHECK (booked_count <= max_capacity),
  CHECK (max_capacity > 0)
);

-- Index for fast date-based availability lookups
CREATE INDEX IF NOT EXISTS idx_schedules_date ON program_schedules(schedule_date);
CREATE INDEX IF NOT EXISTS idx_schedules_program_date ON program_schedules(program_id, schedule_date);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON program_schedules(status) WHERE status = 'open';

-- ============================================
-- 4. Reservations table - individual bookings
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
  id              SERIAL PRIMARY KEY,
  schedule_id     INTEGER NOT NULL REFERENCES program_schedules(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,            -- Booker's name
  phone           VARCHAR(50) NOT NULL,             -- Contact number
  email           VARCHAR(200),                     -- Optional email
  participants    INTEGER NOT NULL DEFAULT 1,       -- Number of people
  message         TEXT,                             -- Special requests / notes
  status          VARCHAR(20) DEFAULT 'pending',    -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  CHECK (participants > 0)
);

-- Index for looking up reservations by schedule
CREATE INDEX IF NOT EXISTS idx_reservations_schedule ON reservations(schedule_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_phone ON reservations(phone);

-- ============================================
-- 5. Helper function: check availability and book atomically
--    Prevents overbooking with row-level locking.
-- ============================================
CREATE OR REPLACE FUNCTION make_reservation(
  p_schedule_id   INTEGER,
  p_name          VARCHAR,
  p_phone         VARCHAR,
  p_email         VARCHAR,
  p_participants  INTEGER,
  p_message       TEXT DEFAULT NULL
)
RETURNS TABLE(reservation_id INTEGER, booking_status VARCHAR) AS $$
DECLARE
  v_available INTEGER;
  v_reservation_id INTEGER;
BEGIN
  -- Lock the schedule row to prevent race conditions
  SELECT (max_capacity - booked_count) INTO v_available
  FROM program_schedules
  WHERE id = p_schedule_id AND status = 'open'
  FOR UPDATE;

  -- Check if schedule exists and is open
  IF v_available IS NULL THEN
    RETURN QUERY SELECT 0, 'schedule_not_available'::VARCHAR;
    RETURN;
  END IF;

  -- Check if enough seats are available
  IF v_available < p_participants THEN
    RETURN QUERY SELECT 0, 'insufficient_capacity'::VARCHAR;
    RETURN;
  END IF;

  -- Create the reservation
  INSERT INTO reservations (schedule_id, name, phone, email, participants, message)
  VALUES (p_schedule_id, p_name, p_phone, p_email, p_participants, p_message)
  RETURNING id INTO v_reservation_id;

  -- Update the booked count
  UPDATE program_schedules
  SET booked_count = booked_count + p_participants,
      status = CASE
        WHEN booked_count + p_participants >= max_capacity THEN 'full'
        ELSE 'open'
      END,
      updated_at = NOW()
  WHERE id = p_schedule_id;

  RETURN QUERY SELECT v_reservation_id, 'success'::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. Helper function: cancel reservation and free seats
-- ============================================
CREATE OR REPLACE FUNCTION cancel_reservation(p_reservation_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_schedule_id INTEGER;
  v_participants INTEGER;
BEGIN
  -- Get reservation details
  SELECT schedule_id, participants INTO v_schedule_id, v_participants
  FROM reservations
  WHERE id = p_reservation_id AND status != 'cancelled';

  IF v_schedule_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Cancel the reservation
  UPDATE reservations
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_reservation_id;

  -- Free the seats
  UPDATE program_schedules
  SET booked_count = GREATEST(booked_count - v_participants, 0),
      status = 'open',
      updated_at = NOW()
  WHERE id = v_schedule_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. View: available schedules (for frontend queries)
-- ============================================
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
ORDER BY ps.schedule_date ASC;
