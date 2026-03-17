-- Seed CureForest programs (5 main programs with sub-programs)
INSERT INTO programs (slug, title, subtitle, number, description, duration) VALUES
  ('dongtan-healing', '동탄호수공원 힐링프로그램', '힐링 치유', '01', '동탄호수공원의 아름다운 자연환경에서 진행되는 산림치유 힐링프로그램입니다.', '60분'),
  ('dongtan-ecology', '동탄호수공원 생태 프로그램', '생태 체험', '02', '동탄호수공원의 다양한 생태계를 체험하고 학습하는 생태 교육 프로그램입니다.', '90분'),
  ('daol-garden', '다올공원 온뜰정원 힐링가드너', '원예 치료', '03', '다올공원 온뜰정원에서 진행되는 원예치료 기반 힐링 프로그램입니다.', '90분'),
  ('mubongsan', '무봉산 자연휴양림', '산림 치유', '04', '무봉산 자연휴양림의 울창한 숲에서 진행되는 본격적인 산림치유 프로그램입니다.', '120분'),
  ('hwaseong-forest', '화성시 숲해설', '숲 해설', '05', '화성시 곳곳의 숲에서 진행되는 전문 숲해설 프로그램입니다.', '90분')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  number = EXCLUDED.number,
  description = EXCLUDED.description,
  duration = EXCLUDED.duration;

-- Seed locations
INSERT INTO locations (slug, name, address) VALUES
  ('dongtan-lake', '동탄호수공원', '경기도 화성시 동탄호수공원'),
  ('daol-garden', '다올공원 온뜰정원', '경기도 화성시 다올공원'),
  ('mubongsan', '무봉산 자연휴양림', '경기도 화성시 무봉산'),
  ('hwaseong', '화성시 일대', '경기도 화성시')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address;
