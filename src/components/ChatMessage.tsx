import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bot, User, CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { SourceReference } from "../lib/mockData";
import { SourceCard } from "./SourceCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";

interface ChatMessageProps {
  key?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  sources?: SourceReference[];
  confidence?: number;
}

export function ChatMessage({ role, content, timestamp, sources, confidence }: ChatMessageProps) {
  const isAssistant = role === "assistant";
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const getConfidenceBadge = () => {
    if (!confidence) return null;
    
    const percentage = Math.round(confidence * 100);
    let variant: "default" | "secondary" | "outline" = "default";
    let color = "";
    
    if (percentage >= 90) {
      color = "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    } else if (percentage >= 75) {
      color = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    } else {
      color = "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    }

    return (
      <Badge variant="outline" className={`text-xs gap-1 ${color}`}>
        <CheckCircle2 className="h-3 w-3" />
        {percentage}% confidence
      </Badge>
    );
  };

  return (
    <div className={`flex gap-4 p-6 ${isAssistant ? "bg-muted/30" : ""}`}>
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className={isAssistant ? "bg-blue-600 text-white" : "bg-secondary"}>
          {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-3 max-w-4xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm">{isAssistant ? "University AI Assistant" : "You"}</span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          )}
          {isAssistant && getConfidenceBadge()}
        </div>
        <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
        
        {isAssistant && sources && sources.length > 0 && (
          <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span>📚 {sources.length} source{sources.length > 1 ? 's' : ''} referenced</span>
              <span className="text-xs">{sourcesOpen ? '▼' : '▶'}</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {sources.map((source, index) => (
                <div key={index}></div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
