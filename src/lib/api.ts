import api from "../api/axios";

// Enum of accepted model values — must match backend ChatModel enum exactly
export type ChatModel =
  | "llama3.1:latest"
  | "qwen2.5:7b"
  | "gpt-oss:120b-cloud";

export const MODEL_OPTIONS: { label: string; value: ChatModel }[] = [
  { label: "Llama 3.1", value: "llama3.1:latest" },
  { label: "Qwen 2.5 7B", value: "qwen2.5:7b" },
  { label: "GPT OSS 120B", value: "gpt-oss:120b-cloud" },
];

export const DEFAULT_MODEL: ChatModel = "llama3.1:latest";

// Define the source reference type from backend
export interface SourceReference {
  chunk_id: number;
  title: string;
  excerpt: string;
  score?: number;
  url?: string;
}

// Define the response type for the RAG endpoint (matches backend ChatResponse schema)
export interface RAGResponse {
  answer: string;
  sources: SourceReference[];
  conversation_id: number;
  query_id: number;
  message_id: number;
  confidence: number;
}

// Define the chat request type
export interface ChatRequest {
  query: string;
  model: ChatModel;
  conversation_id?: number;
  user_id?: string;
}

export interface ChatHistoryMessage {
  id: number | string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: SourceReference[];
  confidence?: number;
  category?: string;
}

export interface ChatHistoryConversation {
  id: number | string;
  title: string;
  timestamp: string;
  preview: string;
  messages?: ChatHistoryMessage[];
  category?: string;
}

// Function to send message to Backend RAG system
export const sendMessageToRAG = async (
  message: string,
  model: ChatModel = DEFAULT_MODEL,
  conversationId?: number
): Promise<RAGResponse> => {
  const payload: ChatRequest = { query: message, model };
  if (conversationId) payload.conversation_id = conversationId;
  const response = await api.post("/chat", payload);
  return response.data;
};

export const fetchChatHistory = async (): Promise<ChatHistoryConversation[]> => {
  const response = await api.get("/chat/history");
  return response.data;
};

// Define the login response type
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_name: string;
  is_admin: boolean;
}

// Login function - sends JSON to /auth/login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};