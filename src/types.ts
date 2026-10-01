// API types matching backend responses
export interface Equipment {
  equipment: string[];
}

export interface Signal {
  parameter: string;
  value: number;
  direction: string;
  threshold: number;
  abnormal: boolean;
  explanation: string;
  trend: {
    recent_mean: number;
    previous_mean: number;
    change_pct: number;
    recent_slope: number;
  } | null;
}

export interface HistoricalIncident {
  ar_no: string;
  title: string;
  failure_mechanism: string;
  downtime_hours: number;
  actual_loss_k_usd: number;
  total_loss_k_usd: number;
  date: string;
}

export interface AnalysisResult {
  equipment: string;
  status: 'NORMAL' | 'HIGH' | 'CRITICAL';
  analysis_type: string;
  mode: string;
  selected_week: number;
  selected_date: string;
  latest_reading: Record<string, any>;
  signals: Signal[];
  anomaly_count: number;
  probable_root_cause: string;
  historical_incidents: HistoricalIncident[];
  performance_summary: Record<string, any>;
  rca_available: boolean;
}

export interface RAGResult {
  text: string;
  score: number;
  document: string;
  page: number;
  failure_mode: string;
  source_type: string;
  source_path: string;
}

export interface RAGResponse {
  success: boolean;
  query: string;
  failure_mode: string | null;
  results: RAGResult[];
  count: number;
  found: boolean;
}

export interface LLMResponse {
  enabled: boolean;
  model?: string;
  rag_used?: boolean;
  rag_count?: number;
  result?: any;
  message?: string;
}

export interface FullAnalysisResponse {
  analysis: AnalysisResult;
  rag: {
    used: boolean;
    count: number;
    results: RAGResult[];
  };
  llm: LLMResponse;
}

export interface RAGHealthResponse {
  status: string;
  collection?: string;
  chunks?: number;
  message?: string;
}
