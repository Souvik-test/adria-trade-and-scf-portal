
import React from "react";
import AmendmentResponseTitle from "./AmendmentResponseTitle";
import AmendmentResponseInfoRow from "./AmendmentResponseInfoRow";

interface AmendmentResponseHeaderProps {
  lcReference: string;
  issueDate: string;
  expiryDate: string;
  amendmentNumber: string;
  amendmentDate: string;
  onViewChanges: () => void;
  onBack?: () => void;
}

const AmendmentResponseHeader: React.FC<AmendmentResponseHeaderProps> = ({
  lcReference,
  issueDate,
  expiryDate,
  amendmentNumber,
  amendmentDate,
  onViewChanges,
  onBack,
}) => (
  <div className="flex flex-col px-6 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
    {/* Top row: Title and status */}
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <AmendmentResponseTitle />
      {/* Potential onBack button in future if needed */}
    </div>
    {/* Second row: info fields row */}
    <AmendmentResponseInfoRow
      lcReference={lcReference}
      issueDate={issueDate}
      expiryDate={expiryDate}
      amendmentNumber={amendmentNumber}
      amendmentDate={amendmentDate}
      onViewChanges={onViewChanges}
    />
  </div>
);

export default AmendmentResponseHeader;
