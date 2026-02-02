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

// Updated mock conversations with backend-compatible source structure
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
            chunk_id: 1,
            title: "Erasmus Yonergeleri 2024",
            excerpt: "Undergraduate students typically need a minimum CGPA of 2.20...",
            score: 0.95,
            url: undefined
          },
          {
            chunk_id: 2,
            title: "Student Handbook 2023",
            excerpt: "Exchange program eligibility criteria include academic standing...",
            score: 0.88,
            url: undefined
          }
        ]
      }
    ]
  }
];