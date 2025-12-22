import type { Influencer, Fan, Product, Inquiry } from './types';

export interface Creator {
  subdomain: string;
  name: string;
  theme: string;
  bio: string;
  stats: { fans: string; posts: string };
  image: string;
}

export const creators: Creator[] = [
  {
    subdomain: "kkang",
    name: "깡대표",
    theme: "dark", 
    bio: "1인 마케팅 대행사를 위한 가장 완벽한 홈페이지 솔루션을 제안합니다. 저 깡대표와 전문 개발팀이 여러분의 비즈니스를 업그레이드해 드립니다.",
    stats: { fans: "3.5K", posts: "85" },
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
  },
  {
    subdomain: "iu",
    name: "IU (아이유)",
    theme: "purple", 
    bio: "음악으로 이야기하는 아이유의 공간입니다.",
    stats: { fans: "2.4M", posts: "1,240" },
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80"
  },
  {
    subdomain: "karina",
    name: "Karina (에스파)",
    theme: "blue",
    bio: "Aespa Karina Official Fan Community.",
    stats: { fans: "4.5M", posts: "890" },
    image: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=800&q=80"
  },
  {
    subdomain: "faker",
    name: "Faker (이상혁)",
    theme: "red",
    bio: "Unkillable Demon King. T1 Faker.",
    stats: { fans: "10M", posts: "560" },
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
  },
  {
    subdomain: "fan1",
    name: "MZ마케팅",
    theme: "dark",
    bio: "온라인 마케팅의 모든 것, MZ마케팅과 함께하세요.",
    stats: { fans: "120", posts: "12" },
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
  },
  {
    subdomain: "fan2",
    name: "BBURI 마케팅",
    theme: "light",
    bio: "뿌리 깊은 마케팅, 당신의 성장을 돕습니다.",
    stats: { fans: "45", posts: "0" },
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=1200&q=80"
  },
  {
    subdomain: "fan3",
    name: "도도마케팅",
    theme: "indigo",
    bio: "데이터 사이언스 기반의 독보적인 퍼포먼스 마케팅 솔루션",
    stats: { fans: "120+", posts: "24/7" },
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
  }
];

export function getCreator(subdomain: string) {
  return creators.find((c) => c.subdomain === subdomain);
}

// Mock Influencer 데이터
// 비밀번호: 모두 "password123" (실제로는 bcrypt 해시)
export const mockInfluencers: Influencer[] = [
  {
    id: 'inf-1',
    subdomain: 'kkang',
    name: '깡대표',
    email: 'kkang@faneasy.kr',
    // bcrypt hash of "password123"
    passwordHash: '$2a$10$rKZLvXz8Y9qXqN5xN5xN5.N5xN5xN5xN5xN5xN5xN5xN5xN5xN5xN',
    role: 'influencer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    pageSettings: {
      title: '깡대표 공식 팬페이지',
      description: '깡대표와 함께하는 특별한 공간',
      theme: 'dark',
      primaryColor: '#8B5CF6',
      logo: '/logos/kkang.png',
      banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80'
    },
    revenueShare: {
      enabled: true,
      percentage: 70 // 인플루언서가 70% 가져감
    }
  },
  {
    id: 'inf-2',
    subdomain: 'iu',
    name: 'IU',
    email: 'iu@faneasy.kr',
    passwordHash: '$2a$10$rKZLvXz8Y9qXqN5xN5xN5.N5xN5xN5xN5xN5xN5xN5xN5xN5xN5xN',
    role: 'influencer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    pageSettings: {
      title: 'IU Official Fanpage',
      description: '아이유 공식 팬페이지',
      theme: 'light',
      primaryColor: '#A855F7',
      banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80'
    },
    revenueShare: {
      enabled: true,
      percentage: 75
    }
  }
];

// Mock Fan 데이터 (깡대표의 팬들)
export const mockFans: Fan[] = [
  {
    id: 'fan-1',
    influencerId: 'inf-1', // 깡대표
    slug: 'fan1',
    name: '팬1',
    email: 'fan1@example.com',
    passwordHash: '$2a$10$rKZLvXz8Y9qXqN5xN5xN5.N5xN5xN5xN5xN5xN5xN5xN5xN5xN5xN',
    role: 'fan',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    pageSettings: {
      title: '팬1의 공간',
      description: '깡대표를 사랑하는 팬1의 페이지',
      theme: 'dark',
      primaryColor: '#EC4899',
      banner: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=1920&q=80'
    },
    permissions: {
      canEditContent: true,
      canManageProducts: true,
      canViewAnalytics: true
    }
  },
  {
    id: 'fan-2',
    influencerId: 'inf-1', // 깡대표
    slug: 'fan2',
    name: '팬2',
    email: 'fan2@example.com',
    passwordHash: '$2a$10$rKZLvXz8Y9qXqN5xN5xN5.N5xN5xN5xN5xN5xN5xN5xN5xN5xN5xN',
    role: 'fan',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    pageSettings: {
      title: '팬2의 공간',
      description: '깡대표 팬클럽',
      theme: 'light',
      primaryColor: '#3B82F6',
    },
    permissions: {
      canEditContent: true,
      canManageProducts: false,
      canViewAnalytics: false
    }
  },
  {
    id: 'fan-3',
    influencerId: 'inf-1', // 깡대표
    slug: 'fan3',
    name: '팬3',
    email: 'fan3@example.com',
    passwordHash: '$2a$10$rKZLvXz8Y9qXqN5xN5xN5.N5xN5xN5xN5xN5xN5xN5xN5xN5xN5xN',
    role: 'fan',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    pageSettings: {
      title: '팬3의 공간',
      description: '도도마케팅 공식 팬페이지',
      theme: 'dark',
      primaryColor: '#6366F1',
    },
    permissions: {
      canEditContent: true,
      canManageProducts: true,
      canViewAnalytics: true
    }
  }
];

// Helper functions
export function getInfluencer(subdomain: string): Influencer | undefined {
  return mockInfluencers.find(inf => inf.subdomain === subdomain);
}

export function getFan(influencerId: string, slug: string): Fan | undefined {
  return mockFans.find(fan => fan.influencerId === influencerId && fan.slug === slug);
}

export function getFansByInfluencer(influencerId: string): Fan[] {
  return mockFans.filter(fan => fan.influencerId === influencerId);
}

// Mock Inquiries
export const mockInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    ownerId: 'inf-1',
    name: '김철수',
    email: 'chulsoo@example.com',
    phone: '010-1234-5678',
    company: '철수마케팅',
    message: '1인 마케팅 대행사 홈페이지 신청합니다. MZ마케팅 레퍼런스처럼 깔끔하게 부탁드려요.',
    plan: 'pro',
    status: 'pending',
    createdAt: new Date('2024-12-20T14:30:00')
  },
  {
    id: 'inq-2',
    ownerId: 'inf-1',
    name: '이영희',
    email: 'younghee@example.com',
    phone: '010-9876-5432',
    company: '영희네디자인',
    message: '베이직 플랜으로 시작해보고 싶습니다.',
    plan: 'basic',
    status: 'contacted',
    createdAt: new Date('2024-12-21T10:15:00')
  }
];

export function getInquiriesByInfluencer(influencerId: string): Inquiry[] {
  return mockInquiries.filter(inq => inq.ownerId === influencerId);
}

// Mock Products for the Agency
export const agencyProducts: Product[] = [
  {
    id: 'prod-basic',
    ownerId: 'inf-1',
    ownerType: 'influencer',
    title: 'BASIC 플랜',
    description: '기본형 1인 마케팅 홈페이지. MZ마케팅 수준의 퀄리티와 필수 기능 포함.',
    price: 300000,
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'],
    category: 'homepage',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-pro',
    ownerId: 'inf-1',
    ownerType: 'influencer',
    title: 'PRO 플랜',
    description: '고급형 랜딩페이지 디자인 포함. 차별화된 브랜딩과 DB 수집 최적화.',
    price: 500000,
    images: ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80'],
    category: 'homepage',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-master',
    ownerId: 'inf-1',
    ownerType: 'influencer',
    title: 'MASTER 플랜',
    description: '풀 커스터마이징 디자인 및 마케팅 자동화 도구 연동.',
    price: 700000,
    images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80'],
    category: 'homepage',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

