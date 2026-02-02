import { useState, useEffect} from "react";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { ConversationSidebar } from "./components/ConversationSidebar";
import { ChatInput } from "./components/ChatInput";
import { ScrollArea } from "./components/ui/scroll-area";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { CategoryFilter } from "./components/CategoryFilter";
import { QuickActions } from "./components/QuickActions";
import { KnowledgeBaseStats } from "./components/KnowledgeBaseStats";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import {  Message, ConversationData, categories } from "./lib/mockData";
import { Sparkles, Search, Brain, LogOut } from "lucide-react";
import { Card } from "./components/ui/card";
import { ChatMessage,} from "./components/ChatMessage"; 
import { sendMessageToRAG, fetchChatHistory } from "./lib/api";
import { SourceReference } from "./components/SourceCard";
import sabancıLogo from "./assets/sabanci_logo.png";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string; isAdmin: boolean } | null>(null);
  const [conversations, setConversations] = useState<ConversationData[]>([]); 
  const [currentConversationId, setCurrentConversationId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      // Only fetch if the user is logged in
      if (isLoggedIn) {
        try {
          // Fetch data from the backend
          const history = await fetchChatHistory();
          
          // Update state if history exists
          if (history && history.length > 0) {
             setConversations(history);
             // Select the most recent conversation by default
             setCurrentConversationId(history[0].id);
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    };
    
    loadHistory();
  }, [isLoggedIn]); // Dependency: Re-run when 'isLoggedIn' changes

  const handleLogin = (email: string, name: string, isAdmin: boolean) => {
    
    setUser({ email, name, isAdmin });
    setIsLoggedIn(true);
    
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show admin dashboard for admin users
  if (user?.isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  // --- UPDATED SEND MESSAGE FUNCTION ---
  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) return;

    // 1. Immediately display the User's message in the UI
    const newUserMessage: Message = {
      id: `${currentConversationId}-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newUserMessage],
              preview: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
              timestamp: "Just now",
            }
          : conv
      )
    );

    // 2. Start loading state (shows the thinking animation)
    setIsTyping(true);

    try {
      // 3. Parse numeric conversation ID if possible (backend expects number)
      const numericConvId = currentConversationId.startsWith('new-')
        ? undefined
        : parseInt(currentConversationId, 10) || undefined;

      // 4. SEND API REQUEST (Connects to Real Backend)
      const data = await sendMessageToRAG(content, numericConvId);

      // 5. CREATE AI RESPONSE OBJECT
      const aiResponse: Message = {
        id: `${currentConversationId}-${Date.now()}-ai`,
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),

        // Map Backend response to Frontend 'SourceReference' type
        sources: data.sources?.map((src) => ({
            chunk_id: src.chunk_id,
            title: src.title,
            excerpt: src.excerpt,
            score: src.score,
            url: src.url
        })) || [],

        confidence: data.confidence || 0.95,
      };

      // 6. Update UI with the AI's answer and sync conversation ID from backend
      const backendConvId = data.conversation_id?.toString() || currentConversationId;

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                id: backendConvId,
                messages: [...conv.messages, aiResponse],
              }
            : conv
        )
      );

      // Update current conversation ID if backend assigned a new one
      if (backendConvId !== currentConversationId) {
        setCurrentConversationId(backendConvId);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      // Always stop the loading animation
      setIsTyping(false);
    }
  };
  // --- END OF FUNCTION ---

  const handleNewConversation = () => {
    const newConv: ConversationData = {
      id: `new-${Date.now()}`,
      title: "New Conversation",
      timestamp: "Just now",
      preview: "Start a new conversation...",
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const filteredConversations = selectedCategory === "all" 
    ? conversations 
    : conversations.filter(c => c.category === selectedCategory);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ConversationSidebar
          conversations={filteredConversations.map((c) => ({
            id: c.id,
            title: c.title,
            timestamp: c.timestamp,
            preview: c.preview,
          }))}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          userName={user?.name || "Student"}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b bg-card px-6 py-3 flex items-center gap-4 shrink-0">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img 
                src={sabancıLogo} 
                alt="Sabancı Universitesi" 
                className="h-8 w-auto shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h1 className="flex items-center gap-2 flex-wrap">
                  <span>AI Assistant</span>
                  <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Brain className="h-3 w-3" />
                    RAG-Powered
                  </Badge>
                </h1>
                <p className="text-xs text-muted-foreground">
                  Intelligent university assistant with document-sourced answers
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 shrink-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </header>

          {/* Category Filter */}
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

          {/* Main Content Area */}
          <div className="flex-1 flex min-h-0">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <ScrollArea className="flex-1">
                {currentConversation && currentConversation.messages.length > 0 ? (
                  <div className="divide-y">
                    {currentConversation.messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        role={message.role}
                        content={message.content}
                        timestamp={message.timestamp}
                        sources={message.sources || []}      
                        confidence={message.confidence || 0}
                      />
                    ))}
                    {isTyping && (
                      <div className="flex gap-4 p-6 bg-muted/30">
                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 text-white animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <span className="text-sm">University AI Assistant</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="h-2 w-2 rounded-full bg-blue-600/40 animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="h-2 w-2 rounded-full bg-blue-600/40 animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="h-2 w-2 rounded-full bg-blue-600/40 animate-bounce"></div>
                            </div>
                            <span className="text-xs text-muted-foreground">Searching university knowledge base...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="text-center max-w-2xl space-y-6">
                      <img 
                        src={sabancıLogo} 
                        alt="Sabancı Universitesi" 
                        className="h-20 w-auto mx-auto"
                      />
                      <div>
                        <h2 className="mb-2">Welcome to AI Assistant</h2>
                        <p className="text-muted-foreground">
                          Your intelligent university assistant powered by RAG (Retrieval-Augmented Generation) technology.
                          I have access to 2,847+ university documents and can provide accurate, source-backed answers.
                        </p>
                      </div>
                      
                      <Card className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3 text-left">
                          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                          <div>
                            <h3 className="text-sm mb-1 text-blue-900 dark:text-blue-100">How It Works</h3>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              When you ask a question, I search through official university documents, handbooks, and databases
                              to provide accurate answers with source citations. Every response includes references to the original documents.
                            </p>
                          </div>
                        </div>
                      </Card>

                      <div className="grid gap-2 text-left">
                        <button
                          onClick={() => handleSendMessage("What are the admission requirements?")}
                          className="p-3 rounded-lg border hover:bg-accent transition-colors text-sm text-left group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>🎓</span>
                            <span className="group-hover:text-primary transition-colors">What are the admission requirements?</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-6">Learn about application process and deadlines</p>
                        </button>
                        <button
                          onClick={() => handleSendMessage("Tell me about tuition and financial aid")}
                          className="p-3 rounded-lg border hover:bg-accent transition-colors text-sm text-left group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>💰</span>
                            <span className="group-hover:text-primary transition-colors">Tell me about tuition and financial aid</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-6">Explore costs and scholarship opportunities</p>
                        </button>
                        <button
                          onClick={() => handleSendMessage("When does course registration open?")}
                          className="p-3 rounded-lg border hover:bg-accent transition-colors text-sm text-left group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>📚</span>
                            <span className="group-hover:text-primary transition-colors">When does course registration open?</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-6">Check registration dates and requirements</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            </div>

            {/* Right Sidebar - Resources & Actions */}
            <div className="w-80 border-l bg-card/50 p-4 space-y-4 overflow-y-auto shrink-0 hidden xl:block">
              <KnowledgeBaseStats />
              <QuickActions />
              
              <Card className="p-4">
                <h3 className="mb-3">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(1).map((cat) => (
                    <Badge 
                      key={cat.id} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.icon} {cat.label}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
