
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ReviewPreAdvicedLCInfoRowProps {
  lcReference: string;
  setLcReference: (value: string) => void;
  onLcSearch: () => void;
  issueDate: string;
  expiryDate: string;
  amount: number;
  currency: string;
}

const ReviewPreAdvicedLCInfoRow: React.FC<ReviewPreAdvicedLCInfoRowProps> = ({
  lcReference,
  setLcReference,
  onLcSearch,
  issueDate,
  expiryDate,
  amount,
  currency,
}) => (
  <div className="flex flex-col md:flex-row gap-4 md:items-end mt-5">
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      {/* LC Reference */}
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">LC Reference</div>
        <div className="flex items-center">
          <Input
            value={lcReference}
            onChange={(e) => setLcReference(e.target.value)}
            placeholder="Enter LC Reference"
            className="w-[220px] pr-10"
            aria-label="LC Reference"
          />
          <Button
            type="button"
            onClick={onLcSearch}
            variant="ghost"
            size="icon"
            className="ml-1"
            aria-label="Search LC Reference"
          >
            <Search className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
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
      {/* Amount */}
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</div>
        <div className="font-bold text-green-600 dark:text-green-300">
          {currency} {amount.toLocaleString()}
        </div>
      </div>
    </div>
  </div>
);

export default ReviewPreAdvicedLCInfoRow;
