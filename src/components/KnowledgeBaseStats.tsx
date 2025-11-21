import { Card } from "./ui/card";
import { FileText, Database, BookOpen, TrendingUp } from "lucide-react";

export function KnowledgeBaseStats() {
  const stats = [
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Documents",
      value: "2,847",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <Database className="h-4 w-4" />,
      label: "Data Sources",
      value: "127",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Topics Covered",
      value: "340+",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Accuracy Rate",
      value: "94%",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <Card className="p-4">
      <h3 className="mb-3">Knowledge Base</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <div className={`flex items-center gap-1.5 ${stat.color}`}>
              {stat.icon}
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="text-xl">{stat.value}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
        Last updated: October 26, 2025
      </p>
    </Card>
  );
}
