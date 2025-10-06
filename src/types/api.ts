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

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse extends TokenResponse {
  user: User;
}

export interface RateHistoryResponse {
  items: RateResponse[];
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
