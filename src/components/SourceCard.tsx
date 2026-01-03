import { Card } from "./ui/card";
import { FileText, Bookmark, CheckCircle2 } from "lucide-react";

// ✅ 1. Define the REAL Data Structure matching the Backend
export interface SourceReference {
  filename: string;
  page_number?: number; 
  score?: number;       
  content?: string;     
}

interface SourceCardProps {
  source: SourceReference;
  index?: number; 
}

export function SourceCard({ source, index }: SourceCardProps) {
  // 2. Helper to clean up the filename for display
  const displayName = source.filename
    ? source.filename.replace(/_/g, " ").replace(".pdf", "").replace(".docx", "")
    : "Unknown Document";

  // 3. Helper to format the score
  const matchPercentage = source.score ? Math.round(source.score * 100) : 0;

  return (
    <Card className="p-3 hover:bg-muted/50 transition-colors cursor-pointer border shadow-sm group bg-card">
      <div className="flex items-start gap-3">
        {/* Icon Section */}
        <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md text-blue-600 dark:text-blue-400">
          <FileText className="h-4 w-4" />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors" title={source.filename}>
              {index !== undefined ? `[${index + 1}] ` : ""}{displayName}
            </h4>
            
            {/* Score Badge */}
            {source.score && (
              <div className="flex items-center gap-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full shrink-0">
                <CheckCircle2 className="h-3 w-3" />
                {matchPercentage}%
              </div>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 mt-1.5">
            {source.page_number !== undefined && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                <Bookmark className="h-3 w-3" />
                <span>Page {source.page_number}</span>
              </div>
            )}
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider border px-1 rounded">
              PDF
            </span>
          </div>

          {/* Snippet preview */}
          {source.content && (
             <p className="mt-2 text-xs text-muted-foreground line-clamp-2 italic border-l-2 pl-2">
               "{source.content.substring(0, 100)}..."
             </p>
          )}
        </div>
      </div>
    </Card>
  );
}