
import React, { useMemo } from "react";
import { LayoutList, FileEdit, Send, Shuffle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductEventMappings } from "@/hooks/useProductEventMappings";

interface ProcessCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface ExportLCProcessSectionProps {
  selectedProcess: string | null;
  onProcessSelect: (id: string) => void;
}

const ExportLCProcessSection: React.FC<ExportLCProcessSectionProps> = ({
  selectedProcess,
  onProcessSelect,
}) => {
  const { getProductName, getEventName } = useProductEventMappings();

  const productName = getProductName('ELC');

  const processCards: ProcessCard[] = useMemo(() => [
    {
      id: "review",
      title: getEventName('ELC', 'REV'),
      description: `Review new or updated pre-adviced ${productName}.`,
      icon: LayoutList,
    },
    {
      id: "amendConsent",
      title: getEventName('ELC', 'AMD'),
      description: `Record your consent for advised amendments.`,
      icon: FileEdit,
    },
    {
      id: "transfer",
      title: getEventName('ELC', 'TRF'),
      description: `Initiate a transfer of the ${productName}.`,
      icon: Send,
    },
    {
      id: "assignment",
      title: getEventName('ELC', 'ASG'),
      description: `Request assignment of LC proceeds or rights.`,
      icon: Shuffle,
    },
  ], [getEventName, productName]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {productName} Processes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {processCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedProcess === card.id;
          return (
            <Card
              key={card.id}
              className={`border cursor-pointer transition-colors ${
                isSelected
                  ? "border-corporate-blue bg-corporate-blue/10 dark:bg-corporate-blue/40"
                  : "border-gray-200 dark:border-gray-600 hover:border-corporate-blue-300 dark:hover:border-corporate-blue-400"
              }`}
              onClick={() => onProcessSelect(card.id)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-14 h-14 bg-corporate-blue/10 dark:bg-corporate-blue/30 rounded-full flex items-center justify-center mb-3">
                  <Icon className="w-7 h-7 text-corporate-blue" />
                </div>
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExportLCProcessSection;
