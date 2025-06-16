
import React from "react";
import { FileText, ArrowLeftRight, UserCheck, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ExportLCProcessSectionProps {
  selectedProcess: string | null;
  onProcessSelect: (id: string) => void;
}

const processCards = [
  {
    id: "review",
    title: "Review Pre-Advised LC",
    description: "Review and respond to pre-advised letter of credit",
    icon: FileText,
  },
  {
    id: "amendConsent",
    title: "Amendment Response",
    description: "Review and respond to LC amendment requests",
    icon: CheckCircle,
  },
  {
    id: "transfer",
    title: "Request Transfer",
    description: "Transfer LC to new beneficiary",
    icon: ArrowLeftRight,
  },
  {
    id: "assignment",
    title: "Request Assignment",
    description: "Assign LC proceeds to third party (Article 39 UCP 600)",
    icon: UserCheck,
  },
];

const ExportLCProcessSection: React.FC<ExportLCProcessSectionProps> = ({
  selectedProcess,
  onProcessSelect,
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
      Export LC Operations
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {processCards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedProcess === card.id;
        return (
          <Card
            key={card.id}
            className={`border transition-colors cursor-pointer ${
              isSelected
                ? "border-corporate-blue-400 bg-corporate-blue/5 dark:bg-corporate-blue/10"
                : "border-gray-200 dark:border-gray-600 hover:border-corporate-blue-300 dark:hover:border-corporate-blue-400"
            }`}
            onClick={() => onProcessSelect(card.id)}
            tabIndex={0}
            role="button"
          >
            <CardHeader className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  isSelected
                    ? "bg-corporate-blue text-white"
                    : "bg-corporate-blue/20 dark:bg-corporate-blue/20 text-corporate-blue"
                }`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <CardTitle
                className={`text-lg font-semibold ${
                  isSelected
                    ? "text-corporate-blue"
                    : "text-gray-800 dark:text-white"
                }`}
              >
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p
                className={`text-sm ${
                  isSelected
                    ? "text-corporate-blue/80"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default ExportLCProcessSection;
