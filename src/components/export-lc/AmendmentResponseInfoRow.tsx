
import React from "react";
import { Button } from "@/components/ui/button";

interface AmendmentResponseInfoRowProps {
  lcReference: string;
  issueDate: string;
  expiryDate: string;
  amendmentNumber: string;
  amendmentDate: string;
  onViewChanges: () => void;
}

const AmendmentResponseInfoRow: React.FC<AmendmentResponseInfoRowProps> = ({
  lcReference,
  issueDate,
  expiryDate,
  amendmentNumber,
  amendmentDate,
  onViewChanges,
}) => (
  <div className="flex flex-col md:flex-row gap-4 md:items-end mt-5">
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      {/* LC Reference */}
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">LC Reference</div>
        <div className="font-medium">{lcReference}</div>
      </div>
      {/* Issue Date */}
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Issue Date</div>
        <div className="font-medium">{issueDate}</div>
      </div>
      {/* Expiry Date */}
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expiry Date</div>
        <div className="font-medium">{expiryDate}</div>
      </div>
      {/* Amendment Number */}
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amendment #</div>
        <div className="font-medium">{amendmentNumber}</div>
      </div>
      {/* Amendment Date */}
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amendment Date</div>
        <div className="font-medium">{amendmentDate}</div>
      </div>
      {/* View Changes */}
      <div className="flex flex-col">
        <Button variant="outline" className="mt-5 md:mt-0" onClick={onViewChanges}>
          View Changes
        </Button>
      </div>
    </div>
  </div>
);

export default AmendmentResponseInfoRow;
