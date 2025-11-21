import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, FileText, Mail, MapPin, ExternalLink } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Schedule Campus Tour",
      description: "Book a guided tour",
      color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Start Application",
      description: "Begin your application",
      color: "bg-green-500/10 text-green-700 dark:text-green-400",
    },
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Contact Admissions",
      description: "Get personalized help",
      color: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "View Campus Map",
      description: "Explore our facilities",
      color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    },
  ];

  return (
    <Card className="p-4">
      <h3 className="mb-3 flex items-center gap-2">
        Quick Actions
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start h-auto py-2 px-3"
          >
            <div className={`p-2 rounded-md mr-3 ${action.color}`}>
              {action.icon}
            </div>
            <div className="text-left flex-1">
              <div className="text-sm">{action.label}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}
