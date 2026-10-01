import type {
  Equipment,
  AnalysisResult,
  FullAnalysisResponse,
  RAGResponse,
  RAGHealthResponse
} from './types';

const API_BASE = '/api';

class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  }

  // Equipment endpoints
  async getEquipmentList(): Promise<string[]> {
    const data = await this.get<Equipment>('/equipment');
    return data.equipment;
  }

  // Analysis endpoints
  async analyzeEquipment(
    equipment: string,
    mode: 'current' | 'failure' = 'failure'
  ): Promise<AnalysisResult> {
    return this.post<AnalysisResult>('/analyze', { equipment, mode });
  }

  async analyzeWithLLM(
    equipment: string,
    mode: 'current' | 'failure' = 'failure'
  ): Promise<FullAnalysisResponse> {
    return this.post<FullAnalysisResponse>('/analyze-with-llm', { equipment, mode });
  }

  // RAG endpoints
  async queryRAG(
    query: string,
    failureMode?: string,
    topK: number = 5
  ): Promise<RAGResponse> {
    return this.post<RAGResponse>('/rag/query', {
      query,
      failure_mode: failureMode,
      top_k: topK
    });
  }

  async getRAGHealth(): Promise<RAGHealthResponse> {
    return this.get<RAGHealthResponse>('/rag/health');
  }
}

export const api = new ApiClient();
