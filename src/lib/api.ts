import api from "../api/axios";

// Define the response type for the RAG endpoint
export interface RAGResponse {
  answer: string;
  sources: Array<{
    filename: string;
    page_number?: number;
    score?: number;
    content?: string;
  }>;
  confidence?: number;
  // backend also sends 'query_id', 'intent' etc. if needed
}

// 1. Function to send message to Backend
export const sendMessageToRAG = async (message: string): Promise<RAGResponse> => {
  // Backend expects: { "query": "Your question here" }
  const response = await api.post("/chat/", { query: message });
  return response.data;
};

export const fetchChatHistory = async () => {
  // Sends a GET request to the history endpoint
  const response = await api.get("/chat/history");
  return response.data; // Returns the list of conversations from the backend
};

// 2. Export the login function (from previous steps) here as well to keep things organized
export const loginUser = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};