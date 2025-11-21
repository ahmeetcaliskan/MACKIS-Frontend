import { SourceReference } from "./mockData";

// Backend'inin adresi (Örnek: localhost:8000)
const API_URL = "http://localhost:8000"; 

export interface BackendResponse {
  answer: string;
  sources: SourceReference[]; // Backend'den gelen kaynak formatı mockData ile uyumlu olmalı
  confidence?: number;
}

export async function sendMessageToRAG(message: string): Promise<BackendResponse> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Backend'inin beklediği parametre adı 'query' veya 'message' olabilir, burayı güncelle.
      body: JSON.stringify({ query: message }), 
    });

    if (!response.ok) {
      throw new Error("API yanıt vermedi");
    }

    return await response.json();
  } catch (error) {
    console.error("RAG Hatası:", error);
    throw error;
  }
}