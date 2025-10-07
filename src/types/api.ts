// API Types for Qeem Frontend

export interface RateRequest {
  project_type:
    | 'web_development'
    | 'mobile_development'
    | 'design'
    | 'writing'
    | 'marketing'
    | 'consulting'
    | 'data_analysis'
    | 'other';
  project_complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  estimated_hours: number;
  experience_years: number;
  skills_count: number;
  location: string;
  client_region: 'egypt' | 'mena' | 'europe' | 'usa' | 'global';
  urgency: 'normal' | 'rush';
}

export interface RateResponse {
  minimum_rate: number;
  competitive_rate: number;
  premium_rate: number;
  currency: 'EGP';
  method: 'rule_based' | 'ml_prediction';
  rationale: string;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  bio: string | null;
  profession: string | null;
  experience_years: number | null;
  skills: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  city: string | null;
  country: string | null;
  preferred_currency: string | null;
  hourly_rate_preference: number | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse extends TokenResponse {
  user: User;
}

export interface RateHistoryItem extends RateResponse {
  id?: number;
  created_at?: string;
  project_type?: string;
  project_complexity?: string;
}

export interface RateHistoryResponse {
  items: RateHistoryItem[];
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface MarketInsight {
  skill: string;
  demand_level: 'low' | 'medium' | 'high';
  average_rate: number;
  trend: 'up' | 'down' | 'stable';
  location: string;
}

export interface Invoice {
  id: string;
  client_name: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
}

export interface Contract {
  id: string;
  title: string;
  client_name: string;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  start_date: string;
  end_date?: string;
  rate: number;
  currency: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface MarketStatisticsQuery {
  project_type?: string;
  location?: string;
  period_type?: 'daily' | 'weekly' | 'monthly';
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface MarketStatisticsItem {
  date: string;
  period_type: string;
  project_type: string;
  location: string;
  average_rate: number;
  median_rate: number;
  min_rate: number;
  max_rate: number;
  demand_score?: number;
  competition_score?: number;
  market_trend?: string;
}

export interface MarketStatisticsResponse {
  items: MarketStatisticsItem[];
  total: number;
  limit: number;
  offset: number;
  cached: boolean;
}

export interface MarketTrendsQuery {
  project_type?: string;
  location?: string;
  period_type?: 'daily' | 'weekly' | 'monthly';
  window?: number;
}

export interface MarketTrendsPoint {
  period_start: string;
  period_end?: string;
  average_rate: number;
  median_rate: number;
  demand_score?: number;
  market_trend?: string;
}

export interface MarketTrendsResponse {
  points: MarketTrendsPoint[];
  cached: boolean;
}
