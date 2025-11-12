export interface Dataset {
  id: string;
  title: string;
  domains: string[];
  description: string;
  est_users: number;
  freshness: string;
  pricing_per_user_day: number;
  sample_fields: string[];
}

export interface Field {
  name: string;
  type: string;
  example: string | number | boolean;
  description: string;
}

export interface Source {
  id: string;
  name: string;
  domain: string;
  description: string;
  estimated_users: number;
  freshness: string;
  price_per_user_day: number;
  fields: Field[];
}

export interface DomainSuggestion {
  domain: string;
  sources: Source[];
}

export interface SuggestResponse {
  query: string;
  detected_domains: string[];
  estimated_users: number;
  estimated_monthly_cost: number;
  suggestions: DomainSuggestion[];
}

export interface PreviewResponse {
  rows: Record<string, unknown>[];
  endpoint: string;
  demo_api_key: string;
}

export interface SelectedFields {
  [sourceId: string]: string[];
}

export interface StreamData {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  created_at: string;
  updated_at: string;
  sample_data: Record<string, unknown>[];
}

export interface PlanResponse {
  query: string;
  detected_domains: string[];
  sources: Array<{
    id: string;
    name: string;
    users: number;
    freshness: string;
    price_per_user_day: number;
  }>;
  estimated_users: number;
  estimated_monthly_cost: number;
}
