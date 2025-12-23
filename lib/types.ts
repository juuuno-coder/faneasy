// 사용자 역할 정의 (4단계 권한 체계)
export type UserRole = 
  | "super_admin"  // 최고관리자 (플랫폼 전체 관리)
  | "owner"        // 소유자 (사이트 실제 주인)
  | "admin"        // 관리자 (소유자가 지정한 운영진)
  | "user";        // 일반 회원

// 사이트별 권한 매핑
export interface SitePermission {
  siteId: string;      // subdomain (e.g., 'kkang')
  role: UserRole;
  grantedBy?: string;  // 권한 부여자 ID
  grantedAt?: string;  // 권한 부여 시각
}

// 인플루언서 (1차 페이지 소유자)
export interface Influencer {
  id: string;
  subdomain: string; // e.g., 'kkang'
  name: string;
  email: string;
  passwordHash: string;
  role: "owner";
  createdAt: Date;
  updatedAt: Date;

  // 페이지 설정
  pageSettings: {
    title: string;
    description: string;
    theme: "dark" | "light" | "custom";
    primaryColor: string;
    logo?: string;
    banner?: string;
  };

  // 수익 설정
  revenueShare: {
    enabled: boolean;
    percentage: number; // 인플루언서가 가져가는 비율
  };
}

// 팬 (2차 하위 페이지 소유자)
export interface Fan {
  id: string;
  influencerId: string; // 소속된 인플루언서
  slug: string; // e.g., 'fan1' (kkang.faneasy.kr/fan1)
  name: string;
  email: string;
  passwordHash: string;
  role: "user";
  createdAt: Date;
  updatedAt: Date;

  // 하위 페이지 설정
  pageSettings: {
    title: string;
    description: string;
    theme: "dark" | "light" | "custom";
    primaryColor: string;
    banner?: string;
  };

  // 권한 설정
  permissions: {
    canEditContent: boolean;
    canManageProducts: boolean;
    canViewAnalytics: boolean;
  };
}

// 상품/서비스
export interface Product {
  id: string;
  ownerId: string; // Influencer ID or Fan ID
  ownerType: "influencer" | "fan";
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 콘텐츠 (게시물, 공지사항 등)
export interface Content {
  id: string;
  ownerId: string;
  ownerType: "influencer" | "fan";
  type: "post" | "notice" | "event";
  title: string;
  body: string;
  images?: string[];
  isPinned: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 주문
// 주문
export interface Order {
  id: string;
  productId: string; // Plan ID (basic, pro, master)
  ownerId: string; // Seller ID (Influencer)

  // Buyer Info
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  businessName?: string; // For B2B

  // Transaction
  amount: number;
  paymentMethod: "bank_transfer";
  status: "pending_payment" | "paid" | "processing" | "active" | "cancelled";

  // Product Specifics (Agency Service)
  domainRequest?: string; // Requested domain

  createdAt: Date;
  updatedAt: Date;

  // 수익 분배 (Log)
  revenueDistribution?: {
    influencerShare: number;
    platformFee: number;
  };
}

// 로그인 요청/응답
export interface LoginRequest {
  email?: string;
  password?: string;
  subdomain?: string; // 어느 페이지의 관리자인지
  idToken?: string; // Firebase ID token (optional)
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    subdomain?: string;
    slug?: string;
  };
  error?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  subdomain?: string; // required for influencers
}

export interface SignupResponse {
  success: boolean;
  token?: string; // custom token
  user?: any;
  error?: string;
}

// JWT 페이로드
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  subdomain?: string;
  slug?: string;
}

// 문의/상담 신청
export type InquiryWorkflowStatus = 
  | 'received'           // 문의폼 접수 확인
  | 'first_call'         // 1차 유선 상담
  | 'kakao_progress'     // 카톡 채널로 진행사항 안내
  | 'signup_order'       // 홈페이지 회원가입 + 주문서 작성
  | 'payment_received'   // 초기세팅비 입금
  | 'in_progress'        // 작업진행
  | 'review'             // 중간중간 검수
  | 'completed'          // 완료
  | 'subscription_active'; // 구독료 발생 중

export interface InquiryNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string; // Admin user ID
}

export interface InquiryTimeline {
  status: InquiryWorkflowStatus;
  timestamp: string;
  note?: string;
}

export interface Inquiry {
  id: string;
  ownerId: string; // Influencer ID (깡대표)
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  plan: "basic" | "pro" | "master";
  desiredDomain?: string; // 희망 도메인
  
  // Legacy status (kept for backward compatibility)
  status: "pending" | "contacted" | "completed" | "in_progress" | "archived";
  
  // New workflow management
  workflowStatus: InquiryWorkflowStatus;
  notes: InquiryNote[];
  timeline: InquiryTimeline[];
  
  // Important dates
  completedAt?: string;        // 완료일
  subscriptionStartDate?: string; // 구독 시작일 (완료일 다음날)
  
  createdAt: Date;
  updatedAt?: Date;
}

export interface SiteSettings {
  id: string; // subdomain or userId
  ownerId: string;
  siteName: string;
  siteDescription: string;
  domain: string;
  primaryColor: string;
  logoUrl?: string;     // Added
  bannerUrl?: string;   // Added
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'reply' | 'settings' | 'login' | 'inquiry' | 'update' | 'security' | 'order';
  userName: string;
  userEmail: string;
  action: string;
  target: string;
  timestamp: string;
  subdomain?: string; // Optional: to filter by site
}
export interface SiteNode {
  id: string;          // subdomain (e.g., 'fan1')
  parentSiteId: string; // parent subdomain (e.g., 'kkang')
  name: string;
  ownerId?: string;
  ownerName?: string;
  adminIds?: string[];
  createdAt: string;
  updatedAt: string;
}
