export type PageView = 'home' | 'about' | 'services' | 'portfolio' | 'contact' | 'admin';

export interface SiteAssets {
  logo?: string;
  founderImage?: string;
  avatar?: string;
}

export interface SiteMetaInfo {
  title?: string;
  tagline?: string;
  email?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  portaly?: string;
}

export interface FounderSocials {
  website: string;
  facebook: string;
  instagram: string;
  youtube: string;
  email: string;
  portaly?: string;
}

export interface FounderInfo {
  name: string;
  nickname: string;
  title: string;
  quote: string;
  taglines: string[];
  yearsOfExperience: number;
  education: string;
  shortBio: string;
  image: string;
  socials: FounderSocials;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'course' | 'ai_workshop' | 'enterprise' | 'consulting';
  categoryLabel: string;
  tagline: string;
  duration: string;
  format: string; // e.g. "線上系統課" | "實體工作坊" | "企業內訓" | "一對一顧問"
  targetAudience: string[];
  description: string;
  highlights: string[];
  modules?: {
    title: string;
    description: string;
  }[];
  featured?: boolean;
  priceTag?: string;
  image: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  clientOrProject: string;
  year: string;
  description: string;
  role: string;
  tags: string[];
  image: string;
  videoUrl?: string;
  highlights: string[];
}

export interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'growth' | 'breakthrough' | 'transformation' | 'impact';
  iconName: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  avatar: string;
  serviceUsed: string;
  tags: string[];
}

export interface DriveFileInfo {
  fileId: string;
  fileName: string;
  fileUrl: string;
}

export interface BotVerification {
  honeypot: boolean;
  durationMs: number;
  isMathValid: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  serviceType: string;
  budgetRange: string;
  preferredTime: string;
  message: string;
  hp_website?: string; // Honeypot field for bot detection
}

export interface InquiryLead {
  id?: string;
  timestamp?: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  serviceType?: string;
  serviceRequested?: string;
  budgetRange?: string;
  preferredTime?: string;
  message?: string;
  driveStatus?: string;
  botVerified?: boolean;
}

