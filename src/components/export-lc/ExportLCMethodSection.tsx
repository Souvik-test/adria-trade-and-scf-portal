
import React from "react";
import { FileText, Upload, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ExportLCMethodSectionProps {
  selectedProcess: string | null;
  selectedMethod: string | null;
  onMethodSelect: (id: string) => void;
}

const methodCards = [
  {
    id: "manual",
    title: "Manual",
    description:
      "Enter export LC details manually through forms",
    icon: FileText,
  },
  {
    id: "upload",
    title: "Upload",
    description: "Upload LC documents and auto-extract data (coming soon)",
    icon: Upload,
    comingSoon: true,
  },
  {
    id: "assistance",
    title: "Contextual Assistance",
    description: "Use AI-powered assistant (coming soon)",
    icon: MessageSquare,
    comingSoon: true,
  },
];

const ExportLCMethodSection: React.FC<ExportLCMethodSectionProps> = ({
  selectedProcess,
  selectedMethod,
  onMethodSelect,
}) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
      Processing Methods
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {methodCards.map((card) => {
        const Icon = card.icon;
        let isEnabled = !!selectedProcess;
        let isComingSoon = !!card.comingSoon;

        // Only Manual is enabled for 'review' (pre-adviced LC)
        if (card.id === "manual") {
          isComingSoon = selectedProcess !== "review";
        }

        return (
          <Card
            key={card.id}
            className={`border transition-colors ${
              !isEnabled
                ? "border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed"
                : isComingSoon
                ? "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer opacity-50"
                : "border-gray-200 dark:border-gray-600 hover:border-corporate-blue-300 dark:hover:border-corporate-blue-400 cursor-pointer"
            }`}
            onClick={isEnabled && !isComingSoon ? () => onMethodSelect(card.id) : undefined}
            tabIndex={isEnabled && !isComingSoon ? 0 : -1}
            aria-disabled={!isEnabled || isComingSoon}
          >
            <CardHeader className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  !isEnabled || isComingSoon
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-corporate-blue/20 dark:bg-corporate-blue/20"
                }`}
              >
                <Icon
                  className={`w-8 h-8 ${
                    !isEnabled || isComingSoon
                      ? "text-gray-400"
                      : "text-corporate-blue"
                  }`}
                />
              </div>
              <CardTitle
                className={`text-lg font-semibold ${
                  !isEnabled || isComingSoon
                    ? "text-gray-500 dark:text-gray-500"
                    : "text-gray-800 dark:text-white"
                }`}
              >
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p
                className={`text-sm ${
                  !isEnabled || isComingSoon
                    ? "text-gray-500 dark:text-gray-500"
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

export default ExportLCMethodSection;
