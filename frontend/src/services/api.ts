import axios from 'axios';
import {
  BorrowerSummary,
  ScoreResponse,
  ScoreHistoryItem,
  ExplanationItem,
  ConsentItem,
  ConsentToggleResponse,
  SimulateRequest,
  SimulateResponse,
  LenderBorrowerAssessment,
  AccessLogItem,
  DemoSession
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Demo Auth
  loginDemo: async (email: string, password: string): Promise<DemoSession> => {
    const res = await client.post('/api/demo/login', { email, password });
    return {
      role: res.data.role,
      borrowerId: res.data.borrower_id,
      name: res.data.name,
      token: res.data.token,
    };
  },

  getBorrowers: async (): Promise<BorrowerSummary[]> => {
    const res = await client.get<BorrowerSummary[]>('/api/demo/borrowers');
    return res.data;
  },

  // Score API
  getScore: async (borrowerId: number): Promise<ScoreResponse> => {
    const res = await client.get<ScoreResponse>(`/api/score/${borrowerId}`);
    return res.data;
  },

  getScoreHistory: async (borrowerId: number): Promise<ScoreHistoryItem[]> => {
    const res = await client.get<ScoreHistoryItem[]>(`/api/score/history/${borrowerId}`);
    return res.data;
  },

  getScoreExplanation: async (borrowerId: number): Promise<ExplanationItem[]> => {
    const res = await client.get<ExplanationItem[]>(`/api/score/explanation/${borrowerId}`);
    return res.data;
  },

  simulateScore: async (borrowerId: number, req: SimulateRequest): Promise<SimulateResponse> => {
    const res = await client.post<SimulateResponse>(`/api/score/simulate/${borrowerId}`, req);
    return res.data;
  },

  // Consent API
  getConsents: async (borrowerId: number): Promise<ConsentItem[]> => {
    const res = await client.get<ConsentItem[]>(`/api/consent/${borrowerId}`);
    return res.data;
  },

  toggleConsent: async (borrowerId: number, source: string, granted: boolean): Promise<ConsentToggleResponse> => {
    const res = await client.post<ConsentToggleResponse>(`/api/consent/${borrowerId}`, {
      source,
      granted,
    });
    return res.data;
  },

  // Lender API
  getLenderBorrowerAssessment: async (borrowerId: number): Promise<LenderBorrowerAssessment> => {
    const res = await client.get<LenderBorrowerAssessment>(`/api/lender/borrower/${borrowerId}`);
    return res.data;
  },

  getLenderAccessLogs: async (): Promise<AccessLogItem[]> => {
    const res = await client.get<AccessLogItem[]>('/api/lender/access-log');
    return res.data;
  },

  healthCheck: async () => {
    const res = await client.get('/health');
    return res.data;
  }
};
