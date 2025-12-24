import { SiteBlock } from './types';

export function getLegacyTemplate(siteSlug: string): SiteBlock[] | null {
  const commonSettings = {
    paddingTop: '80px',
    paddingBottom: '80px',
    maxWidth: 'lg' as const,
    animation: 'fade' as const
  };

  if (siteSlug === 'kkang') {
    return [
      {
        id: 'hero-kkang',
        type: 'hero',
        order: 0,
        content: {
          title: '빠르게 사업을 시작하는 프리미엄 랜딩페이지',
          description: '디자인부터 세팅까지 올인원. 전문 개발팀과 깡대표가 협업하여 여러분의 비즈니스를 가장 프로페셔널하게 완성해드립니다.',
          buttonText: '지금 프로젝트 시작하기'
        },
        settings: { ...commonSettings, animation: 'slide-up', maxWidth: 'xl' }
      },
      {
        id: 'features-kkang',
        type: 'features',
        order: 1,
        content: {
          title: '1인 마케팅 대행사를 위한 완벽한 시작',
          items: [
            { title: '하이엔드 디자인', description: '평범한 마케팅 레퍼런스 이상의 세련되고 트렌디한 디자인으로 브랜드 신뢰도를 즉각적으로 높여드립니다.' },
            { title: 'DB 자동 수집 시스템', description: '유입된 고객의 정보를 놓치지 않고 관리할 수 있는 맞춤형 DB 수집 폼과 알림톡 연동을 지원합니다.' },
            { title: '구독형 유지보수', description: '초기 제작비 부담을 낮추고, 전문가의 지속적인 터치를 받을 수 있는 합리적인 구독형 서비스를 제공합니다.' }
          ]
        },
        settings: { ...commonSettings, backgroundColor: '#000000', textColor: '#ffffff' }
      },
      {
        id: 'pricing-kkang',
        type: 'pricing',
        order: 2,
        content: {
          title: '합리적인 비용으로 비즈니스를 가속하세요',
          plans: [
            {
              name: 'BASIC',
              price: '30만원',
              features: ['타사 랜딩 페이지 수준 베이직 디자인', '기본형 DB 수집 폼', '반응형 웹 지원', '도메인 연결 대행', '보안 서버(SSL) 적용'],
              popular: false
            },
            {
              name: 'PRO',
              price: '50만원',
              features: ['프리미엄 랜딩페이지 디자인', '고급형 DB 모집 섹션', '카카오톡 알림톡 연동', 'SEO 기본 세팅', '월 2회 수정 지원'],
              popular: true
            },
            {
              name: 'MASTER',
              price: '70만원~',
              features: ['풀 커스텀 하이엔드 디자인', '마케팅 자동화 도구 연동', 'AI 채팅봇 기본 세팅', '우선 순위 기술 지원'],
              popular: false
            }
          ]
        },
        settings: commonSettings
      },
      {
        id: 'faq-kkang',
        type: 'faq',
        order: 3,
        content: {
          title: '자주 묻는 질문',
          items: [
            { question: '제작 기간은 얼마나 걸리나요?', answer: '자료 전달 후 평균 3~5일 영업일 이내에 초안을 받아보실 수 있습니다.' },
            { question: '도메인과 서버 호스팅은 어떻게 하나요?', answer: '복잡한 과정 없이 저희가 대행해드립니다. 기존 도메인이 있다면 연결도 가능합니다.' },
            { question: '결제는 어떻게 진행되나요?', answer: '카드 결제와 세금계산서 발행이 모두 가능합니다.' }
          ]
        },
        settings: commonSettings
      },
      {
        id: 'form-kkang',
        type: 'form',
        order: 4,
        content: {
          title: '함께 비즈니스를 시작해볼까요?',
          description: '간단한 정보만 남겨주시면 전문가가 직접 연락드립니다.',
          variant: 'tech'
        },
        settings: { ...commonSettings, paddingBottom: '120px' }
      }
    ];
  }

  if (siteSlug === 'bizon') {
    return [
      {
        id: 'hero-bizon',
        type: 'hero',
        order: 0,
        content: {
          title: '프랜차이즈 매장이라 마케팅이 불필요하다고요?',
          description: '브랜드는 같아도, 성과는 지점마다 다릅니다. 승부는 네이버 플레이스에서 선택받는 구조입니다.',
          buttonText: '진단 요청하기'
        },
        settings: { ...commonSettings, backgroundColor: '#ffffff', textColor: '#111827' }
      },
      {
        id: 'features-bizon',
        type: 'features',
        order: 1,
        content: {
          title: '프랜차이즈도 꼭 해야 하는 이유',
          description: '고객은 브랜드보다 가까운 곳을 먼저 찾습니다.',
          items: [
            { title: '가까운 곳', description: '고객은 브랜드보다 가까운 곳을 먼저 찾습니다.' },
            { title: '후기 좋은 곳', description: '같은 브랜드라도 리뷰 점수가 다르면 선택이 달라집니다.' },
            { title: '지금 가능한 곳', description: '영업 중이고, 바로 예약/전화가 되는 곳을 선택합니다.' }
          ]
        },
        settings: { ...commonSettings, backgroundColor: '#ffffff', textColor: '#111827' }
      },
      {
        id: 'text-bizon-trust',
        type: 'text',
        order: 2,
        content: {
           json: { type: 'doc', content: [
               { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '직접 운영 경험으로 증명합니다' }] },
               { type: 'paragraph', content: [{ type: 'text', text: '연매출 30억 규모의 요식업 매장 3곳을 직접 운영하며 얻은 노하우를 그대로 적용합니다.' }] },
               { type: 'bulletList', content: [
                   { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '성균관대학교 경영학 석사' }] }] },
                   { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '브랜드관리사 1급 보유' }] }] },
                   { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '한국브랜드마케팅협회 정회원' }] }] }
               ]}
           ]}
        },
        settings: { ...commonSettings, backgroundColor: '#f9fafb', textColor: '#111827' }
      },
      {
        id: 'features-bizon-service',
        type: 'features',
        order: 3,
        content: {
          title: '핵심 서비스',
          description: '프랜차이즈 지점에 딱 맞는 실행형 서비스',
          items: [
            { title: '플레이스 주력', description: '노출 구조 + 전환 동선 (전화/길찾기/예약) 설계' },
            { title: '디자인물 제작', description: '메뉴/배너/이벤트/리뷰 유도물 (매장 실사용)' },
            { title: '프랜차이즈 컨설팅', description: '지점별 KPI 기준 우선순위 실행' }
          ]
        },
        settings: { ...commonSettings, backgroundColor: '#ffffff', textColor: '#111827' }
      },
      {
         id: 'text-bizon-process',
         type: 'steps' as any, // fallback to text if steps not exist, but let's use features for now or just text
         // steps block doesn't exist yet, using features instead
         order: 4,
         content: {
             title: '진행 방식',
             description: '멈추지 않고 계속 돌아가는 성공의 수레바퀴',
             items: [
                 { title: '01 진단', description: '현재 상태를 객관적으로 분석' },
                 { title: '02 설계', description: '지점 맞춤형 전략 수립' },
                 { title: '03 실행', description: '고민 없이 즉시 적용' },
                 { title: '04 주간 개선', description: '데이터 기반 지속적 성장' }
             ]
         },
         // re-using features type for steps structure approximation
         settings: { ...commonSettings, backgroundColor: '#ffffff', textColor: '#111827' },
         // We'll coerce type to features since steps isn't registered fully yet
      },
      {
        id: 'form-bizon',
        type: 'form',
        order: 5,
        content: {
          title: '진단 요청하기',
          description: '대표님 매장에 맞는 실행 우선순위 1장으로 답합니다.',
          variant: 'bold' // orange/red theme
        },
        settings: { ...commonSettings, backgroundColor: '#111827', textColor: '#ffffff' }
      }
    ].map(b => b.type === 'steps' ? {...b, type: 'features'} : b) as any;
  }

  // Fallback for fan1, fan2, fan3 basic templates if needed
  if (siteSlug === 'fan1' || siteSlug === 'fan2' || siteSlug === 'fan3') {
     return [
        {
           id: `hero-${siteSlug}`,
           type: 'hero',
           order: 0,
           content: { title: 'Official Fan Page', description: 'Welcome to my official fan page.', buttonText: 'Join Now' },
           settings: commonSettings
        },
        {
           id: `news-${siteSlug}`,
           type: 'text',
           order: 1,
           content: { json: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Checkout my latest updates and news here.' }] }] } },
           settings: commonSettings
        }
     ];
  }

  return null;
}
