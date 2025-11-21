export interface SourceReference {
  title: string;
  type: "pdf" | "webpage" | "handbook" | "database";
  url?: string;
  excerpt: string;
  department?: string;
  lastUpdated?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: SourceReference[];
  confidence?: number;
  category?: string;
}

export interface ConversationData {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: Message[];
  category?: string;
}

export type Category = "admissions" | "academics" | "campus-life" | "financial" | "facilities" | "support" | "general";

export const categories = [
  { id: "all", label: "All Topics", icon: "📚" },
  { id: "admissions", label: "Admissions", icon: "🎓" },
  { id: "academics", label: "Academics", icon: "📖" },
  { id: "financial", label: "Financial", icon: "💰" },
  { id: "campus-life", label: "Campus Life", icon: "🏛️" },
  { id: "facilities", label: "Facilities", icon: "🏢" },
  { id: "support", label: "Support", icon: "🤝" },
];

// Mock source references
const admissionSources: SourceReference[] = [
  {
    title: "Undergraduate Admissions Guide 2025",
    type: "pdf",
    url: "#",
    excerpt: "Rolling admission process opens January 1st. Requirements include completed application, transcripts, test scores (optional), recommendations, and personal essay.",
    department: "Admissions Office",
    lastUpdated: "Jan 2025",
  },
  {
    title: "Application Requirements & Deadlines",
    type: "webpage",
    url: "#",
    excerpt: "Fall 2025 deadline: July 31st. Early decision: November 15th, 2024.",
    department: "Admissions Office",
    lastUpdated: "Dec 2024",
  },
];

const tuitionSources: SourceReference[] = [
  {
    title: "Tuition & Fees Schedule 2024-2025",
    type: "database",
    excerpt: "Undergraduate full-time: $18,500/semester. Graduate full-time: $22,000/semester. Includes itemized fee breakdown.",
    department: "Bursar's Office",
    lastUpdated: "Aug 2024",
  },
  {
    title: "Financial Aid Overview",
    type: "handbook",
    excerpt: "85% of students receive financial assistance through scholarships, grants, and work-study programs.",
    department: "Financial Aid",
    lastUpdated: "Sep 2024",
  },
];

const courseSources: SourceReference[] = [
  {
    title: "Academic Calendar & Registration Dates",
    type: "webpage",
    url: "#",
    excerpt: "Fall 2025 registration: Priority April 1, General April 15, Late Aug 20-25.",
    department: "Registrar",
    lastUpdated: "Mar 2025",
  },
  {
    title: "Course Catalog 2025",
    type: "database",
    excerpt: "Complete course listings with prerequisites, meeting times, and instructor information available online.",
    department: "Academic Affairs",
    lastUpdated: "Jan 2025",
  },
];

const librarySources: SourceReference[] = [
  {
    title: "Library Services & Hours",
    type: "webpage",
    url: "#",
    excerpt: "Main library operates M-Th 7AM-11PM, with extended hours during finals. 500,000+ books and 150+ databases.",
    department: "Library Services",
    lastUpdated: "Oct 2024",
  },
];

const housingSources: SourceReference[] = [
  {
    title: "Housing Options & Rates 2025",
    type: "pdf",
    excerpt: "Traditional dorms: $4,200/semester. Suite-style: $5,500. Apartment-style: $6,800. Applications open Feb 1st.",
    department: "Residential Life",
    lastUpdated: "Nov 2024",
  },
  {
    title: "First-Year Housing Policy",
    type: "handbook",
    excerpt: "All first-year students required to live on campus in traditional residence halls or living-learning communities.",
    department: "Residential Life",
    lastUpdated: "Jun 2024",
  },
];

// Mock responses with sources
export const getMockResponse = (userMessage: string): { content: string; sources: SourceReference[]; confidence: number; category: string } => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("admission") || lowerMessage.includes("apply")) {
    return {
      content: `Based on our university documentation, here's information about admissions:

Our university has a rolling admission process that opens on January 1st each year. The requirements include:

• Completed application form
• Official high school transcripts
• SAT or ACT scores (optional for 2025)
• Two letters of recommendation
• Personal essay (500-750 words)

The application deadline for Fall 2025 is July 31st, 2025. Early decision applicants should submit by November 15th, 2024.

Is there a specific program you're interested in? I can provide more detailed information.`,
      sources: admissionSources,
      confidence: 0.95,
      category: "admissions",
    };
  }

  if (lowerMessage.includes("tuition") || lowerMessage.includes("fee") || lowerMessage.includes("cost")) {
    return {
      content: `Here's the tuition information for the 2024-2025 academic year:

**Undergraduate Programs:**
• Full-time tuition: $18,500 per semester
• Part-time tuition: $1,200 per credit hour
• Student activity fee: $450 per semester
• Technology fee: $300 per semester

**Graduate Programs:**
• Full-time tuition: $22,000 per semester
• Part-time tuition: $1,500 per credit hour

**Financial Aid:**
We offer various scholarships, grants, and work-study programs. Approximately 85% of our students receive some form of financial assistance.

Would you like information about specific scholarship opportunities?`,
      sources: tuitionSources,
      confidence: 0.98,
      category: "financial",
    };
  }

  if (lowerMessage.includes("schedule") || lowerMessage.includes("course") || lowerMessage.includes("class")) {
    return {
      content: `Course schedules are available through our student portal. Here's what you need to know:

**Fall 2025 Registration:**
• Priority registration begins: April 1, 2025
• General registration: April 15, 2025
• Late registration: August 20-25, 2025

**Course Load:**
• Full-time: 12-18 credit hours
• Part-time: 1-11 credit hours
• Overload (requires approval): 19+ credit hours

You can view the complete course catalog on our website. Each course listing includes prerequisites, meeting times, and instructor information.

What specific courses or programs are you interested in?`,
      sources: courseSources,
      confidence: 0.92,
      category: "academics",
    };
  }

  if (lowerMessage.includes("library") || lowerMessage.includes("book")) {
    return {
      content: `Our university library system provides extensive resources:

**Main Library Hours:**
• Monday-Thursday: 7:00 AM - 11:00 PM
• Friday: 7:00 AM - 8:00 PM
• Saturday: 9:00 AM - 6:00 PM
• Sunday: 10:00 AM - 10:00 PM

**Resources:**
• Over 500,000 physical books
• Access to 150+ academic databases
• Study rooms (reservable online)
• 24/7 online research assistance
• Interlibrary loan services

You can access digital resources remotely using your student ID. Need help finding specific materials?`,
      sources: librarySources,
      confidence: 0.96,
      category: "facilities",
    };
  }

  if (lowerMessage.includes("housing") || lowerMessage.includes("dorm") || lowerMessage.includes("residence")) {
    return {
      content: `University housing options include:

**Freshman Housing:**
• Traditional residence halls (double occupancy)
• Living-learning communities
• Mandatory for first-year students

**Upper-Division Housing:**
• Suite-style apartments
• Single and double rooms available
• Optional meal plans

**Housing Costs (per semester):**
• Traditional dorm: $4,200
• Suite-style: $5,500
• Apartment-style: $6,800

Applications for Fall 2025 housing open February 1st. Priority is given to applications submitted by March 15th.

Would you like more information about a specific housing option?`,
      sources: housingSources,
      confidence: 0.94,
      category: "campus-life",
    };
  }

  if (lowerMessage.includes("exam") || lowerMessage.includes("grade") || lowerMessage.includes("academic calendar")) {
    return {
      content: `Here's the academic calendar information:

**Fall 2025 Semester:**
• Classes begin: August 25, 2025
• Labor Day (no classes): September 1, 2025
• Fall break: October 13-14, 2025
• Thanksgiving break: November 26-30, 2025
• Final exams: December 8-12, 2025

**Grading Policy:**
• A: 90-100%
• B: 80-89%
• C: 70-79%
• D: 60-69%
• F: Below 60%

Final grades are posted within 72 hours after the exam period ends. Students can view grades through the student portal.

Need information about a specific course or academic policy?`,
      sources: [
        {
          title: "Academic Calendar 2024-2025",
          type: "webpage",
          excerpt: "Fall 2025 semester dates and important deadlines including registration, breaks, and finals.",
          department: "Registrar",
          lastUpdated: "Feb 2025",
        },
      ],
      confidence: 0.97,
      category: "academics",
    };
  }

  // Default response
  return {
    content: `Thank you for your question. I'm the University AI Assistant, powered by RAG technology with access to all university documentation and web services.

I can help you with information about:
• Admissions and application processes
• Tuition, fees, and financial aid
• Course schedules and registration
• Academic calendars and policies
• Library resources and hours
• Housing and residential life
• Campus facilities and services
• Student support services

Could you please provide more details about what you'd like to know? The more specific your question, the better I can assist you with accurate information from our university resources.`,
    sources: [],
    confidence: 0.85,
    category: "general",
  };
};

// Mock conversation data with enhanced metadata
export const mockConversations: ConversationData[] = [
  {
    id: "1",
    title: "Admission Requirements 2025",
    timestamp: "Today, 2:30 PM",
    preview: "What are the admission requirements?",
    category: "admissions",
    messages: [
      {
        id: "1-1",
        role: "user",
        content: "What are the admission requirements for Fall 2025?",
        timestamp: "2:30 PM",
      },
      {
        id: "1-2",
        role: "assistant",
        content: getMockResponse("admission requirements").content,
        timestamp: "2:30 PM",
        sources: admissionSources,
        confidence: 0.95,
        category: "admissions",
      },
    ],
  },
  {
    id: "2",
    title: "Library Hours & Resources",
    timestamp: "Today, 10:15 AM",
    preview: "When is the library open?",
    category: "facilities",
    messages: [
      {
        id: "2-1",
        role: "user",
        content: "When is the library open?",
        timestamp: "10:15 AM",
      },
      {
        id: "2-2",
        role: "assistant",
        content: getMockResponse("library hours").content,
        timestamp: "10:15 AM",
        sources: librarySources,
        confidence: 0.96,
        category: "facilities",
      },
    ],
  },
  {
    id: "3",
    title: "Tuition and Financial Aid",
    timestamp: "2 days ago",
    preview: "How much is tuition?",
    category: "financial",
    messages: [
      {
        id: "3-1",
        role: "user",
        content: "How much is tuition for undergraduate programs?",
        timestamp: "3:45 PM",
      },
      {
        id: "3-2",
        role: "assistant",
        content: getMockResponse("tuition").content,
        timestamp: "3:45 PM",
        sources: tuitionSources,
        confidence: 0.98,
        category: "financial",
      },
    ],
  },
  {
    id: "4",
    title: "Course Registration Help",
    timestamp: "1 week ago",
    preview: "How do I register for courses?",
    category: "academics",
    messages: [
      {
        id: "4-1",
        role: "user",
        content: "How do I register for courses?",
        timestamp: "11:20 AM",
      },
      {
        id: "4-2",
        role: "assistant",
        content: getMockResponse("course schedule").content,
        timestamp: "11:20 AM",
        sources: courseSources,
        confidence: 0.92,
        category: "academics",
      },
    ],
  },
];
