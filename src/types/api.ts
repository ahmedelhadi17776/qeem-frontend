// API Types for Qeem Frontend

export interface RateRequest {
  project_type: string;
  project_complexity: string;
  estimated_hours: number;
  experience_years: number;
  skills_count: number;
  location: string;
}

export interface RateResponse {
  minimum_rate: number;
  competitive_rate: number;
  premium_rate: number;
  currency: string;
  method: string;
  confidence_score?: number;
  breakdown?: {
    base_rate: number;
    experience_multiplier: number;
    skill_multiplier: number;
    location_multiplier: number;
    complexity_multiplier: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
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
