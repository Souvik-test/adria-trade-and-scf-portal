
import React from "react";
import PartyInfoPane from "./PartyInfoPane";
import LCAmtPane from "./LCAmtPane";
import ShipmentPane from "./ShipmentPane";
import DocumentsRequiredPane from "./DocumentsRequiredPane";
import AdditionalConditionsPane from "./AdditionalConditionsPane";

interface ReviewPreAdvicedLCContentProps {
  expanded: string[];
  togglePane: (pane: string) => void;
  parties: any[];
  lcAmount: any;
  shipment: any;
  documents: string[];
  additionalConditions: string;
  specialInstructions: string;
  PaneChevron: React.FC<{ open: boolean }>;
}

const ReviewPreAdvicedLCContent: React.FC<ReviewPreAdvicedLCContentProps> = ({
  expanded,
  togglePane,
  parties,
  lcAmount,
  shipment,
  documents,
  additionalConditions,
  specialInstructions,
  PaneChevron,
}) => (
  <div className="space-y-4">
    <PartyInfoPane
      expanded={expanded.includes("parties")}
      togglePane={() => togglePane("parties")}
      parties={parties}
      PaneChevron={PaneChevron}
    />
    <LCAmtPane
      expanded={expanded.includes("amount")}
      togglePane={() => togglePane("amount")}
      lcAmount={lcAmount}
      PaneChevron={PaneChevron}
    />
    <ShipmentPane
      expanded={expanded.includes("shipment")}
      togglePane={() => togglePane("shipment")}
      shipment={shipment}
      PaneChevron={PaneChevron}
    />
    <DocumentsRequiredPane
      expanded={expanded.includes("documents")}
      togglePane={() => togglePane("documents")}
      documents={documents}
      PaneChevron={PaneChevron}
    />
    <AdditionalConditionsPane
      expanded={expanded.includes("additional")}
      togglePane={() => togglePane("additional")}
      additionalConditions={additionalConditions}
      specialInstructions={specialInstructions}
      PaneChevron={PaneChevron}
    />
  </div>
);

export default ReviewPreAdvicedLCContent;
