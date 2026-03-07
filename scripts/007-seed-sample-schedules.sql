-- Seed sample schedules for testing
-- Creates schedules for the next 30 days for all programs at all locations

DO $$
DECLARE
  v_program_id INTEGER;
  v_location_id INTEGER;
  v_date DATE;
  v_end_date DATE;
BEGIN
  v_end_date := CURRENT_DATE + INTERVAL '30 days';

  -- For each program
  FOR v_program_id IN SELECT id FROM programs LOOP
    -- For each location
    FOR v_location_id IN SELECT id FROM locations LOOP
      -- Create schedules for the next 30 days (weekdays only)
      v_date := CURRENT_DATE;
      WHILE v_date <= v_end_date LOOP
        -- Skip weekends
        IF EXTRACT(DOW FROM v_date) NOT IN (0, 6) THEN
          INSERT INTO program_schedules (program_id, location_id, schedule_date, start_time, end_time, max_capacity)
          VALUES (v_program_id, v_location_id, v_date, '10:00', '12:00', 20)
          ON CONFLICT (program_id, location_id, schedule_date) DO NOTHING;
        END IF;
        v_date := v_date + 1;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Sample schedules created successfully for the next 30 days!';
END $$;
