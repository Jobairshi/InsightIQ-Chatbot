import {
  API_ENDPOINTS,
  HealthResponse,
  SearchFAQResponse,
  ChatResponse,
  APIError,
} from "./types";

// Robust API calling with error handling
const callAPI = async <T>(url: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: "error",
    } as T;
  }
};

// Check backend status
export const checkHealth = async (): Promise<HealthResponse | APIError> => {
  return callAPI<HealthResponse | APIError>(API_ENDPOINTS.HEALTH);
};

// Search FAQ database
export const searchFAQ = async (
  query: string,
  maxResults: number = 5
): Promise<SearchFAQResponse | APIError> => {
  return callAPI<SearchFAQResponse | APIError>(API_ENDPOINTS.SEARCH_FAQ, {
    method: "POST",
    body: JSON.stringify({
      query,
      max_results: maxResults,
    }),
  });
};

// Chat with AI assistant
export const chatWithAI = async (
  message: string,
  systemPrompt?: string
): Promise<ChatResponse | APIError> => {
  return callAPI<ChatResponse | APIError>(API_ENDPOINTS.CHAT, {
    method: "POST",
    body: JSON.stringify({
      message,
      system_prompt: systemPrompt || "You are a helpful FAQ assistant.",
    }),
  });
};

// Simple chat API
export const simpleChatWithAI = async (
  message: string
): Promise<ChatResponse | APIError> => {
  return callAPI<ChatResponse | APIError>(
    `${API_ENDPOINTS.SIMPLE_CHAT}?message=${encodeURIComponent(message)}`,
    {
      method: "POST",
    }
  );
};

// Utility function to check if response is an error
export const isAPIError = (
  response: HealthResponse | SearchFAQResponse | ChatResponse | APIError
): response is APIError => {
  return response && response.status === "error";
};
