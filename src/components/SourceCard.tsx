import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { FileText, Globe, BookOpen, Database, ExternalLink } from "lucide-react";
import { SourceReference } from "../lib/mockData";

interface SourceCardProps {
  source: SourceReference;
  index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  const getIcon = () => {
    switch (source.type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "webpage":
        return <Globe className="h-4 w-4" />;
      case "handbook":
        return <BookOpen className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (source.type) {
      case "pdf":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "webpage":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "handbook":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "database":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    }
  };

  return (
    <Card className="p-3 hover:bg-accent/50 transition-colors cursor-pointer group">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-muted-foreground">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm line-clamp-1 group-hover:text-primary transition-colors">
              [{index}] {source.title}
            </h4>
            {source.url && <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {source.excerpt}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs px-1.5 py-0 ${getTypeColor()}`}>
              {source.type.toUpperCase()}
            </Badge>
            {source.department && (
              <span className="text-xs text-muted-foreground">{source.department}</span>
            )}
            {source.lastUpdated && (
              <span className="text-xs text-muted-foreground">• {source.lastUpdated}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
