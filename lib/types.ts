// API endpoints
export const API_BASE_URL = "http://localhost:8001";

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  SEARCH_FAQ: `${API_BASE_URL}/search-faq`,
  CHAT: `${API_BASE_URL}/chat`,
  SIMPLE_CHAT: `${API_BASE_URL}/simple-chat`,
} as const;

// Types for API responses
export interface HealthResponse {
  status: string;
  model: string;
  provider: string;
  faq_records: number;
}

export interface FAQResult {
  content: string;
  metadata: {
    id: number;
    title: string;
    category: string;
    sub_category: string;
  };
  similarity_score: number;
}

export interface SearchFAQResponse {
  query: string;
  results: FAQResult[];
  count: number;
  status: string;
}

export interface ChatResponse {
  response: string;
  faq_context?: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  faq_used: boolean;
  status: string;
}

export interface APIError {
  error: string;
  status: string;
}

// Chat message types
export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  faq_context?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Search history types
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
}
