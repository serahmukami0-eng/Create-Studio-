export type Currency = 'KSH' | 'USD';

export interface ServiceItem {
  id: string;
  title: string;
  category: 'commissions' | 'prints' | 'marketing' | 'tech';
  description: string;
  turnaroundDays: number;
  priceKSh: number;
  priceUSD: number;
  unit: string;
  popular?: boolean;
  deliverables: string[];
  recommendedTools: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'commissions' | 'prints' | 'marketing' | 'tech';
  description: string;
  clientPrompt: string;
  image: string;
  aspectRatio: '16:9' | '4:3' | '3:4' | '1:1' | '9:16';
  tools: string[];
  suggestedPriceKSh: number;
  suggestedPriceUSD: number;
  license: string;
  tags: string[];
}

export interface RoadmapTask {
  id: string;
  week: 1 | 2 | 3 | 4;
  weekTitle: string;
  title: string;
  description: string;
  actionableStep: string;
  isCompleted: boolean;
  resources: string[];
}

export type CommissionStage =
  | 'lead'
  | 'deposit'
  | 'draft'
  | 'revisions'
  | 'delivery'
  | 'paid'
  | 'inquiry'
  | 'draft_review'
  | 'revision'
  | 'completed';

export interface CommissionOrder {
  id: string;
  clientName: string;
  clientContact: string;
  serviceTitle: string;
  category: 'commissions' | 'prints' | 'marketing' | 'tech';
  priceKSh: number;
  priceUSD: number;
  currency: Currency;
  depositStatus: 'unpaid' | 'deposit_paid' | 'fully_paid';
  stage: CommissionStage;
  revisionsUsed: number;
  maxRevisions: number;
  deadline: string;
  createdAt?: string;
  notes: string;
  hasWatermarkPreview: boolean;
}

export interface AiConceptResult {
  conceptTitle: string;
  artisticDirection: string;
  recommendedDimensions: string;
  colorPalette: string[];
  typographyPairing: string;
  suggestedPriceKSh: string;
  suggestedPriceUSD: string;
  revisionPolicy: string;
  recommendedTools: string[];
  socialMediaHook: string;
  socialMediaCaption: string;
  whatsappClientPitch: string;
}

export type MonetizationPlan = 'free' | 'premium' | 'individual' | 'business_starter' | 'business_growth';

export interface UserSubscription {
  plan: MonetizationPlan;
  active: boolean;
  activatedAt?: string;
  expiresAt?: string;
  mpesaReceipt?: string;
  customerPhone?: string;
}

export type BusinessDesignNiche =
  | 'restaurants'
  | 'salons'
  | 'boutiques'
  | 'events'
  | 'startups'
  | 'students';

