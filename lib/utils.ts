import { ChatMessage, SearchHistoryItem } from "./types";

// Local storage keys
const STORAGE_KEYS = {
  CHAT_HISTORY: "faq_chat_history",
  SEARCH_HISTORY: "faq_search_history",
} as const;

// Chat history utilities
export const saveChatHistory = (messages: ChatMessage[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
  }
};

export const loadChatHistory = (): ChatMessage[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatMessage[];
        return parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } catch (error) {
        console.error("Error parsing chat history:", error);
      }
    }
  }
  return [];
};

export const clearChatHistory = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  }
};

// Search history utilities
export const saveSearchHistory = (searches: SearchHistoryItem[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(searches));
  }
};

export const loadSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SearchHistoryItem[];
        return parsed.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      } catch (error) {
        console.error("Error parsing search history:", error);
      }
    }
  }
  return [];
};

export const addSearchToHistory = (
  query: string,
  resultCount: number
): void => {
  const history = loadSearchHistory();
  const newSearch: SearchHistoryItem = {
    id: Date.now().toString(),
    query,
    timestamp: new Date(),
    resultCount,
  };

  // Add to beginning and keep only last 50 searches
  const updatedHistory = [newSearch, ...history.slice(0, 49)];
  saveSearchHistory(updatedHistory);
};

export const clearSearchHistory = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  }
};

// Utility functions
export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
