-- Seed CureForest programs (9 therapy programs from PDF)
INSERT INTO programs (slug, title, subtitle, number, description, duration) VALUES
  ('five-senses',    '오감 열기',       '감각 치유',   '01', '숲속에서 시각, 청각, 후각, 촉각, 미각의 다섯 가지 감각을 깨우는 프로그램입니다.', '60분'),
  ('singing-bowl',   '싱잉볼 테라피',    '소리 치유',   '02', '싱잉볼의 깊은 울림과 진동을 통해 몸과 마음의 긴장을 해소하는 소리 치유 프로그램입니다.', '50분'),
  ('aroma',          '아로마 테라피',    '향기 치유',   '03', '숲에서 채취한 천연 에센셜 오일과 허브를 활용한 향기 치유 프로그램입니다.', '60분'),
  ('color',          '컬러 테라피',      '색채 치유',   '04', '자연의 다양한 색채를 활용하여 심리적 안정과 정서적 회복을 돕는 프로그램입니다.', '50분'),
  ('tools',          '소도구 테라피',    '도구 치유',   '05', '마사지볼, 스트레칭밴드 등 치유 소도구를 활용한 신체 이완 프로그램입니다.', '40분'),
  ('hand-foot',      '손발 마사지',      '접촉 치유',   '06', '손과 발의 반사구를 자극하여 혈액순환을 촉진하고 전신 건강을 증진하는 프로그램입니다.', '50분'),
  ('physical',       '신체활동',         '운동 치유',   '07', '숲속에서 진행하는 스트레칭, 요가, 걷기 등 신체 활성화 프로그램입니다.', '60분'),
  ('tea-meditation', '차 명상',          '명상 치유',   '08', '숲속에서 차를 마시며 마음을 가라앉히는 명상 프로그램입니다.', '50분'),
  ('forest-meditation', '숲 명상',       '자연 명상',   '09', '숲의 소리와 향기에 온전히 집중하며 깊은 명상 상태에 도달하는 프로그램입니다.', '60분')
ON CONFLICT (slug) DO NOTHING;

-- Seed locations (healing forests)
INSERT INTO locations (slug, name, address) VALUES
  ('seoul',      '서울 치유의 숲',       '서울특별시'),
  ('pocheon',    '포천 국립치유의 숲',    '경기도 포천시'),
  ('jangseong',  '장성 편백치유의 숲',    '전라남도 장성군'),
  ('yeongju',    '영주 치유의 숲',       '경상북도 영주시'),
  ('hoengseong', '횡성 치유의 숲',       '강원도 횡성군'),
  ('jeongeup',   '정읍 치유의 숲',       '전라북도 정읍시')
ON CONFLICT (slug) DO NOTHING;
