-- CureForest Inquiry Schema
-- Contact inquiries with admin processing status

-- ============================================
-- 1. Inquiry categories
-- ============================================
CREATE TABLE IF NOT EXISTS inquiry_categories (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  sort_order  INTEGER DEFAULT 0
);

INSERT INTO inquiry_categories (slug, name, sort_order) VALUES
  ('program', '프로그램 문의', 1),
  ('reservation', '예약 문의', 2),
  ('schedule', '일정 문의', 3),
  ('group', '단체/기관 문의', 4),
  ('etc', '기타 문의', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. Inquiries table
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id              SERIAL PRIMARY KEY,
  category_id     INTEGER REFERENCES inquiry_categories(id),
  name            VARCHAR(100) NOT NULL,
  phone           VARCHAR(50) NOT NULL,
  email           VARCHAR(200),
  organization    VARCHAR(200),                     -- 소속/단체명 (optional)
  title           VARCHAR(300) NOT NULL,
  content         TEXT NOT NULL,

  -- Processing status
  status          VARCHAR(30) NOT NULL DEFAULT 'pending',
                  -- 'pending' (처리 전), 'in_progress' (처리 중),
                  -- 'completed' (처리 완료), 'rejected' (거부)

  -- Admin response
  admin_id        INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_note      TEXT,                             -- 처리 사유 / 메모
  processed_at    TIMESTAMPTZ,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_category ON inquiries(category_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_admin ON inquiries(admin_id);

-- ============================================
-- 3. Function: admin process inquiry
-- ============================================
CREATE OR REPLACE FUNCTION admin_process_inquiry(
  p_admin_id      INTEGER,
  p_inquiry_id    INTEGER,
  p_new_status    VARCHAR,      -- 'in_progress', 'completed', 'rejected'
  p_note          TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_old_status VARCHAR;
BEGIN
  SELECT status INTO v_old_status
  FROM inquiries
  WHERE id = p_inquiry_id
  FOR UPDATE;

  IF v_old_status IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE inquiries
  SET status = p_new_status,
      admin_id = p_admin_id,
      admin_note = COALESCE(p_note, admin_note),
      processed_at = CASE WHEN p_new_status IN ('completed', 'rejected') THEN NOW() ELSE processed_at END,
      updated_at = NOW()
  WHERE id = p_inquiry_id;

  -- Audit log
  INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
  VALUES (
    p_admin_id,
    'inquiry.status_change',
    'inquiry',
    p_inquiry_id,
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
-- 4. Admin view: inquiry dashboard
-- ============================================
CREATE OR REPLACE VIEW admin_inquiries_view AS
SELECT
  i.id,
  i.name,
  i.phone,
  i.email,
  i.organization,
  i.title,
  i.content,
  i.status,
  i.admin_note,
  i.processed_at,
  i.created_at,
  ic.name AS category_name,
  ic.slug AS category_slug,
  au.name AS admin_name
FROM inquiries i
LEFT JOIN inquiry_categories ic ON ic.id = i.category_id
LEFT JOIN admin_users au ON au.id = i.admin_id
ORDER BY
  CASE i.status
    WHEN 'pending' THEN 0
    WHEN 'in_progress' THEN 1
    WHEN 'completed' THEN 2
    WHEN 'rejected' THEN 3
  END,
  i.created_at DESC;
