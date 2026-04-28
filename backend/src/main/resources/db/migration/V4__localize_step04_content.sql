UPDATE quests
SET
    title = '새 방, 새로운 시작',
    description = '바닐라드림의 첫 공간에서 새로운 생활을 시작해 보세요.'
WHERE code = 'NEW_ROOM_NEW_START';

UPDATE quests
SET
    title = '메인 플라자 둘러보기',
    description = '도시의 중심 공간인 메인 플라자에 나가 분위기를 익혀 보세요.'
WHERE code = 'EXPLORE_THE_MAIN_PLAZA';

UPDATE quests
SET
    title = '직업 멘토 만나기',
    description = '직업을 선택해 아카데미에서 나를 담당할 멘토를 만나 보세요.'
WHERE code = 'MEET_YOUR_JOB_MENTOR';

UPDATE quests
SET
    title = '첫 수업 듣기',
    description = '아카데미 수업을 한 번 듣고 직업의 기초를 쌓아 보세요.'
WHERE code = 'TAKE_YOUR_FIRST_CLASS';

UPDATE quests
SET
    title = '첫 아르바이트 도전',
    description = '미니게임 아르바이트를 한 번 완료하고 첫 수입을 얻어 보세요.'
WHERE code = 'FIRST_PART_TIME_JOB';

UPDATE quests
SET
    title = '쇼핑 스트리트 입장',
    description = '쇼핑 스트리트에 들어가 어떤 스타일 아이템이 있는지 확인해 보세요.'
WHERE code = 'ENTER_THE_SHOPPING_STREET';

UPDATE quests
SET
    title = '첫 코디 완성',
    description = '패션 아이템을 구매해 나만의 첫 코디를 완성해 보세요.'
WHERE code = 'COMPLETE_YOUR_FIRST_OUTFIT';

UPDATE quests
SET
    title = '견습생을 향해',
    description = '레벨 3에 도달해 견습생 준비 단계로 나아갈 기반을 만드세요.'
WHERE code = 'TOWARD_APPRENTICE';

UPDATE quests
SET reward_title = '스타일 새내기'
WHERE code = 'COMPLETE_YOUR_FIRST_OUTFIT';

UPDATE quests
SET reward_title = '커리어 스타터'
WHERE code = 'TOWARD_APPRENTICE';

UPDATE job_classes
SET name = '패션 일러스트 기초'
WHERE job = 'DESIGNER' AND name = 'Fashion Illustration Basics';

UPDATE job_classes
SET name = '원단 감각 트레이닝'
WHERE job = 'DESIGNER' AND name = 'Fabric Sense Training';

UPDATE job_classes
SET name = '컬러 밸런스 입문'
WHERE job = 'DESIGNER' AND name = 'Color Balance Intro';

UPDATE job_classes
SET name = '상품 분류 기초'
WHERE job = 'MD' AND name = 'Product Categorization Basics';

UPDATE job_classes
SET name = '판매 흐름 이해'
WHERE job = 'MD' AND name = 'Sales Flow Understanding';

UPDATE job_classes
SET name = '고객 소통 실습'
WHERE job = 'MD' AND name = 'Customer Communication Practice';

UPDATE job_classes
SET name = '기본 워킹 밸런스'
WHERE job = 'MODEL' AND name = 'Basic Walking Balance';

UPDATE job_classes
SET name = '포즈 트레이닝'
WHERE job = 'MODEL' AND name = 'Pose Training';

UPDATE job_classes
SET name = '표정 연기 입문'
WHERE job = 'MODEL' AND name = 'Facial Expression Intro';
