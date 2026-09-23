export type UserRole = 'borrower' | 'lender';

export interface BorrowerSummary {
  id: number;
  name: string;
  email: string;
  occupation: string;
  city: string;
  current_score: number;
  band: string;
  coverage: number;
}

export interface AlternativeDataCard {
  source: string;
  title: string;
  status_label: string;
  percentage: number;
  description: string;
}

export interface ExplanationItem {
  feature_name: string;
  shap_value: number;
  direction: 'positive' | 'negative' | 'neutral';
  reason: string;
  impact_points: number;
}

export interface ScoreResponse {
  borrower_id: number;
  borrower_name: string;
  occupation: string;
  city: string;
  score: number;
  band: 'Poor' | 'Fair' | 'Good' | 'Excellent' | string;
  confidence: number;
  data_coverage: number;
  monthly_change: number;
  computed_at: string;
  model_version: string;
  alternative_data: AlternativeDataCard[];
  explanations: ExplanationItem[];
}

export interface ScoreHistoryItem {
  month: string;
  score: number;
}

export interface ConsentItem {
  source: string;
  source_label: string;
  granted: boolean;
  updated_at?: string;
  usage_description: string;
}

export interface ConsentToggleResponse {
  success: boolean;
  source: string;
  granted: boolean;
  new_data_coverage: number;
  new_score: number;
  new_band: string;
  message: string;
}

export interface SimulateRequest {
  upi_consistency: number;
  rent_regularity: number;
  utility_payment_timeliness: number;
  recharge_consistency: number;
}

export interface SimulateResponse {
  current_score: number;
  projected_score: number;
  change_points: number;
  current_band: string;
  projected_band: string;
  note: string;
}

export interface ExplainableFactor {
  factor: string;
  direction: 'Positive' | 'Negative' | 'Neutral' | string;
  impact_text: string;
}

export interface LenderBorrowerAssessment {
  borrower_id: number;
  name: string;
  occupation: string;
  city: string;
  score: number;
  band: string;
  data_coverage: number;
  explainable_factors: ExplainableFactor[];
  privacy_notice: string;
}

export interface AccessLogItem {
  id: number;
  lender_name: string;
  borrower_name: string;
  accessed_at: string;
  purpose: string;
}

export interface DemoSession {
  role: UserRole;
  borrowerId?: number;
  name: string;
  token: string;
}
