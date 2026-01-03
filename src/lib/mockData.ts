import { SourceReference } from "../components/SourceCard";

// Message interface update
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: SourceReference[]; // Using the new type
  confidence?: number;
  category?: string;
}

export interface ConversationData {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: Message[];
  category?: string; // "academic", "campus", "financial" etc.
}

export const categories = [
  { id: "all", label: "All Topics", icon: "📋" },
  { id: "academic", label: "Academic", icon: "🎓" },
  { id: "campus", label: "Campus Life", icon: "buildings" },
  { id: "financial", label: "Financial Aid", icon: "💰" },
];

// Updated mock conversations with NEW source structure (filename, score)
export const mockConversations: ConversationData[] = [
  {
    id: "1",
    title: "Erasmus Application",
    timestamp: "2 hours ago",
    preview: "What are the requirements for Erasmus?",
    category: "academic",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "What are the GPA requirements for Erasmus exchange program?",
        timestamp: "10:30 AM",
      },
      {
        id: "m2",
        role: "assistant",
        content: "According to the International Exchange Programs regulations, undergraduate students must have a minimum **CGPA of 2.20** to be eligible for the Erasmus+ program.\n\nAlso, you shouldn't have any disciplinary records.",
        timestamp: "10:30 AM",
        confidence: 0.98,
        sources: [
          {
            filename: "Erasmus_Yonergeleri_2024.pdf",
            page_number: 12,
            score: 0.95,
            content: "Undergraduate students typically need a minimum CGPA of 2.20..."
          },
          {
            filename: "Student_Handbook_2023.pdf",
            page_number: 45,
            score: 0.88,
            content: "Exchange program eligibility criteria include academic standing..."
          }
        ]
      }
    ]
  }
];